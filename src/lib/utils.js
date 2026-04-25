import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix: true });
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function formatDate(date, pattern = "MMM d, yyyy") {
  if (!date) return "";
  return format(new Date(date), pattern);
}

export function formatFullDate(date) {
  if (!date) return "";
  return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
}

export function formatShortDate(date) {
  if (!date) return "";
  return format(new Date(date), "MMM d");
}

// ── Category metadata ──────────────────────────────────────────
const CATEGORY_META = {
  jee: {
    label: "JEE",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    accent: "#2563EB",
    description: "JEE Main & Advanced news, results, cutoffs",
  },
  neet: {
    label: "NEET",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    accent: "#059669",
    description: "NEET UG & PG news, results, counselling",
  },
  cuet: {
    label: "CUET",
    color: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
    accent: "#7C3AED",
    description: "CUET UG & PG news, results, admissions",
  },
  admissions: {
    label: "Admissions",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
    accent: "#EA580C",
    description: "College admissions, counselling, seat allotment",
  },
  results: {
    label: "Results",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    accent: "#DC2626",
    description: "Exam results and scorecards",
  },
  news: {
    label: "News",
    color: "bg-gray-100 text-gray-700",
    dot: "bg-gray-500",
    accent: "#6B7280",
    description: "General education news",
  },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category?.toLowerCase()] || CATEGORY_META.news;
}

export function getCategoryColor(category) {
  return getCategoryMeta(category).color;
}

export function getCategoryLabel(category) {
  return getCategoryMeta(category).label;
}

export function truncate(str, length = 120) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

export function buildSeoMeta(article) {
  const seo = article?.seo_meta || {};
  return {
    title: seo.title || `${article?.title} | Rank360`,
    description: seo.description || article?.summary || "",
    keywords: seo.keywords || "",
  };
}

export function getArticleImageUrl(article, { absolute = false, siteUrl = SITE_URL } = {}) {
  const raw = article?.image_url;

  if (raw) {
    if (/^https?:\/\//.test(raw)) return raw;
    if (raw.startsWith("/")) return absolute ? `${siteUrl}${raw}` : raw;
  }

  const fallback = article?.slug ? `/news/${article.slug}/image` : "/opengraph-image";
  return absolute ? `${siteUrl}${fallback}` : fallback;
}

export function buildJsonLd(article, siteUrl) {
  const catLabel = getCategoryLabel(article.category);
  const imageUrl = getArticleImageUrl(article, { absolute: true, siteUrl });

  const newsArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: [imageUrl],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    articleSection: catLabel,
    keywords: Array.isArray(article.tags) ? article.tags.join(", ") : "",
    inLanguage: "en-IN",
    author: {
      "@type": "Organization",
      name: "Rank360",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Rank360",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/apple-icon`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/news/${article.slug}`,
    },
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "WebSite",
      name: "Rank360",
      url: siteUrl,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: `${siteUrl}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: catLabel,
        item: `${siteUrl}/news?category=${article.category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `${siteUrl}/news/${article.slug}`,
      },
    ],
  };

  const faqItems = (article.faq || []).map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const schemas = [newsArticle, breadcrumb];

  if (faqItems.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems,
    });
  }

  return schemas;
}

// ── Site-level schema (injected in root layout) ────────────────
export function buildSiteSchema(siteUrl) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Rank360",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/apple-icon`,
        width: 200,
        height: 60,
      },
      description:
        "Rank360 covers JEE, NEET, CUET results, cutoffs, admissions, and college news — fast, accurate, student-first.",
      sameAs: [
        "https://twitter.com/rank360in",
        "https://t.me/rank360in",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Rank360",
      url: siteUrl,
      description: "India's Fastest Education News",
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/news?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ];
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rank360.in";
export const SITE_NAME = "Rank360";
export const SITE_TAGLINE = "India's Fastest Education News";
export const SITE_DESCRIPTION =
  "Rank360 covers JEE, NEET, CUET results, cutoffs, admissions, and college news — fast, accurate, student-first.";

export const CATEGORIES = ["jee", "neet", "cuet", "admissions", "results", "news"];

export const NAV_LINKS = [
  { label: "JEE", href: "/news?category=jee" },
  { label: "NEET", href: "/news?category=neet" },
  { label: "CUET", href: "/news?category=cuet" },
  { label: "Admissions", href: "/news?category=admissions" },
  { label: "Results", href: "/news?category=results" },
  { label: "All News", href: "/news" },
];
