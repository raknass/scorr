'use client'

import { useState } from 'react'
import type { Problem } from '@/lib/queries/lessons'

interface PracticeTabProps {
  problems: Problem[]
  lessonTitle: string
  onXpEarned: (xp: number) => void
  onWeakConceptFound: (concept: string) => void
  onComplete: (finalXp: number, score: number) => Promise<void>
  nextLessonHref: string
}

type AnswerState = 'idle' | 'correct' | 'wrong' | 'revealed'

export function PracticeTab({
  problems,
  onXpEarned,
  onWeakConceptFound,
  onComplete,
  nextLessonHref,
}: PracticeTabProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [explanation, setExplanation] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [earnedXp, setEarnedXp] = useState(0)
  const [saving, setSaving] = useState(false)

  const problem = problems[currentIdx]
  const totalProblems = problems.length
  const completedCount = completed.size

  const handleSubmit = async () => {
    if (selected === null || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problemId: problem.id, selectedIndex: selected }),
      })
      const data = await res.json()

      setExplanation(data.explanation)
      if (data.correct) {
        setAnswerState('correct')
        setCompleted(prev => new Set(prev).add(currentIdx))
        const gained = 5
        setEarnedXp(prev => prev + gained)
        onXpEarned(gained)
      } else {
        setAnswerState('wrong')
        if (problem.concept) onWeakConceptFound(problem.concept)
      }
    } catch {
      setExplanation('Could not check answer. Please try again.')
      setAnswerState('wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    setCurrentIdx(i => i + 1)
    setSelected(null)
    setAnswerState('idle')
    setExplanation('')
  }

  const handleReveal = () => {
    setAnswerState('revealed')
  }

  // ── Completion screen: must check BEFORE the null guard below ──────────────
  const allDone = currentIdx >= totalProblems

  if (allDone) {
    const handleFinish = async () => {
      setSaving(true)
      await onComplete(earnedXp, completedCount)
      setSaving(false)
      window.location.href = nextLessonHref
    }

    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
        <div className="text-5xl">🎉</div>
        <h3 className="text-xl font-bold text-slate-800">Lesson Complete!</h3>
        <p className="text-slate-500 text-sm">
          You got <span className="font-bold text-teal-600">{completedCount}</span> of {totalProblems} correct · +{earnedXp} XP
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={handleFinish}
            disabled={saving}
            className="w-full py-3 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving…' : nextLessonHref === '/dashboard' ? '← Back to Dashboard' : 'Next Lesson →'}
          </button>
          <button
            onClick={() => { setCurrentIdx(0); setCompleted(new Set()); setAnswerState('idle'); setSelected(null); setEarnedXp(0) }}
            className="w-full py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50"
          >
            Practice Again
          </button>
        </div>
      </div>
    )
  }

  // ── Problem not loaded yet (safety guard) ──────────────────────────────────
  const isFRQ = problem?.question.startsWith('[FRQ]')
  const options: string[] = isFRQ ? [] : (problem?.options ?? [])

  if (!problem) return null

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500">
            Problem {currentIdx + 1} of {totalProblems}
          </span>
          <span className="text-xs font-semibold text-teal-600">
            {completedCount} correct
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalProblems) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
            problem.difficulty === 1 ? 'bg-green-100 text-green-700' :
            problem.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {problem.difficulty === 1 ? 'Easy' : problem.difficulty === 2 ? 'Medium' : 'Hard'}
          </span>
          {isFRQ && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
              FRQ
            </span>
          )}
          <span className="text-xs text-slate-400">{problem.concept}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
        <p className="text-slate-800 font-medium text-sm leading-relaxed">
          {problem.question.replace('[FRQ] ', '')}
        </p>

        {/* MCQ Options */}
        {!isFRQ && (
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              let optionStyle = 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50'
              if (selected === i && answerState === 'idle') {
                optionStyle = 'border-teal-500 bg-teal-50 text-teal-800'
              } else if (answerState !== 'idle' && answerState !== 'wrong') {
                // Show correct answer
                optionStyle = 'border-slate-200 bg-white cursor-default'
              } else if (answerState === 'wrong') {
                if (selected === i) optionStyle = 'border-red-400 bg-red-50 cursor-default'
                else optionStyle = 'border-slate-200 bg-white cursor-default'
              }

              return (
                <button
                  key={i}
                  onClick={() => answerState === 'idle' && setSelected(i)}
                  disabled={answerState !== 'idle'}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${optionStyle}`}
                >
                  <span className="text-slate-400 font-mono mr-2 text-xs">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* FRQ prompt */}
        {isFRQ && (
          <div className="rounded-xl bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-700">
            Write out your full answer on paper, then check it against the explanation below.
          </div>
        )}

        {/* Feedback */}
        {answerState === 'correct' && (
          <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            <p className="font-bold mb-1">✓ Correct! +5 XP</p>
            <p>{explanation}</p>
          </div>
        )}
        {(answerState === 'wrong' || answerState === 'revealed') && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            <p className="font-bold mb-1">
              {answerState === 'wrong' ? '✗ Not quite.' : '📖 Explanation'}
            </p>
            <p>{explanation || problem.explanation}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex gap-3">
        {answerState === 'idle' && !isFRQ && (
          <>
            <button
              onClick={handleSubmit}
              disabled={selected === null || loading}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Checking…' : 'Submit Answer'}
            </button>
          </>
        )}
        {answerState === 'idle' && isFRQ && (
          <button
            onClick={handleReveal}
            className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
          >
            Show Explanation
          </button>
        )}
        {answerState !== 'idle' && (
          <>
            {answerState === 'wrong' && (
              <button
                onClick={() => { setSelected(null); setAnswerState('idle'); setExplanation('') }}
                className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
              >
                Try Again
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-all"
            >
              {currentIdx + 1 < totalProblems ? 'Next Problem →' : 'Finish'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
