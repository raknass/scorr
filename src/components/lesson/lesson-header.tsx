'use client'

interface LessonHeaderProps {
  lessonTitle: string
  apTopic: string
  estimatedMinutes: number
  unitTitle: string
  subjectTitle: string
  subjectSlug: string
  unitProgressCompleted: number
  unitProgressTotal: number
  xp: number
  userInitials: string
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function LessonHeader({
  lessonTitle,
  apTopic,
  estimatedMinutes,
  unitTitle,
  subjectTitle,
  subjectSlug,
  unitProgressCompleted,
  unitProgressTotal,
  xp,
  userInitials,
  sidebarOpen,
  onToggleSidebar,
}: LessonHeaderProps) {
  const progressPct = unitProgressTotal > 0
    ? Math.round((unitProgressCompleted / unitProgressTotal) * 100)
    : 0

  return (
    <header
      style={{
        height: 'auto',
        background: '#fff',
        borderBottom: '1px solid #E5E7EB',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        zIndex: 10,
        minHeight: '64px',
      }}
    >
      {/* Sidebar toggle */}
      <button
        id="sidebar-toggle"
        onClick={onToggleSidebar}
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        style={{
          flexShrink: 0,
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          background: sidebarOpen ? '#F0FDFA' : '#fff',
          color: sidebarOpen ? '#0D9488' : '#6B7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          fontSize: '16px',
          lineHeight: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#F0FDFA'
          e.currentTarget.style.color = '#0D9488'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = sidebarOpen ? '#F0FDFA' : '#fff'
          e.currentTarget.style.color = sidebarOpen ? '#0D9488' : '#6B7280'
        }}
      >
        ☰
      </button>

      {/* Left: breadcrumb + title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px', flexWrap: 'wrap' }}>
          <a
            href="/dashboard"
            style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'none', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0D9488')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            {subjectTitle}
          </a>
          <span style={{ fontSize: '11px', color: '#D1D5DB' }}>›</span>
          <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>{unitTitle}</span>
          <span style={{ fontSize: '11px', color: '#D1D5DB' }}>›</span>
          <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600 }}>{lessonTitle}</span>
        </div>

        {/* Lesson title */}
        <h1
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {lessonTitle}
        </h1>

        {/* Meta */}
        <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', fontWeight: 500 }}>
          AP Topic {apTopic} · {estimatedMinutes} min read · {unitTitle}
        </p>
      </div>

      {/* Right: XP + progress + avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        {/* XP badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '20px',
            padding: '4px 10px',
          }}
        >
          <span style={{ fontSize: '13px' }}>⭐</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>
            {xp} XP
          </span>
        </div>

        {/* Unit progress */}
        <div
          className="hidden sm:flex"
          style={{ flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}
        >
          <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: 500 }}>
            {unitTitle.split(':')[0]}: {progressPct}% complete
          </span>
          <div style={{ width: '80px', height: '4px', background: '#E5E7EB', borderRadius: '2px' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPct}%`,
                background: '#0D9488',
                borderRadius: '2px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        {/* Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0D9488, #0891B2)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '13px',
            flexShrink: 0,
          }}
        >
          {userInitials}
        </div>
      </div>
    </header>
  )
}
