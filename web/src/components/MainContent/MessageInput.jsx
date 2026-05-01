import React from 'react'

/**
 * 타임라인 하단 메시지 입력
 */
export default function MessageInput({
  value,
  onChange,
  onSend,
  onKeyDown,
  placeholder = '메시지를 입력하세요… (Ctrl/⌘+Enter로 전송)',
  quickActions = null,
}) {
  return (
    <div className="border-t border-slate-200 p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={placeholder}
          className="min-h-[44px] flex-1 resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
        />
        <button
          type="button"
          onClick={onSend}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          전송
        </button>
      </div>
      {quickActions ? <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">{quickActions}</div> : null}
    </div>
  )
}
