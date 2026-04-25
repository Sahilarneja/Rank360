import { getAllSlugs } from "@/lib/articles";
import { SITE_URL, CATEGORIES } from "@/lib/utils";
import { EXAM_HUBS, EVERGREEN_GUIDES } from "@/lib/growth";

export default async function sitemap() {
  let slugs = [];
  try {
    slugs = await getAllSlugs();
  } catch {
    // DB unreachable (e.g. local dev without DB access) — return static URLs only
  }

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

  const examHubUrls = [
    {
      url: `${SITE_URL}/exams`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    ...EXAM_HUBS.map((hub) => ({
      url: `${SITE_URL}${hub.href}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    })),
  ];

  const guideUrls = [
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...EVERGREEN_GUIDES.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    })),
  ];

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
    ...examHubUrls,
    ...guideUrls,
    ...articleUrls,
  ];
}
