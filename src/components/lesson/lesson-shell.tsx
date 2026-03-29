'use client'

import { useState } from 'react'
import { BookOpen, Zap, Trophy, MessageCircle } from 'lucide-react'
import { ConceptTab } from './concept-tab'
import { SimulationTab } from './simulation-tab'
import { PracticeTab } from './practice-tab'
import { TutorChat } from './tutor-chat'
import { completeLessonAction } from '@/app/learn/actions'
import type { LessonWithProblems } from '@/lib/queries/lessons'

type LeftTab = 'concept' | 'simulation' | 'practice'

const LEFT_TABS: { id: LeftTab; label: string; icon: React.ReactNode }[] = [
  { id: 'concept', label: 'Concept', icon: <BookOpen size={14} /> },
  { id: 'simulation', label: 'Simulation', icon: <Zap size={14} /> },
  { id: 'practice', label: 'Practice', icon: <Trophy size={14} /> },
]

interface LessonShellProps {
  lesson: LessonWithProblems
  initialWeakConcepts?: string[]
  nextLessonHref: string
}

export function LessonShell({ lesson, initialWeakConcepts = [], nextLessonHref }: LessonShellProps) {
  const [activeTab, setActiveTab] = useState<LeftTab>('concept')
  const [mobileTab, setMobileTab] = useState<LeftTab | 'tutor'>('concept')
  const [isRead, setIsRead] = useState(false)
  const [xp, setXp] = useState(0)
  const [weakConcepts, setWeakConcepts] = useState<string[]>(initialWeakConcepts)

  const handleXpEarned = (amount: number) => setXp(prev => prev + amount)

  const handleWeakConcept = (concept: string) => {
    setWeakConcepts(prev =>
      prev.includes(concept) ? prev : [...prev, concept]
    )
  }

  const handleMarkRead = () => {
    if (!isRead) {
      setIsRead(true)
      setXp(prev => prev + lesson.xp_reward)
    }
  }

  const handleLessonComplete = async (finalXp: number, score: number) => {
    await completeLessonAction(lesson.id, finalXp, score)
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* ── Top bar ── */}
      <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shrink-0 z-10">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-slate-400 hover:text-teal-600 transition-colors text-sm">
            ← Dashboard
          </a>
          <span className="text-slate-200">|</span>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-none">{lesson.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">AP Topic {lesson.ap_topic} · {lesson.estimated_minutes} min</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            ⭐ {xp} XP
          </span>
        </div>
      </header>

      {/* ── DESKTOP layout: 70 / 30 split ── */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left panel — 70% */}
        <div className="flex flex-col" style={{ width: '70%' }}>
          {/* Left tab bar */}
          <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-slate-100 shrink-0">
            {LEFT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Left panel content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'concept' && (
              <ConceptTab
                conceptNote={lesson.concept_note}
                estimatedMinutes={lesson.estimated_minutes}
                onMarkRead={handleMarkRead}
                isRead={isRead}
              />
            )}
            {activeTab === 'simulation' && (
              <SimulationTab simType={lesson.sim_type} lessonTitle={lesson.title} />
            )}
            {activeTab === 'practice' && (
              <PracticeTab
                problems={lesson.problems}
                lessonTitle={lesson.title}
                onXpEarned={handleXpEarned}
                onWeakConceptFound={handleWeakConcept}
                onComplete={handleLessonComplete}
                nextLessonHref={nextLessonHref}
              />
            )}
          </div>
        </div>

        {/* Right divider */}
        <div className="w-px bg-slate-100 shrink-0" />

        {/* Right panel — 30% AI Tutor (always visible) */}
        <div className="flex flex-col overflow-hidden" style={{ width: '30%' }}>
          <TutorChat
            lessonTitle={lesson.title}
            apTopic={lesson.ap_topic}
            weakConcepts={weakConcepts}
            activeTab={activeTab}
          />
        </div>
      </div>

      {/* ── MOBILE layout: Option A (4 tabs) ── */}
      <div className="flex flex-col flex-1 overflow-hidden md:hidden">
        {/* Mobile tab bar */}
        <div className="flex items-center bg-white border-b border-slate-100 shrink-0">
          {[...LEFT_TABS, { id: 'tutor' as const, label: 'AI Tutor', icon: <MessageCircle size={14} /> }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id as LeftTab | 'tutor')}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold transition-all ${
                mobileTab === tab.id
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-slate-400'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile content */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'concept' && (
            <ConceptTab
              conceptNote={lesson.concept_note}
              estimatedMinutes={lesson.estimated_minutes}
              onMarkRead={handleMarkRead}
              isRead={isRead}
            />
          )}
          {mobileTab === 'simulation' && (
            <SimulationTab simType={lesson.sim_type} lessonTitle={lesson.title} />
          )}
          {mobileTab === 'practice' && (
            <PracticeTab
              problems={lesson.problems}
              lessonTitle={lesson.title}
              onXpEarned={handleXpEarned}
              onWeakConceptFound={handleWeakConcept}
              onComplete={handleLessonComplete}
              nextLessonHref={nextLessonHref}
            />
          )}
          {mobileTab === 'tutor' && (
            <TutorChat
              lessonTitle={lesson.title}
              apTopic={lesson.ap_topic}
              weakConcepts={weakConcepts}
              activeTab={mobileTab === 'tutor' ? 'concept' : mobileTab}
            />
          )}
        </div>
      </div>
    </div>
  )
}
