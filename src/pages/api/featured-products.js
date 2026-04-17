import { getServiceSupabase } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const supabase = getServiceSupabase();

  const { data: products, error } = await supabase
    .from("products")
    .select(
      `
      id, title, slug, image_url,
      product_variants (price_aud, is_active)
    `
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true })
    .limit(3);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const formatted = (products || []).map((p) => {
    const activeVariants = (p.product_variants || []).filter((v) => v.is_active);
    const minPrice = activeVariants.length
      ? Math.min(...activeVariants.map((v) => Number(v.price_aud)))
      : 0;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      image_url: p.image_url,
      price: minPrice,
    };
  });

  // Cache for 5 minutes
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return res.status(200).json(formatted);
}
