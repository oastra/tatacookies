import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function NewOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ variant_id: "", quantity: 1 }]);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    delivery_method: "Pick-Up",
    delivery_address: "",
    notes: "",
    status: "pending",
    shipping_cost: 0,
    decrement_stock: false,
    send_email: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    setProducts(Array.isArray(data) ? data : []);
  };

  const variantOptions = useMemo(() => {
    const opts = [];
    for (const p of products) {
      if (p.is_active === false) continue;
      for (const v of p.product_variants || []) {
        if (v.is_active === false) continue;
        opts.push({
          id: v.id,
          label: `${p.title} — ${v.name} ($${Number(v.price_aud).toFixed(2)})`,
          price: Number(v.price_aud),
          stock: v.stock_count,
        });
      }
    }
    return opts;
  }, [products]);

  const variantById = useMemo(
    () => Object.fromEntries(variantOptions.map((v) => [v.id, v])),
    [variantOptions]
  );

  const subtotal = items.reduce((sum, it) => {
    const v = variantById[it.variant_id];
    const qty = Number(it.quantity) || 0;
    return sum + (v ? v.price * qty : 0);
  }, 0);

  const shippingNum = Number(form.shipping_cost) || 0;
  const total = subtotal + shippingNum;

  const updateItem = (idx, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const addItem = () =>
    setItems((prev) => [...prev, { variant_id: "", quantity: 1 }]);

  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validItems = items.filter(
      (it) => it.variant_id && Number(it.quantity) > 0
    );
    if (validItems.length === 0) {
      setError("Add at least one item");
      return;
    }
    if (
      form.delivery_method === "Australia Post" &&
      !form.delivery_address.trim()
    ) {
      setError("Delivery address is required for Australia Post");
      return;
    }

    setSaving(true);
    const token = await getToken();
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        shipping_cost: shippingNum,
        items: validItems.map((it) => ({
          variant_id: it.variant_id,
          quantity: Number(it.quantity),
        })),
      }),
    });
    setSaving(false);

    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/orders/${data.id}`);
    } else {
      const err = await res.json().catch(() => ({}));
      setError(err.error || "Failed to create order");
    }
  };

  const fieldCls =
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400";

  return (
    <>
      <Head>
        <title>New Order - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="New Order">
        <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Items
                </h3>
                <div className="space-y-3">
                  {items.map((it, idx) => {
                    const v = variantById[it.variant_id];
                    return (
                      <div key={idx} className="flex gap-2 items-start">
                        <select
                          value={it.variant_id}
                          onChange={(e) =>
                            updateItem(idx, "variant_id", e.target.value)
                          }
                          className={`${fieldCls} flex-1`}
                        >
                          <option value="">Select a product…</option>
                          {variantOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                              {opt.stock != null
                                ? ` · stock: ${opt.stock}`
                                : ""}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={it.quantity}
                          onChange={(e) =>
                            updateItem(idx, "quantity", e.target.value)
                          }
                          className={`${fieldCls} w-24`}
                          placeholder="Qty"
                        />
                        <div className="w-24 px-3 py-2.5 text-sm text-gray-600 text-right">
                          {v
                            ? `$${(v.price * (Number(it.quantity) || 0)).toFixed(2)}`
                            : "—"}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          disabled={items.length === 1}
                          className="px-3 py-2.5 text-gray-400 hover:text-red-500 disabled:opacity-30"
                          aria-label="Remove item"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-4 text-sm text-teal-600 hover:underline"
                >
                  + Add item
                </button>

                <div className="mt-6 pt-4 border-t border-gray-100 text-sm space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>${shippingNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800 pt-1">
                    <span>Total</span>
                    <span>${total.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Internal notes about this order…"
                  className={fieldCls}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Customer
                </h3>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                  placeholder="Name"
                  className={fieldCls}
                />
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={(e) =>
                    setForm({ ...form, customer_email: e.target.value })
                  }
                  placeholder="Email"
                  className={fieldCls}
                />
                <input
                  type="tel"
                  value={form.customer_phone}
                  onChange={(e) =>
                    setForm({ ...form, customer_phone: e.target.value })
                  }
                  placeholder="Phone"
                  className={fieldCls}
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Delivery
                </h3>
                <select
                  value={form.delivery_method}
                  onChange={(e) =>
                    setForm({ ...form, delivery_method: e.target.value })
                  }
                  className={fieldCls}
                >
                  <option value="Pick-Up">Pick-Up</option>
                  <option value="Australia Post">Australia Post</option>
                </select>
                {form.delivery_method === "Australia Post" && (
                  <textarea
                    value={form.delivery_address}
                    onChange={(e) =>
                      setForm({ ...form, delivery_address: e.target.value })
                    }
                    rows={2}
                    placeholder="Delivery address"
                    className={fieldCls}
                  />
                )}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Shipping cost (AUD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.shipping_cost}
                    onChange={(e) =>
                      setForm({ ...form, shipping_cost: e.target.value })
                    }
                    className={fieldCls}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h3 className="text-base font-semibold text-gray-800">
                  Status
                </h3>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className={fieldCls}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.decrement_stock}
                    onChange={(e) =>
                      setForm({ ...form, decrement_stock: e.target.checked })
                    }
                  />
                  Decrement stock
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.send_email}
                    onChange={(e) =>
                      setForm({ ...form, send_email: e.target.checked })
                    }
                  />
                  Send confirmation emails
                </label>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#8FE3D9] text-[#46494C] text-sm font-semibold rounded-xl hover:bg-[#7DD4CA] transition disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create Order"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/orders")}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
