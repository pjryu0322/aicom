import React, { useMemo, useState } from 'react'
import { cx } from '../lib/utils'

function toNumberTs(ts) {
  // Expected forms: "HH:MM:SS", "MM:SS", "SS", or already numeric-ish.
  if (typeof ts === 'number') return ts
  if (!ts) return 0
  const raw = String(ts).trim()
  if (!raw) return 0
  const parts = raw.split(':').map((p) => Number(p))
  if (parts.some((n) => Number.isNaN(n))) return 0
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 1) return parts[0]
  return 0
}

function colorBadgeClass(color) {
  return cx(
    'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
    color === 'indigo' && 'bg-indigo-50 text-indigo-700',
    color === 'emerald' && 'bg-emerald-50 text-emerald-700',
    color === 'amber' && 'bg-amber-50 text-amber-800',
    color === 'violet' && 'bg-violet-50 text-violet-700',
    color === 'sky' && 'bg-sky-50 text-sky-700',
    color === 'rose' && 'bg-rose-50 text-rose-700',
    !color && 'bg-slate-100 text-slate-700',
  )
}

/**
 * 화자별 발언 목록
 *
 * Props(호환성 중심):
 * - transcript: [{ id, ts, speakerId, text, speakerName?, speakerRole?, speakerColor? }]
 * - speakers: [{ id, name, role, color }]
 * - getSpeaker: (speakerId) => { id, name, role, color }
 * - onChange: (nextTranscript) => void
 * - onEditLine: ({ id, text, prevText }) => void
 */
export default function SpeakerTranscript({
  transcript = [],
  speakers,
  getSpeaker,
  onChange,
  onEditLine,
  readOnly = false,
}) {
  const speakerById = useMemo(() => {
    if (!Array.isArray(speakers)) return null
    const map = new Map()
    for (const sp of speakers) {
      if (!sp?.id) continue
      map.set(sp.id, sp)
    }
    return map
  }, [speakers])

  const resolvedLines = useMemo(() => {
    const lines = Array.isArray(transcript) ? transcript : []
    return lines
      .filter((l) => l && (l.id || l.ts || l.text))
      .map((l, idx) => {
        const speakerId = l.speakerId ?? l.speaker?.id ?? 'unknown'
        const sp =
          (speakerById && speakerById.get(speakerId)) ||
          (typeof getSpeaker === 'function' ? getSpeaker(speakerId) : null) ||
          null

        return {
          id: l.id ?? `${speakerId}:${l.ts ?? ''}:${idx}`,
          ts: l.ts ?? '',
          tsNum: toNumberTs(l.ts),
          speakerId,
          speakerName: l.speakerName ?? sp?.name ?? l.speaker?.name ?? '알 수 없음',
          speakerRole: l.speakerRole ?? sp?.role ?? l.speaker?.role ?? '',
          speakerColor: l.speakerColor ?? sp?.color ?? l.speaker?.color ?? null,
          text: l.text ?? '',
        }
      })
      .sort((a, b) => a.tsNum - b.tsNum)
  }, [transcript, speakerById, getSpeaker])

  const grouped = useMemo(() => {
    const groups = new Map()
    for (const line of resolvedLines) {
      const key = line.speakerId ?? 'unknown'
      if (!groups.has(key)) {
        groups.set(key, {
          speakerId: key,
          speakerName: line.speakerName,
          speakerRole: line.speakerRole,
          speakerColor: line.speakerColor,
          lines: [],
        })
      }
      groups.get(key).lines.push(line)
    }
    return Array.from(groups.values()).sort((a, b) => a.speakerName.localeCompare(b.speakerName))
  }, [resolvedLines])

  const [draftById, setDraftById] = useState(() => new Map())
  const [editingId, setEditingId] = useState(null)

  function startEdit(lineId, currentText) {
    if (readOnly) return
    setEditingId(lineId)
    setDraftById((prev) => {
      if (prev.has(lineId)) return prev
      const next = new Map(prev)
      next.set(lineId, currentText ?? '')
      return next
    })
  }

  function commitEdit(lineId) {
    if (readOnly) return
    const nextText = draftById.get(lineId)
    const prevLine = resolvedLines.find((l) => l.id === lineId)
    const prevText = prevLine?.text ?? ''
    if (typeof nextText !== 'string') {
      setEditingId(null)
      return
    }

    if (nextText !== prevText) {
      const nextTranscript = (Array.isArray(transcript) ? transcript : []).map((l) =>
        (l?.id ?? null) === lineId ? { ...l, text: nextText } : l,
      )
      if (typeof onChange === 'function') onChange(nextTranscript)
      if (typeof onEditLine === 'function') onEditLine({ id: lineId, text: nextText, prevText })
    }

    setEditingId(null)
  }

  function cancelEdit(lineId) {
    setEditingId(null)
    setDraftById((prev) => {
      if (!prev.has(lineId)) return prev
      const next = new Map(prev)
      next.delete(lineId)
      return next
    })
  }

  if (!resolvedLines.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="text-sm font-semibold text-slate-900">화자별 발언 목록</div>
        <div className="mt-1 text-sm text-slate-600">아직 변환된 스크립트가 없어요. 녹취 파일을 업로드하고 변환을 진행해 주세요.</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {grouped.map((g) => (
        <div key={g.speakerId} className="rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">
                {g.speakerName}{' '}
                {g.speakerRole ? <span className="text-xs font-medium text-slate-500">({g.speakerRole})</span> : null}
              </div>
              <div className="text-xs text-slate-500">발언 {g.lines.length}개</div>
            </div>
            <span className={colorBadgeClass(g.speakerColor)}>{g.speakerName}</span>
          </div>

          <div className="divide-y divide-slate-100">
            {g.lines.map((l) => {
              const isEditing = editingId === l.id
              const draft = draftById.get(l.id) ?? l.text
              return (
                <div key={l.id} className="px-3 py-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-medium tabular-nums text-slate-500">{l.ts || '—'}</div>
                        {!readOnly ? (
                          <button
                            type="button"
                            onClick={() => startEdit(l.id, l.text)}
                            className={cx(
                              'rounded-md border px-2 py-0.5 text-xs font-semibold transition',
                              isEditing
                                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
                            )}
                          >
                            {isEditing ? '편집 중' : '수정'}
                          </button>
                        ) : null}
                      </div>

                      {isEditing ? (
                        <div className="mt-1">
                          <textarea
                            value={draft}
                            onChange={(e) =>
                              setDraftById((prev) => {
                                const next = new Map(prev)
                                next.set(l.id, e.target.value)
                                return next
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                e.preventDefault()
                                cancelEdit(l.id)
                              }
                              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault()
                                commitEdit(l.id)
                              }
                            }}
                            onBlur={() => commitEdit(l.id)}
                            rows={2}
                            className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                            aria-label="발언 내용 수정"
                          />
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>Ctrl/⌘+Enter 저장</span>
                            <span>Esc 취소</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cx(
                            'mt-1 whitespace-pre-wrap text-sm text-slate-800',
                            !readOnly && 'cursor-text',
                          )}
                          onDoubleClick={() => startEdit(l.id, l.text)}
                        >
                          {l.text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

