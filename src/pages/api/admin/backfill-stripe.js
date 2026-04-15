import { getServiceSupabase } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify admin
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "No Stripe key configured" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const db = getServiceSupabase();

  // Get all variants missing stripe_price_id
  const { data: variants, error: fetchErr } = await db
    .from("product_variants")
    .select("id, name, price_aud, product_id, products(title)")
    .is("stripe_price_id", null);

  if (fetchErr) {
    return res.status(500).json({ error: fetchErr.message });
  }

  const results = [];

  for (const v of variants) {
    try {
      const productTitle = v.products?.title || "Cookie";

      const stripeProduct = await stripe.products.create({
        name: `${productTitle} - ${v.name}`,
      });

      const stripePrice = await stripe.prices.create({
        unit_amount: Math.round(Number(v.price_aud) * 100),
        currency: "aud",
        product: stripeProduct.id,
      });

      const { error: updateErr } = await db
        .from("product_variants")
        .update({ stripe_price_id: stripePrice.id })
        .eq("id", v.id);

      results.push({
        variant_id: v.id,
        title: productTitle,
        name: v.name,
        price: v.price_aud,
        stripe_price_id: stripePrice.id,
        status: updateErr ? `error: ${updateErr.message}` : "ok",
      });
    } catch (err) {
      results.push({
        variant_id: v.id,
        title: v.products?.title,
        name: v.name,
        status: `error: ${err.message}`,
      });
    }
  }

  return res.status(200).json({
    total: variants.length,
    processed: results.length,
    results,
  });
}
