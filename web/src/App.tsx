import { Navigate, Route, Routes } from 'react-router-dom'
import { TopNav } from './components/TopNav'
import { Approval } from './pages/Approval'
import { Editor } from './pages/Editor'
import NotFound from './pages/NotFound'
import { ProcessingPage } from './pages/Processing'
import { Share } from './pages/Share'
import UploadPage from './pages/Upload'
import WorkspacePage from './pages/Workspace'

export default function App() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <TopNav />
      <Routes>
        <Route path="/" element={<Navigate to="/workspace" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/approval" element={<Approval />} />
        <Route path="/share" element={<Share />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
