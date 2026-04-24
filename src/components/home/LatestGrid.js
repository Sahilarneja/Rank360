import ArticleCard from "@/components/ui/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function LatestGrid({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <section className="mb-12">
      <SectionHeading action={{ label: "View all", href: "/news" }}>
        Latest News
      </SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article, i) => (
          <ArticleCard key={article.id} article={article} priority={i < 3} />
        ))}
      </div>
    </section>
  );
}
