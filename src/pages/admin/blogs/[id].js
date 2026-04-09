import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import { supabase } from "@/lib/supabase";

export default function EditBlog() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) return;

    const res = await fetch("/api/admin/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const found = Array.isArray(data) ? data.find((b) => b.id === id) : null;
    setBlog(found);
    setLoading(false);
  };

  const handleSave = async (formData) => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const res = await fetch("/api/admin/blogs", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...formData }),
    });

    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to update post");
    }
  };

  return (
    <>
      <Head>
        <title>Edit Blog Post - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout title="Edit Blog Post">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !blog ? (
          <p className="text-red-500">Blog post not found</p>
        ) : (
          <BlogForm blog={blog} onSave={handleSave} />
        )}
      </AdminLayout>
    </>
  );
}
