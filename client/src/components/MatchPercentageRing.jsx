const getTier = (percentage) => {
  if (percentage >= 75) return { text: 'text-green-400', ring: '#22c55e', label: 'Strong Match' }
  if (percentage >= 50) return { text: 'text-yellow-400', ring: '#eab308', label: 'Partial Match' }
  return { text: 'text-red-400', ring: '#ef4444', label: 'Weak Match' }
}

function MatchPercentageRing({ percentage }) {
  const tier = getTier(percentage)

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative grid h-36 w-36 place-items-center rounded-full transition-[background] duration-700"
        style={{
          background: `conic-gradient(${tier.ring} ${percentage * 3.6}deg, #1f1f22 0deg)`,
        }}
      >
        <div className="grid h-26 w-26 place-items-center rounded-full bg-neutral-900">
          <span className={`text-3xl font-extrabold ${tier.text}`}>{percentage}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-sm font-semibold ${tier.text}`}>{tier.label}</p>
        <p className="text-xs text-neutral-500">Overall Match Percentage</p>
      </div>
    </div>
  )
}

export default MatchPercentageRing
