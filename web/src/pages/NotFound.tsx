import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-16 text-slate-900">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-600">404</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">페이지를 찾을 수 없어요</h1>
          <p className="mt-2 text-sm text-slate-600">
            주소가 변경되었거나 삭제되었을 수 있어요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/workspace"
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              워크스페이스로 이동
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              시작 화면
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

