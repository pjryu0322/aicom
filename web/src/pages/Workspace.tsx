import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  getMeetingFile,
  getSpeaker,
  mockMeetings,
  mockSpeakers,
  mockSummary,
  mockTranscript,
  workflowSteps,
  type WorkflowStepId,
  type WorkflowStepStatus,
} from '../lib/mockData'
import { cx } from '../lib/utils'

type WorkspaceTab = 'summary' | 'script'

function statusForStep(active: WorkflowStepId, step: WorkflowStepId): WorkflowStepStatus {
  const order = workflowSteps.map((s) => s.id)
  const ai = order.indexOf(active)
  const si = order.indexOf(step)
  if (si < ai) return 'done'
  if (si === ai) return 'in_progress'
  return 'todo'
}

const stepProgress: Record<WorkflowStepId, number> = {
  upload: 100,
  transcribe: 62,
  diarize: 40,
  draft: 18,
  revise: 0,
  approve: 0,
  share: 0,
}

export default function WorkspacePage() {
  const [params, setParams] = useSearchParams()
  const meetingId = params.get('m') ?? mockMeetings[0].id
  const activeStep = (params.get('step') as WorkflowStepId | null) ?? 'transcribe'
  const tab = (params.get('tab') as WorkspaceTab | null) ?? 'summary'

  const meeting = useMemo(() => getMeetingFile(meetingId), [meetingId])
  const [composer, setComposer] = useState('')
  const [uploading, setUploading] = useState(false)
  const [messages, setMessages] = useState<
    { id: string; kind: 'human' | 'system'; text: string; ts: string }[]
  >([
    {
      id: 'msg-1',
      kind: 'system',
      ts: '방금',
      text: '녹취 파일을 업로드하면 텍스트 변환 → 화자 분리 → 회의록 초안 생성까지 자동으로 진행됩니다.',
    },
    {
      id: 'msg-2',
      kind: 'human',
      ts: '1분 전',
      text: '참석자에게 수정 요청을 보내기 전에 초안을 빠르게 확인하고 싶어요.',
    },
  ])

  const activeProgress = stepProgress[activeStep] ?? 0

  function setMeeting(nextId: string) {
    params.set('m', nextId)
    setParams(params, { replace: true })
  }

  function setStep(nextStep: WorkflowStepId) {
    params.set('step', nextStep)
    setParams(params, { replace: true })
  }

  function setTab(nextTab: WorkspaceTab) {
    params.set('tab', nextTab)
    setParams(params, { replace: true })
  }

  function mockUpload() {
    setUploading(true)
    window.setTimeout(() => {
      setUploading(false)
      setStep('transcribe')
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${prev.length + 1}`,
          kind: 'system',
          ts: '방금',
          text: '업로드 완료. 텍스트 변환을 시작합니다.',
        },
      ])
    }, 850)
  }

  function sendComposer() {
    const text = composer.trim()
    if (!text) return
    setComposer('')
    setMessages((prev) => [
      ...prev,
      { id: `msg-${prev.length + 1}`, kind: 'human', ts: '방금', text },
      {
        id: `msg-${prev.length + 2}`,
        kind: 'system',
        ts: '방금',
        text: '확인했어요. 관련 구간을 스크립트에서 하이라이트하고 요약본의 할 일에 반영할게요(목업).',
      },
    ])
  }

  return (
    <div className="min-h-[calc(100svh-56px)] bg-slate-50">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500">회의 분석 워크스페이스</div>
            <div className="text-lg font-semibold text-slate-900">{meeting.title}</div>
            <div className="text-xs text-slate-500">
              {meeting.date} · {meeting.duration} · 파일: {meeting.fileName}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/processing"
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              처리 상태 보기
            </Link>
            <Link
              to="/upload"
              className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              새 녹취 업로드
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[280px,1fr,360px]">
          {/* Left */}
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-2 text-sm font-semibold text-slate-900">회의 파일 목록</div>
              <div className="space-y-1">
                {mockMeetings.map((m) => {
                  const active = m.id === meetingId
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMeeting(m.id)}
                      className={cx(
                        'w-full rounded-lg border px-3 py-2 text-left text-sm transition',
                        active
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      )}
                    >
                      <div className="font-medium">{m.title}</div>
                      <div className={cx('mt-0.5 text-xs', active ? 'text-white/80' : 'text-slate-500')}>
                        {m.date} · {m.duration} · {m.status}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-2 text-sm font-semibold text-slate-900">참여자/화자 목록</div>
              <div className="space-y-2">
                {mockSpeakers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.role}</div>
                    </div>
                    <span
                      className={cx(
                        'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                        s.color === 'indigo' && 'bg-indigo-50 text-indigo-700',
                        s.color === 'emerald' && 'bg-emerald-50 text-emerald-700',
                        s.color === 'amber' && 'bg-amber-50 text-amber-800',
                        s.color === 'violet' && 'bg-violet-50 text-violet-700',
                        s.color === 'sky' && 'bg-sky-50 text-sky-700',
                        s.color === 'rose' && 'bg-rose-50 text-rose-700'
                      )}
                    >
                      화자
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="mb-2 text-sm font-semibold text-slate-900">작업 상태</div>
              <div className="space-y-2">
                {workflowSteps.map((s) => {
                  const st = statusForStep(activeStep, s.id)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStep(s.id)}
                      className={cx(
                        'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm',
                        st === 'in_progress' && 'border-slate-900 bg-slate-50',
                        st !== 'in_progress' && 'border-slate-200 bg-white hover:bg-slate-50'
                      )}
                    >
                      <span className="font-medium text-slate-800">{s.label}</span>
                      <span
                        className={cx(
                          'rounded-full px-2 py-0.5 text-xs font-semibold',
                          st === 'done' && 'bg-emerald-50 text-emerald-700',
                          st === 'in_progress' && 'bg-indigo-50 text-indigo-700',
                          st === 'todo' && 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {st === 'done' ? '완료' : st === 'in_progress' ? '진행 중' : '대기'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Center */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-900">대화/작업 타임라인</div>
                  <div className="text-xs text-slate-500">업로드·처리 로그와 코멘트가 함께 쌓입니다(목업).</div>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  현재 단계: <span className="text-slate-900">{workflowSteps.find((s) => s.id === activeStep)?.label}</span>
                </div>
              </div>

              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">AI 변환 상태</div>
                    <div className="text-xs text-slate-500">단계별 진행률 UI(목업)</div>
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-slate-900">{activeProgress}%</div>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-[width]"
                    style={{ width: `${activeProgress}%` }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {workflowSteps.slice(0, 4).map((s) => (
                    <span
                      key={s.id}
                      className={cx(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        statusForStep(activeStep, s.id) === 'done' && 'bg-emerald-50 text-emerald-700',
                        statusForStep(activeStep, s.id) === 'in_progress' && 'bg-indigo-50 text-indigo-700',
                        statusForStep(activeStep, s.id) === 'todo' && 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">업로드 카드</div>
                    <div className="text-xs text-slate-500">
                      드래그&드롭/파일 선택은 목업 버튼으로 대체했습니다.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={mockUpload}
                    disabled={uploading}
                    className={cx(
                      'rounded-md px-3 py-2 text-sm font-semibold',
                      uploading
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    )}
                  >
                    {uploading ? '업로드 중…' : '파일 업로드(목업)'}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cx(
                      'flex gap-3 rounded-xl border p-3',
                      m.kind === 'system'
                        ? 'border-indigo-200 bg-indigo-50'
                        : 'border-slate-200 bg-white'
                    )}
                  >
                    <div
                      className={cx(
                        'mt-0.5 h-8 w-8 shrink-0 rounded-full text-center text-sm font-bold leading-8',
                        m.kind === 'system' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'
                      )}
                    >
                      {m.kind === 'system' ? 'AI' : '나'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-slate-900">
                          {m.kind === 'system' ? 'AI 에이전트' : '회의록 작성자'}
                        </div>
                        <div className="text-xs text-slate-500">{m.ts}</div>
                      </div>
                      <div className="mt-1 text-sm text-slate-800">{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  rows={2}
                  placeholder="메시지를 입력하세요(목업)… 예) ‘00:03:18 구간은 결정사항으로 넣어주세요’"
                  className="min-h-[44px] flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={sendComposer}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  전송
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>빠른 액션(목업):</span>
                <button
                  type="button"
                  onClick={() => setStep('diarize')}
                  className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-200"
                >
                  화자 분리로 이동
                </button>
                <button
                  type="button"
                  onClick={() => setStep('draft')}
                  className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-200"
                >
                  초안 생성으로 이동
                </button>
                <button
                  type="button"
                  onClick={() => setStep('approve')}
                  className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-200"
                >
                  승인 단계로 이동
                </button>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 p-3">
              <div className="text-sm font-semibold text-slate-900">문서 패널</div>
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setTab('summary')}
                  className={cx(
                    'rounded-md px-3 py-1.5 text-sm font-semibold',
                    tab === 'summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  )}
                >
                  요약본
                </button>
                <button
                  type="button"
                  onClick={() => setTab('script')}
                  className={cx(
                    'rounded-md px-3 py-1.5 text-sm font-semibold',
                    tab === 'script' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  )}
                >
                  스크립트
                </button>
              </div>
            </div>

            {tab === 'summary' ? (
              <div className="p-3">
                <div className="space-y-3">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-2 text-sm font-semibold text-slate-900">핵심 안건</div>
                    <ul className="space-y-1 text-sm text-slate-800">
                      {mockSummary.agenda.map((a) => (
                        <li key={a.id} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span>{a.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-2 text-sm font-semibold text-slate-900">결정사항</div>
                    <ul className="space-y-1 text-sm text-slate-800">
                      {mockSummary.decisions.map((d) => (
                        <li key={d.id} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{d.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-2 text-sm font-semibold text-slate-900">할 일</div>
                    <div className="space-y-2">
                      {mockSummary.todos.map((t) => (
                        <div key={t.id} className="rounded-lg bg-slate-50 p-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-slate-900">{t.text}</div>
                            <div className="text-xs font-medium text-slate-500">{t.due}</div>
                          </div>
                          <div className="mt-1 text-xs text-slate-600">담당: {t.owner}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('revise')}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    수정 요청 보내기(목업)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('approve')}
                    className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
                  >
                    최종 승인(목업)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('share')}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    공유/배포(목업)
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div className="mb-2 text-sm font-semibold text-slate-900">화자별 발언 목록</div>
                <div className="space-y-2">
                  {mockTranscript.map((l) => {
                    const sp = getSpeaker(l.speakerId)
                    return (
                      <div key={l.id} className="rounded-lg border border-slate-200 p-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-slate-900">
                              {sp.name}{' '}
                              <span className="text-xs font-medium text-slate-500">({sp.role})</span>
                            </div>
                            <div className="text-xs text-slate-500">{l.ts}</div>
                          </div>
                          <span
                            className={cx(
                              'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                              sp.color === 'indigo' && 'bg-indigo-50 text-indigo-700',
                              sp.color === 'emerald' && 'bg-emerald-50 text-emerald-700',
                              sp.color === 'amber' && 'bg-amber-50 text-amber-800',
                              sp.color === 'violet' && 'bg-violet-50 text-violet-700',
                              sp.color === 'sky' && 'bg-sky-50 text-sky-700',
                              sp.color === 'rose' && 'bg-rose-50 text-rose-700'
                            )}
                          >
                            {sp.name}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-slate-800">{l.text}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

