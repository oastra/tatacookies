import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

export default function OrderDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const getToken = async () => {
    const { data: session } = await supabase.auth.getSession();
    return session?.session?.access_token;
  };

  const fetchOrder = async () => {
    const token = await getToken();
    if (!token) return;

    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const found = Array.isArray(data) ? data.find((o) => o.id === id) : null;
    setOrder(found);
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    const token = await getToken();
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchOrder();
  };

  const updateNotes = async (notes) => {
    const token = await getToken();
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, notes }),
    });
  };

  const updateTrackingNumber = async (tracking_number) => {
    const token = await getToken();
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, tracking_number }),
    });
    fetchOrder();
  };

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <p className="text-gray-400">Loading...</p>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <p className="text-red-500">Order not found</p>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head>
        <title>Order {String(order.order_number).padStart(4, "0")} - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title={`Order #${String(order.order_number).padStart(4, "0")}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-800">
                  Order Items
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium">Product</th>
                      <th className="text-left px-6 py-3 font-medium">Variant</th>
                      <th className="text-right px-6 py-3 font-medium">Price</th>
                      <th className="text-right px-6 py-3 font-medium">Qty</th>
                      <th className="text-right px-6 py-3 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(order.order_items || []).map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-gray-800">
                          {item.product_title}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.variant_name}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          ${Number(item.price_aud).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-gray-800">
                          ${(Number(item.price_aud) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-gray-200">
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-right font-semibold text-gray-800"
                      >
                        Total
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-800">
                        ${Number(order.total_aud || 0).toFixed(2)} AUD
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Notes
              </h3>
              <textarea
                defaultValue={order.notes || ""}
                onBlur={(e) => updateNotes(e.target.value)}
                rows={3}
                placeholder="Add internal notes..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Status
              </h3>
              <select
                value={order.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-400"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Tracking */}
            {order.delivery_method === "Australia Post" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Tracking
                </h3>
                <input
                  type="text"
                  defaultValue={order.tracking_number || ""}
                  onBlur={(e) => {
                    if (e.target.value !== (order.tracking_number || "")) {
                      updateTrackingNumber(e.target.value);
                    }
                  }}
                  placeholder="e.g. ABC123456789"
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:outline-none focus:border-teal-400 focus:bg-white font-mono"
                />
                {order.tracking_number && (
                  <a
                    href={`https://auspost.com.au/mypost/track/#/details/${order.tracking_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline text-xs mt-2 inline-block"
                  >
                    View on Australia Post
                  </a>
                )}
                {order.shipping_notification_sent && (
                  <p className="text-xs text-green-600 mt-2">
                    Shipping notification sent
                  </p>
                )}
              </div>
            )}

            {/* Customer */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Customer
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-800">
                  {order.customer_name || "No name provided"}
                </p>
                <p className="text-gray-500">{order.customer_email || "—"}</p>
                {order.customer_phone && (
                  <p className="text-gray-500">
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="hover:text-teal-600 transition"
                    >
                      {order.customer_phone}
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Delivery
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-800">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      order.delivery_method === "Pick-Up"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {order.delivery_method || "Not specified"}
                  </span>
                </p>
                {order.delivery_address && (
                  <p className="text-gray-500">{order.delivery_address}</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Payment
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Stripe Session:{" "}
                  <span className="font-mono text-xs text-gray-400">
                    {order.stripe_session_id?.slice(0, 20)}...
                  </span>
                </p>
                <p className="text-gray-600">
                  Created:{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
