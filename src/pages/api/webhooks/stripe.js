import Stripe from "stripe";
import { Resend } from "resend";
import { renderToString } from "react-dom/server";
import { getServiceSupabase } from "@/lib/supabase";
import ShopOrderConfirmation from "@/emails/shopOrderConfirmation";
import ShopOrderAdminNotification from "@/emails/shopOrderAdminNotification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable body parsing — Stripe needs the raw body for signature verification
export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      await handleCheckoutCompleted(session);
    } catch (err) {
      console.error("Error processing checkout:", err);
      return res.status(500).json({ error: "Processing failed" });
    }
  }

  res.status(200).json({ received: true });
}

async function handleCheckoutCompleted(session) {
  const supabase = getServiceSupabase();

  // Check if order already exists (idempotent)
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .single();

  if (existing) return; // Already processed

  // Parse cart from metadata
  let cartItems = [];
  try {
    cartItems = JSON.parse(session.metadata?.cart_json || "[]");
  } catch {
    console.error("Failed to parse cart metadata");
    return;
  }

  const deliveryMethod = session.metadata?.delivery_method || null;

  // Get variant details for order items
  const variantIds = cartItems.map((item) => item.variantId).filter(Boolean);
  const { data: variants } = await supabase
    .from("product_variants")
    .select(
      `
      id, name, price_aud, product_id,
      products (title, image_url)
    `
    )
    .in("id", variantIds);

  const variantMap = Object.fromEntries(
    (variants || []).map((v) => [v.id, v])
  );

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    const variant = variantMap[item.variantId];
    return sum + (variant ? Number(variant.price_aud) * item.qty : 0);
  }, 0);

  // Format shipping address
  const shipping = session.shipping_details || session.customer_details;
  let deliveryAddress = null;
  if (shipping?.address) {
    const a = shipping.address;
    deliveryAddress = [a.line1, a.line2, a.city, a.state, a.postal_code, a.country]
      .filter(Boolean)
      .join(", ");
  }

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      stripe_session_id: session.id,
      stripe_payment_id: session.payment_intent,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      customer_phone: session.customer_details?.phone || null,
      delivery_method: deliveryMethod,
      delivery_address: deliveryAddress,
      status: "paid",
      subtotal_aud: total,
      total_aud: total,
    })
    .select("id, order_number")
    .single();

  if (orderError) {
    console.error("Failed to create order:", orderError);
    return;
  }

  // Build order items array for email
  const orderItems = [];

  // Create order items and decrement stock
  for (const item of cartItems) {
    const variant = variantMap[item.variantId];
    if (!variant) continue;

    const orderItem = {
      order_id: order.id,
      variant_id: item.variantId,
      product_title: variant.products?.title || "Unknown",
      variant_name: variant.name,
      price_aud: variant.price_aud,
      quantity: item.qty,
    };

    orderItems.push({
      ...orderItem,
      image_url: variant.products?.image_url
        ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://tatacookies.com"}${variant.products.image_url}`
        : null,
    });

    // Insert order item (snapshot product/variant info)
    await supabase.from("order_items").insert(orderItem);

    // Atomic stock decrement (only if enough stock)
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      p_variant_id: item.variantId,
      p_qty: item.qty,
    });

    if (stockError) {
      console.error(
        `Stock decrement failed for variant ${item.variantId}:`,
        stockError
      );
    }
  }

  // Send confirmation emails
  await sendOrderEmails({
    orderNumber: String(order.order_number).padStart(4, "0"),
    customerName: session.customer_details?.name || "Customer",
    customerEmail: session.customer_details?.email,
    customerPhone: session.customer_details?.phone,
    items: orderItems,
    total: total.toFixed(2),
    deliveryMethod,
    address: deliveryAddress,
  });
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

  // 1. Customer confirmation email
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

  // 2. Admin notification email
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
