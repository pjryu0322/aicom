import React from 'react'
import { mockSummary } from '../../lib/mockData'

/**
 * 회의 요약본: 핵심 안건, 결정사항, 할 일
 */
export default function SummaryTab() {
  return (
    <div className="p-3" role="tabpanel" id="right-panel-tab-summary" aria-labelledby="right-panel-tab-trigger-summary">
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 text-sm font-semibold text-slate-900">핵심 안건</div>
          <ul className="space-y-1 text-sm text-slate-800">
            {mockSummary.agenda.map((a) => (
              <li key={a.id} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 text-sm font-semibold text-slate-900">결정사항</div>
          <ul className="space-y-1 text-sm text-slate-800">
            {mockSummary.decisions.map((d) => (
              <li key={d.id} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{d.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 text-sm font-semibold text-slate-900">할 일</div>
          <div className="space-y-2">
            {mockSummary.todos.map((t) => (
              <div key={t.id} className="rounded-lg bg-slate-50 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">{t.text}</div>
                  <div className="text-xs font-medium text-slate-500">{t.due}</div>
                </div>
                <div className="mt-1 text-xs text-slate-600">담당: {t.owner}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
