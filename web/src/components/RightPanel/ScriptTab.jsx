import React, { useMemo } from 'react'
import { getSpeaker, mockTranscript } from '../../lib/mockData'
import { cx } from '../../lib/utils'

/**
 * 화자별 스크립트(발언) 목록. 좌측에서 화자를 선택하면 해당 화자만 필터링됩니다.
 */
export default function ScriptTab({ speakerId }) {
  const lines = useMemo(() => {
    if (!speakerId) return mockTranscript
    return mockTranscript.filter((l) => l.speakerId === speakerId)
  }, [speakerId])

  const speaker = speakerId ? getSpeaker(speakerId) : null

  return (
    <div className="p-3" role="tabpanel" id="right-panel-tab-script" aria-labelledby="right-panel-tab-trigger-script">
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
