import Sidebar, { MeetingWorkspaceProvider } from './Sidebar'
import MainContent from './MainContent'
import RightPanel from '../components/RightPanel'

/**
 * Responsive SaaS workspace shell (meeting-workspace template).
 *
 * - Below `lg`: single column stack (sidebar → main → right panel)
 * - `lg` and up: three columns (fixed sidebar / fluid main / fixed right panel)
 */
export default function AppLayout({
  template = 'meeting-workspace',
  title,
  subtitle,
  detail,
  actions,
  left,
  center,
  right,
  className = '',
  contentClassName = '',
  meetingWorkspaceKey,
  meetingWorkspaceProviderProps,
}) {
  const isMeetingWorkspace = template === 'meeting-workspace'
  const resolvedLeft = isMeetingWorkspace ? left ?? <Sidebar /> : left
  const resolvedCenter = isMeetingWorkspace ? center ?? <MainContent /> : center
  const resolvedRight = isMeetingWorkspace ? right ?? <RightPanel /> : right

  const content = (
    <div className={`min-h-[calc(100svh-56px)] bg-slate-50 ${className}`.trim()}>
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-6">
        {(title || subtitle || detail || actions) && (
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
              {title ? (
                <div className="truncate text-lg font-semibold text-slate-900">{title}</div>
              ) : null}
              {detail ? <div className="mt-0.5 text-xs text-slate-500">{detail}</div> : null}
            </div>
            {actions ? <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
          </div>
        )}

        <div
          className={[
            'grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,280px),minmax(0,1fr),minmax(280px,360px)]',
            contentClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <aside className="min-w-0 space-y-3 lg:max-h-[calc(100svh-56px-2rem)] lg:overflow-y-auto">
            {resolvedLeft}
          </aside>
          <main className="min-w-0 lg:max-h-[calc(100svh-56px-2rem)] lg:overflow-y-auto">{resolvedCenter}</main>
          <aside className="min-w-0 lg:max-h-[calc(100svh-56px-2rem)] lg:overflow-y-auto">
            {resolvedRight}
          </aside>
        </div>
      </div>
    </div>
  )

  if (!isMeetingWorkspace) {
    return content
  }

  return (
    <MeetingWorkspaceProvider key={meetingWorkspaceKey} {...meetingWorkspaceProviderProps}>
      {content}
    </MeetingWorkspaceProvider>
  )
}
