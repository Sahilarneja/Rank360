import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";

export default function TopicHubGrid({ hubs = [] }) {
  if (!hubs.length) return null;

  return (
    <section className="mb-12">
      <SectionHeading action={{ label: "All news", href: "/news" }}>
        Topic Hubs
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map((hub) => (
          <Link
            key={hub.category}
            href={hub.href}
            className="rounded-news-lg border border-brand-border bg-white p-5 hover:shadow-card transition-shadow"
          >
            <p className="text-2xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-2">
              {hub.kicker}
            </p>
            <h2 className="text-[20px] font-black text-[#111111] leading-tight mb-2">
              {hub.title}
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed mb-4">
              {hub.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {hub.searchTopics.slice(0, 3).map((topic) => (
                <span
                  key={topic}
                  className="rounded-full bg-brand-blue-light px-3 py-1 text-2xs font-semibold text-brand-blue"
                >
                  {topic}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
