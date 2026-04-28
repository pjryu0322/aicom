import type { ReactNode } from 'react'

export function SidebarSection({
  title,
  right,
  children,
}: {
  title: string
  right?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {right ? <div className="text-xs text-slate-500">{right}</div> : null}
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

