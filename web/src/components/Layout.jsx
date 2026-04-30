import React from 'react'

/**
 * App shell layout for the meeting workspace.
 *
 * - Desktop (lg+): 3 columns (left / center / right)
 * - Mobile/tablet: single column stack
 */
export default function Layout({
  title,
  subtitle,
  actions,
  left,
  center,
  right,
  className = '',
  contentClassName = '',
}) {
  return (
    <div className={`min-h-[calc(100svh-56px)] bg-slate-50 ${className}`.trim()}>
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-6">
        {(title || subtitle || actions) && (
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
              {title ? <div className="truncate text-lg font-semibold text-slate-900">{title}</div> : null}
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
        )}

        <div
          className={[
            'grid grid-cols-1 gap-3 lg:grid-cols-[280px,1fr,360px]',
            contentClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <aside className="space-y-3">{left}</aside>
          <main className="min-w-0">{center}</main>
          <aside className="min-w-0">{right}</aside>
        </div>
      </div>
    </div>
  )
}

