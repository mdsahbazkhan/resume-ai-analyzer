import { SearchIcon } from './icons'

function EmptyResultState() {
  return (
    <div className="flex h-full min-h-[24rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-10 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-neutral-800/60 text-neutral-500">
        <SearchIcon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-neutral-400">No analysis yet</p>
      <p className="max-w-xs text-sm text-neutral-600">
        Upload a resume and paste a job description to see your matched skills, gaps, and match
        percentage here.
      </p>
    </div>
  )
}

export default EmptyResultState
