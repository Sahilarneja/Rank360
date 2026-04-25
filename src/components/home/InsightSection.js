import Link from "next/link";
import CategoryBadge from "@/components/ui/CategoryBadge";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatRelativeTime } from "@/lib/utils";

const FALLBACK_INSIGHTS = [
  { icon: "AI", title: "AI Rewrite Layer", body: "Fresh source headlines are rewritten into cleaner, student-first summaries and longer crawlable article bodies.", color: "bg-amber-50 border-amber-200", textColor: "text-amber-900" },
  { icon: "SEO", title: "SEO Metadata", body: "Each processed article now gets sharper titles, descriptions, FAQs, and keyword hints designed for indexing.", color: "bg-sky-50 border-sky-200", textColor: "text-sky-900" },
  { icon: "API", title: "Source Diversity", body: "The pipeline now supports RSS plus multiple news APIs so the homepage can stay fresher and less repetitive.", color: "bg-emerald-50 border-emerald-200", textColor: "text-emerald-900" },
];

export default function InsightSection({ articles = [], insights = [] }) {
  const cards = insights.length
    ? insights.map((item) => ({
        icon: item.source ? item.source.slice(0, 2).toUpperCase() : "AI",
        title: item.title,
        body: item.body,
        href: item.href,
        color: "bg-brand-light border-brand-border",
        textColor: "text-[#0A0A0A]",
      }))
    : FALLBACK_INSIGHTS;

  return (
    <section className="mb-12">
      <SectionHeading>Student Insights</SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((item) =>
          item.href ? (
            <Link
              key={item.title}
              href={item.href}
              className={`rounded-news-lg border p-5 block hover:shadow-card transition-shadow min-w-0 overflow-hidden ${item.color}`}
            >
              <div className="flex items-center gap-2 mb-2 min-w-0">
                <span className="text-sm font-black tracking-wide flex-shrink-0">{item.icon}</span>
                <h3 className={`text-[14px] font-bold line-clamp-2 min-w-0 ${item.textColor}`}>{item.title}</h3>
              </div>
              <p className={`text-[13px] leading-relaxed line-clamp-3 ${item.textColor} opacity-90`}>
                {item.body}
              </p>
            </Link>
          ) : (
            <div
            key={item.title}
            className={`rounded-news-lg border p-5 min-w-0 overflow-hidden ${item.color}`}
          >
            <div className="flex items-center gap-2 mb-2 min-w-0">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <h3 className={`text-[14px] font-bold line-clamp-2 min-w-0 ${item.textColor}`}>{item.title}</h3>
            </div>
            <p className={`text-[13px] leading-relaxed line-clamp-3 ${item.textColor} opacity-90`}>
              {item.body}
            </p>
          </div>
          )
        )}
      </div>

      {articles.length > 0 && (
        <div className="space-y-0 divide-y divide-brand-border bg-white rounded-news-lg shadow-card overflow-hidden">
          {articles.slice(0, 5).map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="flex items-start gap-3 p-4 hover:bg-brand-light transition-colors group"
            >
              <span className="text-brand-blue mt-0.5 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <CategoryBadge category={article.category} linked={false} />
                  <time className="text-2xs text-brand-muted" dateTime={article.published_at}>
                    {formatRelativeTime(article.published_at)}
                  </time>
                </div>
                <h3 className="text-[14px] font-semibold text-[#111111] line-clamp-1
                               group-hover:text-brand-blue transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
