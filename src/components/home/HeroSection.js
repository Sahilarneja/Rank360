import Link from "next/link";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { formatRelativeTime, getCategoryMeta } from "@/lib/utils";

export default function HeroSection({ featured, secondary = [] }) {
  if (!featured) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-2" aria-label="Featured news">

      {/* ── Main featured ──────────────────────────────────────── */}
      <article className="lg:col-span-7 group relative rounded-news-lg overflow-hidden bg-gray-900 min-h-[340px] md:min-h-[420px]">
        {/* Gradient background — replaces image until real images are added */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #1D4ED8 50%, #0f2a4a 100%)",
          }}
        />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={featured.category} linked={false} size="lg" />
            <time className="text-xs text-gray-300" dateTime={featured.published_at}>
              {formatRelativeTime(featured.published_at)}
            </time>
            {featured.source_name && (
              <span className="text-xs text-gray-300">{featured.source_name}</span>
            )}
          </div>
          <Link href={`/news/${featured.slug}`}>
            <h1 className="text-white font-black text-[22px] md:text-[28px] leading-tight
                           line-clamp-3 group-hover:text-blue-200 transition-colors text-balance">
              {featured.title}
            </h1>
          </Link>
          {featured.summary && (
            <p className="text-gray-300 text-sm mt-2 line-clamp-2 hidden md:block leading-relaxed">
              {featured.summary}
            </p>
          )}
          <Link
            href={`/news/${featured.slug}`}
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-bold text-white
                       bg-brand-blue hover:bg-brand-blue-dark px-4 py-2 rounded-full transition-colors"
          >
            Read Full Story
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </article>

      {/* ── Secondary articles ─────────────────────────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        {secondary.slice(0, 4).map((article, i) => (
          <article
            key={article.id}
            className="group flex gap-3 bg-white rounded-news shadow-card hover:shadow-card-hover
                       transition-all duration-200 overflow-hidden p-3"
          >
            <Link href={`/news/${article.slug}`} className="flex-shrink-0 w-[90px] h-[70px] rounded-lg overflow-hidden bg-gray-100">
              <div className={`w-full h-full flex items-center justify-center text-xs font-bold ${getCategoryMeta(article.category).color}`}>
                {getCategoryMeta(article.category).label}
              </div>
            </Link>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <CategoryBadge category={article.category} />
                  <time className="text-2xs text-brand-muted" dateTime={article.published_at}>
                    {formatRelativeTime(article.published_at)}
                  </time>
                  {article.source_name && (
                    <span className="text-2xs text-brand-muted">{article.source_name}</span>
                  )}
                </div>
                <Link href={`/news/${article.slug}`}>
                  <h2 className="text-[13.5px] font-bold text-[#111111] leading-snug line-clamp-2
                                 group-hover:text-brand-blue transition-colors">
                    {article.title}
                  </h2>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
