import Link from "next/link";
import { getCategoryMeta, CATEGORIES } from "@/lib/utils";

const ICONS = {
  jee: "📐",
  neet: "🩺",
  cuet: "🎓",
  admissions: "🏛️",
  results: "📊",
  news: "📰",
};

export default function CategoryStrip() {
  return (
    <section className="mb-10">
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => {
          const meta = getCategoryMeta(cat);
          return (
            <Link
              key={cat}
              href={`/news?category=${cat}`}
              className="flex flex-col items-center gap-2 p-3 rounded-news bg-white
                         shadow-card hover:shadow-card-hover hover:-translate-y-0.5
                         transition-all duration-200 text-center group"
            >
              <span className="text-2xl">{ICONS[cat]}</span>
              <span className="text-xs font-bold text-[#374151] group-hover:text-brand-blue transition-colors">
                {meta.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
