import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import ShopOrderShipped from "@/emails/shopOrderShipped";

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

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).end("Method Not Allowed");
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
