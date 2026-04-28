import { Link } from 'react-router-dom'

const inbox = [
  {
    id: 'req-01',
    meeting: 'T05 제품 기획/요구사항 정리',
    from: '민지(회의록 작성자)',
    status: '승인 대기',
    preview: '결정사항 3건, 할 일 3건 추출됨. “STT 품질 지표 표시” 항목 확인 부탁…',
    updatedAt: '방금',
  },
  {
    id: 'req-02',
    meeting: '고객사 PoC 킥오프',
    from: '지훈(PM)',
    status: '수정 요청됨',
    preview: '“공유/배포 권한” 항목이 빠졌어요. 요약본에 섹션 추가 요청…',
    updatedAt: '2시간 전',
  },
]

export function Approval() {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs text-slate-500">승인 요청·함</div>
          <h1 className="mt-1 text-xl font-semibold text-slate-900">승인/수정 요청을 처리하세요</h1>
          <p className="mt-1 text-sm text-slate-600">
            참석자·작성자·시스템(AI)에서 생성된 요청이 모입니다(목업).
          </p>
        </div>
        <Link
          to="/workspace"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          워크스페이스로 돌아가기
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-[1fr,360px]">
        <section className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <div className="text-sm font-semibold text-slate-900">요청함</div>
            <div className="text-xs text-slate-500">승인/수정 요청 항목을 선택해 처리(목업)</div>
          </div>
          <div className="divide-y divide-slate-200">
            {inbox.map((r) => (
              <div key={r.id} className="p-4 hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{r.meeting}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{r.from}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-semibold text-slate-900">{r.status}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{r.updatedAt}</div>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-700">{r.preview}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    수정 요청(목업)
                  </button>
                  <button className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                    승인(목업)
                  </button>
                  <Link
                    to="/workspace?tab=summary&step=approve"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    문서 보기
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">처리 가이드</div>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>승인 전에 요약본(안건/결정/할 일)과 스크립트를 함께 확인합니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>수정 요청은 근거 구간(타임스탬프)과 함께 남기면 왕복이 줄어듭니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>최종 승인 후에는 공유/배포 페이지에서 링크 발급/내보내기(목업)로 진행합니다.</span>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  )
}

