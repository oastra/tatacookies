import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

const statusColors = {
  pending: "bg-gray-100 text-gray-700",
  paid: "bg-green-100 text-green-700",
  fulfilled: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) return;

    const params = new URLSearchParams();
    if (filter) params.set("status", filter);

    const res = await fetch(`/api/admin/orders?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });

    fetchOrders();
  };

  return (
    <>
      <Head>
        <title>Orders - Admin TaTaCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Orders">
        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["", "pending", "paid", "fulfilled", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                filter === status
                  ? "bg-teal-50 border-teal-300 text-teal-700"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {status || "All"}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-400">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="p-8 text-center text-gray-400">No orders found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Order</th>
                    <th className="text-left px-6 py-3 font-medium">Customer</th>
                    <th className="text-left px-6 py-3 font-medium">Items</th>
                    <th className="text-left px-6 py-3 font-medium">Total</th>
                    <th className="text-left px-6 py-3 font-medium">Delivery</th>
                    <th className="text-left px-6 py-3 font-medium">Status</th>
                    <th className="text-left px-6 py-3 font-medium">Date</th>
                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700 text-sm font-mono font-medium">
                        #{String(order.order_number).padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-800 font-medium">
                          {order.customer_name || "—"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer_email}
                        </p>
                        {order.customer_phone && (
                          <p className="text-xs text-gray-400">
                            {order.customer_phone}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {(order.order_items || []).length} items
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        ${Number(order.total_aud || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.delivery_method === "Pick-Up"
                              ? "bg-blue-50 text-blue-600"
                              : order.delivery_method
                                ? "bg-green-50 text-green-600"
                                : "text-gray-400"
                          }`}
                        >
                          {order.delivery_method || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${
                            statusColors[order.status] || statusColors.pending
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="fulfilled">Fulfilled</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-teal-600 hover:underline text-sm"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
