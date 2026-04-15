import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";
import australianSeasons from "@/data/australianSeasons";

// Check if a product is currently in season
function isInSeason(product) {
  if (!product.season_start || !product.season_end) return true; // No dates = always in season
  const now = new Date();
  const today = (now.getMonth() + 1) * 100 + now.getDate();
  const [sM, sD] = product.season_start.split("-").map(Number);
  const [eM, eD] = product.season_end.split("-").map(Number);
  const start = sM * 100 + sD;
  const end = eM * 100 + eD;
  if (start <= end) return today >= start && today <= end;
  return today >= start || today <= end; // Wraps around year (e.g. Dec-Jan)
}

function getSeasonLabel(product) {
  if (!product.season_start || !product.season_end) return "Year-round";
  const match = australianSeasons.find(
    (s) => s.start === product.season_start && s.end === product.season_end,
  );
  if (match) return match.label;
  return `${product.season_start} to ${product.season_end}`;
}

export default function AdminBestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token;
  };

  const fetchProducts = async () => {
    const token = await getToken();
    if (!token) return;

    const res = await fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const active = Array.isArray(data) ? data.filter((p) => p.is_active) : [];
    setProducts(active);
    setLoading(false);
  };

  const updateProduct = async (productId, updates) => {
    setSaving((prev) => ({ ...prev, [productId]: true }));
    const token = await getToken();

    await fetch("/api/admin/products", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId, ...updates }),
    });

    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)),
    );
    setSaving((prev) => ({ ...prev, [productId]: false }));
  };

  // Preview: what would show on homepage right now
  const homepagePreview = useMemo(() => {
    const pinned = products.filter((p) => p.is_featured && p.is_pinned);
    const seasonal = products.filter(
      (p) => p.is_featured && !p.is_pinned && isInSeason(p),
    );
    // Pinned first, then seasonal, max 4
    return [...pinned, ...seasonal].slice(0, 4);
  }, [products]);

  const pinnedProducts = products.filter((p) => p.is_pinned);
  const seasonalFeatured = products.filter(
    (p) => p.is_featured && !p.is_pinned,
  );
  const notFeatured = products.filter((p) => !p.is_featured && !p.is_pinned);

  return (
    <>
      <Head>
        <title>Best Sellers - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Best Sellers">
        {/* How it works */}
        <div className="bg-[#EFF7F6] rounded-2xl p-5 mb-8">
          <p className="text-sm font-semibold text-[#1985A1] mb-2">
            How Best Sellers work
          </p>
          <ul className="text-xs text-gray-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-[#8FE3D9] mt-0.5">1.</span>
              <span>
                <strong>Pinned</strong> cookies always show on the homepage, no
                matter what season it is
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8FE3D9] mt-0.5">2.</span>
              <span>
                <strong>Seasonal</strong> cookies only show when the current
                date falls within their season period (e.g. Valentine cookies
                show Jan 17 - Feb 14)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#8FE3D9] mt-0.5">3.</span>
              <span>
                The homepage shows up to <strong>4 cookies</strong>: pinned
                first, then seasonal ones fill the remaining slots
              </span>
            </li>
          </ul>
        </div>

        {/* Live Preview */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#1985A1]"
            >
              <circle cx="8" cy="8" r="6" />
              <path d="M8 5v3l2 2" />
            </svg>
            Live Preview — showing on homepage right now
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            {loading ? (
              <p className="text-gray-400 text-sm text-center py-4">
                Loading...
              </p>
            ) : homepagePreview.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No cookies will show. Add pinned or seasonal cookies below.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {homepagePreview.map((p) => (
                  <div key={p.id} className="text-center">
                    <div className="w-full aspect-square rounded-xl overflow-hidden relative bg-gray-100 mb-2">
                      {p.image_url && (
                        <Image
                          src={p.image_url}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      )}
                      {p.is_pinned && (
                        <span className="absolute top-1 right-1 bg-[#FF66C4] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          PIN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 font-medium truncate">
                      {p.title}
                    </p>
                  </div>
                ))}
                {homepagePreview.length < 4 && (
                  <div className="flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-xs text-gray-300 text-center px-2">
                      {4 - homepagePreview.length} empty
                      {4 - homepagePreview.length === 1 ? " slot" : " slots"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pinned Products (always show) */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#FF66C4]/10 text-[#FF66C4] flex items-center justify-center text-xs">
              P
            </span>
            Pinned — Always Show ({pinnedProducts.length})
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {pinnedProducts.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">
                No pinned cookies. Pin a product below to always show it.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {pinnedProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onUpdate={updateProduct}
                    saving={saving[product.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seasonal Featured */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-[#8FE3D9]/20 text-[#1985A1] flex items-center justify-center text-xs">
              S
            </span>
            Seasonal — Show During Their Period ({seasonalFeatured.length})
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {seasonalFeatured.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">
                No seasonal cookies. Mark products as featured below.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {seasonalFeatured.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onUpdate={updateProduct}
                    saving={saving[product.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Not Featured */}
        <div>
          <h2 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-gray-100 text-gray-400 flex items-center justify-center text-xs">
              —
            </span>
            Not in Best Sellers ({notFeatured.length})
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {notFeatured.length === 0 ? (
              <p className="p-6 text-center text-gray-400 text-sm">
                All products are featured or pinned!
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {notFeatured.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onUpdate={updateProduct}
                    saving={saving[product.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

function ProductRow({ product, onUpdate, saving }) {
  const inSeason = isInSeason(product);
  const seasonLabel = getSeasonLabel(product);

  return (
    <div
      className={`flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition ${saving ? "opacity-50" : ""}`}
    >
      {/* Image */}
      <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-gray-100">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="40px"
          />
        )}
      </div>

      {/* Title + status */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 font-medium truncate">
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400">{seasonLabel}</span>
          {product.season_start && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                inSeason
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {inSeason ? "In season now" : "Out of season"}
            </span>
          )}
        </div>
      </div>

      {/* Season Dropdown */}
      <div className="shrink-0">
        <select
          value={
            australianSeasons.find(
              (s) =>
                s.start === product.season_start &&
                s.end === product.season_end,
            )?.label ||
            (product.season_start || product.season_end ? "_custom" : "")
          }
          onChange={(e) => {
            const val = e.target.value;
            if (!val) {
              onUpdate(product.id, {
                season_start: null,
                season_end: null,
              });
            } else if (val === "_custom") {
              // keep current
            } else {
              const season = australianSeasons.find(
                (s) => s.label === val,
              );
              if (season) {
                onUpdate(product.id, {
                  season_start: season.start,
                  season_end: season.end,
                });
              }
            }
          }}
          className="w-[160px] px-2 py-1.5 border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:border-[#8FE3D9]"
        >
          <option value="">Year-round</option>
          {australianSeasons.map((s) => (
            <option key={s.label} value={s.label}>
              {s.label}
            </option>
          ))}
          <option value="_custom">Custom...</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Pin button */}
        <button
          onClick={() =>
            onUpdate(product.id, {
              is_pinned: !product.is_pinned,
              is_featured: true,
            })
          }
          disabled={saving}
          title={product.is_pinned ? "Unpin from Best Sellers" : "Pin to always show"}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition ${
            product.is_pinned
              ? "bg-[#FF66C4]/10 border-[#FF66C4]/30 text-[#FF66C4]"
              : "bg-white border-gray-200 text-gray-400 hover:border-[#FF66C4]/50 hover:text-[#FF66C4]"
          }`}
        >
          {product.is_pinned ? "Pinned" : "Pin"}
        </button>

        {/* Seasonal toggle */}
        {!product.is_pinned && (
          <button
            onClick={() =>
              onUpdate(product.id, { is_featured: !product.is_featured })
            }
            disabled={saving}
            title={
              product.is_featured
                ? "Remove from Best Sellers"
                : "Add as seasonal Best Seller"
            }
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition ${
              product.is_featured
                ? "bg-[#8FE3D9]/10 border-[#8FE3D9]/30 text-[#1985A1]"
                : "bg-white border-gray-200 text-gray-400 hover:border-[#8FE3D9]/50 hover:text-[#1985A1]"
            }`}
          >
            {product.is_featured ? "Seasonal" : "Add"}
          </button>
        )}

        {/* Remove */}
        {(product.is_featured || product.is_pinned) && (
          <button
            onClick={() =>
              onUpdate(product.id, { is_featured: false, is_pinned: false })
            }
            disabled={saving}
            className="px-2 py-1.5 text-[11px] text-gray-300 hover:text-red-400 transition"
            title="Remove from Best Sellers"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
