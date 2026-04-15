import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import australianSeasons from "@/data/australianSeasons";

const defaultVariant = {
  name: "Single Cookie",
  price_aud: 10,
  stock_count: 10,
  sort_order: 0,
};

export default function ProductForm({ product, categories, onSave }) {
  const isEdit = !!product;

  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    image_url: product?.image_url || "",
    alt_text: product?.alt_text || "",
    is_featured: product?.is_featured || false,
    season_start: product?.season_start || "",
    season_end: product?.season_end || "",
    is_active: product?.is_active ?? true,
  });

  const [selectedCategories, setSelectedCategories] = useState(
    product?.product_categories?.map((pc) => pc.category_id) || [],
  );

  const [variants, setVariants] = useState(
    product?.product_variants?.length
      ? product.product_variants.map((v) => ({ ...v }))
      : [{ ...defaultVariant }],
  );

  const [additionalImages, setAdditionalImages] = useState(
    product?.product_images?.map((img) => ({ ...img })) || [],
  );

  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadImage = async (file) => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    return data.url || null;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setForm((prev) => ({ ...prev, image_url: url }));
    }
    setUploading(false);
  };

  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingExtra(true);
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) {
        setAdditionalImages((prev) => [
          ...prev,
          { image_url: url, alt_text: "", sort_order: prev.length },
        ]);
      }
    }
    setUploadingExtra(false);
    e.target.value = "";
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId],
    );
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "", price_aud: 0, stock_count: 0, sort_order: prev.length },
    ]);
  };

  const updateVariant = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    );
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    await onSave({
      ...form,
      category_ids: selectedCategories,
      variants,
      additional_images: additionalImages,
    });

    setSaving(false);
  };

  const seasonalCategories = categories.filter((c) => c.type === "seasonal");
  const typeCategories = categories.filter((c) => c.type === "type");

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic Info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Basic Information
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-[#F8FAFB] focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-[#F8FAFB] focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text (SEO)
          </label>
          <input
            type="text"
            value={form.alt_text}
            onChange={(e) =>
              setForm((p) => ({ ...p, alt_text: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm  bg-[#F8FAFB]focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>
      </section>

      {/* Image */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Product Image</h3>

        {form.image_url && (
          <div className="w-40 h-40 relative rounded-lg overflow-hidden">
            <Image
              src={form.image_url}
              alt="Preview"
              fill
              className="object-cover"
              sizes="160px"
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
            <p className="text-sm text-teal-600 mt-1">Uploading...</p>
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
            placeholder="/images/cookies/example.webp"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          />
        </div>
      </section>

      {/* Additional Images */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Additional Images (min 4 total recommended)
        </h3>
        <p className="text-xs text-gray-400">
          The main image above counts as image #1. Add at least 3 more here.
        </p>

        {additionalImages.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {additionalImages.map((img, index) => (
              <div key={index} className="relative group">
                <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || `Image ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAdditionalImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/webp,image/png,image/jpeg"
            multiple
            onChange={handleAdditionalImageUpload}
            className="text-sm text-gray-500"
          />
          {uploadingExtra && (
            <p className="text-sm text-teal-600 mt-1">Uploading...</p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Categories</h3>

        {seasonalCategories.length > 0 && (
          <div>
            <p className="text-sm font-medium  text-gray-600 mb-2">Seasonal</p>
            <div className="flex flex-wrap gap-2">
              {seasonalCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm  font-medium border transition ${
                    selectedCategories.includes(cat.id)
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-[#F8FAFB] border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {typeCategories.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {typeCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    selectedCategories.includes(cat.id)
                      ? "bg-teal-50 border-teal-300 text-teal-700"
                      : "bg-[#F8FAFB] border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Season */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Seasonal Availability (optional)
        </h3>

        {/* Season preset dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Season
          </label>
          <select
            value={
              australianSeasons.find(
                (s) =>
                  s.start === form.season_start && s.end === form.season_end,
              )?.label ||
              (form.season_start || form.season_end ? "_custom" : "")
            }
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                setForm((p) => ({
                  ...p,
                  season_start: "",
                  season_end: "",
                }));
              } else if (val === "_custom") {
                // keep current values, just switch to custom mode
              } else {
                const season = australianSeasons.find(
                  (s) => s.label === val,
                );
                if (season) {
                  setForm((p) => ({
                    ...p,
                    season_start: season.start,
                    season_end: season.end,
                  }));
                }
              }
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
          >
            <option value="">Year-round (no season)</option>
            {australianSeasons.map((s) => (
              <option key={s.label} value={s.label}>
                {s.label} ({s.start} to {s.end})
              </option>
            ))}
            <option value="_custom">Custom dates...</option>
          </select>
        </div>

        {/* Show date inputs when a season is selected or custom */}
        {(form.season_start || form.season_end) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start (MM-DD)
              </label>
              <input
                type="text"
                value={form.season_start}
                onChange={(e) =>
                  setForm((p) => ({ ...p, season_start: e.target.value }))
                }
                placeholder="01-17"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End (MM-DD)
              </label>
              <input
                type="text"
                value={form.season_end}
                onChange={(e) =>
                  setForm((p) => ({ ...p, season_end: e.target.value }))
                }
                placeholder="02-14"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
              />
            </div>
          </div>
        )}
      </section>

      {/* Variants */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Size Variants & Pricing
          </h3>
          <button
            type="button"
            onClick={addVariant}
            className="text-sm text-teal-600 hover:underline"
          >
            + Add Variant
          </button>
        </div>

        <div className="space-y-4">
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_120px_120px_40px] gap-3 items-end"
            >
              <div>
                {index === 0 && (
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Name
                  </label>
                )}
                <input
                  type="text"
                  value={variant.name}
                  onChange={(e) => updateVariant(index, "name", e.target.value)}
                  placeholder="e.g. Box of 6"
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                {index === 0 && (
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Price (AUD)
                  </label>
                )}
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={variant.price_aud}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "price_aud",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  required
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                {index === 0 && (
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Stock
                  </label>
                )}
                <input
                  type="number"
                  min="0"
                  value={variant.stock_count}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "stock_count",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="w-full py-2.5 text-red-400 hover:text-red-600 text-center"
                    title="Remove variant"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Toggles */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm((p) => ({ ...p, is_featured: e.target.checked }))
            }
            className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-400"
          />
          <span className="text-sm font-medium text-gray-700">
            Featured product (show in Best Sellers)
          </span>
        </label>

        {isEdit && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm((p) => ({ ...p, is_active: e.target.checked }))
              }
              className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-400"
            />
            <span className="text-sm font-medium text-gray-700">
              Active (visible in shop)
            </span>
          </label>
        )}
      </section>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
        <a
          href="/admin/products"
          className="px-8 py-3 bg-gray-100 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
