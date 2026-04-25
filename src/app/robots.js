import { SITE_URL } from "@/lib/utils";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Explicitly allow Googlebot-News to crawl all news and guide pages
      {
        userAgent: "Googlebot-News",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    // Point to both sitemaps so Google discovers all URLs and the News sitemap
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
    host: SITE_URL,
  };
}
