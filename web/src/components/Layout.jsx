import React from 'react'
import Sidebar, { MeetingWorkspaceProvider, useMeetingWorkspace } from './Sidebar'
import { getMeetingFile, getSpeaker } from '../lib/mockData'

/**
 * App shell layout for the meeting workspace.
 *
 * - Desktop (lg+): 3 columns (left / center / right)
 * - Mobile/tablet: single column stack
 */
export default function Layout({
  template,
  title,
  subtitle,
  actions,
  left,
  center,
  right,
  className = '',
  contentClassName = '',
}) {
  const isMeetingWorkspace = template === 'meeting-workspace'
  const resolvedLeft = isMeetingWorkspace ? left ?? <Sidebar /> : left
  const resolvedCenter = isMeetingWorkspace ? center ?? <MeetingWorkspaceCenter /> : center

  const content = (
    <div className={`min-h-[calc(100svh-56px)] bg-slate-50 ${className}`.trim()}>
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-6">
        {(title || subtitle || actions) && (
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
              {title ? (
                <div className="truncate text-lg font-semibold text-slate-900">{title}</div>
              ) : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        )}

        <div
          className={['grid grid-cols-1 gap-3 lg:grid-cols-[280px,1fr,360px]', contentClassName]
            .filter(Boolean)
            .join(' ')}
        >
          <aside className="space-y-3">{resolvedLeft}</aside>
          <main className="min-w-0">{resolvedCenter}</main>
          <aside className="min-w-0">{right}</aside>
        </div>
      </div>
    </div>
  )

  return isMeetingWorkspace ? <MeetingWorkspaceProvider>{content}</MeetingWorkspaceProvider> : content
}

function MeetingWorkspaceCenter() {
  const { selection } = useMeetingWorkspace()

  if (selection.kind === 'meeting') {
    const meeting = getMeetingFile(selection.id)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">선택된 회의 파일</div>
        <div className="mt-2">
          <div className="text-lg font-semibold text-slate-900">{meeting.title}</div>
          <div className="mt-1 text-sm text-slate-600">
            {meeting.date} · {meeting.duration} · {meeting.fileName}
          </div>
          <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
            상태: {meeting.status}
          </div>
        </div>
      </div>
    )
  }

  if (selection.kind === 'speaker') {
    const sp = getSpeaker(selection.id)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">선택된 참여자/화자</div>
        <div className="mt-2 text-lg font-semibold text-slate-900">{sp.name}</div>
        <div className="mt-1 text-sm text-slate-600">{sp.role}</div>
      </div>
    )
  }

  if (selection.kind === 'step') {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">선택된 작업 단계</div>
        <div className="mt-2 text-lg font-semibold text-slate-900">{selection.id}</div>
        <div className="mt-1 text-sm text-slate-600">좌측 단계 목록에서 항목을 선택하면 여기에서 확인할 수 있어요.</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-900">선택 항목 없음</div>
      <div className="mt-1 text-sm text-slate-600">좌측 리스트에서 항목을 선택하세요.</div>
    </div>
  )
}

