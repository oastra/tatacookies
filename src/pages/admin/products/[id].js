import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { supabase } from "@/lib/supabase";

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const [prodRes, catRes] = await Promise.all([
      fetch("/api/admin/products", { headers }),
      fetch("/api/admin/categories", { headers }),
    ]);

    const products = await prodRes.json();
    const cats = await catRes.json();

    const found = Array.isArray(products)
      ? products.find((p) => p.id === id)
      : null;

    setProduct(found);
    setCategories(Array.isArray(cats) ? cats : []);
    setLoading(false);
  };

  const handleSave = async (formData) => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    // Update product
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...formData }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Failed to update product");
      return;
    }

    // Update variants
    for (const variant of formData.variants) {
      if (variant.id) {
        // Update existing variant
        await fetch("/api/admin/variants", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(variant),
        });
      } else {
        // Create new variant
        await fetch("/api/admin/variants", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...variant,
            product_id: id,
            product_title: formData.title,
          }),
        });
      }
    }

    router.push("/admin/products");
  };

  return (
    <>
      <Head>
        <title>Edit Product - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Edit Product">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !product ? (
          <p className="text-red-500">Product not found</p>
        ) : (
          <ProductForm
            product={product}
            categories={categories}
            onSave={handleSave}
          />
        )}
      </AdminLayout>
    </>
  );
}
