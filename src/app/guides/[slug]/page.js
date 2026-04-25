import { notFound } from "next/navigation";
import Link from "next/link";
import { EVERGREEN_GUIDES, getGuideBySlug, getGuidesByCategory, buildGuideJsonLd, getExamHubByCategory } from "@/lib/growth";
import { SITE_NAME, SITE_URL, getCategoryLabel } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import AudienceSignup from "@/components/ui/AudienceSignup";

export const revalidate = 3600;

export async function generateStaticParams() {
  return EVERGREEN_GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Not Found" };

  const title = `${guide.title} | ${SITE_NAME}`;
  const description = guide.summary;
  const url = `${SITE_URL}/guides/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuides = getGuidesByCategory(guide.category, {
    excludeSlug: guide.slug,
    limit: 2,
  });
  const hub = getExamHubByCategory(guide.category);
  const schemas = buildGuideJsonLd(guide, SITE_URL);
  const categoryLabel = getCategoryLabel(guide.category);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
        <nav className="flex items-center gap-1.5 text-xs text-brand-muted mb-5" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/exams/${guide.category}`} className="hover:text-brand-blue transition-colors">
            {categoryLabel} Hub
          </Link>
          <span>/</span>
          <span>{guide.title}</span>
        </nav>

        <section className="rounded-news-lg border border-brand-border bg-white p-6 md:p-8 mb-8">
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-3">
            Evergreen Guide
          </p>
          <h1 className="text-[30px] md:text-[40px] font-black text-[#0A0A0A] leading-tight mb-3">
            {guide.heroTitle}
          </h1>
          <p className="text-[15px] text-brand-muted leading-relaxed max-w-3xl">
            {guide.heroDescription}
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <article className="lg:col-span-8 space-y-6">
            {guide.sections.map((section) => (
              <section key={section.heading} className="rounded-news-lg border border-brand-border bg-white p-5 md:p-6">
                <h2 className="text-[20px] font-black text-[#111111] mb-3">{section.heading}</h2>
                <p className="text-[15px] text-brand-muted leading-relaxed">{section.body}</p>
              </section>
            ))}

            <section className="rounded-news-lg border border-brand-border bg-white p-5 md:p-6">
              <SectionHeading>Quick Answers</SectionHeading>
              <div className="space-y-4">
                {guide.faq.map((item) => (
                  <div key={item.question}>
                    <h2 className="text-[16px] font-bold text-[#111111] mb-1.5">{item.question}</h2>
                    <p className="text-sm text-brand-muted leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <AudienceSignup
              compact
              title={`Turn ${categoryLabel} search visits into repeat readers`}
              body={`Evergreen pages pull long-tail search traffic. Channels and alerts help Rank360 keep those users through every update cycle.`}
            />
          </article>

          <aside className="lg:col-span-4 space-y-6">
            {hub && (
              <div className="rounded-news-lg border border-brand-border bg-brand-light p-5">
                <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-2">
                  Topic Hub
                </p>
                <h2 className="text-[18px] font-black text-[#111111] mb-2">{hub.title}</h2>
                <p className="text-sm text-brand-muted leading-relaxed mb-4">{hub.description}</p>
                <Link
                  href={hub.href}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue hover:underline"
                >
                  Open {categoryLabel} Hub
                </Link>
              </div>
            )}

            {relatedGuides.length > 0 && (
              <div className="rounded-news-lg border border-brand-border bg-white p-5">
                <SectionHeading>Related Guides</SectionHeading>
                <div className="space-y-4">
                  {relatedGuides.map((item) => (
                    <Link key={item.slug} href={`/guides/${item.slug}`} className="block group">
                      <h2 className="text-[15px] font-bold text-[#111111] group-hover:text-brand-blue transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-sm text-brand-muted leading-relaxed mt-1">
                        {item.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
