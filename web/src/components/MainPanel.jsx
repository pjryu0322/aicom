import React, { useMemo, useRef, useState } from 'react'
import { useMeetingWorkspace } from './Sidebar'
import { getMeetingFile, getSpeaker, workflowSteps } from '../lib/mockData'
import { cx } from '../lib/utils'

const stepProgress = {
  upload: 100,
  transcribe: 62,
  diarize: 40,
  draft: 18,
  revise: 0,
  approve: 0,
  share: 0,
}

function statusForStep(active, step) {
  const order = workflowSteps.map((s) => s.id)
  const ai = order.indexOf(active)
  const si = order.indexOf(step)
  if (si < ai) return 'done'
  if (si === ai) return 'in_progress'
  return 'todo'
}

function SelectionSummary({ selection }) {
  if (!selection) return null

  if (selection.kind === 'meeting' && selection.id) {
    const meeting = getMeetingFile(selection.id)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">선택된 회의</div>
        <div className="mt-2">
          <div className="text-base font-semibold text-slate-900">{meeting.title}</div>
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

  if (selection.kind === 'speaker' && selection.id) {
    const sp = getSpeaker(selection.id)
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">선택된 참여자/화자</div>
        <div className="mt-2 text-base font-semibold text-slate-900">{sp.name}</div>
        <div className="mt-1 text-sm text-slate-600">{sp.role}</div>
      </div>
    )
  }

  if (selection.kind === 'step' && selection.id) {
    const label = workflowSteps.find((s) => s.id === selection.id)?.label ?? selection.id
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold text-slate-900">선택된 작업 단계</div>
        <div className="mt-2 text-base font-semibold text-slate-900">{label}</div>
        <div className="mt-1 text-sm text-slate-600">좌측 단계 목록에서 항목을 선택하면 상태가 반영됩니다.</div>
      </div>
    )
  }

  return null
}

export default function MainPanel() {
  const { selection, setSelection } = useMeetingWorkspace()
  const fileInputRef = useRef(null)

  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [composer, setComposer] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      kind: 'system',
      ts: '방금',
      text: '녹취 파일을 업로드하면 텍스트 변환 → 화자 분리 → 회의록 초안 생성까지 자동으로 진행됩니다.',
    },
  ])

  const activeStep = useMemo(() => {
    if (selection?.kind === 'step' && selection?.id) return selection.id
    return 'transcribe'
  }, [selection])

  const activeProgress = stepProgress[activeStep] ?? 0
  const activeStepLabel = workflowSteps.find((s) => s.id === activeStep)?.label ?? activeStep

  function startMockUpload(file) {
    if (!file) return
    setSelectedFile(file)
    setUploading(true)
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        kind: 'human',
        ts: '방금',
        text: `파일 업로드 요청: ${file.name} (${Math.round(file.size / 1024)}KB)`,
      },
      {
        id: `msg-${prev.length + 2}`,
        kind: 'system',
        ts: '방금',
        text: '업로드를 시작합니다(목업).',
      },
    ])

    window.setTimeout(() => {
      setUploading(false)
      setSelection({ kind: 'step', id: 'transcribe' })
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${prev.length + 1}`,
          kind: 'system',
          ts: '방금',
          text: '업로드 완료. 텍스트 변환(STT)을 시작합니다(목업).',
        },
      ])
    }, 900)
  }

  function onPickFile(e) {
    const file = e.target.files?.[0]
    if (file) startMockUpload(file)
    e.target.value = ''
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
        text: '확인했어요. 관련 구간을 스크립트에 표시하고 요약/할 일에 반영할게요(목업).',
      },
    ])
  }

  function handleComposerKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      sendComposer()
    }
  }

  function onDropFile(e) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) startMockUpload(file)
  }

  return (
    <div className="space-y-3">
      <SelectionSummary selection={selection} />

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-900">대화/작업 타임라인</div>
              <div className="text-xs text-slate-500">업로드·처리 로그와 코멘트가 함께 쌓입니다(목업).</div>
            </div>
            <div className="text-xs font-medium text-slate-600">
              현재 단계: <span className="text-slate-900">{activeStepLabel}</span>
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
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelection({ kind: 'step', id: s.id })}
                  className={cx(
                    'rounded-full px-2 py-0.5 text-xs font-semibold transition',
                    statusForStep(activeStep, s.id) === 'done' && 'bg-emerald-50 text-emerald-700',
                    statusForStep(activeStep, s.id) === 'in_progress' && 'bg-indigo-50 text-indigo-700',
                    statusForStep(activeStep, s.id) === 'todo' && 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropFile}
            className={cx(
              'mb-3 rounded-xl border border-dashed bg-slate-50 p-4',
              uploading ? 'border-slate-300' : 'border-slate-300 hover:border-slate-400',
            )}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
            }}
            onClick={() => fileInputRef.current?.click()}
            aria-label="녹취 파일 업로드"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">업로드 카드</div>
                <div className="mt-1 text-xs text-slate-500">
                  파일을 드래그&드롭하거나 클릭해서 선택하세요. (프로토타입: 실제 저장은 하지 않아요)
                </div>
                {selectedFile ? (
                  <div className="mt-2 text-xs font-medium text-slate-700">
                    선택됨: {selectedFile.name}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={onPickFile}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  disabled={uploading}
                  className={cx(
                    'rounded-md px-3 py-2 text-sm font-semibold',
                    uploading ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-500',
                  )}
                >
                  {uploading ? '업로드 중…' : '파일 선택'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: `msg-${prev.length + 1}`,
                        kind: 'system',
                        ts: '방금',
                        text: '업로드 큐를 초기화했습니다(목업).',
                      },
                    ])
                  }}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cx(
                  'flex gap-3 rounded-xl border p-3',
                  m.kind === 'system' ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white',
                )}
              >
                <div
                  className={cx(
                    'mt-0.5 h-8 w-8 shrink-0 rounded-full text-center text-sm font-bold leading-8',
                    m.kind === 'system' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white',
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
                  <div className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{m.text}</div>
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
              onKeyDown={handleComposerKeyDown}
              rows={2}
              placeholder="메시지를 입력하세요… (Ctrl/⌘+Enter로 전송)"
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
              onClick={() => setSelection({ kind: 'step', id: 'diarize' })}
              className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-200"
            >
              화자 분리로 이동
            </button>
            <button
              type="button"
              onClick={() => setSelection({ kind: 'step', id: 'draft' })}
              className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-200"
            >
              초안 생성으로 이동
            </button>
            <button
              type="button"
              onClick={() => setSelection({ kind: 'step', id: 'approve' })}
              className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700 hover:bg-slate-200"
            >
              승인 단계로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

