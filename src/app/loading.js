export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Hero skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
        <div className="lg:col-span-7 skeleton rounded-news-lg h-[380px]" />
        <div className="lg:col-span-5 flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 p-3 bg-white rounded-news shadow-card">
              <div className="skeleton w-[90px] h-[70px] rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
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
