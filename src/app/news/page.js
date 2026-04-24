import { Suspense } from "react";
import { getArticles } from "@/lib/articles";
import { getCategoryLabel, SITE_NAME, SITE_URL } from "@/lib/utils";
import ArticleCard from "@/components/ui/ArticleCard";
import CategoryFilter from "@/components/ui/CategoryFilter";
import Pagination from "@/components/ui/Pagination";
import AdUnit from "@/components/ads/AdUnit";

export const revalidate = 120;

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || null;
  const search = params?.search || null;
  const catLabel = category ? getCategoryLabel(category) : null;

  const title = search
    ? `Search: "${search}" | ${SITE_NAME}`
    : catLabel
    ? `${catLabel} News 2024 – Latest Updates | ${SITE_NAME}`
    : `Education News – JEE, NEET, CUET, Admissions | ${SITE_NAME}`;

  const description = catLabel
    ? `Latest ${catLabel} news, results, cutoffs, and updates. Stay ahead with Rank360.`
    : "All education news in one place — JEE, NEET, CUET, admissions, results, and more.";

  return {
    title,
    description,
    alternates: {
      canonical: category
        ? `${SITE_URL}/news?category=${category}`
        : `${SITE_URL}/news`,
    },
    openGraph: { title, description, url: `${SITE_URL}/news` },
  };
}

export default async function NewsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);
  const category = params?.category || null;
  const search = params?.search || null;

  let articles = [], total = 0, totalPages = 0, currentPage = page;

  try {
    ({ articles, total, totalPages, currentPage } = await getArticles({
      page,
      category,
      search,
      limit: 12,
    }));
  } catch (err) {
    console.error("NewsPage data fetch error:", err.message);
  }

  const catLabel = category ? getCategoryLabel(category) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[26px] md:text-[32px] font-black text-[#0A0A0A] tracking-tight mb-1">
          {search
            ? `Results for "${search}"`
            : catLabel
            ? `${catLabel} News`
            : "Education News"}
        </h1>
        <p className="text-sm text-brand-muted">
          {total} {total === 1 ? "article" : "articles"}
          {catLabel ? ` in ${catLabel}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <Suspense>
          <CategoryFilter active={category} />
        </Suspense>
      </div>

      {/* Ad – top of listing */}
      <div className="mb-6">
        <AdUnit slot="1122334455" className="ad-slot w-full" />
      </div>

      {/* Articles grid */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} priority={i < 3} />
            ))}
          </div>

          {/* Mid-listing ad */}
          {articles.length >= 6 && (
            <div className="my-6">
              <AdUnit slot="5566778899" format="rectangle" className="ad-slot w-full max-w-xl mx-auto" />
            </div>
          )}

          {/* Pagination */}
          <Suspense>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </Suspense>
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-[#111111] mb-2">No articles found</h2>
          <p className="text-brand-muted text-sm">
            {search
              ? `No results for "${search}". Try a different keyword.`
              : "No articles in this category yet. Check back soon."}
          </p>
        </div>
      )}
    </div>
  );
}
