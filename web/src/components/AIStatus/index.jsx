import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../../lib/utils'
import { AI_DONE_EVENT, AI_PROGRESS_EVENT } from '../AIProgress'
import ProgressIndicator from './ProgressIndicator'

function statusForStep(active, step, order) {
  const ai = order.indexOf(active)
  const si = order.indexOf(step)
  if (si < ai) return 'done'
  if (si === ai) return 'in_progress'
  return 'todo'
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function nextTickMs(pct) {
  if (pct < 35) return 120
  if (pct < 70) return 160
  if (pct < 90) return 210
  return 280
}

function incForPct(pct) {
  if (pct < 45) return 6
  if (pct < 75) return 4
  if (pct < 90) return 3
  return 2
}

const AI_STEPS = ['transcribe', 'diarize', 'draft']

/**
 * AI 변환 상태 UI: 전역 이벤트·내부 시뮬레이션으로 진행률이 실시간 갱신됩니다.
 *
 * @param {string} props.activeStep
 * @param {number} props.targetProgress — 단계별 목표(정적) 진행률
 * @param {string} props.activeStepLabel
 * @param {{ id: string; label: string }[]} props.stepsSlice
 * @param {(stepId: string) => void} props.onSelectStep
 * @param {boolean} props.jobActive — 업로드 후 AI 파이프라인 시뮬레이션 실행
 * @param {() => void} props.onJobComplete
 * @param {(stepId: string) => void} props.onAutomatedStepChange — 시뮬에서 단계 전환 시 사이드바 등과 동기화
 */
export default function AIStatus({
  activeStep,
  targetProgress = 0,
  activeStepLabel,
  stepsSlice = [],
  onSelectStep,
  jobActive = false,
  onJobComplete,
  onAutomatedStepChange,
}) {
  const order = useMemo(() => stepsSlice.map((s) => s.id), [stepsSlice])

  const [liveStep, setLiveStep] = useState(activeStep)
  const [livePct, setLivePct] = useState(() => clamp(targetProgress, 0, 100))
  const [liveMessage, setLiveMessage] = useState('')
  const [pipelineDone, setPipelineDone] = useState(false)
  const [displayedPct, setDisplayedPct] = useState(() => targetProgress)

  const simStepRef = useRef('transcribe')
  const simPctRef = useRef(0)
  const simDoneRef = useRef(false)

  useEffect(() => {
    setLiveStep(activeStep)
  }, [activeStep])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onProgress = (e) => {
      const d = e?.detail ?? {}
      if (typeof d.step === 'string') setLiveStep(d.step)
      if (Number.isFinite(d.pct)) setLivePct(clamp(d.pct, 0, 100))
      if (typeof d.message === 'string') setLiveMessage(d.message)
      setPipelineDone(false)
    }

    const onDone = (e) => {
      const d = e?.detail ?? {}
      setLivePct(100)
      if (typeof d.message === 'string') setLiveMessage(d.message)
      setPipelineDone(true)
    }

    window.addEventListener(AI_PROGRESS_EVENT, onProgress)
    window.addEventListener(AI_DONE_EVENT, onDone)
    return () => {
      window.removeEventListener(AI_PROGRESS_EVENT, onProgress)
      window.removeEventListener(AI_DONE_EVENT, onDone)
    }
  }, [])

  // 부모에서 단계만 바꾼 경우(목업 진행률 맵) 이벤트가 없을 때 기준 목표를 맞춤
  useEffect(() => {
    if (jobActive) return
    setLivePct((p) => {
      const t = clamp(targetProgress, 0, 100)
      if (Math.abs(p - t) > 12) return t
      return p
    })
  }, [activeStep, targetProgress, jobActive])

  useEffect(() => {
    if (!jobActive) {
      simDoneRef.current = false
      simPctRef.current = 0
      simStepRef.current = 'transcribe'
      return
    }

    setPipelineDone(false)
    simDoneRef.current = false
    simPctRef.current = 0
    simStepRef.current = 'transcribe'
    setLiveStep('transcribe')
    setLivePct(0)
    setLiveMessage('오디오 구간을 분석하는 중…')
    onAutomatedStepChange?.('transcribe')

    let cancelled = false
    let t = null

    const runStep = () => {
      if (cancelled || simDoneRef.current) return

      const step = simStepRef.current
      const tick = () => {
        if (cancelled || simDoneRef.current) return

        simPctRef.current = clamp(simPctRef.current + incForPct(simPctRef.current), 0, 100)
        setLivePct(simPctRef.current)
        setLiveMessage(
          step === 'transcribe'
            ? '음성을 텍스트로 변환하는 중…'
            : step === 'diarize'
              ? '화자별 구간을 나누는 중…'
              : '회의록 초안을 생성하는 중…',
        )

        if (simPctRef.current >= 100) {
          const idx = AI_STEPS.indexOf(step)
          const next = AI_STEPS[idx + 1]
          if (next) {
            simStepRef.current = next
            simPctRef.current = 0
            setLiveStep(next)
            onAutomatedStepChange?.(next)
            t = window.setTimeout(runStep, 180)
          } else {
            simDoneRef.current = true
            setLivePct(100)
            setLiveMessage('변환이 완료되었습니다.')
            setPipelineDone(true)
            onJobComplete?.()
          }
          return
        }

        t = window.setTimeout(tick, nextTickMs(simPctRef.current))
      }

      t = window.setTimeout(tick, 100)
    }

    runStep()

    return () => {
      cancelled = true
      if (t) window.clearTimeout(t)
    }
  }, [jobActive, onAutomatedStepChange, onJobComplete])

  const effectiveStep = jobActive ? liveStep : activeStep
  const effectiveLabel = stepsSlice.find((s) => s.id === effectiveStep)?.label ?? activeStepLabel

  const statusTone = useMemo(() => {
    if (pipelineDone) return 'done'
    if (jobActive) return 'running'
    return 'idle'
  }, [pipelineDone, jobActive])

  const statusText = pipelineDone ? '완료' : jobActive ? '처리 중' : '대기'

  const barPct = jobActive ? livePct : displayedPct

  const easeTarget = useMemo(() => {
    if (jobActive) return livePct
    return clamp(targetProgress, 0, 100)
  }, [jobActive, livePct, targetProgress])

  useEffect(() => {
    if (jobActive) return
    setDisplayedPct(easeTarget)
  }, [easeTarget, jobActive, activeStep])

  useEffect(() => {
    if (jobActive) return
    const id = window.setInterval(() => {
      setDisplayedPct((prev) => {
        const target = easeTarget
        const delta = target - prev
        if (Math.abs(delta) < 0.35) {
          const wobble = Math.sin(performance.now() / 700) * 1.8
          return clamp(target + wobble, 0, 100)
        }
        return prev + delta * 0.12
      })
    }, 220)
    return () => window.clearInterval(id)
  }, [easeTarget, jobActive])

  const onSelect = useCallback(
    (id) => {
      onSelectStep?.(id)
    },
    [onSelectStep],
  )

  return (
    <div
      className="rounded-lg border border-slate-200 bg-slate-50 p-3"
      role="region"
      aria-label="AI 변환 상태"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold text-slate-900">AI 변환 상태</div>
            <span
              className={cx(
                'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                statusTone === 'idle' && 'bg-slate-100 text-slate-700',
                statusTone === 'running' && 'bg-indigo-50 text-indigo-700',
                statusTone === 'done' && 'bg-emerald-50 text-emerald-700',
              )}
            >
              {statusText}
            </span>
          </div>
          <div className="mt-1 truncate text-xs text-slate-500">
            단계별 진행 · 실시간 반영
            {liveMessage ? <span className="font-medium text-slate-600"> · {liveMessage}</span> : null}
          </div>
        </div>
        <div className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">{Math.round(barPct)}%</div>
      </div>

      <div className="mt-2">
        <ProgressIndicator value={barPct} />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {stepsSlice.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={jobActive}
            title={jobActive ? 'AI 변환 중에는 단계를 바꿀 수 없습니다' : undefined}
            onClick={() => onSelect(s.id)}
            className={cx(
              'rounded-full px-2 py-0.5 text-xs font-semibold transition',
              jobActive && 'cursor-not-allowed opacity-80',
              statusForStep(effectiveStep, s.id, order) === 'done' && 'bg-emerald-50 text-emerald-700',
              statusForStep(effectiveStep, s.id, order) === 'in_progress' && 'bg-indigo-50 text-indigo-700',
              statusForStep(effectiveStep, s.id, order) === 'todo' && 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-600">
        현재 단계: <span className="font-medium text-slate-900">{effectiveLabel}</span>
      </div>
    </div>
  )
}
