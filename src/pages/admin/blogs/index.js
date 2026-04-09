import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token;
  };

  const fetchBlogs = async () => {
    const token = await getToken();
    if (!token) return;

    const res = await fetch("/api/admin/blogs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setBlogs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete blog post "${title}"? This cannot be undone.`)) return;

    const token = await getToken();
    await fetch("/api/admin/blogs", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchBlogs();
  };

  const togglePublish = async (id, currentStatus) => {
    const token = await getToken();
    await fetch("/api/admin/blogs", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, is_published: !currentStatus }),
    });
    fetchBlogs();
  };

  return (
    <>
      <Head>
        <title>Blog Posts - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout
        title="Blog Posts"
        headerAction={
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#8FE3D9] text-[#46494C] text-sm font-semibold rounded-xl hover:bg-[#7DD4CA] transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v10M3 8h10" />
            </svg>
            New Post
          </Link>
        }
      >
        <p className="text-gray-500 text-sm mb-6">
          {blogs.filter((b) => b.is_published).length} published,{" "}
          {blogs.filter((b) => !b.is_published).length} drafts
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-400">Loading...</p>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">No blog posts yet</p>
              <Link
                href="/admin/blogs/new"
                className="text-[#1985A1] font-medium hover:underline"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="flex items-center gap-5 px-6 py-4 hover:bg-gray-50/50 transition"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 bg-gray-100">
                    {blog.image_url && (
                      <Image
                        src={blog.image_url}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {blog.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {blog.date_label || "No date"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          blog.is_published
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {blog.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-300">
                        {(blog.content || []).length} paragraphs
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => togglePublish(blog.id, blog.is_published)}
                      className="text-xs text-gray-400 hover:text-gray-700 transition"
                    >
                      {blog.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin/blogs/${blog.id}`}
                      className="text-xs text-[#1985A1] hover:underline font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.id, blog.title)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
