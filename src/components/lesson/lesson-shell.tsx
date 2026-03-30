'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Zap, Trophy, MessageCircle } from 'lucide-react'
import { LessonHeader } from './lesson-header'
import { LessonSidebar } from './lesson-sidebar'
import { LessonNav } from './lesson-nav'
import { ConceptTab } from './concept-tab'
import { SimulationTab } from './simulation-tab'
import { PracticeTab } from './practice-tab'
import { TutorChat } from './tutor-chat'
import { completeLessonAction } from '@/app/learn/actions'
import type { LessonWithProblems } from '@/lib/queries/lessons'
import type { CourseStructure } from '@/lib/queries/course'

// ─── Types ────────────────────────────────────────────────────────────────────

type LeftTab = 'concept' | 'simulation' | 'practice'

const LEFT_TABS: { id: LeftTab; label: string; icon: React.ReactNode }[] = [
  { id: 'concept',    label: 'Concept',    icon: <BookOpen size={13} /> },
  { id: 'simulation', label: 'Simulation', icon: <Zap size={13} /> },
  { id: 'practice',  label: 'Practice',   icon: <Trophy size={13} /> },
]

interface LessonShellProps {
  lesson: LessonWithProblems
  initialWeakConcepts?: string[]
  nextLessonHref: string
  nextLessonTitle?: string | null
  prevLessonHref?: string | null
  prevLessonTitle?: string | null
  courseStructure: CourseStructure
  subjectSlug: string
  userInitials: string
}

const SIDEBAR_KEY = 'scorr_sidebar_open'

// ─── Component ────────────────────────────────────────────────────────────────

export function LessonShell({
  lesson,
  initialWeakConcepts = [],
  nextLessonHref,
  nextLessonTitle,
  prevLessonHref,
  prevLessonTitle,
  courseStructure,
  subjectSlug,
  userInitials,
}: LessonShellProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]     = useState<LeftTab>('concept')
  const [mobileTab, setMobileTab]     = useState<LeftTab | 'tutor'>('concept')
  const [isRead,    setIsRead]        = useState(false)
  const [xp,        setXp]            = useState(0)
  const [weakConcepts, setWeakConcepts] = useState<string[]>(initialWeakConcepts)
  const [sidebarOpen, setSidebarOpen] = useState(true)   // default true, corrected from localStorage below

  // Restore sidebar state from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY)
    if (stored !== null) setSidebarOpen(stored === 'true')
  }, [])

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false)
    }
    if (mq.matches) setSidebarOpen(false)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(prev => {
      const next = !prev
      localStorage.setItem(SIDEBAR_KEY, String(next))
      return next
    })
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleXpEarned = (amount: number) => setXp(prev => prev + amount)

  const handleWeakConcept = (concept: string) =>
    setWeakConcepts(prev => prev.includes(concept) ? prev : [...prev, concept])

  const handleMarkRead = () => {
    if (!isRead) {
      setIsRead(true)
      setXp(prev => prev + lesson.xp_reward)
    }
  }

  const handleLessonComplete = async (finalXp: number, score: number) => {
    await completeLessonAction(lesson.id, finalXp, score)
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  // Find the unit this lesson belongs to (for header meta)
  const currentUnit = courseStructure.units.find(u =>
    u.lessons.some(l => l.id === lesson.id)
  )
  const unitProgressCompleted = currentUnit?.completedCount ?? 0
  const unitProgressTotal     = currentUnit?.lessons.length ?? 0

  // ── Tab bar (shared between desktop content panel) ─────────────────────────
  const TabBar = ({ current, onChange }: { current: LeftTab; onChange: (t: LeftTab) => void }) => (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid #E5E7EB',
        background: '#fff',
        flexShrink: 0,
      }}
    >
      {LEFT_TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: current === tab.id ? '#0D9488' : '#6B7280',
            borderBottom: current === tab.id ? '2px solid #0D9488' : '2px solid transparent',
            marginBottom: '-1px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => {
            if (current !== tab.id) e.currentTarget.style.color = '#374151'
          }}
          onMouseLeave={e => {
            if (current !== tab.id) e.currentTarget.style.color = '#6B7280'
          }}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  )

  // ── Nav footer props ───────────────────────────────────────────────────────
  const navProps = {
    prevHref:  prevLessonHref  ?? null,
    prevTitle: prevLessonTitle ?? null,
    nextHref:  nextLessonHref !== '/dashboard' ? nextLessonHref : null,
    nextTitle: nextLessonTitle ?? null,
  }

  const conceptTabShared = {
    conceptNote:         lesson.concept_note,
    estimatedMinutes:    lesson.estimated_minutes,
    onMarkRead:          handleMarkRead,
    isRead,
    onNavigateToSim:     () => setActiveTab('simulation'),
    onNavigateToPractice:() => setActiveTab('practice'),
  }

  const practiceTabShared = {
    problems:              lesson.problems,
    lessonTitle:           lesson.title,
    onXpEarned:            handleXpEarned,
    onWeakConceptFound:    handleWeakConcept,
    onComplete:            handleLessonComplete,
    nextLessonHref:        nextLessonHref,
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F9FAFB', overflow: 'hidden' }}>

      {/* ── Global header ── */}
      <LessonHeader
        lessonTitle={lesson.title}
        apTopic={lesson.ap_topic}
        estimatedMinutes={lesson.estimated_minutes}
        unitTitle={currentUnit?.title ?? 'Unit'}
        subjectTitle={courseStructure.subjectTitle}
        subjectSlug={subjectSlug}
        unitProgressCompleted={unitProgressCompleted}
        unitProgressTotal={unitProgressTotal}
        xp={xp}
        userInitials={userInitials}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* ── Body row: sidebar + content + tutor ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <LessonSidebar
          courseStructure={courseStructure}
          currentLessonId={lesson.id}
          subjectSlug={subjectSlug}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* ── DESKTOP: content + tutor ── */}
        <div className="hidden md:flex" style={{ flex: 1, overflow: 'hidden' }}>

          {/* Content panel — 70% */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: '0 0 70%', overflow: 'hidden' }}>
            <TabBar current={activeTab} onChange={setActiveTab} />

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {activeTab === 'concept' && (
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <ConceptTab {...conceptTabShared} />
                  </div>
                  <LessonNav {...navProps} />
                </div>
              )}
              {activeTab === 'simulation' && (
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <SimulationTab simType={lesson.sim_type} lessonTitle={lesson.title} />
                  </div>
                  <LessonNav {...navProps} />
                </div>
              )}
              {activeTab === 'practice' && (
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <PracticeTab {...practiceTabShared} />
                  </div>
                  <LessonNav {...navProps} />
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', background: '#E5E7EB', flexShrink: 0 }} />

          {/* AI Tutor — 30% */}
          <div style={{ flex: '0 0 30%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TutorChat
              lessonTitle={lesson.title}
              apTopic={lesson.ap_topic}
              weakConcepts={weakConcepts}
              activeTab={activeTab}
            />
          </div>
        </div>

        {/* ── MOBILE: stacked tabs ── */}
        <div className="flex flex-col flex-1 overflow-hidden md:hidden">
          {/* Mobile tab bar */}
          <div
            style={{
              display: 'flex',
              background: '#fff',
              borderBottom: '1px solid #E5E7EB',
              flexShrink: 0,
            }}
          >
            {[
              ...LEFT_TABS,
              { id: 'tutor' as const, label: 'AI Tutor', icon: <MessageCircle size={13} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setMobileTab(tab.id as LeftTab | 'tutor')}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '8px 4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: mobileTab === tab.id ? '#0D9488' : '#9CA3AF',
                  borderBottom: mobileTab === tab.id ? '2px solid #0D9488' : '2px solid transparent',
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {mobileTab === 'concept' && (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <ConceptTab
                    {...conceptTabShared}
                    onNavigateToSim={() => setMobileTab('simulation')}
                    onNavigateToPractice={() => setMobileTab('practice')}
                  />
                </div>
                <LessonNav {...navProps} />
              </div>
            )}
            {mobileTab === 'simulation' && (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <SimulationTab simType={lesson.sim_type} lessonTitle={lesson.title} />
                </div>
                <LessonNav {...navProps} />
              </div>
            )}
            {mobileTab === 'practice' && (
              <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <PracticeTab {...practiceTabShared} />
                </div>
                <LessonNav {...navProps} />
              </div>
            )}
            {mobileTab === 'tutor' && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <TutorChat
                  lessonTitle={lesson.title}
                  apTopic={lesson.ap_topic}
                  weakConcepts={weakConcepts}
                  activeTab="concept"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
