import { useState } from 'react'
import type { AnalysisResult, SetupConfig } from '../types'
import { analyzeClass, ApiError } from '../api'

interface Props {
  config: SetupConfig
  onComplete: (result: AnalysisResult) => void
  onEditSetup: () => void
}

type Status = 'idle' | 'loading' | 'error'

const LOADING_STEPS = [
  'Connecting to Notion…',
  'Reading student writing samples…',
  'Analyzing against CCSS standards…',
  'Generating teaching points…',
  'Grouping students by instructional need…',
  'Finalizing recommendations…',
]

export default function AnalysisView({ config, onComplete, onEditSetup }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [loadingStep, setLoadingStep] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  async function runAnalysis() {
    setStatus('loading')
    setErrorMessage('')
    setLoadingStep(0)

    // Cycle through loading steps for UX feedback
    const interval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 2200)

    try {
      const result = await analyzeClass(config)
      clearInterval(interval)
      onComplete(result)
    } catch (err) {
      clearInterval(interval)
      setStatus('error')
      if (err instanceof ApiError) {
        setErrorMessage(err.message)
      } else if (err instanceof TypeError) {
        setErrorMessage('Could not connect to the backend. Make sure it\'s running at localhost:3001.')
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.')
      }
    }
  }

  const gradeLabel = config.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${config.gradeLevel}`

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Analyze Class Writing</h1>
        <p className="text-slate-500 text-sm">
          WriteRight will read your Notion database and generate personalized, CCSS-aligned
          teaching points for each student.
        </p>
      </div>

      {/* Config summary */}
      <div className="card mb-6">
        <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Current Configuration</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ConfigRow label="Grade Level" value={gradeLabel} />
          <ConfigRow
            label="Notion Session"
            value={config.sessionId ? 'Connected via OAuth' : 'Not connected'}
          />
          <ConfigRow
            label="Database ID"
            value={`${config.notionDatabaseId.slice(0, 8)}…`}
            mono
          />
        </dl>
        <button
          onClick={onEditSetup}
          className="mt-4 text-xs text-brand-600 hover:text-brand-700 font-medium hover:underline"
        >
          Edit setup
        </button>
      </div>

      {/* What WriteRight does */}
      {status === 'idle' && (
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wide">What happens next</h2>
          <ol className="space-y-3">
            {[
              'WriteRight fetches each student\'s writing entry from your Notion database.',
              `Each sample is evaluated against ${gradeLabel} CCSS writing and language standards.`,
              'The AI identifies 2–3 specific, actionable teaching points per student.',
              'Students are clustered into small groups based on shared instructional needs.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Loading state */}
      {status === 'loading' && (
        <div className="card mb-6 flex flex-col items-center py-10 gap-6">
          <Spinner />
          <div className="text-center">
            <p className="text-base font-medium text-slate-700">{LOADING_STEPS[loadingStep]}</p>
            <p className="text-sm text-slate-400 mt-1">This may take 20–40 seconds depending on class size.</p>
          </div>
          <div className="w-full max-w-xs bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-brand-500 h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="mb-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          <AlertIcon />
          <div>
            <p className="font-semibold">Analysis failed</p>
            <p className="mt-0.5 text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-3">
        {status !== 'loading' && (
          <button
            onClick={runAnalysis}
            className="btn-primary text-base px-8 py-3"
          >
            <SparkleIcon />
            {status === 'error' ? 'Try Again' : 'Analyze Class Writing'}
          </button>
        )}
      </div>
    </div>
  )
}

function ConfigRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</dt>
      <dd className={`text-sm text-slate-700 ${mono ? 'font-mono' : 'font-medium'}`}>{value}</dd>
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
  )
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8a1 1 0 0 0 .6.6L20.3 11.3l-5.8 1.9a1 1 0 0 0-.6.6L12 20.3l-1.9-5.5a1 1 0 0 0-.6-.6L3.7 12.7l5.8-1.9a1 1 0 0 0 .6-.6L12 3z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
