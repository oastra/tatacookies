import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate stock before checkout
    const supabase = getServiceSupabase();
    const variantIds = cart.map((item) => item.variantId).filter(Boolean);

    if (variantIds.length > 0) {
      const { data: variants } = await supabase
        .from("product_variants")
        .select("id, name, stock_count")
        .in("id", variantIds);

      const outOfStock = [];
      for (const item of cart) {
        const variant = variants?.find((v) => v.id === item.variantId);
        if (variant && variant.stock_count < item.qty) {
          outOfStock.push(
            `${variant.name} (only ${variant.stock_count} available)`
          );
        }
      }

      if (outOfStock.length > 0) {
        return res.status(400).json({
          error: `Some items are out of stock: ${outOfStock.join(", ")}`,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: cart.map((item) => ({
        price: item.id, // Stripe Price ID
        quantity: item.qty,
      })),
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/shop`,
      metadata: {
        cart_json: JSON.stringify(
          cart.map((item) => ({
            variantId: item.variantId,
            qty: item.qty,
          }))
        ),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
