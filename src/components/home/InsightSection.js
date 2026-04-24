import Link from "next/link";
import CategoryBadge from "@/components/ui/CategoryBadge";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatRelativeTime } from "@/lib/utils";

const INSIGHTS = [
  {
    icon: "📈",
    title: "JEE Cutoff Trends",
    body: "General category cutoff has risen 3 percentile points YoY. Prepare for 92+ percentile for top NITs.",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
  },
  {
    icon: "🩺",
    title: "NEET Seat Matrix",
    body: "MBBS seats increased by 8,000 this year. State quota seats now open for all-India candidates.",
    color: "bg-emerald-50 border-emerald-200",
    textColor: "text-emerald-800",
  },
  {
    icon: "🏛️",
    title: "DU Admission Insight",
    body: "CUET scores replacing merit lists. Students with 95+ in relevant subjects have strong chances.",
    color: "bg-violet-50 border-violet-200",
    textColor: "text-violet-800",
  },
];

export default function InsightSection({ articles = [] }) {
  return (
    <section className="mb-12">
      <SectionHeading>Student Insights</SectionHeading>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {INSIGHTS.map((item) => (
          <div
            key={item.title}
            className={`rounded-news-lg border p-5 ${item.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{item.icon}</span>
              <h3 className={`text-[14px] font-bold ${item.textColor}`}>{item.title}</h3>
            </div>
            <p className={`text-[13px] leading-relaxed ${item.textColor} opacity-90`}>
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* Recent articles with insight tag */}
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
