import React from 'react'
import { cx } from '../../lib/utils'

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${Math.max(1, Math.round(kb))} KB`
  const mb = kb / 1024
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`
}

/**
 * 녹취 파일 선택 영역: 드래그앤드롭, 파일 입력, 업로드 진행률 표시
 */
export default function UploadForm({
  fileInputRef,
  uploading = false,
  uploadProgress = 0,
  selectedFile = null,
  dragOver = false,
  onPickFile,
  onDropFile,
  onReset,
  onBrowse,
  onDragEnter,
  onDragLeave,
}) {
  const showProgress = uploading || uploadProgress > 0
  const clamped = Math.min(100, Math.max(0, uploadProgress))

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropFile}
      className={cx(
        'rounded-xl border border-dashed p-4 transition-colors',
        dragOver ? 'border-indigo-400 bg-indigo-50/80' : 'border-slate-300 bg-slate-50 hover:border-slate-400',
        uploading && 'pointer-events-none opacity-95',
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (uploading) return
        if (e.key === 'Enter' || e.key === ' ') onBrowse?.()
      }}
      onClick={() => !uploading && onBrowse?.()}
      aria-label="녹취 파일 업로드"
      aria-busy={uploading}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900">녹취 파일 업로드</div>
          <p className="mt-1 text-xs text-slate-500">
            오디오 파일을 드래그해서 놓거나, 영역을 클릭해 선택하세요. (프로토타입: 브라우저 내 시뮬레이션)
          </p>
          {selectedFile && !uploading ? (
            <p className="mt-2 truncate text-xs font-medium text-slate-700">
              선택됨: {selectedFile.name}
              {selectedFile.size ? ` · ${formatBytes(selectedFile.size)}` : ''}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={onPickFile} />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onBrowse?.()
            }}
            disabled={uploading}
            className={cx(
              'rounded-md px-3 py-2 text-sm font-semibold',
              uploading ? 'cursor-not-allowed bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-500',
            )}
          >
            {uploading ? '업로드 중…' : '파일 선택'}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={(e) => {
              e.stopPropagation()
              onReset?.()
            }}
            className={cx(
              'rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50',
              uploading && 'cursor-not-allowed opacity-60',
            )}
          >
            초기화
          </button>
        </div>
      </div>

      {showProgress ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-slate-800">
              {uploading ? '업로드 진행 중' : uploadProgress >= 100 ? '업로드 완료' : '대기'}
            </span>
            <span className="font-mono font-medium text-indigo-700">{Math.round(clamped)}%</span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={Math.round(clamped)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full bg-indigo-600 transition-[width] duration-150 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>
          {selectedFile && uploading ? (
            <p className="mt-2 truncate text-xs text-slate-600">{selectedFile.name}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
