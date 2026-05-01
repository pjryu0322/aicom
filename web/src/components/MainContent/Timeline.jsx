import React from 'react'
import { cx } from '../../lib/utils'

/**
 * 대화·작업 타임라인 (시스템 / 사용자 / 화자 발언)
 *
 * @param {Array<{
 *   id: string
 *   ts: string
 *   kind: 'system' | 'human' | 'speaker'
 *   text: string
 *   speakerName?: string
 *   speakerRole?: string
 *   speakerColor?: string
 * }>} entries
 */
export default function Timeline({ entries = [], className = '' }) {
  return (
    <div className={cx('space-y-3', className)}>
      {entries.map((m) => {
        const isSpeaker = m.kind === 'speaker'
        const isSystem = m.kind === 'system'
        return (
          <div
            key={m.id}
            className={cx(
              'flex gap-3 rounded-xl border p-3',
              isSystem && 'border-indigo-200 bg-indigo-50',
              !isSystem && isSpeaker && 'border-slate-200 bg-white',
              m.kind === 'human' && 'border-slate-200 bg-white',
            )}
          >
            <div
              className={cx(
                'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                isSystem && 'bg-indigo-600 text-white',
                m.kind === 'human' && 'bg-slate-900 text-white',
                isSpeaker && 'bg-slate-100 text-slate-700',
              )}
              aria-hidden
            >
              {isSpeaker ? (m.speakerName?.slice(0, 1) ?? '?') : isSystem ? 'AI' : '나'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-slate-900">
                  {isSpeaker
                    ? m.speakerName ?? '화자'
                    : isSystem
                      ? 'AI 에이전트'
                      : '회의록 작성자'}
                </div>
                {isSpeaker && m.speakerRole ? (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {m.speakerRole}
                  </span>
                ) : null}
                {isSpeaker && m.speakerColor ? (
                  <span
                    className={cx(
                      'h-2 w-2 shrink-0 rounded-full',
                      m.speakerColor === 'indigo' && 'bg-indigo-500',
                      m.speakerColor === 'emerald' && 'bg-emerald-500',
                      m.speakerColor === 'amber' && 'bg-amber-500',
                      m.speakerColor === 'violet' && 'bg-violet-500',
                      m.speakerColor === 'sky' && 'bg-sky-500',
                      m.speakerColor === 'rose' && 'bg-rose-500',
                    )}
                    aria-hidden
                  />
                ) : null}
                <div className="text-xs text-slate-500">{m.ts}</div>
              </div>
              <div className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{m.text}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
