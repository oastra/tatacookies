import Stripe from "stripe";
import { getServiceSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const { cart, deliveryMethod } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Validate stock before checkout
    const supabase = getServiceSupabase();
    const variantIds = cart.map((item) => item.variantId).filter(Boolean);

    if (variantIds.length > 0) {
      const { data: variants } = await supabase
        .from("product_variants")
        .select("id, name, stock_count, price_aud")
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

    const isDelivery = deliveryMethod === "Australia Post";

    const sessionConfig = {
      line_items: cart.map((item) => ({
        price: item.id, // Stripe Price ID
        quantity: item.qty,
      })),
      mode: "payment",
      phone_number_collection: { enabled: true },
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/shop`,
      metadata: {
        cart_json: JSON.stringify(
          cart.map((item) => ({
            variantId: item.variantId,
            qty: item.qty,
          }))
        ),
        delivery_method: deliveryMethod || "Pick-Up",
      },
    };

    // Collect shipping address and add shipping cost for delivery orders
    if (isDelivery) {
      sessionConfig.shipping_address_collection = {
        allowed_countries: ["AU"],
      };

      // Calculate cart total for free shipping threshold
      const cartTotal = cart.reduce((sum, item) => {
        const variant = variants?.find((v) => v.id === item.variantId);
        return sum + (variant ? Number(variant.price_aud) * item.qty : 0);
      }, 0);

      const FREE_SHIPPING_THRESHOLD = 300;
      const FLAT_RATE_CENTS = 2000; // $20 AUD

      if (cartTotal >= FREE_SHIPPING_THRESHOLD) {
        sessionConfig.shipping_options = [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: 0, currency: "aud" },
              display_name: "Australia Post — Free shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ];
      } else {
        sessionConfig.shipping_options = [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: { amount: FLAT_RATE_CENTS, currency: "aud" },
              display_name: "Australia Post",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
        ];
      }
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
