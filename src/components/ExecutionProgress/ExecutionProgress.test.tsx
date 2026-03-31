import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ExecutionProgress, type ExecutionStage } from './ExecutionProgress'

const stages: ExecutionStage[] = [
  { id: 'queued', label: 'Queued' },
  { id: 'running', label: 'Running' },
  { id: 'done', label: 'Done' },
]

describe('ExecutionProgress', () => {
  it('renders title, status, and percent', () => {
    render(<ExecutionProgress title="My Task" status="running" percent={42} stages={stages} activeStageId="running" />)

    expect(screen.getByText('My Task')).toBeInTheDocument()
    expect(screen.getByLabelText('Execution status: Running')).toBeInTheDocument()
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  })

  it('marks active stage', () => {
    render(<ExecutionProgress status="running" percent={10} stages={stages} activeStageId="running" />)

    const active = screen.getAllByRole('listitem', { current: 'step' })[0]
    expect(active).toHaveTextContent('Running')
  })

  it('shows terminal state for succeeded', () => {
    render(<ExecutionProgress status="succeeded" percent={100} stages={stages} activeStageId="done" />)
    expect(screen.getByText('Succeeded')).toBeInTheDocument()
  })
})

