import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import imageToSquareWebp from "@/utils/imageToSquareWebp";

export default function BlogForm({ blog, onSave }) {
  const isEdit = !!blog;

  const [form, setForm] = useState({
    title: blog?.title || "",
    date_label: blog?.date_label || "",
    image_url: blog?.image_url || "",
    is_published: blog?.is_published ?? true,
  });

  const [paragraphs, setParagraphs] = useState(
    blog?.content?.length ? blog.content : [""],
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const processed = await imageToSquareWebp(file, {
      size: 1200,
      quality: 0.9,
    });

    const formData = new FormData();
    formData.append("image", processed);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setForm((prev) => ({ ...prev, image_url: data.url }));
    }
    setUploading(false);
  };

  const updateParagraph = (index, value) => {
    setParagraphs((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addParagraph = () => {
    setParagraphs((prev) => [...prev, ""]);
  };

  const removeParagraph = (index) => {
    if (paragraphs.length <= 1) return;
    setParagraphs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await onSave({
      ...form,
      content: paragraphs.filter((p) => p.trim()),
    });

    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Title & Date */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">Post Details</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FE3D9] focus:ring-1 focus:ring-[#8FE3D9]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Label
          </label>
          <input
            type="text"
            value={form.date_label}
            onChange={(e) =>
              setForm((p) => ({ ...p, date_label: e.target.value }))
            }
            placeholder="e.g. 21 June 2025 or Behind the Brand"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FE3D9] focus:ring-1 focus:ring-[#8FE3D9]"
          />
        </div>
      </section>

      {/* Cover Image */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="text-base font-semibold text-gray-800">Cover Image</h3>

        {form.image_url && (
          <div className="w-full max-w-md h-48 relative rounded-xl overflow-hidden">
            <Image
              src={form.image_url}
              alt="Cover preview"
              fill
              className="object-cover"
              sizes="400px"
            />
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/webp,image/png,image/jpeg"
            onChange={handleImageUpload}
            className="text-sm text-gray-500"
          />
          {uploading && (
            <p className="text-sm text-[#1985A1] mt-1">Uploading...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Or paste image URL
          </label>
          <input
            type="text"
            value={form.image_url}
            onChange={(e) =>
              setForm((p) => ({ ...p, image_url: e.target.value }))
            }
            placeholder="/images/blogs/example.webp"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FE3D9] focus:ring-1 focus:ring-[#8FE3D9]"
          />
        </div>
      </section>

      {/* Content Paragraphs */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">Content</h3>
          <button
            type="button"
            onClick={addParagraph}
            className="text-sm text-[#1985A1] hover:underline font-medium"
          >
            + Add Paragraph
          </button>
        </div>

        <div className="space-y-3">
          {paragraphs.map((para, index) => (
            <div key={index} className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-gray-400 font-medium">
                    Paragraph {index + 1}
                  </span>
                </div>
                <textarea
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8FE3D9] focus:ring-1 focus:ring-[#8FE3D9] resize-y"
                />
              </div>
              {paragraphs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="self-start mt-7 text-gray-300 hover:text-red-500 transition"
                  title="Remove paragraph"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 4L4 12M4 4l8 8" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Publish Toggle */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) =>
              setForm((p) => ({ ...p, is_published: e.target.checked }))
            }
            className="w-5 h-5 rounded border-gray-300 text-[#8FE3D9] focus:ring-[#8FE3D9]"
          />
          <span className="text-sm font-medium text-gray-700">
            Published (visible on the website)
          </span>
        </label>
      </section>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-[#8FE3D9] text-[#46494C] font-semibold rounded-xl hover:bg-[#7DD4CA] transition disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Post" : "Publish Post"}
        </button>
        <a
          href="/admin/blogs"
          className="px-8 py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
