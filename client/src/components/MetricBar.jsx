const getBarColor = (percentage) => {
  if (percentage >= 75) return 'bg-green-500'
  if (percentage >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

function MetricBar({ label, percentage, subtext }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-medium text-neutral-300">{label}</span>
        <span className="text-sm font-semibold text-neutral-200">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ${getBarColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {subtext && <p className="mt-1 text-xs text-neutral-500">{subtext}</p>}
    </div>
  )
}

export default MetricBar
