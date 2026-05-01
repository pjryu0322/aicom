import React, { useEffect, useMemo, useState } from 'react'
import { cx } from '../../lib/utils'

function statusForStep(active, step, order) {
  const ai = order.indexOf(active)
  const si = order.indexOf(step)
  if (si < ai) return 'done'
  if (si === ai) return 'in_progress'
  return 'todo'
}

/**
 * AI 변환 단계·진행률 (실시간으로 표시 값이 갱신됨)
 *
 * @param {string} activeStep
 * @param {number} targetProgress — 단계별 목표 진행률(정적 목업)
 * @param {string} activeStepLabel
 * @param {{ id: string; label: string }[]} stepsSlice — 표시할 단계 버튼들
 * @param {(stepId: string) => void} onSelectStep
 */
export default function AIStatus({
  activeStep,
  targetProgress = 0,
  activeStepLabel,
  stepsSlice = [],
  onSelectStep,
}) {
  const order = useMemo(() => stepsSlice.map((s) => s.id), [stepsSlice])
  const [displayedPct, setDisplayedPct] = useState(() => targetProgress)

  useEffect(() => {
    setDisplayedPct(targetProgress)
  }, [activeStep, targetProgress])

  useEffect(() => {
    const id = window.setInterval(() => {
      setDisplayedPct((prev) => {
        const target = targetProgress
        const delta = target - prev
        if (Math.abs(delta) < 0.35) {
          const wobble = Math.sin(performance.now() / 700) * 1.8
          return Math.min(100, Math.max(0, target + wobble))
        }
        return prev + delta * 0.12
      })
    }, 220)
    return () => window.clearInterval(id)
  }, [targetProgress])

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">AI 변환 상태</div>
          <div className="text-xs text-slate-500">단계별 진행률 · 실시간 갱신(목업)</div>
        </div>
        <div className="text-sm font-semibold tabular-nums text-slate-900">
          {Math.round(displayedPct)}%
        </div>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-slate-900 transition-[width] duration-200 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, displayedPct))}%` }}
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {stepsSlice.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelectStep?.(s.id)}
            className={cx(
              'rounded-full px-2 py-0.5 text-xs font-semibold transition',
              statusForStep(activeStep, s.id, order) === 'done' && 'bg-emerald-50 text-emerald-700',
              statusForStep(activeStep, s.id, order) === 'in_progress' && 'bg-indigo-50 text-indigo-700',
              statusForStep(activeStep, s.id, order) === 'todo' && 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-600">
        현재 단계: <span className="font-medium text-slate-900">{activeStepLabel}</span>
      </div>
    </div>
  )
}
