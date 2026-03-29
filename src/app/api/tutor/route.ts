import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const DAILY_LIMIT = 20

const SYSTEM_PROMPT = `You are an expert AP Physics tutor. Your role is to help students \
understand physics concepts at the AP level (both AP Physics 1 and AP Physics C).

Guidelines:
- Explain concepts clearly using precise physics terminology
- Show step-by-step reasoning for problem solving
- Connect ideas to the student's identified weak concepts when relevant
- Reference the specific AP topic and lesson context in your explanations
- Use equations with proper notation (e.g., F = ma, ΔKE = W_net)
- Highlight common AP exam misconceptions and pitfalls
- Keep responses focused and exam-oriented — students need to apply this on the AP exam
- If a student's question contains a misconception, gently correct it before explaining

Always be encouraging and build student confidence alongside content knowledge.`

export async function POST(request: Request) {
  // 1. Authenticate
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse and validate request body
  let body: {
    lessonTitle?: unknown
    apTopic?: unknown
    weakConcepts?: unknown
    studentQuestion?: unknown
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { lessonTitle, apTopic, weakConcepts, studentQuestion } = body

  if (
    typeof lessonTitle !== 'string' || !lessonTitle.trim() ||
    typeof apTopic !== 'string' || !apTopic.trim() ||
    typeof studentQuestion !== 'string' || !studentQuestion.trim()
  ) {
    return Response.json(
      { error: 'lessonTitle, apTopic, and studentQuestion are required strings.' },
      { status: 400 }
    )
  }

  // 3. Enforce daily limit
  const todayStart = new Date()
  todayStart.setUTCHours(0, 0, 0, 0)

  const { count, error: countError } = await supabase
    .from('ai_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', todayStart.toISOString())

  if (countError) {
    console.error('[tutor] usage count error:', countError)
    return Response.json({ error: 'Failed to check usage limit.' }, { status: 500 })
  }

  if ((count ?? 0) >= DAILY_LIMIT) {
    return Response.json(
      {
        error: 'Daily limit reached.',
        message: `You have used all ${DAILY_LIMIT} questions for today. Come back tomorrow!`,
        remaining: 0,
      },
      { status: 429 }
    )
  }

  // 4. Record usage before the API call to prevent races
  const { error: insertError } = await supabase
    .from('ai_usage')
    .insert({ user_id: user.id })

  if (insertError) {
    console.error('[tutor] usage insert error:', insertError)
    return Response.json({ error: 'Failed to record usage.' }, { status: 500 })
  }

  // 5. Build user message
  const weakConceptsList =
    Array.isArray(weakConcepts) && weakConcepts.length > 0
      ? `\nIdentified weak concepts: ${weakConcepts.join(', ')}`
      : typeof weakConcepts === 'string' && weakConcepts.trim()
        ? `\nIdentified weak concepts: ${weakConcepts}`
        : ''

  const userMessage =
    `Lesson: ${lessonTitle}\n` +
    `AP Topic: ${apTopic}` +
    weakConceptsList +
    `\n\nStudent question: ${studentQuestion}`

  // 6. Call Claude — stream internally to avoid HTTP timeouts, return final text
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 64000,
      thinking: { type: 'adaptive' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const message = await stream.finalMessage()

    const textBlock = message.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    )

    return Response.json({
      answer: textBlock?.text ?? '',
      remaining: DAILY_LIMIT - (count ?? 0) - 1,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    })
  } catch (err) {
    // Roll back the usage row so the failed request doesn't count
    await supabase
      .from('ai_usage')
      .delete()
      .eq('user_id', user.id)
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)

    if (err instanceof Anthropic.AuthenticationError) {
      console.error('[tutor] Anthropic auth error — check ANTHROPIC_API_KEY')
      return Response.json({ error: 'AI service misconfigured.' }, { status: 500 })
    }

    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'AI service rate limited. Try again shortly.' }, { status: 503 })
    }

    if (err instanceof Anthropic.APIError) {
      console.error(`[tutor] Anthropic API error ${err.status}:`, err.message)
      return Response.json({ error: 'AI service error.' }, { status: 502 })
    }

    console.error('[tutor] unexpected error:', err)
    return Response.json({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
