import { getAllSlugs } from "@/lib/articles";
import { SITE_URL, CATEGORIES } from "@/lib/utils";

export default async function sitemap() {
  const slugs = await getAllSlugs();

  const articleUrls = slugs.map((s) => ({
    url: `${SITE_URL}/news/${s.slug}`,
    lastModified: s.updated_at || new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/news?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.8,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
