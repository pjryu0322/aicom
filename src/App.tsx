import { useEffect, useMemo, useState } from 'react'
import { ExecutionProgress, type ExecutionStage } from './components/ExecutionProgress/ExecutionProgress'

type DemoStage = ExecutionStage

const demoStages: DemoStage[] = [
  { id: 'queued', label: 'Queued' },
  { id: 'running', label: 'Running' },
  { id: 'finalizing', label: 'Finalizing' },
  { id: 'done', label: 'Done' },
]

export function App() {
  const [activeId, setActiveId] = useState<string>('queued')
  const [status, setStatus] = useState<'running' | 'succeeded' | 'failed' | 'cancelled'>('running')

  const activeIndex = useMemo(() => demoStages.findIndex((s) => s.id === activeId), [activeId])
  const percent = useMemo(() => {
    if (activeIndex < 0) return 0
    if (status !== 'running') return 100
    return Math.round((activeIndex / (demoStages.length - 1)) * 100)
  }, [activeIndex, status])

  useEffect(() => {
    if (status !== 'running') return
    const t = setInterval(() => {
      setActiveId((prev) => {
        const idx = demoStages.findIndex((s) => s.id === prev)
        const next = Math.min(idx + 1, demoStages.length - 1)
        return demoStages[next]?.id ?? prev
      })
    }, 900)
    return () => clearInterval(t)
  }, [status])

  return (
    <div style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial', padding: 24 }}>
      <h1 style={{ margin: '0 0 16px' }}>Execution Progress</h1>

      <ExecutionProgress
        title="Task: Implement Execution Progress Display"
        status={status}
        percent={percent}
        stages={demoStages}
        activeStageId={activeId}
      />

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {demoStages.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setStatus('running')
              setActiveId(s.id)
            }}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#fff' }}
          >
            Set {s.label}
          </button>
        ))}
        <button
          onClick={() => setStatus('succeeded')}
          style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #16a34a', background: '#16a34a', color: '#fff' }}
        >
          Succeed
        </button>
        <button
          onClick={() => setStatus('failed')}
          style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #dc2626', background: '#dc2626', color: '#fff' }}
        >
          Fail
        </button>
        <button
          onClick={() => setStatus('cancelled')}
          style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #64748b', background: '#64748b', color: '#fff' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

