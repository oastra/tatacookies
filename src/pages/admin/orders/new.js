import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

const FREE_SHIPPING_THRESHOLD = 300;
const FLAT_RATE = 20;

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
    status: "paid",
    shipping_cost: 0,
    auto_shipping: true,
    decrement_stock: true,
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
          product_title: p.title,
          variant_name: v.name,
          price: Number(v.price_aud),
          stock: v.stock_count,
          image_url: p.image_url,
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

  // Auto shipping calc
  const autoShipping = useMemo(() => {
    if (form.delivery_method !== "Australia Post") return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_RATE;
  }, [form.delivery_method, subtotal]);

  const shippingNum =
    form.delivery_method === "Pick-Up"
      ? 0
      : form.auto_shipping
      ? autoShipping
      : Number(form.shipping_cost) || 0;

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
    setItems((prev) =>
      prev.length === 1 ? [{ variant_id: "", quantity: 1 }] : prev.filter((_, i) => i !== idx)
    );

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
    if (!form.customer_email.trim()) {
      setError("Customer email is required");
      return;
    }

    // Stock warnings — soft check (admin can still proceed)
    const overstock = validItems.find((it) => {
      const v = variantById[it.variant_id];
      return v && v.stock != null && Number(it.quantity) > v.stock;
    });
    if (overstock && form.decrement_stock) {
      const v = variantById[overstock.variant_id];
      const ok = confirm(
        `"${v.product_title} — ${v.variant_name}" only has ${v.stock} in stock. Continue anyway?`
      );
      if (!ok) return;
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
        customer_name: form.customer_name,
        customer_email: form.customer_email,
        customer_phone: form.customer_phone,
        delivery_method: form.delivery_method,
        delivery_address:
          form.delivery_method === "Australia Post"
            ? form.delivery_address
            : null,
        notes: form.notes,
        status: form.status,
        shipping_cost: shippingNum,
        decrement_stock: form.decrement_stock,
        send_email: form.send_email,
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
    "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-teal-400";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1";
  const cardCls = "bg-white rounded-xl border border-gray-200 p-6";
  const sectionTitleCls =
    "text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4";

  return (
    <>
      <Head>
        <title>New Order - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="New Order">
        <div className="mb-4">
          <Link
            href="/admin/orders"
            className="text-sm text-gray-500 hover:text-teal-600 transition"
          >
            ← Back to Orders
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="max-w-5xl pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <div className={cardCls}>
                <h3 className={sectionTitleCls}>Items</h3>

                {/* Column headers */}
                <div className="hidden sm:grid grid-cols-[1fr_110px_110px_32px] gap-3 px-1 pb-2 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Line total</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {items.map((it, idx) => (
                    <ItemRow
                      key={idx}
                      item={it}
                      options={variantOptions}
                      variantById={variantById}
                      onChange={(field, value) => updateItem(idx, field, value)}
                      onRemove={() => removeItem(idx)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addItem}
                  className="mt-3 w-full py-2.5 border border-dashed border-gray-300 text-sm text-gray-500 rounded-lg hover:border-teal-300 hover:text-teal-600 transition"
                >
                  + Add item
                </button>

                <div className="mt-6 pt-4 border-t border-gray-100 text-sm space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Shipping
                      {form.delivery_method === "Australia Post" &&
                        form.auto_shipping && (
                          <span className="ml-2 text-xs text-gray-400">
                            {subtotal >= FREE_SHIPPING_THRESHOLD
                              ? "(free over $300)"
                              : "(flat $20)"}
                          </span>
                        )}
                    </span>
                    <span>${shippingNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800 pt-2 text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className={cardCls}>
                <h3 className={sectionTitleCls}>Internal Notes</h3>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  placeholder="Internal notes about this order…"
                  className={fieldCls}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Customer */}
              <div className={`${cardCls} space-y-3`}>
                <h3 className={sectionTitleCls}>Customer</h3>
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.customer_email}
                    onChange={(e) =>
                      setForm({ ...form, customer_email: e.target.value })
                    }
                    className={fieldCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input
                    type="tel"
                    value={form.customer_phone}
                    onChange={(e) =>
                      setForm({ ...form, customer_phone: e.target.value })
                    }
                    className={fieldCls}
                  />
                </div>
              </div>

              {/* Delivery */}
              <div className={`${cardCls} space-y-3`}>
                <h3 className={sectionTitleCls}>Delivery</h3>
                <div>
                  <label className={labelCls}>Method</label>
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
                </div>
                {form.delivery_method === "Australia Post" && (
                  <>
                    <div>
                      <label className={labelCls}>
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={form.delivery_address}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            delivery_address: e.target.value,
                          })
                        }
                        rows={2}
                        className={fieldCls}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <input
                          type="checkbox"
                          checked={form.auto_shipping}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              auto_shipping: e.target.checked,
                            })
                          }
                        />
                        Auto-calculate shipping
                      </label>
                      <label className={labelCls}>Shipping cost</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          disabled={form.auto_shipping}
                          value={
                            form.auto_shipping
                              ? autoShipping
                              : form.shipping_cost
                          }
                          onChange={(e) =>
                            setForm({
                              ...form,
                              shipping_cost: e.target.value,
                            })
                          }
                          className={`${fieldCls} pl-7 disabled:bg-gray-50 disabled:text-gray-500`}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Status */}
              <div className={`${cardCls} space-y-3`}>
                <h3 className={sectionTitleCls}>Status</h3>
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
              </div>

              {/* Options */}
              <div className={`${cardCls} space-y-3`}>
                <h3 className={sectionTitleCls}>Options</h3>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.decrement_stock}
                    onChange={(e) =>
                      setForm({ ...form, decrement_stock: e.target.checked })
                    }
                    className="mt-0.5"
                  />
                  <span>
                    Decrement stock
                    <span className="block text-xs text-gray-400">
                      Reduce stock counts for each variant.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.send_email}
                    onChange={(e) =>
                      setForm({ ...form, send_email: e.target.checked })
                    }
                    className="mt-0.5"
                  />
                  <span>
                    Send confirmation emails
                    <span className="block text-xs text-gray-400">
                      Email the customer and admin inbox.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Sticky action bar */}
          <div className="fixed bottom-0 left-[260px] right-0 bg-white border-t border-gray-200 px-8 py-3 flex items-center justify-between z-20">
            <div className="text-sm">
              <span className="text-gray-500">Total</span>{" "}
              <span className="font-semibold text-gray-800 ml-2">
                ${total.toFixed(2)} AUD
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/orders")}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#8FE3D9] text-[#46494C] text-sm font-semibold rounded-xl hover:bg-[#7DD4CA] transition disabled:opacity-50"
              >
                {saving ? "Creating…" : "Create Order"}
              </button>
            </div>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}

function ItemRow({ item, options, variantById, onChange, onRemove }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const v = variantById[item.variant_id];

  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.product_title.toLowerCase().includes(q) ||
        o.variant_name.toLowerCase().includes(q)
    );
  }, [options, query]);

  const qty = Number(item.quantity) || 0;
  const lineTotal = v ? v.price * qty : 0;
  const overstock = v && v.stock != null && qty > v.stock;

  const step = (delta) =>
    onChange("quantity", Math.max(1, qty + delta));

  return (
    <div className="grid grid-cols-[1fr_110px_110px_32px] gap-3 items-start">
      {/* Picker */}
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-white hover:border-gray-300 text-left min-h-[44px]"
        >
          {v ? (
            <>
              {v.image_url ? (
                <div className="relative w-8 h-8 shrink-0 rounded overflow-hidden bg-gray-100">
                  <Image
                    src={v.image_url}
                    alt=""
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 shrink-0 rounded bg-gray-100" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">
                  {v.product_title}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {v.variant_name} · ${v.price.toFixed(2)}
                  {v.stock != null && ` · stock: ${v.stock}`}
                </p>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-400">Select a product…</span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-400 shrink-0"
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full max-h-80 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-teal-400"
              />
            </div>
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-sm text-gray-400 text-center">
                No matches
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => {
                    onChange("variant_id", opt.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                >
                  {opt.image_url ? (
                    <div className="relative w-8 h-8 shrink-0 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={opt.image_url}
                        alt=""
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 shrink-0 rounded bg-gray-100" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">
                      {opt.product_title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {opt.variant_name} · ${opt.price.toFixed(2)}
                      {opt.stock != null && ` · stock: ${opt.stock}`}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Qty stepper */}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-[44px]">
        <button
          type="button"
          onClick={() => step(-1)}
          className="w-9 h-full text-gray-500 hover:bg-gray-50"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onChange("quantity", e.target.value)}
          className="flex-1 w-full text-center text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => step(1)}
          className="w-9 h-full text-gray-500 hover:bg-gray-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Line total */}
      <div className="h-[44px] flex items-center justify-end">
        {v ? (
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              ${lineTotal.toFixed(2)}
            </p>
            {overstock && (
              <p className="text-[11px] text-amber-600">
                Over stock ({v.stock})
              </p>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-300">—</span>
        )}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="h-[44px] w-8 text-gray-300 hover:text-red-500"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}
