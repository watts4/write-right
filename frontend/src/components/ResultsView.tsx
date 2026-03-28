import { useState } from 'react'
import type { AnalysisResult, SetupConfig } from '../types'
import { saveToNotion, ApiError } from '../api'
import StudentCard from './StudentCard'
import SmallGroupPanel from './SmallGroupPanel'

interface Props {
  result: AnalysisResult
  config: SetupConfig
  onUpdate: (result: AnalysisResult) => void
  onReanalyze: () => void
  onEditSetup: () => void
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ResultsView({ result, config, onUpdate, onReanalyze, onEditSetup }: Props) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(result.notionPageUrl ? 'saved' : 'idle')
  const [saveError, setSaveError] = useState('')
  const [activeTab, setActiveTab] = useState<'students' | 'groups'>('students')

  const gradeLabel = result.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${result.gradeLevel}`
  const analyzedDate = new Date(result.analyzedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  async function handleSaveToNotion() {
    setSaveStatus('saving')
    setSaveError('')
    try {
      const updated = await saveToNotion(config, result)
      onUpdate(updated)
      setSaveStatus('saved')
    } catch (err) {
      setSaveStatus('error')
      if (err instanceof ApiError) {
        setSaveError(err.message)
      } else if (err instanceof TypeError) {
        setSaveError('Could not reach the backend. Make sure it\'s running at localhost:3001.')
      } else {
        setSaveError('Something went wrong saving to Notion.')
      }
    }
  }

  return (
    <div>
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analysis Results</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {gradeLabel} &bull; {result.students.length} students &bull; Analyzed {analyzedDate}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onEditSetup} className="btn-secondary text-xs py-2 px-3">
            Setup
          </button>
          <button onClick={onReanalyze} className="btn-secondary text-xs py-2 px-3">
            Re-analyze
          </button>

          {saveStatus === 'saved' && result.notionPageUrl ? (
            <a
              href={result.notionPageUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-xs py-2 px-3"
            >
              <NotionIcon />
              View in Notion
            </a>
          ) : (
            <button
              onClick={handleSaveToNotion}
              disabled={saveStatus === 'saving'}
              className="btn-primary text-xs py-2 px-3"
            >
              {saveStatus === 'saving' ? (
                <>
                  <MiniSpinner />
                  Saving…
                </>
              ) : (
                <>
                  <NotionIcon />
                  Save to Notion
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Save error */}
      {saveStatus === 'error' && (
        <div className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertIcon />
          <div>
            <span className="font-semibold">Couldn't save to Notion: </span>
            {saveError}
          </div>
        </div>
      )}

      {/* Save success (no URL case) */}
      {saveStatus === 'saved' && !result.notionPageUrl && (
        <div className="mb-5 flex gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckIcon />
          <span>Results successfully saved to Notion.</span>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Students Analyzed" value={String(result.students.length)} />
        <StatCard
          label="Total Teaching Points"
          value={String(result.students.reduce((sum, s) => sum + s.teachingPoints.length, 0))}
        />
        <StatCard label="Small Groups" value={String(result.smallGroups.length)} />
        <StatCard
          label="Standards Covered"
          value={String(
            new Set(result.students.flatMap(s => s.standardsAddressed)).size
          )}
        />
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-slate-200 mb-6">
        <TabButton
          label={`Student Cards (${result.students.length})`}
          active={activeTab === 'students'}
          onClick={() => setActiveTab('students')}
        />
        <TabButton
          label={`Small Groups (${result.smallGroups.length})`}
          active={activeTab === 'groups'}
          onClick={() => setActiveTab('groups')}
        />
      </div>

      {/* Student cards grid */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.students.map((student, i) => (
            <StudentCard key={student.studentName} student={student} index={i} />
          ))}
        </div>
      )}

      {/* Small groups */}
      {activeTab === 'groups' && (
        <SmallGroupPanel groups={result.smallGroups} />
      )}
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center py-4">
      <p className="text-2xl font-bold text-brand-700">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      {label}
    </button>
  )
}

function MiniSpinner() {
  return (
    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
  )
}

function NotionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
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

function CheckIcon() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
