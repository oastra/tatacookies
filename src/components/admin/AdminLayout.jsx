import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import useAdmin from "@/hooks/useAdmin";

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="2" width="7" height="7" rx="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg
        width="20"
        height="20"
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
    href: "/admin/categories",
    label: "Categories",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 5h16M2 10h16M2 15h10" />
      </svg>
    ),
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: (
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
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg
        width="20"
        height="20"
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
    href: "/admin/best-sellers",
    label: "Best Sellers",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.5l-4.8 2.4.9-5.4-3.9-3.8 5.4-.8L10 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/blogs",
    label: "Blog Posts",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M7 7h6M7 10h6M7 13h4" />
      </svg>
    ),
  },
];

export default function AdminLayout({ children, title, headerAction, onSearch, searchPlaceholder }) {
  const { user, loading, signOut } = useAdmin();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/LogoTataCookies.svg"
            alt="TaTaCookies"
            width={50}
            height={50}
            className="animate-pulse"
          />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 fixed h-full z-30">
        {/* Logo */}
        <div className="p-5 pb-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/LogoTataCookies.svg"
              alt="TaTaCookies logo"
              width={44}
              height={44}
            />
            <div>
              <p className="text-[15px] font-bold text-[#1985A1] leading-tight">
                TataCookies
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Action */}
        <div className="px-4 mb-4">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#8FE3D9] text-[#46494C] text-sm font-semibold rounded-xl hover:bg-[#7DD4CA] transition"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M8 3v10M3 8h10" />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? router.pathname === "/admin"
                : router.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition ${
                  isActive
                    ? "bg-[#EFF7F6] text-[#1985A1]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <span className={isActive ? "text-[#1985A1]" : "text-gray-400"}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#EFF7F6] flex items-center justify-center text-xs font-bold text-[#1985A1]">
              {(user.email?.[0] || "A").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 font-medium truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-gray-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500 transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M5 1H3a2 2 0 00-2 2v8a2 2 0 002 2h2M9 10l3-3-3-3M12 7H5" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          <div className="flex items-center gap-4">
            {onSearch && (
              <div className="relative">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3 3" />
                </svg>
                <input
                  type="text"
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder={searchPlaceholder || "Search..."}
                  className="pl-9 pr-4 py-2 w-64 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#8FE3D9] focus:ring-1 focus:ring-[#8FE3D9]"
                />
              </div>
            )}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </header>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
