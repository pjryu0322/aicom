import { Link, useSearchParams } from 'react-router-dom'
import { getMeetingFile } from '../lib/mockData'

export function Share() {
  const [params] = useSearchParams()
  const meetingId = params.get('m') ?? 'm-0428'
  const meeting = getMeetingFile(meetingId)

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">공유·배포</div>
          <div className="text-lg font-semibold text-slate-900">{meeting.title}</div>
          <div className="text-xs text-slate-500">
            외부 공유 링크와 내보내기를 모의로 제공합니다.
          </div>
        </div>
        <Link
          to={`/workspace?m=${encodeURIComponent(meetingId)}&step=share&tab=summary`}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          워크스페이스로 돌아가기
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">공유 링크</div>
          <div className="mt-1 text-xs text-slate-500">
            권한/만료/비밀번호는 프로토타입 상에서 목업입니다.
          </div>

          <div className="mt-3 space-y-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="text-xs font-medium text-slate-600">링크</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <code className="rounded bg-white px-2 py-1 text-xs text-slate-800">
                  https://t05.example.com/share/{meetingId}?token=mock
                </code>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  복사(목업)
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-500">권한: 읽기 · 만료: 7일 · 비밀번호: 사용 안 함</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                참석자에게 공유(목업)
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                링크 설정(목업)
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">내보내기</div>
          <div className="mt-1 text-xs text-slate-500">문서 포맷별로 다운로드되는 것처럼 보이는 UI입니다.</div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { label: 'PDF', desc: '회의록(요약본) 고정 레이아웃' },
              { label: 'DOCX', desc: '사내 템플릿에 맞춘 편집용 문서' },
              { label: 'Markdown', desc: 'Wiki/깃 저장소에 바로 붙여넣기' },
              { label: 'CSV(할 일)', desc: '할 일만 추출해서 태스크 도구로' },
            ].map((x) => (
              <button
                key={x.label}
                type="button"
                className="rounded-lg border border-slate-200 bg-white p-3 text-left hover:bg-slate-50"
              >
                <div className="text-sm font-semibold text-slate-900">{x.label} 내보내기(목업)</div>
                <div className="mt-1 text-xs text-slate-500">{x.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

