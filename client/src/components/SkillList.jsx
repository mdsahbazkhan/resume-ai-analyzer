import SkillBadge from './SkillBadge'

const TITLE_CLASSES = {
  matched: 'text-green-400',
  missing: 'text-red-400',
}

function SkillList({ title, skills, variant }) {
  return (
    <div>
      <h2 className={`text-sm font-semibold mb-3 ${TITLE_CLASSES[variant]}`}>
        {title} ({skills.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && <span className="text-sm text-neutral-500">None</span>}
        {skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} variant={variant} />
        ))}
      </div>
    </div>
  )
}

export default SkillList
