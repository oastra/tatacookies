import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase";

const statusColors = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
  fulfilled: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const [prodRes, orderRes] = await Promise.all([
      fetch("/api/admin/products", { headers }),
      fetch("/api/admin/orders?limit=10", { headers }),
    ]);

    const products = await prodRes.json();
    const orders = await orderRes.json();

    const activeProducts = Array.isArray(products)
      ? products.filter((p) => p.is_active)
      : [];

    const paidOrders = Array.isArray(orders)
      ? orders.filter((o) => o.status === "paid" || o.status === "fulfilled")
      : [];

    const revenue = paidOrders.reduce(
      (sum, o) => sum + Number(o.total_aud || 0),
      0,
    );

    const lowStock = activeProducts.reduce((count, p) => {
      const lowVariants = (p.product_variants || []).filter(
        (v) => v.is_active && v.stock_count <= 5,
      );
      return count + lowVariants.length;
    }, 0);

    setStats({
      products: activeProducts.length,
      orders: Array.isArray(orders) ? orders.length : 0,
      revenue,
      lowStock,
    });

    setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
    setLoading(false);
  };

  const statCards = [
    {
      label: "Active Products",
      value: stats.products,
      href: "/admin/products",
      iconBg: "bg-[#EFF7F6]",
      iconColor: "text-[#1985A1]",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 6l7-4 7 4v8l-7 4-7-4V6z" />
          <path d="M3 6l7 4m0 0l7-4m-7 4v8" />
        </svg>
      ),
    },
    {
      label: "Total Orders",
      value: stats.orders,
      href: "/admin/orders",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M6 2L3 6v10a2 2 0 002 2h10a2 2 0 002-2V6l-3-4H6z" />
          <path d="M3 6h14M13 9a3 3 0 01-6 0" />
        </svg>
      ),
    },
    {
      label: "Revenue (AUD)",
      value: `$${stats.revenue.toFixed(2)}`,
      href: "/admin/orders",
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 2v16M6 6c0-1.1 1.8-2 4-2s4 .9 4 2-1.8 2-4 2-4 .9-4 2 1.8 2 4 2 4-.9 4-2" />
        </svg>
      ),
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      href: "/admin/inventory",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 3L2 17h16L10 3zM10 8v4M10 14h.01" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Admin TataCookies</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminLayout title="Dashboard">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm">
            Welcome back! Here is what is happening with your shop today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-gray-300 group-hover:text-gray-500 transition"
                >
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? "—" : card.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#8FE3D9] hover:shadow-sm transition"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8FE3D9]/20 text-[#1985A1] flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 4v12M4 10h12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Add Product</p>
              <p className="text-xs text-gray-400">Create a new cookie</p>
            </div>
          </Link>

          <Link
            href="/admin/inventory"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#8FE3D9] hover:shadow-sm transition"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 4h12v12H4z" rx="1" />
                <path d="M4 8h12M8 8v8" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Update Stock
              </p>
              <p className="text-xs text-gray-400">Manage inventory</p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#8FE3D9] hover:shadow-sm transition"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M9 5H5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-4" />
                <path d="M16 3l-8 8M12 3h4v4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">View Orders</p>
              <p className="text-xs text-gray-400">Check recent orders</p>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-800">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-[#1985A1] hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-300 text-sm"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          className="text-gray-200"
                        >
                          <path d="M6 2L3 6v10a2 2 0 002 2h10a2 2 0 002-2V6l-3-4H6z" />
                          <path d="M3 6h14M13 9a3 3 0 01-6 0" />
                        </svg>
                        <p className="text-sm text-gray-400">No orders yet</p>
                        <p className="text-xs text-gray-300">
                          Orders will appear here when customers purchase
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition"
                    >
                      <td className="px-6 py-3.5">
                        <p className="text-sm text-gray-800 font-medium">
                          {order.customer_name || "Guest"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.customer_email || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium text-gray-800">
                        ${Number(order.total_aud || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status] || statusColors.pending
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-AU",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
