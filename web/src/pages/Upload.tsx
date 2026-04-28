import { Link, useNavigate } from 'react-router-dom'
import { cx } from '../lib/utils'

export default function UploadPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          녹취파일 업로드
        </h1>
        <p className="text-sm text-slate-600">
          회의 녹취 파일을 업로드하면 AI가 텍스트 변환 → 화자 분리 → 회의록 초안을
          생성합니다. (프로토타입: 실제 업로드는 저장되지 않아요)
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-slate-900">
                업로드할 파일
              </div>
              <div className="mt-1 text-xs text-slate-600">
                지원 형식: mp3, wav, m4a / 최대 2시간
              </div>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
              B2B 팀 워크플로우
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="text-sm font-medium text-slate-900">
                파일을 끌어다 놓거나 버튼으로 선택하세요
              </div>
              <div className="text-xs text-slate-600">
                업로드 후 자동으로 처리 상태 화면으로 이동합니다.
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  className={cx(
                    'rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white',
                    'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                  )}
                  onClick={() => navigate('/processing')}
                >
                  샘플 파일 업로드 (mock)
                </button>
                <Link
                  to="/workspace"
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  워크스페이스로 이동
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                title: '텍스트 변환(STT)',
                desc: '구간별 진행률과 오류/재시도를 로그로 남겨요.',
              },
              {
                title: '화자 분리(Diarization)',
                desc: '화자별 발언을 묶고, 이름/역할 매핑을 지원해요.',
              },
              {
                title: '회의록 초안 생성',
                desc: '핵심 안건/결정/할 일을 구조화해서 만들어줘요.',
              },
              {
                title: '승인/공유 워크플로우',
                desc: '수정 요청 → 최종 승인 → 링크 공유/내보내기까지.',
              },
            ].map((c) => (
              <div
                key={c.title}
                className="rounded-lg border border-slate-200 bg-white p-3"
              >
                <div className="text-sm font-semibold text-slate-900">
                  {c.title}
                </div>
                <div className="mt-1 text-xs text-slate-600">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">바로가기</div>
          <div className="mt-3 flex flex-col gap-2">
            {[
              { to: '/processing', label: '변환·처리 상태' },
              { to: '/workspace', label: '회의 분석 워크스페이스' },
              { to: '/editor', label: '문서 편집' },
              { to: '/approval', label: '승인 요청·함' },
              { to: '/share', label: '공유·배포' },
            ].map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
              >
                {i.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-700">권한 모델</div>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>- 회의록 작성자: 편집/승인 요청</li>
              <li>- 참석자: 코멘트/수정 제안</li>
              <li>- AI 에이전트: 변환/요약/할 일 추출</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

