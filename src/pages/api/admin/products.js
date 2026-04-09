import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import slugify from "@/utils/slugify";

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

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  return error ? null : user;
}

export default async function handler(req, res) {
  const user = await verifyAdmin(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getServiceSupabase();

  // GET: List products
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_variants (id, name, price_aud, stock_count, stripe_price_id, is_active, sort_order),
        product_categories (category_id, categories (id, name, slug)),
        product_images (id, image_url, alt_text, sort_order)
      `
      )
      .order("sort_order", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST: Create product with variants
  if (req.method === "POST") {
    const { title, description, image_url, alt_text, is_featured, season_start, season_end, category_ids, variants, additional_images } = req.body;

    const slug = slugify(title);

    // Get max sort_order
    const { data: maxOrder } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const { data: product, error: prodError } = await supabase
      .from("products")
      .insert({
        title,
        slug,
        description,
        image_url,
        alt_text,
        is_featured: is_featured || false,
        season_start: season_start || null,
        season_end: season_end || null,
        sort_order: (maxOrder?.sort_order || 0) + 1,
      })
      .select("id")
      .single();

    if (prodError) return res.status(500).json({ error: prodError.message });

    // Link categories
    if (category_ids?.length) {
      await supabase.from("product_categories").insert(
        category_ids.map((cid) => ({
          product_id: product.id,
          category_id: cid,
        }))
      );
    }

    // Create variants with Stripe prices
    if (variants?.length) {
      for (const v of variants) {
        let stripePriceId = v.stripe_price_id;

        if (!stripePriceId) {
          const stripe = getStripe();
          if (stripe) {
            const stripeProduct = await stripe.products.create({
              name: `${title} - ${v.name}`,
            });
            const stripePrice = await stripe.prices.create({
              unit_amount: Math.round(v.price_aud * 100),
              currency: "aud",
              product: stripeProduct.id,
            });
            stripePriceId = stripePrice.id;
          }
        }

        await supabase.from("product_variants").insert({
          product_id: product.id,
          name: v.name,
          price_aud: v.price_aud,
          stripe_price_id: stripePriceId,
          stock_count: v.stock_count || 0,
          sort_order: v.sort_order || 0,
        });
      }
    }

    // Save additional images
    if (additional_images?.length) {
      await supabase.from("product_images").insert(
        additional_images.map((img, i) => ({
          product_id: product.id,
          image_url: img.image_url,
          alt_text: img.alt_text || "",
          sort_order: i,
        }))
      );
    }

    return res.status(201).json({ id: product.id });
  }

  // PUT: Update product
  if (req.method === "PUT") {
    const { id, title, description, image_url, alt_text, is_active, is_featured, is_pinned, season_start, season_end, category_ids, additional_images } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (alt_text !== undefined) updates.alt_text = alt_text;
    if (is_active !== undefined) updates.is_active = is_active;
    if (is_featured !== undefined) updates.is_featured = is_featured;
    if (is_pinned !== undefined) updates.is_pinned = is_pinned;
    if (season_start !== undefined) updates.season_start = season_start;
    if (season_end !== undefined) updates.season_end = season_end;
    if (title) updates.slug = slugify(title);

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });

    // Update categories
    if (category_ids !== undefined) {
      await supabase
        .from("product_categories")
        .delete()
        .eq("product_id", id);

      if (category_ids.length) {
        await supabase.from("product_categories").insert(
          category_ids.map((cid) => ({
            product_id: id,
            category_id: cid,
          }))
        );
      }
    }

    // Update additional images
    if (additional_images !== undefined) {
      await supabase.from("product_images").delete().eq("product_id", id);

      if (additional_images.length) {
        await supabase.from("product_images").insert(
          additional_images.map((img, i) => ({
            product_id: id,
            image_url: img.image_url,
            alt_text: img.alt_text || "",
            sort_order: i,
          }))
        );
      }
    }

    return res.status(200).json({ success: true });
  }

  // DELETE: Soft delete
  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return res.status(405).end("Method Not Allowed");
}
