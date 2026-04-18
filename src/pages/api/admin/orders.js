import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import ShopOrderShipped from "@/emails/shopOrderShipped";
import ShopOrderConfirmation from "@/emails/shopOrderConfirmation";
import ShopOrderAdminNotification from "@/emails/shopOrderAdminNotification";

async function verifyAdmin(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  return error ? null : user;
}

export default async function handler(req, res) {
  const user = await verifyAdmin(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getServiceSupabase();

  if (req.method === "GET") {
    const { status, limit = 50 } = req.query;

    let query = supabase
      .from("orders")
      .select(`*, order_items (*)`)
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_method,
      delivery_address,
      items,
      notes,
      status,
      shipping_cost,
      decrement_stock: shouldDecrementStock,
      send_email: shouldSendEmail,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "At least one item is required" });
    }

    const variantIds = items.map((i) => i.variant_id).filter(Boolean);
    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("id, name, price_aud, product_id, products (title, image_url)")
      .in("id", variantIds);

    if (variantsError) {
      return res.status(500).json({ error: variantsError.message });
    }

    const variantMap = Object.fromEntries((variants || []).map((v) => [v.id, v]));

    const subtotal = items.reduce((sum, it) => {
      const v = variantMap[it.variant_id];
      const qty = Number(it.quantity) || 0;
      return sum + (v ? Number(v.price_aud) * qty : 0);
    }, 0);

    const shippingNum = Number(shipping_cost) || 0;
    const total = subtotal + shippingNum;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customer_name || null,
        customer_email: customer_email || null,
        customer_phone: customer_phone || null,
        delivery_method: delivery_method || null,
        delivery_address: delivery_address || null,
        notes: notes || null,
        status: status || "pending",
        subtotal_aud: subtotal,
        total_aud: total,
      })
      .select("id, order_number")
      .single();

    if (orderError) {
      return res.status(500).json({ error: orderError.message });
    }

    const orderItemsToInsert = [];
    for (const it of items) {
      const v = variantMap[it.variant_id];
      if (!v) continue;
      orderItemsToInsert.push({
        order_id: order.id,
        variant_id: v.id,
        product_title: v.products?.title || "Unknown",
        variant_name: v.name,
        price_aud: v.price_aud,
        quantity: Number(it.quantity) || 1,
      });
    }

    if (orderItemsToInsert.length) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);
      if (itemsError) {
        return res.status(500).json({ error: itemsError.message });
      }
    }

    if (shouldDecrementStock) {
      for (const it of items) {
        const qty = Number(it.quantity) || 0;
        if (!it.variant_id || qty <= 0) continue;
        const { error: stockError } = await supabase.rpc("decrement_stock", {
          p_variant_id: it.variant_id,
          p_qty: qty,
        });
        if (stockError) {
          console.error(
            `Stock decrement failed for variant ${it.variant_id}:`,
            stockError
          );
        }
      }
    }

    if (shouldSendEmail) {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://tatacookies.com";
      const emailItems = orderItemsToInsert.map((oi) => {
        const v = variantMap[oi.variant_id];
        return {
          product_title: oi.product_title,
          variant_name: oi.variant_name,
          price_aud: oi.price_aud,
          quantity: oi.quantity,
          image_url: v?.products?.image_url
            ? `${siteUrl}${v.products.image_url}`
            : null,
        };
      });

      try {
        await sendOrderEmails({
          orderNumber: String(order.order_number).padStart(4, "0"),
          customerName: customer_name || "Customer",
          customerEmail: customer_email,
          customerPhone: customer_phone,
          items: emailItems,
          total: total.toFixed(2),
          deliveryMethod: delivery_method,
          address: delivery_address,
        });
      } catch (err) {
        console.error("Failed to send admin-order emails:", err);
      }
    }

    return res.status(201).json({ id: order.id, order_number: order.order_number });
  }

  if (req.method === "PATCH") {
    const { id, status, notes, tracking_number } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;

    const { error } = await supabase.from("orders").update(updates).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });

    // Check if we should send a shipping notification
    const { data: order } = await supabase
      .from("orders")
      .select(
        `*, order_items (*, product_variants (product_id, products (image_url)))`
      )
      .eq("id", id)
      .single();

    if (
      order &&
      order.status === "fulfilled" &&
      order.tracking_number &&
      order.delivery_method === "Australia Post" &&
      !order.shipping_notification_sent &&
      order.customer_email
    ) {
      try {
        await sendShippingEmail(order);
        await supabase
          .from("orders")
          .update({ shipping_notification_sent: true })
          .eq("id", id);
      } catch (err) {
        console.error("Failed to send shipping email:", err);
      }
    }

    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, POST, PATCH");
  return res.status(405).end("Method Not Allowed");
}

async function sendOrderEmails({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  items,
  total,
  deliveryMethod,
  address,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set, skipping order emails");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = `Tatacookies <${process.env.ORDER_EMAIL_FROM || "orders@tatacookies.com"}>`;
  const adminTo = process.env.ORDER_EMAIL_TO || "orders@tatacookies.com";

  if (customerEmail) {
    try {
      const customerHtml = renderToString(
        <ShopOrderConfirmation
          name={customerName}
          orderNumber={orderNumber}
          items={items}
          total={total}
          deliveryMethod={deliveryMethod}
          address={address}
        />
      );
      await resend.emails.send({
        from,
        to: customerEmail,
        subject: `Order confirmed — #${orderNumber}`,
        html: customerHtml,
      });
    } catch (err) {
      console.error("Failed to send customer email:", err);
    }
  }

  try {
    const adminHtml = renderToString(
      <ShopOrderAdminNotification
        orderNumber={orderNumber}
        customerName={customerName}
        customerEmail={customerEmail}
        customerPhone={customerPhone}
        items={items}
        total={total}
        deliveryMethod={deliveryMethod}
        address={address}
      />
    );
    await resend.emails.send({
      from,
      to: adminTo,
      subject: `New order #${orderNumber} — ${customerName}`,
      html: adminHtml,
    });
  } catch (err) {
    console.error("Failed to send admin email:", err);
  }
}

async function sendShippingEmail(order) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY not set, skipping shipping email");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = `Tatacookies <${process.env.ORDER_EMAIL_FROM || "orders@tatacookies.com"}>`;
  const orderNumber = String(order.order_number).padStart(4, "0");
  const trackingUrl = `https://auspost.com.au/parcels-mail/track.html#/track?id=${order.tracking_number}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tatacookies.com";

  const items = (order.order_items || []).map((item) => ({
    product_title: item.product_title,
    variant_name: item.variant_name,
    price_aud: item.price_aud,
    quantity: item.quantity,
    image_url: item.product_variants?.products?.image_url
      ? `${siteUrl}${item.product_variants.products.image_url}`
      : null,
  }));

  const html = renderToString(
    <ShopOrderShipped
      name={order.customer_name || "Customer"}
      orderNumber={orderNumber}
      trackingNumber={order.tracking_number}
      trackingUrl={trackingUrl}
      items={items}
      total={Number(order.total_aud || 0).toFixed(2)}
      deliveryMethod={order.delivery_method}
    />
  );

  await resend.emails.send({
    from,
    to: order.customer_email,
    subject: `Your order #${orderNumber} has been shipped!`,
    html,
  });
}
