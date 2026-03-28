import { useState, useEffect } from 'react'
import type { AppScreen, AnalysisResult, SetupConfig } from './types'
import SetupForm from './components/SetupForm'
import AnalysisView from './components/AnalysisView'
import ResultsView from './components/ResultsView'

const STORAGE_KEY = 'writesight_config'

function loadConfig(): SetupConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SetupConfig) : null
  } catch {
    return null
  }
}

function saveConfig(config: SetupConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('setup')
  const [config, setConfig] = useState<SetupConfig>({
    notionApiKey: '',
    notionDatabaseId: '',
    gradeLevel: '3',
  })
  const [results, setResults] = useState<AnalysisResult | null>(null)

  // Hydrate config from localStorage on mount and skip to analyze if present
  useEffect(() => {
    const stored = loadConfig()
    if (stored) {
      setConfig(stored)
      setScreen('analyze')
    }
  }, [])

  function handleSetupSave(cfg: SetupConfig) {
    saveConfig(cfg)
    setConfig(cfg)
    setScreen('analyze')
  }

  function handleAnalysisComplete(result: AnalysisResult) {
    setResults(result)
    setScreen('results')
  }

  function handleResultsUpdate(updated: AnalysisResult) {
    setResults(updated)
  }

  function handleReset() {
    setScreen('setup')
    setResults(null)
  }

  function handleReanalyze() {
    setResults(null)
    setScreen('analyze')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
              <PenIcon />
            </div>
            <div>
              <span className="text-lg font-bold text-brand-700 tracking-tight">WriteRight</span>
              <span className="hidden sm:inline ml-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                AI Writing Differentiation
              </span>
            </div>
          </div>

          {/* Breadcrumb / nav */}
          <nav className="flex items-center gap-1 text-sm">
            <StepIndicator label="Setup" step={1} active={screen === 'setup'} done={screen !== 'setup'} onClick={() => setScreen('setup')} />
            <ChevronRight />
            <StepIndicator label="Analyze" step={2} active={screen === 'analyze'} done={screen === 'results'} onClick={() => screen !== 'setup' && setScreen('analyze')} />
            <ChevronRight />
            <StepIndicator label="Results" step={3} active={screen === 'results'} done={false} onClick={() => results && setScreen('results')} />
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {screen === 'setup' && (
          <SetupForm
            initialConfig={config}
            onSave={handleSetupSave}
          />
        )}
        {screen === 'analyze' && (
          <AnalysisView
            config={config}
            onComplete={handleAnalysisComplete}
            onEditSetup={handleReset}
          />
        )}
        {screen === 'results' && results && (
          <ResultsView
            result={results}
            config={config}
            onUpdate={handleResultsUpdate}
            onReanalyze={handleReanalyze}
            onEditSetup={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <p className="text-center text-xs text-slate-400">
          WriteRight &mdash; built for teachers, powered by AI &bull; CCSS-aligned feedback
        </p>
      </footer>
    </div>
  )
}

// ── Small inline helpers ──────────────────────────────────────────────────────

function StepIndicator({
  label,
  active,
  done,
  onClick,
}: {
  label: string
  step: number
  active: boolean
  done: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium transition-colors
        ${active ? 'text-brand-700 font-semibold' : done ? 'text-slate-500 hover:text-brand-600 cursor-pointer' : 'text-slate-400 cursor-default'}`}
    >
      {done && (
        <span className="mr-1 text-green-500">&#10003;</span>
      )}
      {label}
    </button>
  )
}

function ChevronRight() {
  return <span className="text-slate-300 text-xs select-none">/</span>
}

function PenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
