import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles, getAllSlugs } from "@/lib/articles";
import { buildSeoMeta, buildJsonLd, formatFullDate, formatDate, getArticleImageUrl, SITE_URL, SITE_NAME } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import ArticleCard from "@/components/ui/ArticleCard";
import AdUnit from "@/components/ads/AdUnit";
import SectionHeading from "@/components/ui/SectionHeading";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    // DB unavailable at build time — pages will be rendered on-demand (ISR)
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  const { title, description, keywords } = buildSeoMeta(article);
  const canonicalUrl = `${SITE_URL}/news/${slug}`;
  const imageUrl = getArticleImageUrl(article, { absolute: true, siteUrl: SITE_URL });

  return {
    title,
    description,
    keywords,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at || article.published_at,
      authors: [SITE_NAME],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;

  let article, related = [];
  try {
    article = await getArticleBySlug(slug);
  } catch (err) {
    console.error("ArticlePage fetch error:", err.message);
  }

  if (!article) notFound();

  try {
    related = await getRelatedArticles(article.category, slug, 4);
  } catch {
    related = [];
  }

  const jsonLd = buildJsonLd(article, SITE_URL);
  const displayImageUrl = getArticleImageUrl(article);

  // Extract "what it means" section from content if present
  const hasInsight = article.content?.toLowerCase().includes("what it means");

  return (
    <>
      {/* JSON-LD: NewsArticle + BreadcrumbList + FAQPage */}
      {(Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── Main article ──────────────────────────────────── */}
          <article className="lg:col-span-8" itemScope itemType="https://schema.org/NewsArticle">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-brand-muted mb-5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
              <span>/</span>
              <Link href="/news" className="hover:text-brand-blue transition-colors">News</Link>
              <span>/</span>
              <Link href={`/news?category=${article.category}`} className="hover:text-brand-blue transition-colors capitalize">
                {article.category}
              </Link>
            </nav>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <CategoryBadge category={article.category} size="lg" />
              <time
                className="text-sm text-brand-muted"
                dateTime={article.published_at}
                itemProp="datePublished"
              >
                {formatFullDate(article.published_at)}
              </time>
              {article.source_name && (
                <span className="text-sm text-brand-muted">Source: {article.source_name}</span>
              )}
              {article.reading_time_minutes ? (
                <span className="text-sm text-brand-muted">{article.reading_time_minutes} min read</span>
              ) : null}
              {article.updated_at && article.updated_at !== article.published_at && (
                <span className="text-xs text-brand-muted">
                  · Updated {formatDate(article.updated_at)}
                </span>
              )}
            </div>

            {/* Title */}
            <h1
              className="text-[26px] md:text-[34px] font-black text-[#0A0A0A] leading-tight
                         tracking-tight mb-5 text-balance"
              itemProp="headline"
            >
              {article.title}
            </h1>

            {/* Summary highlight */}
            {article.summary && (
              <div className="bg-brand-blue-light border-l-4 border-brand-blue rounded-r-news p-4 mb-6">
                <p className="text-[15px] font-medium text-[#1e3a5f] leading-relaxed" itemProp="description">
                  {article.summary}
                </p>
              </div>
            )}

            {/* Feature image */}
            <figure className="mb-6 rounded-news-lg overflow-hidden shadow-card" itemProp="image">
              <Image
                src={displayImageUrl}
                alt={article.title}
                width={1200}
                height={630}
                className="w-full object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </figure>

            {/* Ad – below title */}
            <div className="mb-6">
              <AdUnit slot="2233445566" className="ad-slot w-full" />
            </div>

            {/* Article body */}
            <div
              className="article-body"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />

            {article.external_url && (
              <div className="mt-6 rounded-news border border-brand-border bg-brand-light p-4">
                <p className="text-sm text-[#111111]">
                  Original source:
                  {" "}
                  <a
                    href={article.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-blue hover:underline"
                  >
                    {article.source_name || "View source article"}
                  </a>
                </p>
              </div>
            )}

            {/* Ad – mid content */}
            <div className="my-8">
              <AdUnit slot="3344556677" format="rectangle" className="ad-slot w-full max-w-xl mx-auto" />
            </div>

            {article.faq?.length > 0 && (
              <section className="mt-8">
                <SectionHeading>Quick Answers</SectionHeading>
                <div className="space-y-3">
                  {article.faq.map((item) => (
                    <div key={item.question} className="rounded-news border border-brand-border p-4 bg-white">
                      <h2 className="text-[15px] font-bold text-[#111111] mb-2">{item.question}</h2>
                      <p className="text-sm text-brand-muted leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-brand-border">
                <span className="text-xs font-semibold text-brand-muted uppercase tracking-wide">Tags:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/news?search=${encodeURIComponent(tag)}`}
                    className="text-xs font-medium text-brand-blue bg-brand-blue-light
                               px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share */}
            <ShareBar title={article.title} slug={slug} />

            {/* Ad – end of article */}
            <div className="mt-8">
              <AdUnit slot="4455667788" className="ad-slot w-full" />
            </div>
          </article>

          {/* ── Sidebar ───────────────────────────────────────── */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Related articles */}
            {related.length > 0 && (
              <div className="bg-white rounded-news-lg shadow-card p-5">
                <SectionHeading>Related Articles</SectionHeading>
                <div className="space-y-0">
                  {related.map((rel) => (
                    <ArticleCard key={rel.id} article={rel} variant="horizontal" />
                  ))}
                </div>
              </div>
            )}

            {/* Sticky ad */}
            <div className="sticky top-[80px]">
              <AdUnit slot="5566778800" format="rectangle" className="ad-slot w-full" style={{ minHeight: 250 }} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

// ── Share bar ──────────────────────────────────────────────────
function ShareBar({ title, slug }) {
  const url = `${SITE_URL}/news/${slug}`;
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-brand-border">
      <span className="text-xs font-bold text-brand-muted uppercase tracking-wide">Share:</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0A0A0A]
                   hover:bg-[#1a1a1a] px-3 py-1.5 rounded-full transition-colors"
        aria-label="Share on X"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#25D366]
                   hover:bg-[#1ebe5d] px-3 py-1.5 rounded-full transition-colors"
        aria-label="Share on WhatsApp"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encoded}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0088cc]
                   hover:bg-[#0077bb] px-3 py-1.5 rounded-full transition-colors"
        aria-label="Share on Telegram"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
        Telegram
      </a>
    </div>
  );
}
