import FileDropzone from './FileDropzone'
import ErrorBanner from './ErrorBanner'
import { SpinnerIcon, SearchIcon } from './icons'

function ResumeUploadForm({
  resumeFile,
  jobDescription,
  loading,
  error,
  onResumeChange,
  onJobDescriptionChange,
  onSubmit,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 space-y-5 shadow-xl shadow-black/20"
    >
      <div>
        <label className="block text-sm font-semibold text-neutral-200 mb-2">Resume</label>
        <FileDropzone file={resumeFile} onFileChange={onResumeChange} />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="block text-sm font-semibold text-neutral-200">Job Description</label>
          <span className="text-xs text-neutral-500">{jobDescription.length} chars</span>
        </div>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          rows={9}
          placeholder="Paste the job description here..."
          className="w-full rounded-xl bg-neutral-950 border border-neutral-700 p-3.5 text-sm text-neutral-200
            placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/60
            focus:border-indigo-500/60 resize-none transition-shadow"
        />
      </div>

      {error && <ErrorBanner message={error} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500
          disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed
          transition-colors py-3 font-semibold text-white shadow-lg shadow-indigo-600/20
          disabled:shadow-none cursor-pointer"
      >
        {loading ? (
          <>
            <SpinnerIcon className="h-4.5 w-4.5 animate-spin" />
            Analyzing your match...
          </>
        ) : (
          <>
            <SearchIcon className="h-4.5 w-4.5" />
            Analyze Match
          </>
        )}
      </button>
    </form>
  )
}

export default ResumeUploadForm
