import React from 'react'
import { cx } from '../../lib/utils'

/**
 * 녹취 파일 업로드 카드 (드래그앤드롭 · 파일 선택)
 */
export default function UploadCard({
  fileInputRef,
  uploading = false,
  selectedFile = null,
  onPickFile,
  onDropFile,
  onReset,
  onBrowse,
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropFile}
      className={cx(
        'rounded-xl border border-dashed bg-slate-50 p-4',
        uploading ? 'border-slate-300' : 'border-slate-300 hover:border-slate-400',
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onBrowse?.()
      }}
      onClick={() => onBrowse?.()}
      aria-label="녹취 파일 업로드"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">업로드 카드</div>
          <div className="mt-1 text-xs text-slate-500">
            파일을 드래그앤드롭하거나 클릭해서 선택하세요. (프로토타입: 실제 저장은 하지 않아요)
          </div>
          {selectedFile ? (
            <div className="mt-2 text-xs font-medium text-slate-700">선택됨: {selectedFile.name}</div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
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
              uploading ? 'bg-slate-200 text-slate-500' : 'bg-indigo-600 text-white hover:bg-indigo-500',
            )}
          >
            {uploading ? '업로드 중…' : '파일 선택'}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onReset?.()
            }}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}
