import { CheckCircleIcon, XCircleIcon } from './icons'

const VARIANTS = {
  matched: {
    classes: 'bg-green-500/10 text-green-400 border-green-500/30',
    Icon: CheckCircleIcon,
  },
  missing: {
    classes: 'bg-red-500/10 text-red-400 border-red-500/30',
    Icon: XCircleIcon,
  },
}

function SkillBadge({ skill, variant }) {
  const { classes, Icon } = VARIANTS[variant]

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {skill}
    </span>
  )
}

export default SkillBadge
