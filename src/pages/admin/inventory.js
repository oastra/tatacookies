import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminInventory() {
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

  const updateStock = async (variantId, newStock) => {
    setSaving((prev) => ({ ...prev, [variantId]: true }));
    const token = await getToken();

    await fetch("/api/admin/variants", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: variantId, stock_count: newStock }),
    });

    // Update local state
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        product_variants: (p.product_variants || []).map((v) =>
          v.id === variantId ? { ...v, stock_count: newStock } : v
        ),
      }))
    );

    setSaving((prev) => ({ ...prev, [variantId]: false }));
  };

  return (
    <>
      <Head>
        <title>Inventory - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Inventory">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Product</th>
                    <th className="text-left px-6 py-3 font-medium">Variant</th>
                    <th className="text-left px-6 py-3 font-medium">Price</th>
                    <th className="text-left px-6 py-3 font-medium">Stock</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) =>
                    (product.product_variants || [])
                      .filter((v) => v.is_active)
                      .map((variant, vi) => (
                        <tr key={variant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-800">
                            {vi === 0 ? product.title : ""}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {variant.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            ${Number(variant.price_aud).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              min="0"
                              value={variant.stock_count}
                              onChange={(e) => {
                                const newVal = parseInt(e.target.value) || 0;
                                // Update locally immediately
                                setProducts((prev) =>
                                  prev.map((p) => ({
                                    ...p,
                                    product_variants: (
                                      p.product_variants || []
                                    ).map((v) =>
                                      v.id === variant.id
                                        ? { ...v, stock_count: newVal }
                                        : v
                                    ),
                                  }))
                                );
                              }}
                              onBlur={(e) => {
                                const newVal = parseInt(e.target.value) || 0;
                                updateStock(variant.id, newVal);
                              }}
                              className={`w-20 px-3 py-2 border rounded-lg text-sm text-center focus:outline-none focus:border-teal-400 ${
                                variant.stock_count === 0
                                  ? "border-red-300 bg-red-50"
                                  : variant.stock_count <= 5
                                    ? "border-amber-300 bg-amber-50"
                                    : "border-gray-200"
                              }`}
                            />
                            {saving[variant.id] && (
                              <span className="text-xs text-teal-500 ml-2">
                                Saving...
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {variant.stock_count === 0 ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                Out of Stock
                              </span>
                            ) : variant.stock_count <= 5 ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                In Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
