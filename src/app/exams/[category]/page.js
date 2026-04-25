import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticles, getArticlesByCategory } from "@/lib/articles";
import { EXAM_HUBS, getExamHubByCategory, getGuidesByCategory, AUDIENCE_CHANNELS } from "@/lib/growth";
import { SITE_NAME, SITE_URL, getCategoryLabel } from "@/lib/utils";
import ArticleCard from "@/components/ui/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import AudienceSignup from "@/components/ui/AudienceSignup";

export const revalidate = 900;

export async function generateStaticParams() {
  return EXAM_HUBS.map((hub) => ({ category: hub.category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const hub = getExamHubByCategory(category);
  if (!hub) return { title: "Not Found" };

  const title = `${hub.title} | ${SITE_NAME}`;
  const description = hub.description;
  const url = `${SITE_URL}/exams/${category}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default async function ExamHubPage({ params }) {
  const { category } = await params;
  const hub = getExamHubByCategory(category);
  if (!hub) notFound();

  let latestArticles = [];
  let deepArticles = [];
  try {
    latestArticles = await getArticlesByCategory(category, 6);
    const result = await getArticles({ category, page: 1, limit: 12 });
    deepArticles = result.articles.slice(0, 9);
  } catch (error) {
    console.error("Exam hub fetch error:", error.message);
  }

  const guides = getGuidesByCategory(category, { limit: 3 });
  const label = getCategoryLabel(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">
      <section className="rounded-news-lg bg-[#0A0A0A] text-white p-6 md:p-8 mb-8">
        <p className="text-2xs font-bold uppercase tracking-[0.2em] text-blue-200 mb-3">
          Topic Hub
        </p>
        <h1 className="text-[30px] md:text-[42px] font-black leading-tight max-w-3xl mb-3">
          {hub.title}
        </h1>
        <p className="text-sm md:text-[15px] text-gray-300 leading-relaxed max-w-3xl mb-6">
          {hub.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {hub.searchTopics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-white/10 px-3 py-1 text-2xs font-semibold text-gray-100"
            >
              {topic}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hub.trustPoints.map((point) => (
            <div key={point} className="rounded-news border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-200 leading-relaxed">{point}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading action={{ label: `All ${label} news`, href: `/news?category=${category}` }}>
          Latest {label} Coverage
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} priority={index < 3} />
          ))}
        </div>
      </section>

      {guides.length > 0 && (
        <section className="mb-10">
          <SectionHeading>Evergreen Pages for {label}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-news-lg border border-brand-border bg-white p-5 hover:shadow-card transition-shadow"
              >
                <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-2">
                  Search Intent Guide
                </p>
                <h2 className="text-[18px] font-black text-[#111111] leading-tight mb-2">
                  {guide.title}
                </h2>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {guide.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-10">
        <SectionHeading>More {label} Updates</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deepArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      <AudienceSignup
        title={`Bring ${label} users back every time a deadline moves`}
        body={`Search gets the first visit. Telegram, WhatsApp, and email help Rank360 keep students returning through result, correction, counselling, and reporting cycles.`}
      />

      <div className="mt-6 text-sm text-brand-muted">
        Fast links:
        {" "}
        <Link href={AUDIENCE_CHANNELS.telegram} className="text-brand-blue font-semibold hover:underline">Telegram</Link>
        {" · "}
        <Link href={AUDIENCE_CHANNELS.whatsapp} className="text-brand-blue font-semibold hover:underline">WhatsApp</Link>
        {" · "}
        <Link href={`/news?category=${category}`} className="text-brand-blue font-semibold hover:underline">All {label} news</Link>
      </div>
    </div>
  );
}
