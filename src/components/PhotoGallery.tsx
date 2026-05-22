'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styled, { keyframes } from 'styled-components'
import { theme } from '@/styles/theme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCamera, faUser, faSpinner, faUpload, faChevronLeft, faChevronRight,
  faTrash, faTimes, faHeart, faDownload, faVideo, faImages,
} from '@fortawesome/free-solid-svg-icons'

interface Photo {
  id: string
  url: string
  filename: string
  contentType: string | null
  uploadedBy: string | null
  uploadedAt: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalPhotos: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface UploadResult {
  success: number
  failed: number
  total: number
  errors: string[]
}

const isVideoItem = (photo: Photo) => {
  if (photo.contentType) return photo.contentType.startsWith('video/')
  return /\.(mp4|mov|avi|webm|mkv|m4v)(\?|$)/i.test(photo.url)
}

// ─── Styled Components ───────────────────────────────────────────────────────

const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem;
  @media (min-width: ${theme.breakpoints.mobile}) { padding: 1.5rem; }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  @media (min-width: ${theme.breakpoints.mobile}) { margin-bottom: 1.5rem; }
`

const UploadBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${theme.colors.primary.eucalyptus};
  color: ${theme.colors.neutral.white};
  padding: 0.875rem 1.5rem;
  border-radius: ${theme.borderRadius.lg};
  text-decoration: none;
  font-family: ${theme.fonts.body};
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: ${theme.shadows.md};
  width: 100%;
  justify-content: center;
  margin-bottom: 1rem;
  &:hover { background: ${theme.colors.primary.eucalyptusDark}; transform: translateY(-1px); }
  @media (min-width: ${theme.breakpoints.mobile}) { width: auto; }
`

const CountBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(212,175,55,0.3);
  color: ${theme.colors.neutral.darkGray};
  padding: 0.5rem 1.2rem;
  border-radius: ${theme.borderRadius.lg};
  font-family: ${theme.fonts.body};
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

const SearchBox = styled.div`
  background: rgba(255,255,255,0.95);
  border: 2px solid ${theme.colors.primary.eucalyptus};
  border-radius: ${theme.borderRadius.lg};
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
`

const SearchLabel = styled.h3`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.primary.eucalyptus};
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const SearchRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  position: relative;
`

const SearchInput = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: 2px solid ${theme.colors.secondary.gold};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 0.95rem;
  background: white;
  &:focus { outline: none; border-color: ${theme.colors.primary.eucalyptus}; box-shadow: 0 0 0 3px rgba(83,102,65,0.1); }
  &::placeholder { color: #999; font-style: italic; }
`

const ClearBtn = styled.button`
  background: ${theme.colors.neutral.gray};
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  border-radius: ${theme.borderRadius.md};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  &:hover { background: ${theme.colors.neutral.darkGray}; }
`

const Suggestions = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid ${theme.colors.primary.eucalyptus};
  border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
  max-height: 180px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: ${theme.shadows.md};
`

const SuggestionItem = styled.div`
  padding: 0.65rem 1rem;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  &:hover { background: ${theme.colors.primary.eucalyptus}; color: white; }
  &:last-child { border-bottom: none; }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  @media (min-width: ${theme.breakpoints.mobile}) { grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  @media (min-width: ${theme.breakpoints.tablet}) { grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
`

const Card = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.sm};
  cursor: pointer;
  position: relative;
  height: 180px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: ${theme.shadows.md}; }
  &:active { transform: scale(0.98); }
  @media (min-width: ${theme.breakpoints.mobile}) { height: 260px; }
  @media (min-width: ${theme.breakpoints.tablet}) { height: 320px; }
`

const CardMedia = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const VideoThumb = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const VideoBadge = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0,0,0,0.6);
  color: white;
  border-radius: ${theme.borderRadius.sm};
  padding: 0.2rem 0.4rem;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`

const UploaderTag = styled.div`
  position: absolute;
  top: 6px;
  left: 6px;
  background: linear-gradient(135deg, ${theme.colors.primary.eucalyptus}, ${theme.colors.primary.eucalyptusDark});
  color: white;
  padding: 0.2rem 0.55rem;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  font-family: ${theme.fonts.body};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  z-index: 5;
  max-width: calc(100% - 50px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const DeleteBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(220,53,69,0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  &:hover { background: rgba(220,53,69,1); }
  &:active { transform: scale(0.95); }
`

const Spinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${theme.colors.neutral.gray};
  gap: 0.5rem;
  font-family: ${theme.fonts.body};
`

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const SkeletonCard = styled.div`
  border-radius: ${theme.borderRadius.lg};
  height: 180px;
  background: linear-gradient(90deg, #e4eae4 25%, #d0d9d0 50%, #e4eae4 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  @media (min-width: ${theme.breakpoints.mobile}) { height: 260px; }
  @media (min-width: ${theme.breakpoints.tablet}) { height: 320px; }
`

const Empty = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${theme.colors.neutral.gray};
  font-family: ${theme.fonts.body};
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: ${theme.colors.secondary.gold};
  margin-bottom: 0.75rem;
`

const AdminBanner = styled.div`
  background: #fff3cd;
  color: #856404;
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid #ffeaa7;
  margin-bottom: 1rem;
  text-align: center;
  font-family: ${theme.fonts.body};
  font-weight: 600;
  font-size: 0.9rem;
`

const ResultBanner = styled.div<{ $type: 'success' | 'partial' | 'error' }>`
  padding: 1rem;
  border-radius: ${theme.borderRadius.md};
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-family: ${theme.fonts.body};
  font-weight: 500;
  font-size: 0.95rem;
  white-space: pre-line;
  max-height: 250px;
  overflow-y: auto;
  ${({ $type }) =>
    $type === 'success'
      ? 'background:#d4edda;color:#155724;border:1px solid #c3e6cb;'
      : $type === 'partial'
      ? 'background:#fff3cd;color:#856404;border:1px solid #ffeaa7;'
      : 'background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;'}
`

const CloseBannerBtn = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-left: auto;
  flex-shrink: 0;
  opacity: 0.7;
  &:hover { opacity: 1; }
`

// ─── Modal ───────────────────────────────────────────────────────────────────

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  cursor: pointer;
  padding: 0.5rem;
`

const ModalClose = styled.button`
  position: fixed;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1.1rem;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(0,0,0,0.9); }
`

const ModalDownload = styled.button`
  position: fixed;
  top: 12px;
  right: 64px;
  background: ${theme.colors.secondary.gold};
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 1rem;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: ${theme.colors.secondary.goldDark}; transform: scale(1.05); }
`

const ModalPrev = styled.button`
  position: fixed;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 52px;
  height: 52px;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(0,0,0,0.9); }
  &:disabled { opacity: 0.25; cursor: default; }
`

const ModalNext = styled(ModalPrev)`
  left: auto;
  right: 10px;
`

const ModalImageWrap = styled.div`
  position: relative;
  width: 90vw;
  height: 80vh;
  max-width: 1100px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalHint = styled.div`
  position: fixed;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-family: ${theme.fonts.body};
  white-space: nowrap;
  z-index: 10001;
`

const ModalInfo = styled.div`
  position: fixed;
  top: 14px;
  left: 14px;
  right: 120px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: ${theme.borderRadius.md};
  font-size: 0.8rem;
  font-family: ${theme.fonts.body};
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  @media (min-width: ${theme.breakpoints.mobile}) {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    max-width: 380px;
  }
`

const ModalVideo = styled.video`
  max-width: 90vw;
  max-height: 80vh;
  border-radius: ${theme.borderRadius.md};
`

// ─── Component ───────────────────────────────────────────────────────────────

export default function PhotoGallery({ isAdmin = false }: { isAdmin?: boolean }) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1, totalPages: 1, totalPhotos: 0,
    hasNextPage: false, hasPrevPage: false, limit: 50,
  })
  const [uploaders, setUploaders] = useState<string[]>([])
  const [uploaderQuery, setUploaderQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imgLoading, setImgLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  // Read upload result from sessionStorage on mount
  useEffect(() => {
    const raw = sessionStorage.getItem('uploadResult')
    if (raw) {
      try { setUploadResult(JSON.parse(raw)) } catch { /* ignore */ }
      sessionStorage.removeItem('uploadResult')
    }
  }, [])

  const fetchPhotos = useCallback(async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true)
      else setLoading(true)
      const params = new URLSearchParams({
        page: String(page),
        limit: '50',
        ...(uploaderQuery ? { uploader: uploaderQuery } : {}),
      })
      const res = await fetch(`/api/photos?${params}`)
      const data = await res.json()
      if (res.ok) {
        setPhotos(prev => append ? [...prev, ...data.photos] : data.photos)
        setPagination(data.pagination)
        if (Array.isArray(data.uploaders)) setUploaders(data.uploaders)
      } else {
        setError(data.error ?? 'Failed to load')
      }
    } catch {
      setError('Failed to load photos. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [uploaderQuery])

  useEffect(() => { fetchPhotos(1) }, [fetchPhotos])

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (loadingMore || !pagination.hasNextPage) return
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollTop + clientHeight >= scrollHeight - 250) {
        fetchPhotos(pagination.currentPage + 1, true)
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [loadingMore, pagination, fetchPhotos])

  // Keyboard + back button in modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedPhoto) return
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    const onPop = (e: PopStateEvent) => {
      if (selectedPhoto) { e.preventDefault(); closeModal() }
    }
    if (selectedPhoto) {
      document.addEventListener('keydown', onKey)
      window.addEventListener('popstate', onPop)
      document.body.style.overflow = 'hidden'
      window.history.pushState({ modal: true }, '')
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('popstate', onPop)
      document.body.style.overflow = ''
    }
  }, [selectedPhoto, selectedIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => { setSelectedPhoto(null); setSelectedIndex(0) }

  const navigate = (dir: number) => {
    const next = selectedIndex + dir
    if (next >= 0 && next < photos.length) {
      setSelectedIndex(next)
      setSelectedPhoto(photos[next])
      setImgLoading(true)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const dist = touchStart - touchEnd
    if (dist > 50) navigate(1)
    if (dist < -50) navigate(-1)
  }

  const downloadPhoto = async (photo: Photo) => {
    try {
      const res = await fetch(photo.url)
      const blob = await res.blob()
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.href = url
      link.download = `rebecca-james-wedding-${photo.filename || 'photo'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      window.open(photo.url, '_blank')
    }
  }

  const deletePhoto = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Delete this photo? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/photos/delete?photoId=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== id))
        if (selectedPhoto?.id === id) closeModal()
      } else {
        alert('Failed to delete photo.')
      }
    } catch {
      alert('Failed to delete photo.')
    } finally {
      setDeleting(null)
    }
  }

  const resultMessage = () => {
    if (!uploadResult) return null
    const { success, failed, total, errors } = uploadResult
    if (failed === 0) {
      return { type: 'success' as const, text: `Successfully shared ${success} ${success !== 1 ? 'memories' : 'memory'}! Thank you!` }
    } else if (success > 0) {
      const errList = errors.slice(0, 3).join('\n')
      return {
        type: 'partial' as const,
        text: `Shared ${success} of ${total}.\n\n${failed} failed:\n${errList}`,
      }
    } else {
      const errList = errors.slice(0, 3).join('\n')
      return { type: 'error' as const, text: `Nothing was shared. All ${total} failed.\n\n${errList}` }
    }
  }

  const result = resultMessage()

  return (
    <Wrap>
      {isAdmin && <AdminBanner>Admin mode — delete buttons are visible</AdminBanner>}

      {result && (
        <ResultBanner $type={result.type}>
          <div style={{ flex: 1 }}>{result.text}</div>
          <CloseBannerBtn onClick={() => setUploadResult(null)}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseBannerBtn>
        </ResultBanner>
      )}

      <Header>
        <UploadBtn href="/photos/upload">
          <FontAwesomeIcon icon={faUpload} />
          <FontAwesomeIcon icon={faImages} />
          Share Your Photos & Videos
        </UploadBtn>

        <SearchBox>
          <SearchLabel>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.8rem' }} />
            Find by name
          </SearchLabel>
          <SearchRow>
            <SearchInput
              type="text"
              placeholder="Type a name..."
              value={uploaderQuery}
              onChange={e => {
                setUploaderQuery(e.target.value)
                if (e.target.value) {
                  setSuggestions(uploaders.filter(u => u.toLowerCase().includes(e.target.value.toLowerCase())))
                  setShowSuggestions(true)
                } else {
                  setShowSuggestions(false)
                }
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {uploaderQuery && (
              <ClearBtn onClick={() => { setUploaderQuery(''); setShowSuggestions(false) }}>
                <FontAwesomeIcon icon={faTimes} />
                Clear
              </ClearBtn>
            )}
            {showSuggestions && suggestions.length > 0 && (
              <Suggestions>
                {suggestions.map(u => (
                  <SuggestionItem key={u} onMouseDown={() => { setUploaderQuery(u); setShowSuggestions(false) }}>
                    <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.7rem' }} />
                    {u}
                  </SuggestionItem>
                ))}
              </Suggestions>
            )}
          </SearchRow>
        </SearchBox>

        {pagination.totalPhotos > 0 && (
          <CountBadge>
            <FontAwesomeIcon icon={faHeart} style={{ color: theme.colors.secondary.gold, fontSize: '0.75rem' }} />
            {pagination.totalPhotos} memories shared
          </CountBadge>
        )}
      </Header>

      {loading && (
        <Grid>
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Grid>
      )}

      {!loading && error && (
        <Empty>
          <EmptyIcon><FontAwesomeIcon icon={faCamera} /></EmptyIcon>
          <p>{error}</p>
        </Empty>
      )}

      {!loading && !error && photos.length === 0 && (
        <Empty>
          <EmptyIcon><FontAwesomeIcon icon={faCamera} /></EmptyIcon>
          <p style={{ fontFamily: theme.fonts.body }}>No photos shared yet — be the first!</p>
        </Empty>
      )}

      {!loading && !error && photos.length > 0 && (
        <>
          <Grid>
            {photos.map((photo, index) => (
              <Card
                key={photo.id}
                onClick={() => { setSelectedPhoto(photo); setSelectedIndex(index); setImgLoading(true) }}
              >
                <CardMedia>
                  {isVideoItem(photo) ? (
                    <>
                      <VideoThumb
                        src={photo.url}
                        preload="metadata"
                        muted
                        playsInline
                        onClick={e => e.stopPropagation()}
                      />
                      <VideoBadge>
                        <FontAwesomeIcon icon={faVideo} style={{ fontSize: '0.6rem' }} />
                        VIDEO
                      </VideoBadge>
                    </>
                  ) : (
                    <Image
                      src={photo.url}
                      alt="Wedding memory"
                      fill
                      unoptimized
                      priority={index < 6}
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  )}
                  {photo.uploadedBy && (
                    <UploaderTag>
                      <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.55rem' }} />
                      {photo.uploadedBy}
                    </UploaderTag>
                  )}
                  {isAdmin && (
                    <DeleteBtn onClick={e => deletePhoto(photo.id, e)} disabled={deleting === photo.id}>
                      <FontAwesomeIcon icon={deleting === photo.id ? faSpinner : faTrash} spin={deleting === photo.id} />
                    </DeleteBtn>
                  )}
                </CardMedia>
              </Card>
            ))}
          </Grid>

          {loadingMore && (
            <Spinner style={{ padding: '1.5rem' }}>
              <FontAwesomeIcon icon={faSpinner} spin />
              Loading more...
            </Spinner>
          )}

          {!pagination.hasNextPage && photos.length > 0 && (
            <Spinner style={{ padding: '1.5rem', color: theme.colors.primary.eucalyptusDark }}>
              <FontAwesomeIcon icon={faHeart} style={{ color: theme.colors.secondary.gold }} />
              All {pagination.totalPhotos} memories loaded
            </Spinner>
          )}
        </>
      )}

      {/* ── Lightbox Modal ── */}
      {selectedPhoto && (
        <Modal onClick={closeModal}>
          <ModalClose onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </ModalClose>

          {!isVideoItem(selectedPhoto) && (
            <ModalDownload onClick={e => { e.stopPropagation(); downloadPhoto(selectedPhoto) }}>
              <FontAwesomeIcon icon={faDownload} />
            </ModalDownload>
          )}

          {selectedPhoto.uploadedBy && (
            <ModalInfo>
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.75rem' }} />
              {selectedPhoto.uploadedBy}
              <span style={{ opacity: 0.7, marginLeft: 'auto' }}>
                {selectedIndex + 1} / {photos.length}
              </span>
            </ModalInfo>
          )}

          <ModalPrev onClick={e => { e.stopPropagation(); navigate(-1) }} disabled={imgLoading || selectedIndex === 0}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </ModalPrev>

          <ModalNext onClick={e => { e.stopPropagation(); navigate(1) }} disabled={imgLoading || selectedIndex === photos.length - 1}>
            <FontAwesomeIcon icon={faChevronRight} />
          </ModalNext>

          <ModalImageWrap
            onClick={e => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {isVideoItem(selectedPhoto) ? (
              <ModalVideo
                src={selectedPhoto.url}
                controls
                autoPlay
                playsInline
                muted={false}
              />
            ) : (
              <>
                {imgLoading && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ color: 'white', fontSize: '1.5rem' }} />
                  </div>
                )}
                <Image
                  src={selectedPhoto.url}
                  alt="Wedding memory"
                  fill
                  unoptimized
                  style={{ objectFit: 'contain' }}
                  onLoad={() => setImgLoading(false)}
                />
              </>
            )}
          </ModalImageWrap>

          <ModalHint>Swipe or arrow keys to navigate • ESC to close</ModalHint>
        </Modal>
      )}
    </Wrap>
  )
}
