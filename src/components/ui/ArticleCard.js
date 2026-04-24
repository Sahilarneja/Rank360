import Link from "next/link";
import Image from "next/image";
import CategoryBadge from "./CategoryBadge";
import { formatRelativeTime, truncate } from "@/lib/utils";

export default function ArticleCard({
  article,
  priority = false,
  variant = "default", // "default" | "compact" | "horizontal"
}) {
  const { title, slug, summary, category, image_url, published_at } = article;

  if (variant === "horizontal") {
    return (
      <article className="group flex gap-3 py-3 border-b border-brand-border last:border-0">
        {image_url && (
          <Link href={`/news/${slug}`} className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={image_url}
              alt={title}
              width={80}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="80px"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <CategoryBadge category={category} />
          </div>
          <Link href={`/news/${slug}`}>
            <h3 className="text-[13.5px] font-semibold text-[#111111] leading-snug line-clamp-2
                           group-hover:text-brand-blue transition-colors">
              {title}
            </h3>
          </Link>
          <time className="text-2xs text-brand-muted mt-1 block" dateTime={published_at}>
            {formatRelativeTime(published_at)}
          </time>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-3 items-start">
        {image_url && (
          <Link href={`/news/${slug}`} className="flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={image_url}
              alt={title}
              width={64}
              height={56}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              sizes="64px"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/news/${slug}`}>
            <h3 className="text-[13px] font-semibold text-[#111111] leading-snug line-clamp-2
                           group-hover:text-brand-blue transition-colors">
              {title}
            </h3>
          </Link>
          <time className="text-2xs text-brand-muted mt-0.5 block" dateTime={published_at}>
            {formatRelativeTime(published_at)}
          </time>
        </div>
      </article>
    );
  }

  // Default card
  return (
    <article className="news-card group flex flex-col h-full">
      {/* Thumbnail */}
      <Link
        href={`/news/${slug}`}
        className="block overflow-hidden aspect-[16/9] bg-gray-100 flex-shrink-0"
      >
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            width={480}
            height={270}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100
                          flex items-center justify-center">
            <span className="text-brand-blue text-3xl font-black opacity-20">R360</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-2">
          <CategoryBadge category={category} />
          <time className="text-2xs text-brand-muted" dateTime={published_at}>
            {formatRelativeTime(published_at)}
          </time>
        </div>

        <Link href={`/news/${slug}`}>
          <h3 className="text-[15px] font-bold text-[#111111] leading-snug line-clamp-2
                         group-hover:text-brand-blue transition-colors">
            {title}
          </h3>
        </Link>

        {summary && (
          <p className="text-[13px] text-brand-muted leading-relaxed line-clamp-2 flex-1">
            {truncate(summary, 110)}
          </p>
        )}

        <Link
          href={`/news/${slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue
                     hover:gap-2 transition-all mt-auto pt-1"
        >
          Read more
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
