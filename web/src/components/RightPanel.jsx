import React, { useMemo, useState } from 'react'
import { useMeetingWorkspace } from './Sidebar'
import { getSpeaker, mockSummary, mockTranscript } from '../lib/mockData'
import { cx } from '../lib/utils'

function SummaryTab() {
  return (
    <div className="p-3">
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="mb-2 text-sm font-semibold text-slate-900">핵심 안건</div>
          <ul className="space-y-1 text-sm text-slate-800">
            {mockSummary.agenda.map((a) => (
              <li key={a.id} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
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
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
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

function ScriptTab({ speakerId }) {
  const lines = useMemo(() => {
    if (!speakerId) return mockTranscript
    return mockTranscript.filter((l) => l.speakerId === speakerId)
  }, [speakerId])

  const speaker = speakerId ? getSpeaker(speakerId) : null

  return (
    <div className="p-3">
      <div className="mb-2 flex items-end justify-between gap-2">
        <div className="text-sm font-semibold text-slate-900">화자별 발언 목록</div>
        {speaker ? (
          <div className="text-xs font-medium text-slate-500">
            필터: <span className="font-semibold text-slate-900">{speaker.name}</span>
          </div>
        ) : null}
      </div>

      {lines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          선택된 화자의 발언이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {lines.map((l) => {
            const sp = getSpeaker(l.speakerId)
            return (
              <div key={l.id} className="rounded-lg border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {sp.name} <span className="text-xs font-medium text-slate-500">({sp.role})</span>
                    </div>
                    <div className="text-xs text-slate-500">{l.ts}</div>
                  </div>
                  <span
                    className={cx(
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                      sp.color === 'indigo' && 'bg-indigo-50 text-indigo-700',
                      sp.color === 'emerald' && 'bg-emerald-50 text-emerald-700',
                      sp.color === 'amber' && 'bg-amber-50 text-amber-800',
                      sp.color === 'violet' && 'bg-violet-50 text-violet-700',
                      sp.color === 'sky' && 'bg-sky-50 text-sky-700',
                      sp.color === 'rose' && 'bg-rose-50 text-rose-700',
                    )}
                  >
                    {sp.name}
                  </span>
                </div>
                <div className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{l.text}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function RightPanel({ className = '' }) {
  const { selection } = useMeetingWorkspace()
  const [tab, setTab] = useState('summary')

  const selectedSpeakerId = selection?.kind === 'speaker' ? selection.id : null

  return (
    <section className={cx('rounded-xl border border-slate-200 bg-white', className)}>
      <div className="flex items-center justify-between border-b border-slate-200 p-3">
        <div className="text-sm font-semibold text-slate-900">AI 문서 패널</div>
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setTab('summary')}
            className={cx(
              'rounded-md px-3 py-1.5 text-sm font-semibold transition',
              tab === 'summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            )}
          >
            요약본
          </button>
          <button
            type="button"
            onClick={() => setTab('script')}
            className={cx(
              'rounded-md px-3 py-1.5 text-sm font-semibold transition',
              tab === 'script' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
            )}
          >
            스크립트
          </button>
        </div>
      </div>

      {tab === 'summary' ? <SummaryTab /> : <ScriptTab speakerId={selectedSpeakerId} />}
    </section>
  )
}

