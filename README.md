# T05 회의록 작성 및 관리 자동화 (프로토타입)

녹취 파일을 업로드하면 AI가 텍스트로 변환하고 화자별 발언을 정리하는 **회의 워크스페이스** UI 프로토타입입니다. 백엔드 없이 정적 목업으로 동작합니다.

## 실행 방법

앱 소스는 `web/` 디렉터리에 있습니다.

```bash
cd web
npm install
npm run dev
```

터미널에 표시된 로컬 URL(예: `http://localhost:5173/aicom/`)로 브라우저에서 접속합니다.  
프로덕션 빌드:

```bash
cd web
npm run build
npm run preview
```

## GitHub Pages

- Vite `base`는 저장소 경로에 맞게 설정되어 있습니다(`web/vite.config.ts`의 `base`).
- `BrowserRouter`의 `basename`은 `import.meta.env.BASE_URL`과 동일하게 맞춰져 있어, 프로젝트 하위 경로에 배포해도 라우팅이 동작합니다.
- 루트 경로(`/`)는 메인 워크스페이스(`WorkspacePage`)를 렌더링합니다.

## 목업 데이터

- 회의 목록, 화자, 스크립트, 요약(안건·결정·할 일)은 `web/src/data/mockData.js`에 정의되어 있습니다.
- TypeScript 페이지·훅에서는 `web/src/lib/mockData.ts`를 통해 같은 데이터를 가져옵니다.

## 관련 문서

자세한 화면 구성·라우트 목록은 `web/README.md`를 참고하세요.
