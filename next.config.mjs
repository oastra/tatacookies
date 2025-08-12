/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: { styledComponents: true },

  async redirects() {
    // Enforce one host: www → apex
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
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/email-preview", headers: noindex },
      { source: "/email-custom-order-preview", headers: noindex },
      { source: "/success", headers: noindex },
      { source: "/contact/success", headers: noindex },
    ];
  },
};

export default nextConfig;
