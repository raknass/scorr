'use client'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface ConceptTabProps {
  conceptNote: string
  estimatedMinutes: number
  onMarkRead: () => void
  isRead: boolean
}

export function ConceptTab({
  conceptNote,
  estimatedMinutes,
  onMarkRead,
  isRead,
}: ConceptTabProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <span className="text-xs text-slate-500 font-medium">
          ⏱ {estimatedMinutes} min read
        </span>
        <button
          onClick={onMarkRead}
          disabled={isRead}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isRead
              ? 'bg-teal-100 text-teal-700 cursor-default'
              : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
          }`}
        >
          {isRead ? '✓ Marked as Read' : 'Mark as Read'}
        </button>
      </div>

      {/* Scrollable concept content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <article className="prose prose-slate max-w-none
          prose-headings:text-slate-800 prose-headings:font-bold
          prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm
          prose-strong:text-slate-800
          prose-blockquote:border-l-4 prose-blockquote:border-teal-400
          prose-blockquote:bg-teal-50 prose-blockquote:py-1 prose-blockquote:px-4
          prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-blockquote:text-slate-700
          prose-table:text-sm prose-th:bg-slate-100 prose-th:text-slate-600
          prose-td:text-slate-700
          prose-code:text-teal-700 prose-code:bg-teal-50 prose-code:px-1 prose-code:rounded
          [&_.katex]:text-slate-800
          [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto
        ">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {conceptNote}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
