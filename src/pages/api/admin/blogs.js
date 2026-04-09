import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import slugify from "@/utils/slugify";

async function verifyAdmin(req) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, date_label, content, image_url, is_published } = req.body;
    const slug = slugify(title);

    const { data: maxOrder } = await supabase
      .from("blog_posts")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug,
        date_label: date_label || null,
        content: Array.isArray(content) ? content : [content],
        image_url: image_url || null,
        is_published: is_published ?? true,
        sort_order: (maxOrder?.sort_order || 0) + 1,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, title, date_label, content, image_url, is_published } =
      req.body;

    const updates = {};
    if (title !== undefined) {
      updates.title = title;
      updates.slug = slugify(title);
    }
    if (date_label !== undefined) updates.date_label = date_label;
    if (content !== undefined)
      updates.content = Array.isArray(content) ? content : [content];
    if (image_url !== undefined) updates.image_url = image_url;
    if (is_published !== undefined) updates.is_published = is_published;

    const { error } = await supabase
      .from("blog_posts")
      .update(updates)
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return res.status(405).end("Method Not Allowed");
}
