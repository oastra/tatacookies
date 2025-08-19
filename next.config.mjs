/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // smaller prod bundles
  poweredByHeader: false,

  // Ship smaller JS by tree‑shaking common libs
  experimental: {
    // ✅ put it here
    optimizePackageImports: ["framer-motion"],
  },
  // Image pipeline defaults (helps LCP, prefers AVIF then WebP)
  images: {
    formats: ["image/avif", "image/webp"],
    // tune sizes for your hero/layout
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 96, 160, 216, 400, 608], // include your hero heights/widths
  },

  // Cache headers (CDN + browser) for static assets & public images
  async headers() {
    const oneYear = "public, max-age=31536000, immutable";
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

    return [
      // cache Next’s build assets
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: oneYear }],
      },
      // cache your public images
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: oneYear }],
      },

      // noindex preview/success pages
      { source: "/email-preview", headers: noindex },
      { source: "/email-custom-order-preview", headers: noindex },
      { source: "/success", headers: noindex },
      { source: "/contact/success", headers: noindex },

      // silence Chrome DevTools .well-known 404 noise
      {
        source: "/.well-known/appspecific/com.chrome.devtools.json",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },

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

  // Optional: serve a tiny placeholder file for the .well-known path
  async rewrites() {
    return [
      {
        source: "/.well-known/appspecific/com.chrome.devtools.json",
        destination: "/devtools-placeholder.json", // put {} in /public/devtools-placeholder.json
      },
    ];
  },

  // Strip console.* in production (keeps errors)
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
    styledComponents: true,
  },
};

export default nextConfig;
