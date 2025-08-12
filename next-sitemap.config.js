/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tatacookies.com",
  generateRobotsTxt: false, // you already manage robots.txt via script
  exclude: ["/404", "/500", "/api/*"],
  changefreq: "monthly",
  priority: 0.7,
};
