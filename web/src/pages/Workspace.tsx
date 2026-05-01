import { Link, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { getMeetingFile, mockMeetings } from '../lib/mockData'
import AppLayout from '../layout/AppLayout'

export default function WorkspacePage() {
  const [params] = useSearchParams()
  const meetingId = params.get('m') ?? mockMeetings[0].id

  const meeting = useMemo(() => getMeetingFile(meetingId), [meetingId])

  return (
    <AppLayout
      subtitle="회의 분석 워크스페이스"
      title={meeting.title}
      detail={
        <>
          {meeting.date} · {meeting.duration} · 파일: {meeting.fileName}
        </>
      }
      actions={
        <>
          <Link
            to="/processing"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            처리 상태 보기
          </Link>
          <Link
            to="/upload"
            className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            새 녹취 업로드
          </Link>
        </>
      }
    />
  )
}
