export type WorkflowStepId =
  | 'upload'
  | 'transcribe'
  | 'diarize'
  | 'draft'
  | 'revise'
  | 'approve'
  | 'share'

export type MeetingStatus =
  | '업로드 대기'
  | '업로드됨'
  | '텍스트 변환 중'
  | '화자 분리 중'
  | '초안 생성 중'
  | '수정 요청됨'
  | '승인 대기'
  | '최종 승인'
  | '공유 완료'

export type MeetingFile = {
  id: string
  title: string
  date: string
  duration: string
  fileName: string
  status: MeetingStatus
}

export type Speaker = {
  id: string
  name: string
  role: string
  color: 'indigo' | 'emerald' | 'amber' | 'violet' | 'sky' | 'rose'
}

export type TranscriptLine = {
  id: string
  ts: string
  speakerId: string
  text: string
}

export type SummaryDoc = {
  agenda: { id: string; text: string }[]
  decisions: { id: string; text: string }[]
  todos: { id: string; owner: string; due: string; text: string }[]
}

export const workflowSteps: { id: WorkflowStepId; label: string }[]
export const mockMeetings: MeetingFile[]
export const mockSpeakers: Speaker[]
export const mockTranscript: TranscriptLine[]
export const mockSummary: SummaryDoc
