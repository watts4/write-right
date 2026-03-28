import type { SmallGroup } from '../types'

interface Props {
  groups: SmallGroup[]
}

const GROUP_PALETTES = [
  { border: 'border-blue-200',   bg: 'bg-blue-50',   badge: 'bg-blue-100 text-blue-700',   icon: 'text-blue-400'   },
  { border: 'border-violet-200', bg: 'bg-violet-50', badge: 'bg-violet-100 text-violet-700', icon: 'text-violet-400' },
  { border: 'border-emerald-200',bg: 'bg-emerald-50',badge: 'bg-emerald-100 text-emerald-700',icon: 'text-emerald-400'},
  { border: 'border-amber-200',  bg: 'bg-amber-50',  badge: 'bg-amber-100 text-amber-700',  icon: 'text-amber-400'  },
  { border: 'border-rose-200',   bg: 'bg-rose-50',   badge: 'bg-rose-100 text-rose-700',    icon: 'text-rose-400'   },
]

export default function SmallGroupPanel({ groups }: Props) {
  if (groups.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon />
        <h2 className="text-lg font-bold text-slate-800">Small Group Recommendations</h2>
        <span className="ml-auto text-xs text-slate-400 font-medium">
          {groups.length} {groups.length === 1 ? 'group' : 'groups'} identified
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-5 leading-relaxed">
        Students have been clustered by shared instructional need. These groupings are a starting
        point — adjust based on your classroom knowledge.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group, i) => {
          const palette = GROUP_PALETTES[i % GROUP_PALETTES.length]
          return (
            <div
              key={group.groupName}
              className={`rounded-xl border ${palette.border} ${palette.bg} p-4`}
            >
              {/* Group header */}
              <div className="flex items-start gap-2 mb-3">
                <div className={`mt-0.5 ${palette.icon}`}>
                  <GroupIcon />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm leading-tight">{group.groupName}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{group.focus}</p>
                </div>
              </div>

              {/* Student badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {group.students.map(name => (
                  <span key={name} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${palette.badge}`}>
                    {name}
                  </span>
                ))}
              </div>

              {/* Suggested activity */}
              <div className="pt-3 border-t border-white/60">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <LightbulbIcon />
                  Suggested Activity
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">{group.suggestedActivity}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function GroupIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function LightbulbIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  )
}
