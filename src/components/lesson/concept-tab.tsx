'use client'

import { useRef, useState, useEffect } from 'react'
import { ConceptNoteRenderer } from './concept-note-renderer'

interface ConceptTabProps {
  conceptNote: string
  estimatedMinutes: number
  onMarkRead: () => void
  isRead: boolean
  onNavigateToSim?: () => void
  onNavigateToPractice?: () => void
}

export function ConceptTab({
  conceptNote,
  estimatedMinutes,
  onMarkRead,
  isRead,
  onNavigateToSim,
  onNavigateToPractice,
}: ConceptTabProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight - container.clientHeight
      if (scrollHeight > 0) {
        setScrollProgress(Math.round((scrollTop / scrollHeight) * 100))
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const canMarkRead = isRead || scrollProgress >= 80

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* ── Header bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          borderBottom: '1px solid #F1F5F9',
          background: '#FAFAFA',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
          ⏱ {estimatedMinutes} min read
        </span>
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px 32px',
          scrollBehavior: 'smooth',
          background: '#fff',
        }}
      >
        <ConceptNoteRenderer
          conceptNote={conceptNote}
          onNavigateToSim={onNavigateToSim}
          onNavigateToPractice={onNavigateToPractice}
          scrollContainerRef={scrollRef}
        />

        {/* ── Mark as Read Button ── */}
        <div style={{ marginTop: '30px', paddingBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onMarkRead}
            disabled={isRead || !canMarkRead}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '14px 24px',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: 700,
              border: 'none',
              cursor: (isRead || !canMarkRead) ? 'default' : 'pointer',
              background: isRead ? '#F0FDFA' : canMarkRead ? '#0D9488' : '#F1F5F9',
              color: isRead ? '#0F766E' : canMarkRead ? '#fff' : '#94A3B8',
              boxShadow: (canMarkRead && !isRead) ? '0 4px 12px rgba(13,148,136,0.2)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {isRead ? '✓ Marked as Read' : canMarkRead ? 'Mark as Read' : `Read more to complete (${scrollProgress}%)`}
          </button>
        </div>
      </div>
    </div>
  )
}
