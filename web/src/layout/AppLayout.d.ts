import type { ReactNode } from 'react'

export interface AppLayoutProps {
  template?: string
  title?: ReactNode
  subtitle?: ReactNode
  detail?: ReactNode
  actions?: ReactNode
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
  className?: string
  contentClassName?: string
  meetingWorkspaceKey?: string
  meetingWorkspaceProviderProps?: Record<string, unknown>
  children?: ReactNode
}

declare function AppLayout(props: AppLayoutProps): ReactNode
export default AppLayout
