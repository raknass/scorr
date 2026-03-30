'use client'

import { useState } from 'react'
import type { CourseStructure } from '@/lib/queries/course'

interface LessonSidebarProps {
  courseStructure: CourseStructure
  currentLessonId: string
  subjectSlug: string
  /** Controlled by LessonShell — whether sidebar is open on desktop */
  isOpen: boolean
  /** Called on mobile when user taps backdrop to close */
  onClose: () => void
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}hr ${m}min` : `${h}hr`
}

export function LessonSidebar({
  courseStructure,
  currentLessonId,
  subjectSlug,
  isOpen,
  onClose,
}: LessonSidebarProps) {
  // Which units are expanded (default: all expanded)
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(
    () => new Set(courseStructure.units.map(u => u.id))
  )

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => {
      const next = new Set(prev)
      if (next.has(unitId)) next.delete(unitId)
      else next.add(unitId)
      return next
    })
  }

  const sidebar = (
    <aside
      style={{
        width: '260px',
        minWidth: '260px',
        height: '100%',
        background: '#F9FAFB',
        borderRight: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Sidebar header */}
      <div
        style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid #E5E7EB',
          background: '#F9FAFB',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '2px' }}>
          Course
        </p>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
          {courseStructure.subjectTitle}
        </p>
      </div>

      {/* Units + Lessons */}
      <div style={{ flex: 1, paddingBottom: '24px' }}>
        {courseStructure.units.map(unit => {
          const isExpanded = expandedUnits.has(unit.id)
          const progressPct = unit.lessons.length > 0
            ? (unit.completedCount / unit.lessons.length) * 100
            : 0

          return (
            <div key={unit.id}>
              {/* Unit header */}
              <button
                onClick={() => !unit.isLocked && toggleUnit(unit.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  cursor: unit.isLocked ? 'default' : 'pointer',
                  padding: '12px 16px 8px',
                  borderBottom: '1px solid #E5E7EB',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: unit.isLocked ? '#9CA3AF' : '#0F172A',
                      flex: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {unit.isLocked ? '🔒 ' : ''}{unit.title}
                  </span>
                  {!unit.isLocked && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        marginLeft: '6px',
                        transition: 'transform 0.2s ease',
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        display: 'inline-block',
                      }}
                    >
                      ▾
                    </span>
                  )}
                </div>

                {/* Unit meta */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>
                    {unit.lessons.length} lessons · {formatMinutes(unit.totalMinutes)}
                  </span>
                  {!unit.isLocked && (
                    <span style={{ fontSize: '10px', color: '#0D9488', fontWeight: 600 }}>
                      {unit.completedCount}/{unit.lessons.length}
                    </span>
                  )}
                </div>

                {/* Unit progress bar */}
                {!unit.isLocked && (
                  <div style={{ width: '100%', height: '3px', background: '#E5E7EB', borderRadius: '2px' }}>
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
                )}

                {/* Locked hint */}
                {unit.isLocked && (
                  <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px' }}>
                    Complete previous unit to unlock
                  </p>
                )}
              </button>

              {/* Lesson list */}
              {isExpanded && !unit.isLocked && (
                <div>
                  {unit.lessons.map(lesson => {
                    const isCurrent = lesson.id === currentLessonId
                    const isDone = lesson.isCompleted

                    return (
                      <a
                        key={lesson.id}
                        href={`/learn/${subjectSlug}/${unit.id}/${lesson.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '9px 16px 9px 28px',
                          textDecoration: 'none',
                          background: isCurrent ? '#F0FDFA' : 'transparent',
                          borderLeft: isCurrent ? '3px solid #0D9488' : '3px solid transparent',
                          transition: 'background 0.1s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          if (!isCurrent) e.currentTarget.style.background = '#F3F4F6'
                        }}
                        onMouseLeave={e => {
                          if (!isCurrent) e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {/* Status icon */}
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 700,
                            background: isDone ? '#CCFBF1' : isCurrent ? '#E0F2FE' : '#F3F4F6',
                            color: isDone ? '#0D9488' : isCurrent ? '#0284C7' : '#9CA3AF',
                          }}
                        >
                          {isDone ? '✓' : isCurrent ? '→' : lesson.order_num}
                        </div>

                        {/* Lesson info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: '12px',
                              fontWeight: isCurrent ? 600 : 500,
                              color: isCurrent ? '#0D9488' : isDone ? '#6B7280' : '#374151',
                              lineHeight: 1.35,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginBottom: '1px',
                            }}
                          >
                            {lesson.title}
                          </p>
                          <p style={{ fontSize: '10px', color: '#9CA3AF' }}>
                            {lesson.estimated_minutes} min
                          </p>
                        </div>

                        {/* Done checkmark badge */}
                        {isDone && !isCurrent && (
                          <span style={{ fontSize: '12px', color: '#0D9488', flexShrink: 0 }}>✓</span>
                        )}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className="hidden md:flex"
        style={{
          width: isOpen ? '260px' : '0px',
          minWidth: isOpen ? '260px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.25s ease, min-width 0.25s ease',
          height: '100%',
          flexShrink: 0,
        }}
      >
        {sidebar}
      </div>

      {/* Mobile: full-screen drawer overlay */}
      <div className="md:hidden">
        {/* Backdrop */}
        {isOpen && (
          <div
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.5)',
              zIndex: 40,
            }}
          />
        )}
        {/* Drawer */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            zIndex: 50,
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
          }}
        >
          {sidebar}
        </div>
      </div>
    </>
  )
}
