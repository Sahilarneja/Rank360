/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rank360.in",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "hourly",
  priority: 0.7,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/" },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://rank360.in"}/sitemap.xml`,
      // Google News sitemap — required for News carousel inclusion
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://rank360.in"}/news-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    if (path === "/") {
      return { loc: path, changefreq: "hourly", priority: 1.0 };
    }
    if (path.startsWith("/news/")) {
      return { loc: path, changefreq: "daily", priority: 0.9 };
    }
    if (path === "/news") {
      return { loc: path, changefreq: "hourly", priority: 0.8 };
    }
    if (path.startsWith("/exams/")) {
      return { loc: path, changefreq: "daily", priority: 0.85 };
    }
    if (path.startsWith("/guides/")) {
      return { loc: path, changefreq: "weekly", priority: 0.75 };
    }
    return { loc: path, changefreq: config.changefreq, priority: config.priority };
  },
};
