import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) return;

    const res = await fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Deactivate "${title}"? It will be hidden from the shop.`))
      return;

    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchProducts();
  };

  const filtered = search
    ? products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  return (
    <>
      <Head>
        <title>Products - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout
        title="Products"
        onSearch={setSearch}
        searchPlaceholder="Search products..."
        headerAction={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8FE3D9] text-[#46494C] text-sm font-semibold rounded-xl hover:bg-[#7DD4CA] transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add Product
          </Link>
        }
      >
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-400">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Product</th>
                    <th className="text-left px-6 py-3 font-medium">Variants</th>
                    <th className="text-left px-6 py-3 font-medium">Price Range</th>
                    <th className="text-left px-6 py-3 font-medium">Stock</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => {
                    const variants = p.product_variants || [];
                    const activeVariants = variants.filter((v) => v.is_active);
                    const prices = activeVariants.map((v) => Number(v.price_aud));
                    const minPrice = prices.length ? Math.min(...prices) : 0;
                    const maxPrice = prices.length ? Math.max(...prices) : 0;
                    const totalStock = activeVariants.reduce(
                      (sum, v) => sum + v.stock_count,
                      0
                    );

                    return (
                      <tr key={p.id} className={`hover:bg-gray-50 ${!p.is_active ? "opacity-50" : ""}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-gray-100">
                              {p.image_url && (
                                <Image
                                  src={p.image_url}
                                  alt={p.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {p.title}
                              </p>
                              {p.is_featured && (
                                <span className="text-xs text-teal-600">Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {activeVariants.length}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {minPrice === maxPrice
                            ? `$${minPrice}`
                            : `$${minPrice} - $${maxPrice}`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`${
                              totalStock === 0
                                ? "text-red-500"
                                : totalStock <= 5
                                  ? "text-amber-600"
                                  : "text-gray-600"
                            }`}
                          >
                            {totalStock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              p.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {p.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="text-teal-600 hover:underline"
                          >
                            Edit
                          </Link>
                          {p.is_active && (
                            <button
                              onClick={() => handleDelete(p.id, p.title)}
                              className="text-red-500 hover:underline"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
