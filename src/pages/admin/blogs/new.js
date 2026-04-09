import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import BlogForm from "@/components/admin/BlogForm";
import { supabase } from "@/lib/supabase";

export default function NewBlog() {
  const router = useRouter();

  const handleSave = async (formData) => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin/blogs");
    } else {
      const err = await res.json();
      alert(err.error || "Failed to create post");
    }
  };

  return (
    <>
      <Head>
        <title>New Blog Post - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminLayout title="New Blog Post">
        <BlogForm onSave={handleSave} />
      </AdminLayout>
    </>
  );
}
