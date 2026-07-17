function ResultSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-32 w-32 rounded-full animate-shimmer" />
        <div className="h-3 w-24 rounded animate-shimmer" />
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-3">
            <div className="h-3 w-28 rounded animate-shimmer" />
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-6 w-16 rounded-full animate-shimmer" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultSkeleton
