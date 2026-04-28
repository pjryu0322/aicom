import { NavLink } from 'react-router-dom'

const linkBase =
  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition'

export function TopNav() {
  const links: { to: string; label: string; helper?: string }[] = [
    { to: '/', label: '워크스페이스', helper: '회의 분석' },
    { to: '/upload', label: '자료 업로드', helper: '녹취 업로드' },
    { to: '/processing', label: '변환·처리 상태' },
    { to: '/editor', label: '문서 편집' },
    { to: '/approval', label: '승인 요청·함' },
    { to: '/share', label: '공유·배포' },
  ]

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            T05
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900">
              회의록 작성·관리 자동화
            </div>
            <div className="text-xs text-slate-500">
              녹취 업로드 → 변환 → 화자 분리 → 초안 → 승인 → 공유
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                [
                  linkBase,
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100',
                ].join(' ')
              }
              end={l.to === '/'}
            >
              <span>{l.label}</span>
              {l.helper ? (
                <span className="rounded bg-white/15 px-1.5 py-0.5 text-[11px] text-white">
                  {l.helper}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 md:block">
            검색: 회의 제목/참여자/키워드
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">
            새 회의 업로드
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 lg:hidden">
        <div className="mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-4 py-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                [
                  'whitespace-nowrap rounded-md px-3 py-2 text-sm',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100',
                ].join(' ')
              }
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}

