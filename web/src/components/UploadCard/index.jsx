import React, { useState, useCallback } from 'react'
import UploadForm from './UploadForm'

/**
 * 녹취 파일 업로드 카드 — 드래그앤드롭 · 파일 선택 · 진행 상태
 */
export default function UploadCard({
  fileInputRef,
  uploading = false,
  uploadProgress = 0,
  selectedFile = null,
  onPickFile,
  onDropFile,
  onReset,
  onBrowse,
}) {
  const [dragOver, setDragOver] = useState(false)

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
