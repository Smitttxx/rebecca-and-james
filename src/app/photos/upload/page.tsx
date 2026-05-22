'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDropzone, type FileRejection } from 'react-dropzone'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Layout from '@/components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCloudUploadAlt, faSpinner, faCheckCircle, faExclamationTriangle,
  faTimes, faImages, faVideo, faHeart, faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons'

// ─── Types ───────────────────────────────────────────────────────────────────

interface QueuedFile {
  id: string
  file: File
  name: string
  size: number
  isVideo: boolean
}

interface UploadResult {
  success: number
  failed: number
  total: number
  errors: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isImageFile = (f: File) => {
  const mime = f.type || ''
  const name = f.name.toLowerCase()
  return (
    mime.startsWith('image/') ||
    /\.(heic|heif|heics|avif|webp|jpg|jpeg|jfif|png|gif|bmp|tif|tiff)$/i.test(name)
  )
}

const isVideoFile = (f: File) => {
  const mime = f.type || ''
  return mime.startsWith('video/') || /\.(mp4|mov|avi|webm|mkv|m4v)$/i.test(f.name.toLowerCase())
}

const formatSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

const formatTime = (seconds: number) => {
  if (seconds < 60) return `~${Math.ceil(seconds)}s`
  return `~${Math.ceil(seconds / 60)}min`
}

async function convertHeic(file: File): Promise<File> {
  const name = file.name.toLowerCase()
  const mime = file.type || ''
  const isHeic = mime.includes('heic') || mime.includes('heif') || /\.(heic|heif|heics)$/i.test(name)
  if (!isHeic) return file
  const heic2any = (await import('heic2any')).default
  const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 }) as Blob
  return new File([converted], file.name.replace(/\.(heic|heif|heics)$/i, '.jpg'), { type: 'image/jpeg' })
}

async function compressImage(file: File, maxBytes = 4.2 * 1024 * 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img
      const max = 2048
      if (width > max || height > max) {
        if (width > height) { height = Math.round((height * max) / width); width = max }
        else { width = Math.round((width * max) / height); height = max }
      }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      const tryQ = (q: number) => {
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('Compression failed')); return }
          if (blob.size <= maxBytes || q <= 0.1) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg', lastModified: Date.now() }))
          } else {
            tryQ(Math.max(0.1, q - 0.15))
          }
        }, 'image/jpeg', q)
      }
      tryQ(0.85)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

async function processImageFile(file: File): Promise<File> {
  let f = file
  f = await convertHeic(f)
  if (f.size > 4.0 * 1024 * 1024) {
    f = await compressImage(f)
  }
  return f
}

async function uploadImage(file: File, uploadedBy: string, signal: AbortSignal): Promise<void> {
  const form = new FormData()
  form.append('file', file)
  if (uploadedBy) form.append('uploadedBy', uploadedBy)

  let lastErr: Error = new Error('Upload failed')
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('/api/photos/upload', { method: 'POST', body: form, signal })
      if (res.ok) return
      const data = await res.json().catch(() => ({}))
      const msg = data.error || `HTTP ${res.status}`
      if (res.status === 413) throw new Error('File too large after compression')
      if (res.status === 415) throw new Error('Unsupported file type')
      if (res.status >= 500) { lastErr = new Error(msg); continue }
      throw new Error(msg)
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw new Error('Upload timed out — try a faster connection')
      lastErr = err as Error
      if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
    }
  }
  throw lastErr
}

async function uploadVideo(file: File, uploadedBy: string): Promise<void> {
  if (file.size > 250 * 1024 * 1024) throw new Error('Video too large (max 250MB)')
  const { upload } = await import('@vercel/blob/client')
  const safeName = `video-${Date.now()}-${Math.random().toString(36).substring(7)}${file.name.slice(file.name.lastIndexOf('.'))}`
  await upload(safeName, file, {
    access: 'public',
    handleUploadUrl: '/api/photos/video-upload',
    clientPayload: uploadedBy || '',
  })
}

async function requestWakeLock(): Promise<WakeLockSentinel | null> {
  try {
    if ('wakeLock' in navigator) return await navigator.wakeLock.request('screen')
  } catch { /* not available */ }
  return null
}

// ─── Styled Components ───────────────────────────────────────────────────────

const PageContent = styled.div`
  padding: 1.25rem 1rem 2rem;
  @media (min-width: ${theme.breakpoints.mobile}) { padding: 2rem 1.5rem; }
`

const Card = styled.div`
  background: rgba(255,255,255,0.97);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  padding: 1.25rem;
  max-width: 640px;
  margin: 0 auto;
  @media (min-width: ${theme.breakpoints.mobile}) { padding: 2rem; }
`

const PageTitle = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 1.8rem;
  color: ${theme.colors.primary.eucalyptus};
  text-align: center;
  margin: 0 0 0.25rem 0;
  @media (min-width: ${theme.breakpoints.mobile}) { font-size: 2.2rem; }
`

const SubTitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.gray};
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-style: italic;
`

const Label = styled.label`
  display: block;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  color: ${theme.colors.neutral.darkGray};
  margin-bottom: 0.35rem;
`

const NameInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${theme.colors.secondary.gold};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  background: white;
  box-sizing: border-box;
  margin-bottom: 1rem;
  &:focus { outline: none; border-color: ${theme.colors.primary.eucalyptus}; box-shadow: 0 0 0 3px rgba(83,102,65,0.1); }
`

const DropZone = styled.div<{ $active: boolean }>`
  border: 3px dashed ${p => p.$active ? theme.colors.primary.eucalyptus : theme.colors.secondary.gold};
  border-radius: ${theme.borderRadius.lg};
  padding: 2.5rem 1.5rem;
  text-align: center;
  background: ${p => p.$active ? 'rgba(83,102,65,0.05)' : 'rgba(255,255,255,0.8)'};
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 1rem;
  &:hover { border-color: ${theme.colors.primary.eucalyptus}; background: rgba(83,102,65,0.04); }
`

const DropIcon = styled.div`
  font-size: 2.8rem;
  color: ${theme.colors.primary.eucalyptus};
  margin-bottom: 0.75rem;
`

const DropTitle = styled.h3`
  font-family: ${theme.fonts.body};
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.primary.eucalyptus};
  margin: 0 0 0.35rem 0;
`

const DropSub = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  color: ${theme.colors.neutral.gray};
  margin: 0;
`

const QueueBanner = styled.div`
  background: ${theme.colors.primary.eucalyptus};
  color: white;
  border-radius: ${theme.borderRadius.md};
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: ${theme.fonts.body};
  font-weight: 600;
  font-size: 0.95rem;
`

const QueueBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`

const Badge = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`

const FileList = styled.div`
  background: #f8f9fa;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid #e9ecef;
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 1rem;
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.75rem;
  border-bottom: 1px solid #e9ecef;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  &:last-child { border-bottom: none; }
`

const FileName = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
  color: ${theme.colors.neutral.darkGray};
`

const FileSize = styled.span`
  color: ${theme.colors.neutral.gray};
  white-space: nowrap;
  margin-right: 0.5rem;
  font-size: 0.8rem;
`

const RemoveFileBtn = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  &:hover { background: #c82333; }
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

const UploadBtn = styled.button`
  flex: 1;
  background: ${theme.colors.primary.eucalyptus};
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 52px;
  box-shadow: ${theme.shadows.md};
  transition: all 0.2s;
  &:hover { background: ${theme.colors.primary.eucalyptusDark}; transform: translateY(-1px); }
  &:active { transform: scale(0.98); }
  &:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }
`

const ClearBtn = styled.button`
  background: ${theme.colors.neutral.gray};
  color: white;
  border: none;
  padding: 1rem 1.25rem;
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  min-height: 52px;
  transition: all 0.2s;
  &:hover { background: ${theme.colors.neutral.darkGray}; }
`

const WarningBox = styled.div`
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: ${theme.borderRadius.md};
  padding: 0.75rem 1rem;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`

const StatusMsg = styled.div<{ $type: 'error' | 'success' | 'info' }>`
  padding: 0.875rem 1rem;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 1rem;
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  white-space: pre-line;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  ${({ $type }) =>
    $type === 'success'
      ? 'background:#d4edda;color:#155724;border:1px solid #c3e6cb;'
      : $type === 'error'
      ? 'background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;'
      : 'background:#d1ecf1;color:#0c5460;border:1px solid #bee5eb;'}
`

const ViewGalleryLink = styled(Link)`
  display: block;
  text-align: center;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.primary.eucalyptus};
  text-decoration: underline;
  margin-top: 0.75rem;
  &:hover { color: ${theme.colors.primary.eucalyptusDark}; }
`

// ─── Uploading Overlay ────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
`

const OverlayCard = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.xl};
  padding: 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: ${theme.shadows.xl};
`

const OverlayIcon = styled.div`
  font-size: 3rem;
  color: ${theme.colors.primary.eucalyptus};
  margin-bottom: 0.75rem;
`

const OverlayTitle = styled.h2`
  font-family: ${theme.fonts.serif};
  color: ${theme.colors.neutral.darkGray};
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
`

const OverlayWarn = styled.div`
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: ${theme.borderRadius.md};
  padding: 0.75rem 1rem;
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 600;
  margin: 1rem 0;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  margin: 0.75rem 0 0.5rem;
`

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary.eucalyptus}, ${theme.colors.primary.eucalyptusLight});
  width: ${p => p.$pct}%;
  transition: width 0.4s ease;
`

const ProgressText = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.95rem;
  color: ${theme.colors.neutral.darkGray};
  font-weight: 600;
`

const ProgressSub = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  color: ${theme.colors.neutral.gray};
  margin-top: 0.25rem;
`

// ─── Component ───────────────────────────────────────────────────────────────

export default function PhotoUploadPage() {
  const router = useRouter()
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [uploadedBy, setUploadedBy] = useState('')
  const [phase, setPhase] = useState<'select' | 'uploading'>('select')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [elapsedMs, setElapsedMs] = useState(0)
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null)
  const [showList, setShowList] = useState(false)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Restore name from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rj_upload_name')
    if (saved) setUploadedBy(saved)
  }, [])

  const saveName = (name: string) => {
    setUploadedBy(name)
    if (name) localStorage.setItem('rj_upload_name', name)
    else localStorage.removeItem('rj_upload_name')
  }

  // Warn before closing during upload
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase === 'uploading') { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [phase])

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    setStatusMsg(null)
    const errors: string[] = []

    if (rejected.length > 0) {
      rejected.forEach(r => {
        if (r.errors.some((e: { code: string }) => e.code === 'file-too-large')) {
          errors.push(`${r.file.name}: too large`)
        } else {
          errors.push(`${r.file.name}: not supported`)
        }
      })
    }

    const newFiles: QueuedFile[] = accepted
      .filter(f => isImageFile(f) || isVideoFile(f))
      .map(f => ({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
        file: f,
        name: f.name,
        size: f.size,
        isVideo: isVideoFile(f),
      }))

    const skipped = accepted.length - newFiles.length
    if (skipped > 0) errors.push(`${skipped} file(s) skipped — not a recognised image or video format`)

    if (errors.length > 0) {
      setStatusMsg({ type: 'error', text: errors.join('\n') })
    }

    if (newFiles.length > 0) {
      setQueue(prev => [...prev, ...newFiles])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    maxSize: 300 * 1024 * 1024, // 300MB client limit (videos)
    noClick: false,
  })

  const removeFile = (id: string) => setQueue(prev => prev.filter(f => f.id !== id))
  const clearAll = () => { setQueue([]); setStatusMsg(null) }

  const imageCount = queue.filter(f => !f.isVideo).length
  const videoCount = queue.filter(f => f.isVideo).length
  const estimatedSeconds = progress.current > 0 && elapsedMs > 0
    ? (elapsedMs / 1000 / progress.current) * (progress.total - progress.current)
    : null

  const startUpload = async () => {
    if (!uploadedBy.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter your name before uploading.' })
      document.getElementById('name')?.focus()
      return
    }

    if (queue.length === 0) {
      setStatusMsg({ type: 'error', text: 'Please select at least one photo or video.' })
      return
    }

    setPhase('uploading')
    setStatusMsg(null)
    setProgress({ current: 0, total: queue.length })
    startTimeRef.current = Date.now()

    wakeLockRef.current = await requestWakeLock()

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current)
    }, 1000)

    let successCount = 0
    const errors: string[] = []
    const files = [...queue]

    // ── Pipeline: process file[i+1] while uploading file[i] ──
    let nextProcessing: Promise<File | null> = files[0].isVideo
      ? Promise.resolve(files[0].file)
      : processImageFile(files[0].file).catch(() => null)

    for (let i = 0; i < files.length; i++) {
      const qf = files[i]
      const processed = await nextProcessing

      // Start processing next file immediately (pipeline overlap)
      if (i + 1 < files.length) {
        const next = files[i + 1]
        nextProcessing = next.isVideo
          ? Promise.resolve(next.file)
          : processImageFile(next.file).catch(() => null)
      }

      if (!processed) {
        errors.push(`${qf.name}: Failed to process file`)
        setProgress({ current: i + 1, total: files.length })
        continue
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 90_000)
        if (qf.isVideo) {
          await uploadVideo(processed, uploadedBy)
        } else {
          await uploadImage(processed, uploadedBy, controller.signal)
        }
        clearTimeout(timeoutId)
        successCount++
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed'
        errors.push(`${qf.name}: ${msg}`)
      }

      setProgress({ current: i + 1, total: files.length })
    }

    // Cleanup
    if (timerRef.current) clearInterval(timerRef.current)
    wakeLockRef.current?.release()

    const result: UploadResult = {
      success: successCount,
      failed: errors.length,
      total: files.length,
      errors,
    }
    sessionStorage.setItem('uploadResult', JSON.stringify(result))
    router.push('/photos/gallery')
  }

  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <Layout activePage="upload">
      {phase === 'uploading' && (
        <Overlay>
          <OverlayCard>
            <OverlayIcon>
              <FontAwesomeIcon icon={faSpinner} spin />
            </OverlayIcon>
            <OverlayTitle>Sharing your memories…</OverlayTitle>
            <OverlayWarn>
              Keep this screen open and your phone unlocked — switching apps will pause the upload
            </OverlayWarn>
            <ProgressBar>
              <ProgressFill $pct={pct} />
            </ProgressBar>
            <ProgressText>
              {progress.current} of {progress.total} uploaded
            </ProgressText>
            {estimatedSeconds !== null && estimatedSeconds > 5 && (
              <ProgressSub>{formatTime(estimatedSeconds)} remaining</ProgressSub>
            )}
          </OverlayCard>
        </Overlay>
      )}
      <PageContent>
      <Card>
        <PageTitle>Share Your Photos</PageTitle>
        <SubTitle>Help Rebecca & James relive every moment of their special day</SubTitle>

        <div>
          <Label htmlFor="name">Your name <span style={{ color: theme.colors.status.error }}>*</span></Label>
          <NameInput
            id="name"
            type="text"
            placeholder="e.g. Sarah & Tom"
            value={uploadedBy}
            onChange={e => saveName(e.target.value)}
            required
          />
        </div>

        <DropZone {...getRootProps()} $active={isDragActive}>
          <input {...getInputProps()} />
          <DropIcon>
            <FontAwesomeIcon icon={faCloudUploadAlt} />
          </DropIcon>
          <DropTitle>
            {isDragActive ? 'Drop files here' : 'Tap to select photos & videos'}
          </DropTitle>
          <DropSub>Photos + videos supported · Large photos are automatically compressed · HEIC from iPhone supported</DropSub>
        </DropZone>

        {statusMsg && (
          <StatusMsg $type={statusMsg.type}>
            <FontAwesomeIcon
              icon={statusMsg.type === 'error' ? faExclamationTriangle : statusMsg.type === 'success' ? faCheckCircle : faExclamationCircle}
              style={{ flexShrink: 0, marginTop: '0.1rem' }}
            />
            <div>{statusMsg.text}</div>
          </StatusMsg>
        )}

        {queue.length > 0 && (
          <>
            <QueueBanner>
              <QueueBadges>
                {imageCount > 0 && (
                  <Badge>
                    <FontAwesomeIcon icon={faImages} style={{ fontSize: '0.7rem' }} />
                    {imageCount} photo{imageCount !== 1 ? 's' : ''}
                  </Badge>
                )}
                {videoCount > 0 && (
                  <Badge>
                    <FontAwesomeIcon icon={faVideo} style={{ fontSize: '0.7rem' }} />
                    {videoCount} video{videoCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </QueueBadges>
              {queue.length <= 15 && (
                <span
                  style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.85 }}
                  onClick={() => setShowList(v => !v)}
                >
                  {showList ? 'Hide' : 'Show'} list
                </span>
              )}
            </QueueBanner>

            {/* Only show file list for small batches to avoid memory pressure */}
            {queue.length <= 15 && showList && (
              <FileList>
                {queue.map(qf => (
                  <FileItem key={qf.id}>
                    <FontAwesomeIcon
                      icon={qf.isVideo ? faVideo : faImages}
                      style={{ color: theme.colors.primary.eucalyptus, flexShrink: 0, marginRight: '0.4rem', fontSize: '0.75rem' }}
                    />
                    <FileName title={qf.name}>{qf.name}</FileName>
                    <FileSize>{formatSize(qf.size)}</FileSize>
                    <RemoveFileBtn onClick={() => removeFile(qf.id)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </RemoveFileBtn>
                  </FileItem>
                ))}
              </FileList>
            )}

            {videoCount > 0 && (
              <WarningBox>
                <FontAwesomeIcon icon={faExclamationCircle} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>Videos may take a few minutes each — keep this page open and your screen on.</span>
              </WarningBox>
            )}

            {queue.length > 50 && (
              <WarningBox>
                <FontAwesomeIcon icon={faExclamationCircle} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>
                  {queue.length} files selected — this may take {formatTime((queue.length * 5))}.
                  Keep the screen on and don&apos;t switch apps.
                </span>
              </WarningBox>
            )}

            <ButtonRow>
              <ClearBtn onClick={clearAll}>Clear</ClearBtn>
              <UploadBtn onClick={startUpload}>
                <FontAwesomeIcon icon={faHeart} />
                Share {queue.length} file{queue.length !== 1 ? 's' : ''}
              </UploadBtn>
            </ButtonRow>
          </>
        )}

        <ViewGalleryLink href="/photos/gallery">
          View the shared gallery →
        </ViewGalleryLink>
      </Card>
      </PageContent>
    </Layout>
  )
}
