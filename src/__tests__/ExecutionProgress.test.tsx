import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExecutionProgress } from '../components/ExecutionProgress';

describe('ExecutionProgress', () => {
  it('renders a determinate bar when percent is provided', () => {
    render(<ExecutionProgress label="Sync" status="running" percent={42} />);
    const bar = screen.getByRole('progressbar', { name: 'Sync' });
    expect(bar).toHaveAttribute('aria-valuenow', '42');
    expect(screen.getAllByText('42%').length).toBeGreaterThan(0);
  });

  it('renders an indeterminate bar when percent is not provided', () => {
    render(<ExecutionProgress label="Sync" status="running" />);
    const bar = screen.getByRole('progressbar', { name: 'Sync' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('renders step progress when provided', () => {
    render(<ExecutionProgress label="ETL" status="running" currentStep={2} totalSteps={5} />);
    expect(screen.getAllByText('2/5').length).toBeGreaterThan(0);
  });

  it('renders terminal statuses', () => {
    const { rerender } = render(<ExecutionProgress label="Job" status="succeeded" percent={100} />);
    expect(screen.getAllByText('Succeeded').length).toBeGreaterThan(0);
    rerender(<ExecutionProgress label="Job" status="failed" />);
    expect(screen.getAllByText('Failed').length).toBeGreaterThan(0);
    rerender(<ExecutionProgress label="Job" status="cancelled" />);
    expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);
  });
});

