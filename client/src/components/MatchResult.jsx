import MatchPercentageRing from './MatchPercentageRing'
import MetricBar from './MetricBar'
import SkillList from './SkillList'
import FitVerdict from './FitVerdict'

const formatYears = (years) => {
  if (years < 1) {
    const months = Math.round(years * 12)
    return `${months} mo${months === 1 ? '' : 's'}`
  }
  const rounded = Math.round(years * 10) / 10
  return `${rounded} yr${rounded === 1 ? '' : 's'}`
}

function MatchResult({ result }) {
  const total = result.matchedSkills.length + result.missingSkills.length
  const experienceSubtext = `${formatYears(result.candidateYears)} experience${
    result.requiredMinYears > 0 ? ` • requires ${formatYears(result.requiredMinYears)}+` : ' • no minimum required'
  }`

  return (
    <section className="min-w-0 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-6 shadow-xl shadow-black/20 animate-fade-slide-up">
      <div className="flex flex-col items-center gap-2">
        <MatchPercentageRing percentage={result.overallMatchPercentage} label="Overall Match" />
        <p className="text-sm text-neutral-400">
          Matches <span className="font-semibold text-neutral-200">{result.matchedSkills.length}</span> of{' '}
          <span className="font-semibold text-neutral-200">{total}</span> required skills
        </p>
      </div>

      <div className="h-px bg-neutral-800" />

      <div className="space-y-4">
        <MetricBar label="Skills Match" percentage={result.matchPercentage} />
        <MetricBar
          label="Experience Match"
          percentage={result.experienceMatchPercentage}
          subtext={experienceSubtext}
        />
      </div>

      <div className="h-px bg-neutral-800" />

      <FitVerdict verdict={result.verdict} reasons={result.reasons} />

      <div className="h-px bg-neutral-800" />

      <div className="grid sm:grid-cols-2 gap-6">
        <SkillList title="Matched Skills" skills={result.matchedSkills} variant="matched" />
        <SkillList title="Missing Skills" skills={result.missingSkills} variant="missing" />
      </div>
    </section>
  )
}

export default MatchResult
