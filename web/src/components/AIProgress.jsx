import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../lib/utils'

const defaultStepOrder = ['upload', 'transcribe', 'diarize', 'draft']
const defaultLabels = {
  upload: '업로드',
  transcribe: '텍스트 변환(STT)',
  diarize: '화자 분리',
  draft: '회의록 초안 생성',
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function nextTickMs(pct) {
  // Faster early, slower near completion for a more natural feel.
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

/**
 * Global progress event helpers.
 *
 * Producers can do:
 *   emitAIProgress({ step: 'transcribe', pct: 17, message: '세그먼트 생성 중…' })
 *   emitAIDone({ result: { speakers: [{ name, role, lines: [{ ts, text }] }] } })
 */
export const AI_PROGRESS_EVENT = 'meeting-workspace:ai-progress'
export const AI_DONE_EVENT = 'meeting-workspace:ai-done'

export function emitAIProgress(detail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(AI_PROGRESS_EVENT, { detail }))
}

export function emitAIDone(detail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(AI_DONE_EVENT, { detail }))
}

export default function AIProgress({
  running = false,
  stepOrder = defaultStepOrder,
  initialStep = 'transcribe',
  labels,
  onStepChange,
  onProgress,
  onDone,
  showResult = true,
  className = '',
}) {
  const [step, setStep] = useState(initialStep)
  const [pct, setPct] = useState(0)
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const doneRef = useRef(false)
  const pctRef = useRef(0)

  const idx = useMemo(() => stepOrder.indexOf(step), [step, stepOrder])
  const stepLabel = (labels ?? defaultLabels)?.[step] ?? step

  useEffect(() => {
    // When restarted, reset internal state.
    if (!running) {
      doneRef.current = false
      setPct(0)
      setStep(initialStep)
      setMessage('')
      setResult(null)
      pctRef.current = 0
    }
  }, [running, initialStep])

  useEffect(() => {
    if (!running) return
    if (idx < 0) return
    if (doneRef.current) return

    let cancelled = false
    let t = null

    const tick = () => {
      if (cancelled) return
      setPct((prev) => {
        const next = clamp(prev + incForPct(prev), 0, 100)
        pctRef.current = next
        onProgress?.({ step, pct: next })
        if (next >= 100) {
          const nextStep = stepOrder[idx + 1]
          if (nextStep) {
            setStep(nextStep)
            onStepChange?.(nextStep)
            return 0
          }
          doneRef.current = true
          onDone?.()
          return 100
        }
        return next
      })

      t = window.setTimeout(tick, nextTickMs(pctRef.current))
    }

    t = window.setTimeout(tick, 120)
    return () => {
      cancelled = true
      if (t) window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, idx, step, stepOrder, onProgress, onStepChange, onDone])

  useEffect(() => {
    // Real-time updates via global events (preferred over mock timer).
    if (typeof window === 'undefined') return

    const onEvtProgress = (e) => {
      const detail = e?.detail ?? {}
      if (typeof detail.step === 'string') setStep(detail.step)
      if (Number.isFinite(detail.pct)) {
        const next = clamp(detail.pct, 0, 100)
        pctRef.current = next
        setPct(next)
        onProgress?.({ step: detail.step ?? step, pct: next, message: detail.message })
      }
      if (typeof detail.message === 'string') setMessage(detail.message)
    }

    const onEvtDone = (e) => {
      const detail = e?.detail ?? {}
      doneRef.current = true
      pctRef.current = 100
      setPct(100)
      if (typeof detail.message === 'string') setMessage(detail.message)
      if (detail.result) setResult(detail.result)
      onDone?.(detail)
    }

    window.addEventListener(AI_PROGRESS_EVENT, onEvtProgress)
    window.addEventListener(AI_DONE_EVENT, onEvtDone)
    return () => {
      window.removeEventListener(AI_PROGRESS_EVENT, onEvtProgress)
      window.removeEventListener(AI_DONE_EVENT, onEvtDone)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDone, onProgress])

  const status = useMemo(() => {
    if (!running) return { tone: 'idle', text: '대기 중' }
    if (doneRef.current) return { tone: 'done', text: '완료' }
    return { tone: 'running', text: '처리 중' }
  }, [running])

  return (
    <div className={cx('space-y-3', className)}>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-slate-900">AI 변환 상태</div>
              <span
                className={cx(
                  'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                  status.tone === 'idle' && 'bg-slate-100 text-slate-700',
                  status.tone === 'running' && 'bg-indigo-50 text-indigo-700',
                  status.tone === 'done' && 'bg-emerald-50 text-emerald-700',
                )}
              >
                {status.text}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              현재 단계: <span className="font-semibold text-slate-700">{stepLabel}</span>
              {message ? <span className="text-slate-400"> · {message}</span> : null}
            </div>
          </div>
          <div className="text-sm font-semibold tabular-nums text-slate-900">{pct}%</div>
        </div>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-slate-900 transition-[width]" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {showResult && doneRef.current && result ? (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">변환 결과</div>
              <div className="mt-1 text-xs text-slate-500">화자별 발언 내용을 정리했습니다.</div>
            </div>
            <div className="text-xs font-medium text-slate-500">완료</div>
          </div>

          {Array.isArray(result?.speakers) && result.speakers.length ? (
            <div className="mt-3 space-y-3">
              {result.speakers.map((sp, sIdx) => (
                <div key={sp.id ?? `${sp.name ?? 'speaker'}-${sIdx}`} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {sp.name ?? `화자 ${sIdx + 1}`}
                        {sp.role ? <span className="ml-1 text-xs font-medium text-slate-500">({sp.role})</span> : null}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      {Array.isArray(sp.lines) ? `${sp.lines.length}개 발언` : '발언'}
                    </span>
                  </div>
                  {Array.isArray(sp.lines) && sp.lines.length ? (
                    <ul className="mt-2 space-y-2">
                      {sp.lines.slice(0, 6).map((ln, lIdx) => (
                        <li key={ln.id ?? `${sIdx}-${lIdx}`} className="text-sm text-slate-800">
                          <span className="mr-2 text-xs font-medium text-slate-500">{ln.ts ?? ''}</span>
                          <span className="whitespace-pre-wrap">{ln.text ?? ''}</span>
                        </li>
                      ))}
                      {sp.lines.length > 6 ? (
                        <li className="text-xs font-medium text-slate-500">… {sp.lines.length - 6}개 더</li>
                      ) : null}
                    </ul>
                  ) : (
                    <div className="mt-2 text-sm text-slate-600">발언 내용이 없습니다.</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              표시할 결과가 없습니다.
            </div>
          )}
        </section>
      ) : null}
    </div>
  )
}

