import { useState } from 'react'
import type { SetupConfig } from '../types'
import { getAuthorizeUrl } from '../api'

const GRADE_OPTIONS = [
  { value: 'K', label: 'Kindergarten' },
  { value: '1', label: 'Grade 1' },
  { value: '2', label: 'Grade 2' },
  { value: '3', label: 'Grade 3' },
  { value: '4', label: 'Grade 4' },
  { value: '5', label: 'Grade 5' },
  { value: '6', label: 'Grade 6' },
  { value: '7', label: 'Grade 7' },
  { value: '8', label: 'Grade 8' },
]

interface Props {
  initialConfig: SetupConfig
  onSave: (config: SetupConfig) => void
  isReconnecting?: boolean
}

export default function SetupForm({ initialConfig, onSave, isReconnecting }: Props) {
  const [databaseId, setDatabaseId] = useState(initialConfig.notionDatabaseId)
  const [gradeLevel, setGradeLevel] = useState(initialConfig.gradeLevel || '3')
  const [dbError, setDbError] = useState('')

  function handleConnect() {
    if (!databaseId.trim()) {
      setDbError('Database ID is required before connecting.')
      return
    }
    // Save grade level to localStorage so we can restore it after OAuth redirect
    localStorage.setItem('wr_pending_grade', gradeLevel)
    localStorage.setItem('wr_pending_db', databaseId)
    window.location.href = getAuthorizeUrl(databaseId)
  }

  // If already connected (has sessionId), allow proceeding directly
  function handleContinue() {
    onSave({ ...initialConfig, notionDatabaseId: databaseId, gradeLevel })
  }

  const alreadyConnected = !!initialConfig.sessionId

  return (
    <div className="max-w-xl mx-auto">
      {/* Hero blurb */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Connect your Notion classroom</h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          WriteRight reads student writing samples from a Notion database and uses AI to surface
          targeted, standards-aligned teaching points — so you can plan small-group instruction in
          minutes, not hours.
        </p>
      </div>

      <div className="card space-y-5">
        <h2 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3">
          Class Settings
        </h2>

        {/* Grade level */}
        <div>
          <label htmlFor="grade" className="label">Grade Level</label>
          <select
            id="grade"
            value={gradeLevel}
            onChange={e => setGradeLevel(e.target.value)}
            className="input-field"
          >
            {GRADE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">
            Teaching points will be anchored to this grade's California CCSS benchmarks.
          </p>
        </div>

        <h2 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3 pt-2">
          Notion Database
        </h2>

        {/* Database ID */}
        <div>
          <label htmlFor="dbId" className="label">Database ID</label>
          <input
            id="dbId"
            type="text"
            autoComplete="off"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={databaseId}
            onChange={e => { setDatabaseId(e.target.value); setDbError('') }}
            className={`input-field font-mono text-xs ${dbError ? 'border-red-400 focus:ring-red-200' : ''}`}
          />
          {dbError ? (
            <p className="mt-1 text-xs text-red-500">{dbError}</p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">
              Found in the database URL: notion.so/…/<strong>{'<this-32-char-id>'}</strong>?v=…
            </p>
          )}
        </div>

        {/* Notion OAuth connection */}
        <div className="pt-1">
          {alreadyConnected && !isReconnecting ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckIcon />
                <span>Connected to Notion via OAuth</span>
              </div>
              <div className="flex justify-end">
                <button onClick={handleContinue} className="btn-primary">
                  Continue to Analysis
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                WriteRight uses Notion's official MCP server to read your student pages and write
                results back — your data never passes through any intermediate server.
              </p>
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <NotionIcon />
                Connect with Notion
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function NotionIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/>
    </svg>
  )
}
