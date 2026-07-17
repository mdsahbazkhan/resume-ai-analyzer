const VERDICT_STYLES = {
  Qualified: {
    badge: 'bg-green-500/10 text-green-400 border-green-500/30',
    bullet: 'text-green-400',
  },
  'Almost There': {
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    bullet: 'text-yellow-400',
  },
  'Not Yet': {
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    bullet: 'text-red-400',
  },
}

function FitVerdict({ verdict, reasons }) {
  const style = VERDICT_STYLES[verdict] ?? VERDICT_STYLES['Almost There']

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-neutral-200">Fit Verdict</h2>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${style.badge}`}>
          {verdict}
        </span>
      </div>
      <ul className="space-y-2">
        {reasons.map((reason, index) => (
          <li key={index} className="flex gap-2 text-sm text-neutral-300">
            <span className={`shrink-0 ${style.bullet}`}>&bull;</span>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FitVerdict
