'use client'

import React, { useState, useRef, useCallback } from 'react'
import { FileText, Camera, Upload, X, Loader2, CheckCircle, XCircle, RotateCcw, GraduationCap } from 'lucide-react'
import type { PastExamQuestion } from '@/lib/queries/lessons'

// ── Types ───────────────────────────────────────────────────────────────────

interface PointResult {
  criterion: string
  earned: boolean
  feedback: string
}

interface GradeResult {
  totalScore: number
  maxScore: number
  points: PointResult[]
  overallFeedback: string
}

interface PastExamsTabProps {
  questions: PastExamQuestion[]
  lessonTitle: string
  onAskTutor?: (context: string) => void
}

type SubmitMode = 'type' | 'photo'
type CardState = 'idle' | 'submitting' | 'graded'

// ── Sub-components ──────────────────────────────────────────────────────────

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    easy:   { label: 'Easy',   color: '#166534', bg: '#DCFCE7' },
    medium: { label: 'Medium', color: '#92400E', bg: '#FEF3C7' },
    hard:   { label: 'Hard',   color: '#991B1B', bg: '#FEE2E2' },
  }
  const { label, color, bg } = map[difficulty] ?? map.medium
  return (
    <span style={{
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 700,
      color,
      background: bg,
      letterSpacing: '0.02em',
    }}>
      {label}
    </span>
  )
}

function ScoreRing({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? score / max : 0
  const r = 32
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - pct)
  const color = pct >= 0.75 ? '#0D9488' : pct >= 0.5 ? '#F59E0B' : '#EF4444'

  return (
    <svg width={84} height={84} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={42} cy={42} r={r} fill="none" stroke="#E5E7EB" strokeWidth={8} />
      <circle
        cx={42} cy={42} r={r}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={dash}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text
        x={42} y={42}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: '42px 42px', fill: '#0F172A', fontSize: 14, fontWeight: 800 }}
      >
        {score}/{max}
      </text>
    </svg>
  )
}

function GradedResults({
  result,
  onTryAgain,
  onAskTutor,
}: {
  result: GradeResult
  onTryAgain: () => void
  onAskTutor?: (ctx: string) => void
}) {
  const pct = result.maxScore > 0 ? result.totalScore / result.maxScore : 0
  const label = pct >= 0.75 ? '🎉 Strong work!' : pct >= 0.5 ? '📈 Good effort.' : '💡 Room to grow.'
  const missedPoints = result.points
    .filter(p => !p.earned)
    .map(p => p.criterion)
    .join('; ')

  return (
    <div style={{ marginTop: 24 }}>
      {/* Score header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '20px 24px',
        background: '#F8FAFC',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        marginBottom: 20,
      }}>
        <ScoreRing score={result.totalScore} max={result.maxScore} />
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            You scored {result.totalScore} out of {result.maxScore} points
          </div>
          <div style={{ fontSize: 13, color: '#64748B' }}>{label}</div>
        </div>
      </div>

      {/* Point-by-point breakdown */}
      <div style={{ marginBottom: 20, border: '0.5px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: '#0F172A', padding: '10px 14px', display: 'flex', gap: 16 }}>
          <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rubric Criterion</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Points</span>
        </div>
        {result.points.map((p, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 16,
            padding: '12px 14px',
            background: i % 2 === 0 ? '#fff' : '#F9FAFB',
            borderTop: '0.5px solid #E5E7EB',
            alignItems: 'flex-start',
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#374151', marginBottom: 2 }}>{p.criterion}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{p.feedback}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              {p.earned ? (
                <><CheckCircle size={16} color="#0D9488" /><span style={{ fontSize: 13, fontWeight: 700, color: '#0D9488' }}>+1</span></>
              ) : (
                <><XCircle size={16} color="#EF4444" /><span style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF' }}>0</span></>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI feedback */}
      <div style={{
        background: '#F0FDFA',
        border: '1px solid #99F6E4',
        borderRadius: 10,
        padding: '14px 16px',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F766E', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Feedback</div>
        <p style={{ fontSize: 14, color: '#134E4A', lineHeight: 1.7, margin: 0 }}>{result.overallFeedback}</p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onTryAgain}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer', color: '#374151',
          }}
        >
          <RotateCcw size={14} /> Try Again
        </button>
        {onAskTutor && missedPoints && (
          <button
            onClick={() => onAskTutor(
              `I missed these AP rubric points: ${missedPoints}. Can you help me understand how to answer them correctly?`
            )}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              border: 'none', background: '#0D9488', cursor: 'pointer', color: '#fff',
              flex: 1,
            }}
          >
            <GraduationCap size={14} /> Ask AI Tutor about missed points
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Question Card ───────────────────────────────────────────────────────

function QuestionCard({
  question,
  onAskTutor,
}: {
  question: PastExamQuestion
  onAskTutor?: (ctx: string) => void
}) {
  const [mode, setMode] = useState<SubmitMode>('type')
  const [answerText, setAnswerText] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [cardState, setCardState] = useState<CardState>('idle')
  const [result, setResult] = useState<GradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = e => setPhotoPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const removePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const canSubmit = mode === 'type' ? answerText.trim().length > 0 : photoFile !== null

  const handleSubmit = async () => {
    if (!canSubmit) return
    setCardState('submitting')
    setError(null)

    try {
      const body: Record<string, unknown> = { questionId: question.id }
      if (mode === 'type') {
        body.answerText = answerText
      } else if (photoPreview) {
        body.photoBase64 = photoPreview
      }

      const res = await fetch('/api/grade-frq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Grading failed')
      setResult(data as GradeResult)
      setCardState('graded')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setCardState('idle')
    }
  }

  const handleTryAgain = () => {
    setAnswerText('')
    setPhotoFile(null)
    setPhotoPreview(null)
    setResult(null)
    setError(null)
    setCardState('idle')
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      border: '1px solid #E5E7EB',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      marginBottom: 24,
    }}>
      {/* Card header */}
      <div style={{
        padding: '16px 22px',
        background: '#F8FAFC',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{
          background: '#0F172A', color: '#fff',
          padding: '3px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        }}>
          {question.year} AP Exam
        </span>
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>
          {question.question_ref}
        </span>
        <span style={{
          marginLeft: 'auto',
          background: '#FEF3C7', color: '#92400E',
          padding: '3px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700,
        }}>
          {question.points} {question.points === 1 ? 'point' : 'points'}
        </span>
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <div style={{ padding: '22px 24px' }}>
        {/* Diagram */}
        {question.diagram_url && (
          <div style={{ marginBottom: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={question.diagram_url}
              alt="Exam diagram"
              style={{ maxWidth: '100%', borderRadius: 8, border: '1px solid #E5E7EB' }}
            />
          </div>
        )}

        {/* Question text */}
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#1E293B', marginBottom: 24, margin: '0 0 24px 0' }}>
          {question.question_text}
        </p>

        {cardState !== 'graded' && (
          <>
            {/* Mode toggle */}
            <div style={{
              display: 'flex',
              background: '#F1F5F9',
              borderRadius: 10,
              padding: 4,
              marginBottom: 16,
              width: 'fit-content',
            }}>
              {(['type', 'photo'] as SubmitMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    background: mode === m ? '#fff' : 'transparent',
                    color: mode === m ? '#0D9488' : '#64748B',
                    boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {m === 'type' ? <><FileText size={13} /> Type Answer</> : <><Camera size={13} /> Photo Upload</>}
                </button>
              ))}
            </div>

            {mode === 'type' ? (
              <div>
                {/* AP Tip */}
                <div style={{
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: 8,
                  padding: '8px 14px',
                  marginBottom: 12,
                  fontSize: 12,
                  color: '#92400E',
                  lineHeight: 1.6,
                }}>
                  <strong>AP Tip:</strong> AP graders award points for method even when the final answer is wrong. Always show your working.
                </div>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={answerText}
                    onChange={e => setAnswerText(e.target.value)}
                    placeholder="Write your answer here. Show all work. Include units on all quantities."
                    rows={6}
                    style={{
                      width: '100%',
                      minHeight: 120,
                      padding: '12px 14px',
                      paddingBottom: 28,
                      borderRadius: 10,
                      border: '1.5px solid #E2E8F0',
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: '#1E293B',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#0D9488')}
                    onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                  />
                  <span style={{
                    position: 'absolute', bottom: 10, right: 14,
                    fontSize: 11, color: '#94A3B8',
                  }}>
                    {answerText.length} chars
                  </span>
                </div>
              </div>
            ) : (
              <div>
                {!photoPreview ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${isDragging ? '#0D9488' : '#CBD5E1'}`,
                      borderRadius: 12,
                      padding: '40px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: isDragging ? '#F0FDFA' : '#FAFAFA',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Camera size={32} color={isDragging ? '#0D9488' : '#94A3B8'} style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                      Take a photo of your handwritten work
                    </p>
                    <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 8 }}>or drag and drop an image here</p>
                    <p style={{ fontSize: 11, color: '#CBD5E1' }}>Accepts: JPG, PNG, HEIC, PDF</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/heic,application/pdf"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files?.[0]
                        if (f) handleFile(f)
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Your handwritten answer"
                      style={{
                        maxWidth: '100%', maxHeight: 320,
                        borderRadius: 10, border: '1.5px solid #E5E7EB',
                        objectFit: 'contain',
                      }}
                    />
                    <button
                      onClick={removePhoto}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        background: '#0F172A', color: '#fff',
                        width: 24, height: 24, borderRadius: 99,
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{
                marginTop: 12, padding: '10px 14px',
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 8, fontSize: 13, color: '#DC2626',
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || cardState === 'submitting'}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '14px 24px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                border: 'none',
                cursor: canSubmit && cardState === 'idle' ? 'pointer' : 'default',
                background: canSubmit ? '#0D9488' : '#F1F5F9',
                color: canSubmit ? '#fff' : '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: canSubmit ? '0 4px 14px rgba(13,148,136,0.2)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cardState === 'submitting' ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  AI is grading your response against the official College Board rubric…
                </>
              ) : (
                <><Upload size={16} /> Submit for AI Grading</>
              )}
            </button>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
          </>
        )}

        {/* Results */}
        {cardState === 'graded' && result && (
          <GradedResults
            result={result}
            onTryAgain={handleTryAgain}
            onAskTutor={onAskTutor}
          />
        )}
      </div>
    </div>
  )
}

// ── Tab Component ────────────────────────────────────────────────────────────

export function PastExamsTab({ questions, lessonTitle, onAskTutor }: PastExamsTabProps) {
  if (questions.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: '#FAFAFA',
      }}>
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E5E7EB',
          borderRadius: 20,
          padding: '48px 40px',
          maxWidth: 440,
          textAlign: 'center',
        }}>
          <div style={{
            width: 64, height: 64,
            background: '#F1F5F9',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <GraduationCap size={28} color="#94A3B8" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>
            Real exam questions coming soon
          </h3>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>
            We're adding official College Board free-response questions for this topic.
            In the meantime, practice with the questions in the <strong>Practice</strong> tab.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: '#F8FAFC',
      padding: '24px',
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
            Real AP Exam Questions — No Answer Key
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0, lineHeight: 1.7 }}>
            These are actual questions from past AP {lessonTitle.includes('Physics') ? 'Physics 1' : 'AP'} exams
            released by College Board. Submit your work for AI grading against the official rubric.
          </p>
        </div>

        {questions.map(q => (
          <QuestionCard key={q.id} question={q} onAskTutor={onAskTutor} />
        ))}

        <div style={{ height: 32 }} />
      </div>
    </div>
  )
}
