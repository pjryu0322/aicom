import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getMeetingFile, mockSummary } from '../lib/mockData'

export function Editor() {
  const [params] = useSearchParams()
  const meetingId = params.get('m') ?? 'm-0428'
  const meeting = useMemo(() => getMeetingFile(meetingId), [meetingId])

  const [title, setTitle] = useState(`${meeting.title} 회의록`)
  const [notes, setNotes] = useState(
    [
      '### 핵심 요약',
      '- (목업) AI가 요약본/결정사항/할 일을 자동 구성합니다.',
      '',
      '### 논의 내용',
      '- (목업) 대화 타임라인/스크립트를 보고 필요한 문장을 정리합니다.',
      '',
      '### 안건',
      ...mockSummary.agenda.map((a) => `- ${a.text}`),
      '',
      '### 결정사항',
      ...mockSummary.decisions.map((d) => `- ${d.text}`),
      '',
      '### 할 일',
      ...mockSummary.todos.map((t) => `- [ ] ${t.text} (담당: ${t.owner}, 기한: ${t.due})`),
    ].join('\n')
  )

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">문서 편집</div>
          <div className="text-lg font-semibold text-slate-900">{meeting.title}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/workspace?m=${meeting.id}&tab=summary`}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            워크스페이스로
          </Link>
          <Link
            to={`/approval?m=${meeting.id}`}
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            승인 요청 보내기
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr,360px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <label className="block text-sm font-semibold text-slate-900">문서 제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
          />

          <label className="mt-4 block text-sm font-semibold text-slate-900">회의록 본문(목업 편집)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={22}
            className="mt-2 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm leading-6 text-slate-800 focus:border-slate-900 focus:outline-none"
          />
          <div className="mt-3 text-xs text-slate-500">
            저장/버전관리는 백엔드 없이 목업으로만 표시됩니다.
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">편집 가이드(목업)</div>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              <div className="rounded-lg bg-slate-50 p-3">
                - 요약본의 **안건/결정/할 일**을 회사 템플릿에 맞춰 다듬습니다.
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                - 스크립트에서 근거가 되는 발언을 확인하고 문장만 남깁니다.
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                - 민감 정보는 공유 전에 마스킹합니다(목업).
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">다음 액션</div>
            <div className="mt-2 flex flex-col gap-2">
              <Link
                to={`/approval?m=${meeting.id}`}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              >
                참석자에게 수정 요청/승인 요청
              </Link>
              <Link
                to={`/share?m=${meeting.id}`}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                공유/배포 화면 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

