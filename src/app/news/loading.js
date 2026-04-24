export default function NewsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="skeleton h-9 w-48 rounded mb-2" />
      <div className="skeleton h-4 w-32 rounded mb-6" />

      {/* Filter skeleton */}
      <div className="flex gap-2 mb-6">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="skeleton h-8 w-16 rounded-full flex-shrink-0" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="news-card">
            <div className="skeleton aspect-[16/9] w-full" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-3 w-16 rounded-full" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
