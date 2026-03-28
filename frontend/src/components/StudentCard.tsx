import type { StudentAnalysis } from '../types'

interface Props {
  student: StudentAnalysis
  index: number
}

// Rotate through soft background accents for visual variety
const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
]

export default function StudentCard({ student, index }: Props) {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
  const initials = student.studentName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      {/* Student header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor}`}>
          {initials}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">{student.studentName}</h3>
          {student.standardsAddressed.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {student.standardsAddressed.map(std => (
                <span
                  key={std}
                  className="inline-block rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700 border border-brand-100"
                >
                  {std}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Teaching points */}
      <div className="mb-3">
        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <TargetIcon />
          Teaching Points
        </h4>
        <ul className="space-y-2">
          {student.teachingPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-xs text-slate-700 leading-relaxed">
              <span className="text-brand-500 font-bold shrink-0 mt-0.5">·</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths */}
      {student.strengths.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <StarIcon />
            Strengths
          </h4>
          <ul className="space-y-1.5">
            {student.strengths.map((strength, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-600 leading-relaxed">
                <span className="text-emerald-500 font-bold shrink-0 mt-0.5">·</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TargetIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
