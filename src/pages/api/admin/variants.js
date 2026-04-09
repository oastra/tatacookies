import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

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
    const { product_id } = req.query;
    let query = supabase.from("product_variants").select("*");
    if (product_id) query = query.eq("product_id", product_id);
    query = query.order("sort_order", { ascending: true });

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { product_id, name, price_aud, stock_count, sort_order, product_title } = req.body;

    // Auto-create Stripe product + price (if Stripe key available)
    let stripePriceId = null;
    const stripe = getStripe();
    if (stripe) {
      const stripeProduct = await stripe.products.create({
        name: `${product_title || "Cookie"} - ${name}`,
      });
      const stripePrice = await stripe.prices.create({
        unit_amount: Math.round(price_aud * 100),
        currency: "aud",
        product: stripeProduct.id,
      });
      stripePriceId = stripePrice.id;
    }

    const { data, error } = await supabase
      .from("product_variants")
      .insert({
        product_id,
        name,
        price_aud,
        stripe_price_id: stripePriceId,
        stock_count: stock_count || 0,
        sort_order: sort_order || 0,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, name, price_aud, stock_count, is_active, sort_order } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (price_aud !== undefined) updates.price_aud = price_aud;
    if (stock_count !== undefined) updates.stock_count = stock_count;
    if (is_active !== undefined) updates.is_active = is_active;
    if (sort_order !== undefined) updates.sort_order = sort_order;

    const { error } = await supabase
      .from("product_variants")
      .update(updates)
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase
      .from("product_variants")
      .update({ is_active: false })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return res.status(405).end("Method Not Allowed");
}
