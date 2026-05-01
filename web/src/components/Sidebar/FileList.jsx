import { SidebarSection } from '../SidebarSection'
import { cx } from '../../lib/utils'

/**
 * 회의 파일 목록 — 좌측 사이드바
 */
export default function FileList({ meetings = [], selection, onSelectMeeting }) {
  return (
    <SidebarSection title="회의 파일 목록" right={`${meetings.length}개`}>
      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50">
        {meetings.map((m) => {
          const active = selection?.kind === 'meeting' && selection?.id === m.id
          return (
            <li key={m.id} className="first:rounded-t-lg last:rounded-b-lg">
              <button
                type="button"
                onClick={() => onSelectMeeting?.(m.id)}
                className={cx(
                  'flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left text-sm transition',
                  'first:rounded-t-lg last:rounded-b-lg',
                  'hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-400',
                  active ? 'bg-white shadow-[inset_3px_0_0_0_rgb(15_23_42)]' : 'bg-transparent',
                )}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{m.title}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {m.date} · {m.duration}
                  </div>
                </div>
                <span
                  className={cx(
                    'mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    active ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700',
                  )}
                >
                  {m.status}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </SidebarSection>
  )
}
