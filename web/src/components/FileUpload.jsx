import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '../lib/utils'

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.max(1, Math.round(kb))}KB`
  const mb = kb / 1024
  return `${mb.toFixed(mb < 10 ? 1 : 0)}MB`
}

function nowId() {
  return `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/**
 * FileUpload (prototype)
 * - Drag & drop / file picker
 * - Shows upload state inline (center panel friendly)
 * - Keeps an uploaded file list and updates it immediately
 *
 * Props are optional so this can be dropped into existing pages gradually.
 */
export default function FileUpload({
  accept = 'audio/*',
  multiple = false,
  maxFiles = 10,
  onUploadedFilesChange,
  onStatusChange,
  className = '',
}) {
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [dragOver, setDragOver] = useState(false)

  const uploadingCount = useMemo(() => items.filter((i) => i.status === 'uploading').length, [items])
  const lastStatus = useMemo(() => {
    if (!items.length) return { kind: 'idle', text: '파일을 선택하면 업로드 상태가 여기에 표시됩니다.' }
    const last = items[0]
    if (last.status === 'done') return { kind: 'done', text: `업로드 완료: ${last.name}` }
    if (last.status === 'error') return { kind: 'error', text: `업로드 실패: ${last.name}` }
    return { kind: 'uploading', text: `업로드 중… ${last.name} (${last.progress}%)` }
  }, [items])

  useEffect(() => {
    onUploadedFilesChange?.(items.filter((x) => x.status === 'done'))
  }, [items, onUploadedFilesChange])

  useEffect(() => {
    onStatusChange?.(lastStatus)
  }, [lastStatus, onStatusChange])

  function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function addFiles(files) {
    const incoming = Array.from(files ?? [])
    if (!incoming.length) return

    setItems((prev) => {
      const capacity = Math.max(0, maxFiles - prev.length)
      const sliced = incoming.slice(0, capacity)
      const nextAdds = sliced.map((f) => ({
        id: nowId(),
        name: f.name,
        size: f.size,
        type: f.type,
        status: 'uploading',
        progress: 0,
        file: f,
      }))
      const next = [...nextAdds, ...prev].slice(0, maxFiles)
      return next
    })

    // start mock upload for each file (stagger slightly so UI feels responsive)
    window.setTimeout(() => {
      setItems((prev) => {
        const pending = prev.filter((x) => x.status === 'uploading' && x.progress === 0)
        pending.forEach((it, idx) => window.setTimeout(() => startMockUpload(it.id), idx * 90))
        return prev
      })
    }, 0)
  }

  function startMockUpload(id) {
    let p = 0
    const tick = () => {
      // simple easing-ish increments
      const inc = p < 65 ? 10 : p < 85 ? 6 : 3
      p = Math.min(100, p + inc)
      updateItem(id, { progress: p, status: 'uploading' })
      if (p >= 100) {
        updateItem(id, { status: 'done', progress: 100 })
        return
      }
      window.setTimeout(tick, 140)
    }
    window.setTimeout(tick, 160)
  }

  function onPick(e) {
    const files = e.target.files
    addFiles(files)
    // allow picking the same file again
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  function remove(id) {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id)
      return next
    })
  }

  function clear() {
    setItems([])
  }

  return (
    <div className={cx('space-y-3', className)}>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900">파일 업로드</div>
            <div className="mt-1 text-xs text-slate-500">드래그&드롭 또는 파일 선택 (프로토타입: 실제 저장 없음)</div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cx(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                lastStatus.kind === 'idle' && 'bg-slate-100 text-slate-700',
                lastStatus.kind === 'uploading' && 'bg-indigo-50 text-indigo-700',
                lastStatus.kind === 'done' && 'bg-emerald-50 text-emerald-700',
                lastStatus.kind === 'error' && 'bg-rose-50 text-rose-700',
              )}
            >
              {lastStatus.kind === 'idle'
                ? '대기'
                : lastStatus.kind === 'uploading'
                  ? `업로드 중 ${uploadingCount}개`
                  : lastStatus.kind === 'done'
                    ? '완료'
                    : '오류'}
            </span>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
          {lastStatus.text}
        </div>

        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onClick={() => inputRef.current?.click()}
          onDragEnter={() => setDragOver(true)}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cx(
            'mt-3 rounded-xl border border-dashed p-4 transition',
            dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-white hover:bg-slate-50',
          )}
          aria-label="녹취 파일 업로드"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-900">파일 드롭존</div>
              <div className="mt-1 text-xs text-slate-500">클릭해서 선택하거나 여기로 끌어다 놓으세요.</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={onPick}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  inputRef.current?.click()
                }}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                파일 선택
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clear()
                }}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-900">업로드된 파일 목록</div>
          <div className="text-xs font-medium text-slate-500">{items.length}개</div>
        </div>

        {items.length ? (
          <ul className="mt-3 space-y-2">
            {items.map((it) => (
              <li key={it.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{it.name}</div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {formatBytes(it.size)} {it.type ? `· ${it.type}` : ''}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cx(
                        'rounded-full px-2 py-0.5 text-xs font-semibold',
                        it.status === 'uploading' && 'bg-indigo-50 text-indigo-700',
                        it.status === 'done' && 'bg-emerald-50 text-emerald-700',
                        it.status === 'error' && 'bg-rose-50 text-rose-700',
                      )}
                    >
                      {it.status === 'uploading' ? `업로드 ${it.progress}%` : it.status === 'done' ? '완료' : '오류'}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(it.id)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      제거
                    </button>
                  </div>
                </div>

                {it.status === 'uploading' ? (
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-[width]"
                      style={{ width: `${it.progress}%` }}
                    />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            아직 업로드된 파일이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

