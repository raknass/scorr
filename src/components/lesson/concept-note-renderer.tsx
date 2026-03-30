'use client'

import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import type { Components } from 'react-markdown'
import { getDiagramForSection, LessonDiagram } from './lesson-diagrams'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ConceptNoteRendererProps {
  conceptNote: string
  onNavigateToSim?: () => void
  onNavigateToPractice?: () => void
  /** The scrollable container ref for progress tracking */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>
}

// ─── Context tracking for section type detection ──────────────────────────────

type SectionContext =
  | 'default'
  | 'worked-example'
  | 'self-check'
  | 'connection'
  | 'key-formula'
  | 'ap-exam-traps'

function detectH2Context(text: string): SectionContext {
  const lower = text.toLowerCase()
  if (lower.includes('worked example') || lower.includes('example')) return 'worked-example'
  if (lower.includes('self-check') || lower.includes('self check')) return 'self-check'
  if (lower.includes('connection')) return 'connection'
  if (lower.includes('key formula') || lower.includes('key formulae')) return 'key-formula'
  if (lower.includes('ap exam trap') || lower.includes('trap')) return 'ap-exam-traps'
  return 'default'
}

function isApTip(text: string): boolean {
  return /ap exam tip:|ap tip:/i.test(text)
}

function isTrapH3(text: string): boolean {
  return /trap|ap exam trap/i.test(text)
}

function isWorkedExampleH3(text: string): boolean {
  return /worked example|example/i.test(text)
}

function isStepParagraph(text: string): boolean {
  return /^\s*(\(a\)|\(b\)|\(c\)|\(d\)|step\s*\d+|\d+\.\s)/i.test(text)
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgressBar({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = scrollContainerRef?.current
    const target = container || window

    const handleScroll = () => {
      if (container) {
        const scrollTop = container.scrollTop
        const scrollHeight = container.scrollHeight - container.clientHeight
        if (scrollHeight > 0) setProgress(Math.round((scrollTop / scrollHeight) * 100))
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        if (scrollHeight > 0) setProgress(Math.round((scrollTop / scrollHeight) * 100))
      }
    }

    target.addEventListener('scroll', handleScroll, { passive: true })
    return () => target.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  return (
    <div style={{ position: 'relative' }}>
      {/* Bar track */}
      <div
        style={{
          width: '100%',
          height: '4px',
          background: '#E2E8F0',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#0D9488',
            transition: 'width 0.15s ease',
          }}
        />
      </div>
      {/* Percentage label */}
      <div
        style={{
          position: 'absolute',
          right: '12px',
          top: '6px',
          fontSize: '10px',
          fontWeight: 600,
          color: '#0D9488',
          letterSpacing: '0.03em',
        }}
      >
        {progress}% read
      </div>
    </div>
  )
}

// ─── Self-Check Section ────────────────────────────────────────────────────────

function SelfCheckSection({ children }: { children: React.ReactNode }) {
  const [showAnswers, setShowAnswers] = useState(false)
  // Split children into questions vs answers by looking for an <hr> or "Answers:" heading
  return (
    <div
      style={{
        background: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px' }}>🧠</span>
        <span
          style={{
            color: '#1E40AF',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Self-Check
        </span>
      </div>
      <div style={{ color: '#1E3A5F', fontSize: '14px', lineHeight: 1.7 }}>{children}</div>
      <button
        onClick={() => setShowAnswers(v => !v)}
        style={{
          marginTop: '16px',
          background: showAnswers ? '#0D9488' : 'transparent',
          border: '1.5px solid #0D9488',
          borderRadius: '8px',
          padding: '8px 20px',
          color: showAnswers ? '#fff' : '#0D9488',
          fontWeight: 600,
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {showAnswers ? '▲ Hide Answers' : '▼ Show Answers'}
      </button>
      {showAnswers && (
        <div
          style={{
            marginTop: '12px',
            padding: '14px 16px',
            background: '#F0FDF4',
            borderRadius: '8px',
            border: '1px solid #BBF7D0',
            color: '#14532D',
            fontSize: '14px',
            lineHeight: 1.7,
            animation: 'fadeSlideIn 0.25s ease',
          }}
        >
          <span style={{ fontWeight: 700, color: '#15803D', display: 'block', marginBottom: '6px' }}>
            ✓ Answers
          </span>
          Refer to your notes and the simulation to verify your work.
        </div>
      )}
    </div>
  )
}

// ─── Worked Example Section ───────────────────────────────────────────────────

let workedExampleCounter = 0

function WorkedExampleSection({ label, children }: { label: string; children: React.ReactNode }) {
  workedExampleCounter++
  return (
    <div
      style={{
        background: '#FAFFFE',
        border: '1px solid rgba(13,148,136,0.25)',
        borderRadius: '12px',
        overflow: 'hidden',
        margin: '20px 0',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: '#0D9488',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 700 }}>
          {workedExampleCounter}
        </span>
        <span style={{ color: '#fff', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label || 'Worked Example'}
        </span>
      </div>
      <div style={{ padding: '16px 20px', fontSize: '14px', color: '#0F172A', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  )
}

// ─── AP Exam Traps Section ────────────────────────────────────────────────────

function ApExamTrapsSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#FFFBEB',
        borderLeft: '4px solid #F59E0B',
        borderRadius: '0 8px 8px 0',
        padding: '14px 18px',
        margin: '16px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ fontSize: '16px' }}>⚠️</span>
        <span
          style={{
            color: '#92400E',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          AP Exam Traps
        </span>
      </div>
      <div style={{ color: '#78350F', fontSize: '14px', lineHeight: 1.7 }}>{children}</div>
    </div>
  )
}

// ─── Key Formula Section ──────────────────────────────────────────────────────

function KeyFormulaSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#0F172A',
        borderRadius: '12px',
        padding: '24px 28px',
        margin: '20px 0',
        textAlign: 'center',
      }}
    >
      <div style={{ marginBottom: '8px' }}>
        <span
          style={{
            background: '#F59E0B',
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 10px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          Memorize This
        </span>
      </div>
      <div
        style={{
          color: '#0D9488',
          fontFamily: 'monospace',
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: 1.5,
          marginTop: '8px',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Connection Section ───────────────────────────────────────────────────────

function ConnectionSection({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#F3F4F6',
        borderRadius: '8px',
        padding: '14px 18px',
        margin: '16px 0',
        fontSize: '13px',
        color: '#374151',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <span style={{ fontSize: '15px' }}>🔗</span>
        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Connections
        </span>
      </div>
      {children}
    </div>
  )
}

// ─── Completion Card ──────────────────────────────────────────────────────────

function CompletionCard({
  onNavigateToSim,
  onNavigateToPractice,
}: {
  onNavigateToSim?: () => void
  onNavigateToPractice?: () => void
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0D9488 0%, #0891B2 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        margin: '32px 0 16px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(13,148,136,0.25)',
      }}
    >
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
      <p
        style={{
          color: '#fff',
          fontWeight: 700,
          fontSize: '16px',
          marginBottom: '6px',
        }}
      >
        You've covered the key concepts.
      </p>
      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '20px' }}>
        Ready to test yourself?
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {onNavigateToSim && (
          <button
            onClick={onNavigateToSim}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.6)',
              borderRadius: '10px',
              padding: '10px 22px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            Try the Simulation →
          </button>
        )}
        {onNavigateToPractice && (
          <button
            onClick={onNavigateToPractice}
            style={{
              background: '#fff',
              border: '1.5px solid #fff',
              borderRadius: '10px',
              padding: '10px 22px',
              color: '#0D9488',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F0FDFA'
              e.currentTarget.style.color = '#065F46'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#0D9488'
            }}
          >
            Go to Practice →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Step Badge Paragraph ──────────────────────────────────────────────────────

function StepBadgeParagraph({ text, rest }: { text: string; rest: React.ReactNode }) {
  const match = text.match(/^\s*(\(([a-d])\)|[Ss]tep\s*(\d+)|(\d+)\.\s)/i)
  if (!match) return null
  const label = match[2]?.toUpperCase() || match[3] || match[4] || '1'
  const remainder = text.slice(match[0].length)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
      <div
        style={{
          minWidth: '26px',
          height: '26px',
          background: '#0D9488',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: '11px',
          marginTop: '2px',
          flexShrink: 0,
        }}
      >
        {label}
      </div>
      <span
        style={{
          fontSize: '14px',
          color: '#0F172A',
          lineHeight: 1.75,
          paddingLeft: '0',
        }}
      >
        {remainder}
        {rest}
      </span>
    </div>
  )
}

// ─── Section State Machine ────────────────────────────────────────────────────
// We use a ref-based mutable context so custom renderers can share state
// without triggering re-renders.

interface RenderContext {
  currentSection: SectionContext
  inWorkedExample: boolean
  inApTraps: boolean
  inSelfCheck: boolean
  inConnection: boolean
  inKeyFormula: boolean
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConceptNoteRenderer({
  conceptNote,
  onNavigateToSim,
  onNavigateToPractice,
  scrollContainerRef,
}: ConceptNoteRendererProps) {
  const ctxRef = useRef<RenderContext>({
    currentSection: 'default',
    inWorkedExample: false,
    inApTraps: false,
    inSelfCheck: false,
    inConnection: false,
    inKeyFormula: false,
  })

  // Reset counter each render so numbers stay stable across re-renders
  workedExampleCounter = 0

  const components: Components = {
    // ── Skip H1 (shown in lesson header) ───────────────────────────────────
    h1: () => null,

    // ── H2 — section dividers ───────────────────────────────────────────────
    h2: ({ children }) => {
      const text = typeof children === 'string' ? children : String(children ?? '')
      const ctx = detectH2Context(text)
      const diagramKey = getDiagramForSection(text)

      // Reset all flags
      ctxRef.current.inWorkedExample = ctx === 'worked-example'
      ctxRef.current.inApTraps = ctx === 'ap-exam-traps'
      ctxRef.current.inSelfCheck = ctx === 'self-check'
      ctxRef.current.inConnection = ctx === 'connection'
      ctxRef.current.inKeyFormula = ctx === 'key-formula'
      ctxRef.current.currentSection = ctx

      const diagram = diagramKey ? <LessonDiagram id={diagramKey} /> : null

      // AP Exam Traps header
      if (ctx === 'ap-exam-traps') {
        return (
          <>
            <div
              style={{
                borderLeft: '4px solid #F59E0B',
                background: '#FFFBEB',
                padding: '10px 16px',
                marginTop: '24px',
                marginBottom: '12px',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>⚠️</span>
              <span style={{ color: '#92400E', fontWeight: 700, fontSize: '15px', letterSpacing: '0.02em' }}>
                {text}
              </span>
            </div>
            {diagram}
          </>
        )
      }

      // Self-Check header
      if (ctx === 'self-check') {
        return (
          <>
            <div
              style={{
                borderLeft: '4px solid #3B82F6',
                background: '#EFF6FF',
                padding: '10px 16px',
                marginTop: '24px',
                marginBottom: '12px',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🧠</span>
              <span style={{ color: '#1E40AF', fontWeight: 700, fontSize: '15px' }}>
                {text}
              </span>
            </div>
            {diagram}
          </>
        )
      }

      // Key Formula header
      if (ctx === 'key-formula') {
        return (
          <>
            <div
              style={{
                borderLeft: '4px solid #0D9488',
                background: '#F8FAFC',
                padding: '10px 16px',
                marginTop: '24px',
                marginBottom: '4px',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>📐</span>
              <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '15px' }}>
                {text}
              </span>
            </div>
            {diagram}
          </>
        )
      }

      // Worked Example header
      if (ctx === 'worked-example') {
        workedExampleCounter++
        return (
          <>
            <div
              style={{
                background: '#0D9488',
                padding: '10px 16px',
                marginTop: '24px',
                marginBottom: '0',
                borderRadius: '12px 12px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#fff',
                  fontWeight: 700,
                }}
              >
                {workedExampleCounter}
              </span>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {text}
              </span>
            </div>
            {diagram}
          </>
        )
      }

      // Connection header
      if (ctx === 'connection') {
        return (
          <>
            <div
              style={{
                borderLeft: '4px solid #6B7280',
                background: '#F3F4F6',
                padding: '10px 16px',
                marginTop: '24px',
                marginBottom: '12px',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🔗</span>
              <span style={{ color: '#111827', fontWeight: 700, fontSize: '15px' }}>
                {text}
              </span>
            </div>
            {diagram}
          </>
        )
      }

      // Default H2
      return (
        <>
          <div
            style={{
              borderLeft: '4px solid #0D9488',
              background: '#F8FAFC',
              padding: '10px 16px',
              marginTop: '24px',
              marginBottom: '12px',
              borderRadius: '0 8px 8px 0',
            }}
          >
            <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '16px' }}>
              {children}
            </span>
          </div>
          {diagram}
        </>
      )
    },

    // ── H3 — sub-headings ────────────────────────────────────────────────────
    h3: ({ children }) => {
      const text = typeof children === 'string' ? children : String(children ?? '')
      const diagramKey = getDiagramForSection(text)
      const diagram = diagramKey ? <LessonDiagram id={diagramKey} /> : null

      if (isTrapH3(text)) {
        return (
          <>
            <div
              style={{
                borderLeft: '4px solid #F59E0B',
                background: '#FFFBEB',
                padding: '10px 14px',
                marginBottom: '10px',
                marginTop: '8px',
                borderRadius: '0 8px 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '14px' }}>⚠️</span>
              <span style={{ color: '#92400E', fontWeight: 600, fontSize: '14px' }}>
                {children}
              </span>
            </div>
            {diagram}
          </>
        )
      }

      return (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '16px',
              marginBottom: '8px',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                background: '#0D9488',
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '14px' }}>
              {children}
            </span>
          </div>
          {diagram}
        </>
      )
    },

    // ── Paragraphs ───────────────────────────────────────────────────────────
    p: ({ children }) => {
      // Extract text content for detection
      const text = React.Children.toArray(children)
        .map(c => (typeof c === 'string' ? c : ''))
        .join('')

      // AP Tip detection
      if (isApTip(text)) {
        const cleaned = text.replace(/^(ap exam tip:|ap tip:)\s*/i, '')
        return (
          <div
            style={{
              borderLeft: '4px solid #0D9488',
              background: '#E6FFFA',
              padding: '10px 14px',
              marginBottom: '14px',
              marginTop: '4px',
              borderRadius: '0 8px 8px 0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <span
              style={{
                background: '#0D9488',
                color: '#fff',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                marginTop: '1px',
              }}
            >
              AP TIP
            </span>
            <span style={{ fontSize: '14px', color: '#134E4A', lineHeight: 1.75 }}>
              {cleaned}
            </span>
          </div>
        )
      }

      // Step badge detection (within worked example or general)
      if (isStepParagraph(text)) {
        const match = text.match(/^\s*(\(([a-d])\)|[Ss]tep\s*(\d+)|(\d+)\.\s)/i)
        if (match) {
          const label = match[2]?.toUpperCase() || match[3] || match[4] || '1'
          const remainder = text.slice(match[0].length)
          return (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
              <div
                style={{
                  minWidth: '26px',
                  height: '26px',
                  background: '#0D9488',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '11px',
                  marginTop: '2px',
                  flexShrink: 0,
                }}
              >
                {label}
              </div>
              <span style={{ fontSize: '14px', color: '#0F172A', lineHeight: 1.75 }}>
                {remainder}
              </span>
            </div>
          )
        }
      }

      // Default paragraph
      return (
        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.75,
            color: '#374151',
            marginBottom: '12px',
          }}
        >
          {children}
        </p>
      )
    },

    // ── Bold ─────────────────────────────────────────────────────────────────
    strong: ({ children }) => (
      <strong style={{ color: '#0F172A', fontWeight: 600 }}>{children}</strong>
    ),

    // ── Inline code ──────────────────────────────────────────────────────────
    code: ({ children, className }) => {
      // Code blocks (fenced) will be wrapped in <pre><code>
      // Inline code has no className
      const isBlock = className?.startsWith('language-')
      if (isBlock) {
        return (
          <code
            style={{
              color: '#e2e8f0',
              fontFamily: 'monospace',
              fontSize: '15px',
              display: 'block',
            }}
          >
            {children}
          </code>
        )
      }
      return (
        <code
          style={{
            background: '#E6FFFA',
            color: '#0D9488',
            fontFamily: 'monospace',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {children}
        </code>
      )
    },

    // ── Code blocks (pre) ────────────────────────────────────────────────────
    pre: ({ children }) => (
      <div style={{ margin: '16px 0' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#0D9488',
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 10px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '0',
          }}
        >
          Key Formula
        </div>
        <pre
          style={{
            background: '#0F172A',
            color: '#E2E8F0',
            borderLeft: '4px solid #0D9488',
            borderRadius: '0 8px 8px 8px',
            padding: '16px 20px',
            fontFamily: 'monospace',
            fontSize: '15px',
            overflowX: 'auto',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {children}
        </pre>
      </div>
    ),

    // ── Blockquote ───────────────────────────────────────────────────────────
    blockquote: ({ children }) => (
      <div
        style={{
          borderLeft: '4px solid #F59E0B',
          background: '#FFFBEB',
          padding: '12px 16px',
          borderRadius: '0 8px 8px 0',
          margin: '12px 0',
          color: '#78350F',
          fontSize: '14px',
          lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    ),

    // ── Tables ───────────────────────────────────────────────────────────────
    table: ({ children }) => (
      <div
        className="cnr-card-white"
        style={{
          background: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '0.5px solid #E5E7EB',
          margin: '16px 0',
          fontSize: '14px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead style={{ background: '#0F172A', color: '#fff' }}>{children}</thead>
    ),

    tr: ({ children }) => (
      <tr className="cnr-tr"
        style={{
          borderBottom: '0.5px solid #E5E7EB',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#F0FDFA')}
        onMouseLeave={e => (e.currentTarget.style.background = '')}
      >
        {children}
      </tr>
    ),

    th: ({ children }) => (
      <th
        style={{
          padding: '10px 14px',
          fontWeight: 600,
          textAlign: 'left',
          color: '#fff',
          fontSize: '13px',
          letterSpacing: '0.04em',
        }}
      >
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td
        style={{
          padding: '10px 14px',
          color: '#374151',
          borderRight: '0.5px solid #E5E7EB',
        }}
      >
        {children}
      </td>
    ),

    // ── Lists ─────────────────────────────────────────────────────────────────
    ul: ({ children }) => (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '8px 0 12px 0',
        }}
      >
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol
        style={{
          listStyle: 'none',
          counterReset: 'scorr-ol',
          padding: 0,
          margin: '8px 0 12px 0',
        }}
      >
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => {
      // Detect if inside ol via parent check — we'll use a simple heuristic
      return (
        <li
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '14px',
            lineHeight: 1.7,
            color: '#374151',
            marginBottom: '4px',
            paddingLeft: '4px',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              background: '#0D9488',
              borderRadius: '50%',
              marginTop: '8px',
              flexShrink: 0,
            }}
          />
          <span style={{ flex: 1 }}>{children}</span>
        </li>
      )
    },

    // ── Horizontal Rule ───────────────────────────────────────────────────────
    hr: () => (
      <hr
        style={{
          border: 'none',
          borderTop: '1.5px solid #E5E7EB',
          margin: '20px 0',
        }}
      />
    ),
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Reading progress bar */}
      <ReadingProgressBar scrollContainerRef={scrollContainerRef} />

      {/* Animated keyframes injection */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cnr-tr:nth-child(even) { background: #F9FAFB; }
        .cnr-tr:nth-child(odd) { background: #fff; }
        @media (prefers-color-scheme: dark) {
          .cnr-card-white   { background: #1E293B !important; }
          .cnr-bg-gray      { background: #1E293B !important; }
          .cnr-text-body    { color: #CBD5E1 !important; }
        }
      `}</style>

      {/* Main content */}
      <div style={{ padding: '0 0 8px 0' }}>
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
          components={components}
        >
          {conceptNote}
        </ReactMarkdown>
      </div>

      {/* Completion card */}
      <CompletionCard
        onNavigateToSim={onNavigateToSim}
        onNavigateToPractice={onNavigateToPractice}
      />
    </div>
  )
}
