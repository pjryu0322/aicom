import { SidebarSection } from '../SidebarSection'
import { cx } from '../../lib/utils'

/**
 * 작업 상태(워크플로 단계) — 좌측 사이드바
 */
export default function TaskStatus({ steps = [], selection, onSelectStep }) {
  return (
    <SidebarSection title="작업 상태" right="단계 선택">
      <ol className="relative space-y-0 rounded-lg border border-slate-100 bg-slate-50/50 p-1">
        {steps.map((st, index) => {
          const active = selection?.kind === 'step' && selection?.id === st.id
          const isLast = index === steps.length - 1
          return (
            <li key={st.id} className="relative">
              {!isLast ? (
                <span
                  className="absolute left-[1.15rem] top-[2.25rem] h-[calc(100%-0.25rem)] w-px bg-slate-200"
                  aria-hidden
                />
              ) : null}
              <button
                type="button"
                onClick={() => onSelectStep?.(st.id)}
                className={cx(
                  'relative flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition',
                  'hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-slate-400',
                  active ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'bg-transparent',
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className={cx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums',
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-600',
                    )}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 truncate font-medium text-slate-900">{st.label}</span>
                </span>
                <span
                  className={cx(
                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                    active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600',
                  )}
                >
                  {active ? '선택됨' : '보기'}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </SidebarSection>
  )
}
