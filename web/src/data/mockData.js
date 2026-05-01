/**
 * Meeting-workspace template: static mock data for the T05 prototype.
 * TypeScript types live in `src/lib/mockData.ts`.
 */

export const workflowSteps = [
  { id: 'upload', label: '녹취파일 업로드' },
  { id: 'transcribe', label: '텍스트 변환' },
  { id: 'diarize', label: '화자 분리' },
  { id: 'draft', label: '회의록 초안 생성' },
  { id: 'revise', label: '수정 요청' },
  { id: 'approve', label: '최종 승인' },
  { id: 'share', label: '공유/배포' },
]

export const mockMeetings = [
  {
    id: 'm-0428',
    title: 'T05 제품 기획/요구사항 정리',
    date: '2026-04-28',
    duration: '48:12',
    fileName: 't05_planning_0428.m4a',
    status: '초안 생성 중',
  },
  {
    id: 'm-0423',
    title: '고객사 PoC 킥오프',
    date: '2026-04-23',
    duration: '31:05',
    fileName: 'poc_kickoff_0423.wav',
    status: '화자 분리 중',
  },
  {
    id: 'm-0419',
    title: '주간 운영 회의',
    date: '2026-04-19',
    duration: '25:44',
    fileName: 'ops_weekly_0419.mp3',
    status: '업로드 대기',
  },
  {
    id: 'm-0501',
    title: '스프린트 리뷰 · 회의록 자동화 데모',
    date: '2026-05-01',
    duration: '36:20',
    fileName: 'sprint_review_0501.m4a',
    status: '텍스트 변환 중',
  },
]

export const mockSpeakers = [
  { id: 's1', name: '민지', role: '회의록 작성자', color: 'indigo' },
  { id: 's2', name: '지훈', role: 'PM', color: 'emerald' },
  { id: 's3', name: '서연', role: '개발 리드', color: 'amber' },
  { id: 's4', name: 'AI 에이전트', role: 'System', color: 'violet' },
  { id: 's5', name: '하준', role: '디자인', color: 'sky' },
  { id: 's6', name: '유진', role: '고객 성공', color: 'rose' },
]

export const mockTranscript = [
  {
    id: 't1',
    ts: '00:01:12',
    speakerId: 's2',
    text: '오늘 목표는 녹취 업로드부터 회의록 초안까지 흐름을 확정하는 거예요.',
  },
  {
    id: 't2',
    ts: '00:02:01',
    speakerId: 's1',
    text: '회의록 작성에 시간이 너무 오래 걸려서, 화자별 정리가 필수예요.',
  },
  {
    id: 't3',
    ts: '00:03:18',
    speakerId: 's3',
    text: '텍스트 변환 정확도랑 화자 분리 품질을 상태로 보여주면 신뢰가 올라가요.',
  },
  {
    id: 't4',
    ts: '00:04:02',
    speakerId: 's4',
    text: '업로드된 파일을 분석해 스크립트와 요약본을 생성하고, 할 일을 추출합니다.',
  },
  {
    id: 't5',
    ts: '00:05:40',
    speakerId: 's2',
    text: '초안 이후에는 참석자에게 수정 요청 → 최종 승인 → 공유/배포까지 한 번에 가야 해요.',
  },
  {
    id: 't6',
    ts: '00:07:05',
    speakerId: 's5',
    text: '처리 중 화면에서는 진행률이랑 로그 타임라인을 같이 보여주면 이해하기 쉬울 것 같아요.',
  },
  {
    id: 't7',
    ts: '00:08:33',
    speakerId: 's6',
    text: '고객 데모 때는 샘플 녹취로 끝까지 한 번 돌려보는 시나리오가 있으면 좋겠어요.',
  },
  {
    id: 't8',
    ts: '00:09:50',
    speakerId: 's1',
    text: '좋아요. 워크스페이스에서 파일·타임라인·요약/스크립트를 한 화면에서 맞춰볼게요.',
  },
]

export const mockSummary = {
  agenda: [
    { id: 'a1', text: '서비스 흐름(업로드→변환→화자 분리→초안) 확정' },
    { id: 'a2', text: '회의록 승인/수정 요청 프로세스 정의' },
    { id: 'a3', text: '공유/배포 방식(링크/보내기) 정리' },
    { id: 'a4', text: '데모·PoC용 샘플 녹취 및 시나리오 정리' },
  ],
  decisions: [
    { id: 'd1', text: '워크스페이스는 3컬럼(파일/타임라인/문서) 구조로 통일' },
    { id: 'd2', text: '처리 상태는 단계별 진행률과 로그 타임라인을 함께 표시' },
    { id: 'd3', text: '요약본은 안건/결정/할 일 3섹션으로 고정' },
    { id: 'd4', text: 'GitHub Pages 배포 시 Vite base와 라우터 basename을 동일하게 맞춤' },
  ],
  todos: [
    { id: 'td1', owner: '민지', due: '이번 주', text: '회의록 템플릿(회사 표준) 반영 항목 정리' },
    { id: 'td2', owner: '서연', due: '다음 주', text: '화자 분리 품질 지표(신뢰도) 표시 방식 제안' },
    { id: 'td3', owner: '지훈', due: '이번 주', text: '공유/배포 요구사항(권한/링크) 수집' },
    { id: 'td4', owner: '하준', due: '다음 주', text: '처리 중·완료 상태 UI 톤앤매너 가이드 초안' },
    { id: 'td5', owner: '유진', due: '이번 주', text: 'PoC 킥오프용 샘플 스크립트·요약 검수' },
  ],
}
