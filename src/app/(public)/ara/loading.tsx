export default function SearchLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-8 bg-dark-card rounded w-36 mb-6" />

      {/* Search form skeleton */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-8">
        <div className="hidden md:flex gap-3">
          <div className="flex-1 h-10 bg-dark-section rounded-lg" />
          <div className="w-40 h-10 bg-dark-section rounded-lg" />
          <div className="w-32 h-10 bg-dark-section rounded-lg" />
          <div className="w-32 h-10 bg-dark-section rounded-lg" />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-dark-card rounded-xl border border-dark-border p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-dark-section rounded-lg" />
              <div className="flex gap-1">
                <div className="w-14 h-5 bg-dark-section rounded-full" />
              </div>
            </div>
            <div className="h-5 bg-dark-section rounded w-36" />
            <div className="h-4 bg-dark-section rounded w-24" />
            <div className="h-4 bg-dark-section rounded w-full" />
            <div className="h-4 bg-dark-section rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}