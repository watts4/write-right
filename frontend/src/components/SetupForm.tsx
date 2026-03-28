import { useState } from 'react'
import type { SetupConfig } from '../types'

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
}

export default function SetupForm({ initialConfig, onSave }: Props) {
  const [form, setForm] = useState<SetupConfig>(initialConfig)
  const [showKey, setShowKey] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof SetupConfig, string>>>({})

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.notionApiKey.trim()) next.notionApiKey = 'Notion API key is required.'
    else if (!form.notionApiKey.startsWith('secret_') && !form.notionApiKey.startsWith('ntn_')) {
      next.notionApiKey = 'Key should start with "secret_" or "ntn_".'
    }
    if (!form.notionDatabaseId.trim()) next.notionDatabaseId = 'Database ID is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  function field(key: keyof SetupConfig, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

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

      <form onSubmit={handleSubmit} noValidate>
        <div className="card space-y-5">
          <h2 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3">
            Notion Connection
          </h2>

          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="label">
              Notion Integration API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                autoComplete="off"
                placeholder="secret_xxxxxxxxxx"
                value={form.notionApiKey}
                onChange={e => field('notionApiKey', e.target.value)}
                className={`input-field pr-24 font-mono text-xs ${errors.notionApiKey ? 'border-red-400 focus:ring-red-200' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.notionApiKey ? (
              <p className="mt-1 text-xs text-red-500">{errors.notionApiKey}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                Create an integration at{' '}
                <a href="https://www.notion.so/my-integrations" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                  notion.so/my-integrations
                </a>
                , then share your database with it.
              </p>
            )}
          </div>

          {/* Database ID */}
          <div>
            <label htmlFor="dbId" className="label">
              Notion Database ID
            </label>
            <input
              id="dbId"
              type="text"
              autoComplete="off"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={form.notionDatabaseId}
              onChange={e => field('notionDatabaseId', e.target.value)}
              className={`input-field font-mono text-xs ${errors.notionDatabaseId ? 'border-red-400 focus:ring-red-200' : ''}`}
            />
            {errors.notionDatabaseId ? (
              <p className="mt-1 text-xs text-red-500">{errors.notionDatabaseId}</p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">
                Found in the database URL: notion.so/your-workspace/<strong>{'<this-part>'}</strong>?v=…
              </p>
            )}
          </div>

          <h2 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3 pt-2">
            Class Settings
          </h2>

          {/* Grade level */}
          <div>
            <label htmlFor="grade" className="label">
              Grade Level
            </label>
            <select
              id="grade"
              value={form.gradeLevel}
              onChange={e => field('gradeLevel', e.target.value)}
              className="input-field"
            >
              {GRADE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Teaching points and standards references will be anchored to this grade's CCSS benchmarks.
            </p>
          </div>
        </div>

        {/* Info callout */}
        <div className="mt-4 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <InfoIcon />
          <p>
            Your API key and database ID are stored only in your browser's localStorage and are
            never sent anywhere except directly to Notion and this app's local backend.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn-primary">
            Save &amp; Continue
            <ArrowRightIcon />
          </button>
        </div>
      </form>
    </div>
  )
}

function InfoIcon() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
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
