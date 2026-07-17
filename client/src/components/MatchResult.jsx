import MatchPercentageRing from './MatchPercentageRing'
import SkillList from './SkillList'

function MatchResult({ result }) {
  const total = result.matchedSkills.length + result.missingSkills.length

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-6 shadow-xl shadow-black/20 animate-fade-slide-up">
      <div className="flex flex-col items-center gap-2">
        <MatchPercentageRing percentage={result.matchPercentage} />
        <p className="text-sm text-neutral-400">
          Matches <span className="font-semibold text-neutral-200">{result.matchedSkills.length}</span> of{' '}
          <span className="font-semibold text-neutral-200">{total}</span> required skills
        </p>
      </div>

      <div className="h-px bg-neutral-800" />

      <div className="grid sm:grid-cols-2 gap-6">
        <SkillList title="Matched Skills" skills={result.matchedSkills} variant="matched" />
        <SkillList title="Missing Skills" skills={result.missingSkills} variant="missing" />
      </div>
    </section>
  )
}

export default MatchResult
