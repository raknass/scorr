'use client'

interface LessonNavProps {
  prevHref?: string | null
  prevTitle?: string | null
  nextHref?: string | null
  nextTitle?: string | null
}

export function LessonNav({ prevHref, prevTitle, nextHref, nextTitle }: LessonNavProps) {
  if (!prevHref && !nextHref) return null

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px 20px',
        borderTop: '1px solid #E5E7EB',
        background: '#FAFAFA',
        flexShrink: 0,
      }}
    >
      {/* Previous */}
      <div style={{ flex: 1 }}>
        {prevHref && prevTitle && (
          <a
            href={prevHref}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 14px',
              border: '1.5px solid #E5E7EB',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              background: '#fff',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0D9488'
              e.currentTarget.style.background = '#F0FDFA'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E5E7EB'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500, marginBottom: '2px' }}>
              ← Previous
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {prevTitle}
            </span>
          </a>
        )}
      </div>

      {/* Next */}
      <div style={{ flex: 1 }}>
        {nextHref && nextTitle && (
          <a
            href={nextHref}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              padding: '10px 14px',
              border: '1.5px solid #E5E7EB',
              borderRadius: '10px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              background: '#fff',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0D9488'
              e.currentTarget.style.background = '#F0FDFA'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#E5E7EB'
              e.currentTarget.style.background = '#fff'
            }}
          >
            <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500, marginBottom: '2px' }}>
              Next →
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {nextTitle}
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
