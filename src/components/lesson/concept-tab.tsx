'use client'

import { useRef } from 'react'
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

  return (
    <div className="flex flex-col h-full">
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
        <button
          onClick={onMarkRead}
          disabled={isRead}
          style={{
            padding: '6px 18px',
            borderRadius: '99px',
            fontSize: '12px',
            fontWeight: 600,
            border: 'none',
            cursor: isRead ? 'default' : 'pointer',
            background: isRead ? '#CCFBF1' : '#0D9488',
            color: isRead ? '#0F766E' : '#fff',
            transition: 'all 0.2s ease',
          }}
        >
          {isRead ? '✓ Marked as Read' : 'Mark as Read'}
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px 32px',
          scrollBehavior: 'smooth',
        }}
      >
        <ConceptNoteRenderer
          conceptNote={conceptNote}
          onNavigateToSim={onNavigateToSim}
          onNavigateToPractice={onNavigateToPractice}
          scrollContainerRef={scrollRef}
        />
      </div>
    </div>
  )
}
