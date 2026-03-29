'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TutorChatProps {
  lessonTitle: string
  apTopic: string
  weakConcepts: string[]
  activeTab: 'concept' | 'simulation' | 'practice'
}

const TAB_CONTEXT: Record<string, string> = {
  concept: 'reading the concept note',
  simulation: 'using the interactive simulation',
  practice: 'working through practice problems',
}

export function TutorChat({
  lessonTitle,
  apTopic,
  weakConcepts,
  activeTab,
}: TutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const question = input.trim()
    if (!question || loading || remaining === 0) return

    const tabCtx = TAB_CONTEXT[activeTab]
    const userMessage: Message = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonTitle,
          apTopic,
          weakConcepts,
          studentQuestion: question,
          activeContext: `Student is currently ${tabCtx}.`,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message ?? data.error ?? 'Something went wrong. Please try again.',
        }])
        if (data.remaining !== undefined) setRemaining(data.remaining)
        return
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }])
      if (data.remaining !== undefined) setRemaining(data.remaining)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Network error. Check your connection and try again.',
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const limitReached = remaining === 0

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-sm">🎓</div>
          <div>
            <p className="text-xs font-semibold text-slate-700">AI Physics Tutor</p>
            <p className="text-xs text-slate-400">
              Topic {apTopic} · {TAB_CONTEXT[activeTab]}
            </p>
          </div>
          {remaining !== null && (
            <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
              remaining > 10 ? 'bg-green-100 text-green-700' :
              remaining > 3 ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-600'
            }`}>
              {remaining} left today
            </span>
          )}
        </div>

        {weakConcepts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="text-xs text-slate-400">Weak areas:</span>
            {weakConcepts.slice(0, 3).map(c => (
              <span key={c} className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center pt-6">
            <p className="text-xs text-slate-400 mb-4">Ask me anything about this lesson!</p>
            <div className="space-y-2">
              {[
                `Explain ${lessonTitle} in simple terms`,
                `What are common AP exam mistakes for ${apTopic}?`,
                `Walk me through a practice problem`,
              ].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); inputRef.current?.focus() }}
                  className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 transition-all"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs mr-2 mt-0.5 shrink-0">
                🎓
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-teal-600 text-white rounded-br-sm'
                : 'bg-slate-100 text-slate-800 rounded-bl-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs mr-2 shrink-0">🎓</div>
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-3 py-2">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-slate-100 shrink-0">
        {limitReached ? (
          <div className="text-center py-2 px-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-700 font-medium">Daily limit reached</p>
            <p className="text-xs text-amber-600">Come back tomorrow for more questions!</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about this lesson…"
              disabled={loading}
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-slate-400 disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-9 h-9 flex items-center justify-center bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <Send size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
