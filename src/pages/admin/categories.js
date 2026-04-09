import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("type");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token;
  };

  const fetchCategories = async () => {
    const token = await getToken();
    if (!token) return;

    const res = await fetch("/api/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const token = await getToken();
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newName.trim(), type: newType }),
    });

    setNewName("");
    fetchCategories();
  };

  const handleUpdate = async (id) => {
    if (!editName.trim()) return;

    const token = await getToken();
    await fetch("/api/admin/categories", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name: editName.trim() }),
    });

    setEditingId(null);
    fetchCategories();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?`)) return;

    const token = await getToken();
    await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchCategories();
  };

  const seasonalCats = categories.filter((c) => c.type === "seasonal");
  const typeCats = categories.filter((c) => c.type === "type");

  const renderCategory = (cat) => (
    <div
      key={cat.id}
      className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg"
    >
      {editingId === cat.id ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
          />
          <button
            onClick={() => handleUpdate(cat.id)}
            className="text-sm text-teal-600 hover:underline"
          >
            Save
          </button>
          <button
            onClick={() => setEditingId(null)}
            className="text-sm text-gray-400 hover:underline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div>
            <span className="text-sm text-gray-800">{cat.name}</span>
            <span className="text-xs text-gray-400 ml-2">({cat.slug})</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setEditingId(cat.id);
                setEditName(cat.name);
              }}
              className="text-sm text-teal-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              className="text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>Categories - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Categories">
        {/* Add new */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-8 flex gap-3 items-end"
        >
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Mother's Day"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
            >
              <option value="seasonal">Seasonal</option>
              <option value="type">Type</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition"
          >
            Add
          </button>
        </form>

        {/* Seasonal */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800">
              Seasonal Categories
            </h3>
          </div>
          <div className="p-2">
            {seasonalCats.length === 0 ? (
              <p className="px-4 py-6 text-center text-gray-400 text-sm">
                No seasonal categories
              </p>
            ) : (
              seasonalCats.map(renderCategory)
            )}
          </div>
        </div>

        {/* Type */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-800">
              Type Categories
            </h3>
          </div>
          <div className="p-2">
            {typeCats.length === 0 ? (
              <p className="px-4 py-6 text-center text-gray-400 text-sm">
                No type categories
              </p>
            ) : (
              typeCats.map(renderCategory)
            )}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
