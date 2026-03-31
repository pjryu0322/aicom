import { useId, useMemo } from 'react'

export type ExecutionStatus = 'running' | 'succeeded' | 'failed' | 'cancelled'

export type ExecutionStage = {
  id: string
  label: string
}

export type ExecutionProgressProps = {
  title?: string
  status: ExecutionStatus
  percent?: number
  stages?: ExecutionStage[]
  activeStageId?: string
  className?: string
}

function clampPercent(percent: number) {
  if (Number.isNaN(percent)) return 0
  return Math.max(0, Math.min(100, Math.round(percent)))
}

function statusLabel(status: ExecutionStatus) {
  switch (status) {
    case 'running':
      return 'Running'
    case 'succeeded':
      return 'Succeeded'
    case 'failed':
      return 'Failed'
    case 'cancelled':
      return 'Cancelled'
  }
}

function statusColor(status: ExecutionStatus) {
  switch (status) {
    case 'running':
      return { bg: '#dbeafe', fg: '#1d4ed8', border: '#93c5fd' }
    case 'succeeded':
      return { bg: '#dcfce7', fg: '#166534', border: '#86efac' }
    case 'failed':
      return { bg: '#fee2e2', fg: '#991b1b', border: '#fca5a5' }
    case 'cancelled':
      return { bg: '#f1f5f9', fg: '#334155', border: '#cbd5e1' }
  }
}

function stageState(status: ExecutionStatus, stageIndex: number, activeIndex: number) {
  if (status === 'failed' || status === 'cancelled') {
    if (stageIndex < activeIndex) return 'complete'
    if (stageIndex === activeIndex) return 'current'
    return 'pending'
  }

  if (status === 'succeeded') return 'complete'
  if (stageIndex < activeIndex) return 'complete'
  if (stageIndex === activeIndex) return 'current'
  return 'pending'
}

export function ExecutionProgress(props: ExecutionProgressProps) {
  const { title, status, stages, activeStageId, className } = props
  const ariaId = useId()

  const activeIndex = useMemo(() => {
    if (!stages?.length || !activeStageId) return -1
    return stages.findIndex((s) => s.id === activeStageId)
  }, [stages, activeStageId])

  const computedPercent = useMemo(() => {
    if (typeof props.percent === 'number') return clampPercent(props.percent)
    if (!stages?.length) return status === 'running' ? 0 : 100
    if (status !== 'running') return 100
    const denom = Math.max(1, stages.length - 1)
    const idx = Math.max(0, activeIndex)
    return clampPercent((idx / denom) * 100)
  }, [props.percent, stages, status, activeIndex])

  const badge = statusColor(status)

  return (
    <section
      className={className}
      aria-labelledby={ariaId}
      style={{
        width: 'min(720px, 100%)',
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        padding: 16,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <header style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h2 id={ariaId} style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            {title ?? 'Execution'}
          </h2>
          <div style={{ marginTop: 4, color: '#6b7280', fontSize: 13 }}>
            {status === 'running' ? 'In progress' : 'Completed'}
          </div>
        </div>

        <span
          role="status"
          aria-label={`Execution status: ${statusLabel(status)}`}
          style={{
            flex: 'none',
            padding: '4px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            background: badge.bg,
            color: badge.fg,
            border: `1px solid ${badge.border}`,
          }}
        >
          {statusLabel(status)}
        </span>
      </header>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>Progress</div>
          <div aria-label="Percent complete" style={{ fontVariantNumeric: 'tabular-nums', color: '#6b7280', fontSize: 12 }}>
            {computedPercent}%
          </div>
        </div>

        <div
          role="progressbar"
          aria-label="Execution progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={computedPercent}
          style={{
            marginTop: 8,
            height: 10,
            borderRadius: 999,
            overflow: 'hidden',
            background: '#e5e7eb',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${computedPercent}%`,
              background: status === 'failed' ? '#dc2626' : status === 'cancelled' ? '#64748b' : '#2563eb',
              transition: 'width 200ms ease',
            }}
          />
        </div>
      </div>

      {stages?.length ? (
        <ol style={{ margin: '14px 0 0', padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {stages.map((s, idx) => {
            const state = stageState(status, idx, Math.max(0, activeIndex))
            const dotColor =
              state === 'complete' ? '#16a34a' : state === 'current' ? '#2563eb' : '#9ca3af'

            return (
              <li
                key={s.id}
                aria-current={state === 'current' ? 'step' : undefined}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: dotColor,
                    boxShadow: '0 0 0 3px rgba(37,99,235,0.10)',
                  }}
                />
                <span style={{ fontSize: 13, color: state === 'pending' ? '#6b7280' : '#111827', fontWeight: 600 }}>
                  {s.label}
                </span>
              </li>
            )
          })}
        </ol>
      ) : null}
    </section>
  )
}

