import React, { useMemo, useRef, useState } from 'react'
import { useMeetingWorkspace } from '../Sidebar'
import { getMeetingFile, getSpeaker, mockTranscript, workflowSteps } from '../../lib/mockData'
import AIStatus from './AIStatus'
import MessageInput from './MessageInput'
import Timeline from './Timeline'
import UploadCard from './UploadCard'

const stepProgress = {
  upload: 100,
  transcribe: 62,
  diarize: 40,
  draft: 18,
  revise: 0,
  approve: 0,
  share: 0,
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

export default function MainContent() {
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
  const stepsSlice = workflowSteps.slice(0, 4)

  const timelineEntries = useMemo(() => {
    const scriptLines = mockTranscript.map((line) => {
      const sp = getSpeaker(line.speakerId)
      return {
        id: `script-${line.id}`,
        kind: 'speaker',
        ts: line.ts,
        text: line.text,
        speakerName: sp.name,
        speakerRole: sp.role,
        speakerColor: sp.color,
      }
    })
    const chatLines = messages.map((m) => ({
      id: m.id,
      kind: m.kind,
      ts: m.ts,
      text: m.text,
    }))
    return [...scriptLines, ...chatLines]
  }, [messages])

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

  function resetUpload() {
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
  }

  const quickActions = (
    <>
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
    </>
  )

  return (
    <div className="space-y-3">
      <SelectionSummary selection={selection} />

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-slate-900">대화/작업 타임라인</div>
              <div className="text-xs text-slate-500">
                화자별 스크립트 미리보기와 업로드·처리 로그가 함께 표시됩니다(목업).
              </div>
            </div>
          </div>

          <div className="mt-3">
            <AIStatus
              activeStep={activeStep}
              targetProgress={activeProgress}
              activeStepLabel={activeStepLabel}
              stepsSlice={stepsSlice}
              onSelectStep={(id) => setSelection({ kind: 'step', id })}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3">
            <UploadCard
              fileInputRef={fileInputRef}
              uploading={uploading}
              selectedFile={selectedFile}
              onPickFile={onPickFile}
              onDropFile={onDropFile}
              onReset={resetUpload}
              onBrowse={() => fileInputRef.current?.click()}
            />
          </div>

          <Timeline entries={timelineEntries} />
        </div>

        <MessageInput
          value={composer}
          onChange={setComposer}
          onSend={sendComposer}
          onKeyDown={handleComposerKeyDown}
          quickActions={quickActions}
        />
      </div>
    </div>
  )
}
