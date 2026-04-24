export default function ArticleLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-5">
          <div className="skeleton h-3 w-48 rounded" />
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-10 w-full rounded" />
          <div className="skeleton h-10 w-4/5 rounded" />
          <div className="skeleton h-20 w-full rounded-news" />
          <div className="skeleton aspect-[16/9] w-full rounded-news-lg" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`skeleton h-4 rounded ${i % 5 === 4 ? "w-3/4" : "w-full"}`} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="skeleton h-6 w-32 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-20 h-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-4/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
