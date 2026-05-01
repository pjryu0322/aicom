import { SidebarSection } from '../SidebarSection'
import { cx } from '../../lib/utils'

const colorDot = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  sky: 'bg-sky-500',
  rose: 'bg-rose-500',
}

/**
 * 참여자/화자 목록 — 좌측 사이드바
 */
export default function ParticipantList({ speakers = [], selection, onSelectSpeaker }) {
  return (
    <SidebarSection title="참여자/화자 목록" right={`${speakers.length}명`}>
      <ul className="divide-y divide-slate-100 rounded-lg border border-slate-100 bg-slate-50/50 text-sm">
        {speakers.map((s) => {
          const active = selection?.kind === 'speaker' && selection?.id === s.id
          return (
            <li key={s.id} className="first:rounded-t-lg last:rounded-b-lg">
              <button
                type="button"
                onClick={() => onSelectSpeaker?.(s.id)}
                className={cx(
                  'flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition',
                  'first:rounded-t-lg last:rounded-b-lg',
                  'hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-slate-400',
                  active ? 'bg-white shadow-[inset_3px_0_0_0_rgb(15_23_42)]' : 'bg-transparent',
                )}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={cx(
                      'h-8 w-8 shrink-0 rounded-full border border-slate-200 bg-white text-center text-xs font-semibold leading-8 text-slate-700',
                      active && 'border-slate-300 bg-slate-100',
                    )}
                    aria-hidden
                  >
                    {s.name.slice(0, 1)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.role}</div>
                  </div>
                </div>
                <span
                  className={cx('h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white', colorDot[s.color] ?? 'bg-slate-400')}
                  title="화자 색상"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </SidebarSection>
  )
}
