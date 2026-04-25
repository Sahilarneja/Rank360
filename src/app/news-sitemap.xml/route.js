import { getAllSlugs } from "@/lib/articles";
import { SITE_URL, SITE_NAME } from "@/lib/utils";

// Google News sitemap — required for Google News carousel inclusion.
// Must only include articles published within the last 2 days.
// Spec: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap

export const revalidate = 300; // regenerate every 5 min

export async function GET() {
  let slugs = [];
  try {
    slugs = await getAllSlugs();
  } catch {
    // DB unavailable — return empty sitemap
  }

  // Google News only indexes articles from the last 2 days
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const recentSlugs = slugs.filter((s) => {
    const pub = s.published_at ? new Date(s.published_at) : null;
    return pub && pub >= twoDaysAgo;
  });

  const items = recentSlugs
    .slice(0, 1000) // Google News sitemap limit
    .map((s) => {
      const pubDate = new Date(s.published_at).toISOString();
      const title = escapeXml(s.title || s.slug);
      const url = `${SITE_URL}/news/${s.slug}`;
      return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

function escapeXml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
