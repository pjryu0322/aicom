import React, { createContext, useContext, useMemo, useState } from 'react'
import { workflowSteps, mockMeetings, mockSpeakers } from '../lib/mockData'
import { cx } from '../lib/utils'
import { SidebarSection } from './SidebarSection'

const MeetingWorkspaceContext = createContext(null)

export function useMeetingWorkspace() {
  const ctx = useContext(MeetingWorkspaceContext)
  if (!ctx) throw new Error('useMeetingWorkspace must be used within MeetingWorkspaceProvider')
  return ctx
}

/**
 * Provides shared selection state for the meeting-workspace template.
 * This lets the left sidebar drive what the center panel shows.
 */
export function MeetingWorkspaceProvider({
  children,
  meetings = mockMeetings,
  speakers = mockSpeakers,
  steps = workflowSteps,
  initialSelection,
}) {
  const defaultSelection =
    initialSelection ??
    (meetings?.[0]?.id
      ? { kind: 'meeting', id: meetings[0].id }
      : speakers?.[0]?.id
        ? { kind: 'speaker', id: speakers[0].id }
        : steps?.[0]?.id
          ? { kind: 'step', id: steps[0].id }
          : { kind: 'meeting', id: null })

  const [selection, setSelection] = useState(defaultSelection)

  const value = useMemo(
    () => ({
      meetings,
      speakers,
      steps,
      selection,
      setSelection,
    }),
    [meetings, speakers, steps, selection],
  )

  return <MeetingWorkspaceContext.Provider value={value}>{children}</MeetingWorkspaceContext.Provider>
}

export default function Sidebar({ className = '' }) {
  const { meetings, speakers, steps, selection, setSelection } = useMeetingWorkspace()

  return (
    <div className={cx('space-y-3', className)}>
      <SidebarSection title="회의 파일 목록" right={`${meetings.length}개`}>
        <ul className="space-y-1">
          {meetings.map((m) => {
            const active = selection.kind === 'meeting' && selection.id === m.id
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelection({ kind: 'meeting', id: m.id })}
                  className={cx(
                    'flex w-full items-start justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition hover:bg-slate-50',
                    active && 'bg-slate-100',
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900">{m.title}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {m.date} · {m.duration}
                    </div>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                    {m.status}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </SidebarSection>

      <SidebarSection title="참여자/화자 목록" right={`${speakers.length}명`}>
        <ul className="space-y-1 text-sm">
          {speakers.map((s) => {
            const active = selection.kind === 'speaker' && selection.id === s.id
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelection({ kind: 'speaker', id: s.id })}
                  className={cx(
                    'flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left transition hover:bg-slate-50',
                    active && 'bg-slate-100',
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.role}</div>
                  </div>
                  <span
                    className={cx(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      s.color === 'indigo' && 'bg-indigo-500',
                      s.color === 'emerald' && 'bg-emerald-500',
                      s.color === 'amber' && 'bg-amber-500',
                      s.color === 'violet' && 'bg-violet-500',
                      s.color === 'sky' && 'bg-sky-500',
                      s.color === 'rose' && 'bg-rose-500',
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </SidebarSection>

      <SidebarSection title="작업 상태" right="단계 선택">
        <ul className="space-y-1">
          {steps.map((st) => {
            const active = selection.kind === 'step' && selection.id === st.id
            return (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => setSelection({ kind: 'step', id: st.id })}
                  className={cx(
                    'flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition hover:bg-slate-50',
                    active && 'bg-slate-100',
                  )}
                >
                  <span className="font-medium text-slate-900">{st.label}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {active ? '선택됨' : '보기'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </SidebarSection>
    </div>
  )
}

