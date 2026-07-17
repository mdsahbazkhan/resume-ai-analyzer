import { useState } from 'react'
import { analyzeResume } from '../api/analyzeApi'
import Header from '../components/Header'
import ResumeUploadForm from '../components/ResumeUploadForm'
import MatchResult from '../components/MatchResult'
import EmptyResultState from '../components/EmptyResultState'
import ResultSkeleton from '../components/ResultSkeleton'

function SkillGapCheckPage() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload a resume PDF and paste the job description.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await analyzeResume(resumeFile, jobDescription)
      setResult(data)
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Something went wrong. Please try again.')
      } else if (err.request) {
        setError('Could not reach the server. Please check your connection and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-40"
        style={{
          background:
            'radial-gradient(60rem 30rem at 50% -10%, rgba(99,102,241,0.15), transparent)',
        }}
      />
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <ResumeUploadForm
            resumeFile={resumeFile}
            jobDescription={jobDescription}
            loading={loading}
            error={error}
            onResumeChange={setResumeFile}
            onJobDescriptionChange={setJobDescription}
            onSubmit={handleSubmit}
          />

          {loading && <ResultSkeleton />}
          {!loading && result && <MatchResult result={result} />}
          {!loading && !result && <EmptyResultState />}
        </div>

        <footer className="mt-12 text-center text-xs text-neutral-600">
          Built with React, Express &amp; Gemini AI
        </footer>
      </main>
    </div>
  )
}

export default SkillGapCheckPage
