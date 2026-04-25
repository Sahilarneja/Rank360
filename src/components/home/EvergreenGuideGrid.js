import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

export default function EvergreenGuideGrid({ guides = [] }) {
  if (!guides.length) return null;

  return (
    <section className="mb-12">
      <SectionHeading>Evergreen Guides</SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="rounded-news-lg border border-brand-border bg-white p-5 hover:shadow-card transition-shadow"
          >
            <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-2">
              Search Intent Page
            </p>
            <h2 className="text-[19px] font-black text-[#111111] leading-tight mb-2">
              {guide.title}
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              {guide.summary}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
