import { getServiceSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false },
};

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
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const user = await verifyAdmin(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const supabase = getServiceSupabase();

  const form = formidable({ maxFileSize: 5 * 1024 * 1024 });

  const [, files] = await form.parse(req);
  const file = files.image?.[0];

  if (!file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  const ext = path.extname(file.originalFilename || ".webp");
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const fileBuffer = fs.readFileSync(file.filepath);

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, fileBuffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  // Clean up temp file
  fs.unlinkSync(file.filepath);

  if (uploadError) {
    return res.status(500).json({ error: uploadError.message });
  }

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return res.status(200).json({ url: urlData.publicUrl });
}
