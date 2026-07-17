import { SparklesIcon } from './icons'

function Header() {
  return (
    <header className="border-b border-neutral-900 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600/15 text-indigo-400">
          <SparklesIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-neutral-100 tracking-tight">Skill Gap Check</h1>
          <p className="text-xs text-neutral-500">AI-powered resume &amp; JD matcher</p>
        </div>
      </div>
    </header>
  )
}

export default Header
