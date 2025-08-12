/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tatacookies.com",
  generateRobotsTxt: false,
  trailingSlash: false,
  changefreq: "monthly",
  priority: 0.7,

  // Keep these out of the sitemap
  exclude: [
    "/email-preview",
    "/email-custom-order-preview",
    "/success",
    "/contact/success",
    "/api/*",
  ],

  // Belt-and-braces: if exclude ever fails, skip them here too
  transform: async (config, path) => {
    const block = new Set([
      "/email-preview",
      "/email-custom-order-preview",
      "/success",
      "/contact/success",
    ]);
    if (block.has(path)) return null;
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
