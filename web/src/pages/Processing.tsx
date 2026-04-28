import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { SidebarSection } from '../components/SidebarSection'
import {
  getMeetingFile,
  mockMeetings,
  mockSpeakers,
  workflowSteps,
  type WorkflowStepId,
  type WorkflowStepStatus,
} from '../lib/mockData'
import { cx } from '../lib/utils'

const stepOrder: WorkflowStepId[] = [
  'upload',
  'transcribe',
  'diarize',
  'draft',
  'revise',
  'approve',
  'share',
]

function calcStatus(current: WorkflowStepId): Record<WorkflowStepId, WorkflowStepStatus> {
  const currentIdx = stepOrder.indexOf(current)
  return stepOrder.reduce(
    (acc, id, idx) => {
      acc[id] = idx < currentIdx ? 'done' : idx === currentIdx ? 'in_progress' : 'todo'
      return acc
    },
    {} as Record<WorkflowStepId, WorkflowStepStatus>,
  )
}

export function ProcessingPage() {
  const [params] = useSearchParams()
  const meetingId = params.get('meetingId') ?? mockMeetings[0].id
  const meeting = getMeetingFile(meetingId)
  const navigate = useNavigate()

  const [current, setCurrent] = useState<WorkflowStepId>(() => {
    const initial = params.get('step') as WorkflowStepId | null
    return initial && stepOrder.includes(initial) ? initial : 'transcribe'
  })

  const statusMap = useMemo(() => calcStatus(current), [current])
  const progressPct = useMemo(() => {
    const idx = stepOrder.indexOf(current)
    return Math.round(((idx + 0.5) / stepOrder.length) * 100)
  }, [current])

  const logs = useMemo(() => {
    const logBase = [
      { ts: '12:01', level: 'info', text: '업로드 파일 메타데이터 분석 시작' },
      { ts: '12:02', level: 'info', text: '오디오 길이/채널/샘플레이트 확인' },
      { ts: '12:03', level: 'info', text: 'STT 세그먼트 생성(가속 모드)' },
      { ts: '12:04', level: 'info', text: '화자 분리(초기 클러스터링) 수행' },
      { ts: '12:05', level: 'info', text: '요약본/할 일/결정사항 추출' },
    ]
    const idx = stepOrder.indexOf(current)
    return logBase.slice(0, Math.max(2, Math.min(logBase.length, idx + 2)))
  }, [current])

  const goNext = () => {
    const idx = stepOrder.indexOf(current)
    const next = stepOrder[Math.min(stepOrder.length - 1, idx + 1)]
    setCurrent(next)
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-slate-600">변환·처리 상태</div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{meeting.title}</h1>
            <div className="mt-1 text-xs text-slate-500">
              {meeting.date} · {meeting.duration} · 파일: {meeting.fileName}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(`/workspace?meetingId=${meeting.id}`)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              워크스페이스로
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              다음 단계로 (mock)
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr_320px]">
          <aside className="space-y-3">
            <SidebarSection title="회의 파일 목록">
              <ul className="space-y-1">
                {mockMeetings.map((m) => (
                  <li key={m.id}>
                    <Link
                      to={`/processing?meetingId=${m.id}&step=${current}`}
                      className={cx(
                        'flex items-start justify-between gap-2 rounded-md px-2 py-2 text-sm hover:bg-slate-50',
                        m.id === meetingId && 'bg-slate-100',
                      )}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{m.title}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {m.date} · {m.duration}
                        </div>
                      </div>
                      <span className="mt-0.5 shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                        {m.status}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarSection>

            <SidebarSection title="참여자/화자 목록">
              <ul className="space-y-1 text-sm">
                {mockSpeakers.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{s.name}</div>
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
                  </li>
                ))}
              </ul>
            </SidebarSection>
          </aside>

          <main className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">AI 변환 상태</div>
                <div className="mt-1 text-xs text-slate-500">
                  현재 단계: {workflowSteps.find((s) => s.id === current)?.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{progressPct}%</div>
                <div className="text-xs text-slate-500">진행률 (mock)</div>
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full bg-indigo-600" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {workflowSteps.map((s) => {
                const st = statusMap[s.id]
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrent(s.id)}
                    className={cx(
                      'flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm',
                      st === 'done' && 'border-emerald-200 bg-emerald-50',
                      st === 'in_progress' && 'border-indigo-200 bg-indigo-50',
                      st === 'todo' && 'border-slate-200 bg-white hover:bg-slate-50',
                    )}
                  >
                    <span className="font-medium">{s.label}</span>
                    <span
                      className={cx(
                        'rounded-full px-2 py-0.5 text-[11px] font-medium',
                        st === 'done' && 'bg-emerald-100 text-emerald-800',
                        st === 'in_progress' && 'bg-indigo-100 text-indigo-800',
                        st === 'todo' && 'bg-slate-100 text-slate-700',
                      )}
                    >
                      {st === 'done' ? '완료' : st === 'in_progress' ? '진행 중' : '대기'}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 border-t border-slate-200 pt-4">
              <div className="text-sm font-semibold">처리 로그 타임라인</div>
              <ul className="mt-2 space-y-2">
                {logs.map((l, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">
                        {l.ts} · {l.level.toUpperCase()}
                      </div>
                      <div className="truncate text-slate-900">{l.text}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </main>

          <aside className="space-y-3">
            <SidebarSection title="다음 액션">
              <div className="space-y-2 text-sm text-slate-700">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  처리 결과가 준비되면 <span className="font-semibold">회의록 편집</span>으로 이동해 초안을 다듬고,
                  참석자에게 수정 요청을 보낼 수 있어요.
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/editor?meetingId=${meetingId}`}
                    className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
                  >
                    문서 편집
                  </Link>
                  <Link
                    to={`/inbox?meetingId=${meetingId}`}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium hover:bg-slate-50"
                  >
                    승인 요청함
                  </Link>
                </div>
              </div>
            </SidebarSection>
          </aside>
        </div>
    </div>
  )
}

