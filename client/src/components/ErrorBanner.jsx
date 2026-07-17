import { AlertTriangleIcon } from './icons'

function ErrorBanner({ message }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-fade-slide-up">
      <AlertTriangleIcon className="h-4.5 w-4.5 mt-0.5 shrink-0 text-red-400" />
      <span>{message}</span>
    </div>
  )
}

export default ErrorBanner
