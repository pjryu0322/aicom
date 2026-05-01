import React, { useState, useCallback, useEffect } from 'react'
import UploadForm from './UploadForm'

/**
 * 녹취 파일 업로드 카드 — 드래그앤드롭 · 파일 선택 · 업로드 진행 표시
 */
export default function UploadCard({
  fileInputRef,
  uploading = false,
  selectedFile = null,
  onPickFile,
  onDropFile,
  onReset,
  onBrowse,
}) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (uploading) {
      setUploadProgress(0)
      let progress = 0
      const intervalId = window.setInterval(() => {
        progress = Math.min(100, progress + 8 + Math.round(Math.random() * 6))
        setUploadProgress(progress)
        if (progress >= 100) window.clearInterval(intervalId)
      }, 120)
      return () => window.clearInterval(intervalId)
    }
    if (selectedFile) setUploadProgress(100)
    else setUploadProgress(0)
    return undefined
  }, [uploading, selectedFile])

  const onDragEnter = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      setDragOver(false)
      onDropFile?.(e)
    },
    [onDropFile],
  )

  return (
    <UploadForm
      fileInputRef={fileInputRef}
      uploading={uploading}
      uploadProgress={uploadProgress}
      selectedFile={selectedFile}
      dragOver={dragOver}
      onPickFile={onPickFile}
      onDropFile={handleDrop}
      onReset={onReset}
      onBrowse={onBrowse}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    />
  )
}
