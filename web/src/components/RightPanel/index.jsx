import React, { useState } from 'react'
import { useMeetingWorkspace } from '../Sidebar'
import { cx } from '../../lib/utils'
import SummaryTab from './SummaryTab'
import ScriptTab from './ScriptTab'

export default function RightPanel({ className = '' }) {
  const { selection } = useMeetingWorkspace()
  const [tab, setTab] = useState('summary')

  const selectedSpeakerId = selection?.kind === 'speaker' ? selection.id : null

  return (
    <section className={cx('rounded-xl border border-slate-200 bg-white', className)} aria-label="AI 문서 패널">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 p-3">
        <div className="text-sm font-semibold text-slate-900">AI 문서 패널</div>
        <div className="inline-flex rounded-lg bg-slate-100 p-1" role="tablist" aria-label="문서 보기">
          <button
            type="button"
            role="tab"
            id="right-panel-tab-trigger-summary"
            aria-selected={tab === 'summary'}
            aria-controls="right-panel-tab-summary"
            tabIndex={tab === 'summary' ? 0 : -1}
            onClick={() => setTab('summary')}
            className={cx(
              'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-150',
              tab === 'summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            )}
          >
            요약본
          </button>
          <button
            type="button"
            role="tab"
            id="right-panel-tab-trigger-script"
            aria-selected={tab === 'script'}
            aria-controls="right-panel-tab-script"
            tabIndex={tab === 'script' ? 0 : -1}
            onClick={() => setTab('script')}
            className={cx(
              'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors duration-150',
              tab === 'script' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            )}
          >
            스크립트
          </button>
        </div>
      </div>

      <div className="min-h-[200px]">
        {tab === 'summary' ? <SummaryTab key="summary" /> : <ScriptTab key="script" speakerId={selectedSpeakerId} />}
      </div>
    </section>
  )
}
