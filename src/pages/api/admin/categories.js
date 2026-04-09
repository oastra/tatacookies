import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import slugify from "@/utils/slugify";

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
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, type } = req.body;
    const slug = slugify(name);

    const { data: maxOrder } = await supabase
      .from("categories")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug, type: type || "type", sort_order: (maxOrder?.sort_order || 0) + 1 })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "PUT") {
    const { id, name, type, sort_order } = req.body;
    const updates = {};
    if (name) { updates.name = name; updates.slug = slugify(name); }
    if (type) updates.type = type;
    if (sort_order !== undefined) updates.sort_order = sort_order;

    const { error } = await supabase.from("categories").update(updates).eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader("Allow", "GET, POST, PUT, DELETE");
  return res.status(405).end("Method Not Allowed");
}
