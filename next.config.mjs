/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: { styledComponents: true },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.tatacookies.com" }],
        destination: "https://tatacookies.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    const noindex = [
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
    ];

    return [
      // your existing path-specific noindex rules
      { source: "/email-preview", headers: noindex },
      { source: "/email-custom-order-preview", headers: noindex },
      { source: "/success", headers: noindex },
      { source: "/contact/success", headers: noindex },

      // 🔹 NEW: apply noindex to every route when host = dev domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "tatacookiesdev.vercel.app" }],
        headers: noindex,
      },
    ];
  },
};

export default nextConfig;
