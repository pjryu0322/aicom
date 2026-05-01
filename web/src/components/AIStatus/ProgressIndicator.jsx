import React, { useEffect, useState } from 'react'
import { cx } from '../../lib/utils'

/**
 * Accessible progress bar for AI conversion (determinate or indeterminate).
 */
export default function ProgressIndicator({
  value = 0,
  indeterminate = false,
  className = '',
  trackClassName = 'bg-slate-200',
  fillClassName = 'bg-slate-900',
  'aria-label': ariaLabel = 'AI 변환 진행률',
}) {
  const clamped = Math.min(100, Math.max(0, value))
  const rounded = Math.round(clamped)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    if (!indeterminate) return
    let raf = 0
    const start = performance.now()
    const duration = 1400

    const tick = (now) => {
      const t = ((now - start) % duration) / duration
      // Sweep a segment across the track (0 = left edge off-screen, 1 = right)
      setSlide(t)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [indeterminate])

  const segmentPct = 36
  const translatePct = indeterminate ? slide * (100 + segmentPct) - segmentPct : 0

  return (
    <div
      className={cx('relative h-2 w-full overflow-hidden rounded-full', trackClassName, className)}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : rounded}
      aria-busy={indeterminate}
    >
      <div
        className={cx('h-full rounded-full', fillClassName, !indeterminate && 'transition-[width] duration-200 ease-out')}
        style={
          indeterminate
            ? {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${segmentPct}%`,
                transform: `translateX(${translatePct}%)`,
              }
            : {
                width: `${clamped}%`,
              }
        }
      />
    </div>
  )
}
