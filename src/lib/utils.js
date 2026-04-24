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

export function buildJsonLd(article, siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: article.image_url
      ? [article.image_url]
      : [`${siteUrl}/og-default.jpg`],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Organization",
      name: "Rank360",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Rank360",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/news/${article.slug}`,
    },
  };
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
