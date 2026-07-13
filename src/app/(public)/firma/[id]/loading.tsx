export default function CompanyLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 bg-dark-card rounded w-48 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company header */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-dark-section rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-dark-section rounded w-48" />
                <div className="h-4 bg-dark-section rounded w-32" />
                <div className="h-4 bg-dark-section rounded w-24" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 space-y-3">
            <div className="h-5 bg-dark-section rounded w-24" />
            <div className="h-4 bg-dark-section rounded w-full" />
            <div className="h-4 bg-dark-section rounded w-3/4" />
            <div className="h-4 bg-dark-section rounded w-1/2" />
          </div>

          {/* Gallery */}
          <div className="bg-dark-card rounded-xl border border-dark-border p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square bg-dark-section rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 space-y-4">
            <div className="h-5 bg-dark-section rounded w-20" />
            <div className="h-10 bg-dark-section rounded-lg w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-dark-section rounded w-32" />
              <div className="h-4 bg-dark-section rounded w-28" />
              <div className="h-4 bg-dark-section rounded w-36" />
            </div>
          </div>
          <div className="bg-dark-card rounded-xl border border-dark-border p-6 space-y-3">
            <div className="h-5 bg-dark-section rounded w-16" />
            <div className="h-32 bg-dark-section rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}