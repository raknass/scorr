import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import type { RubricCriterion } from '@/lib/queries/lessons'

// ── Types ───────────────────────────────────────────────────────────────────

interface GradeResult {
  totalScore: number
  maxScore: number
  points: { criterion: string; earned: boolean; feedback: string }[]
  overallFeedback: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function buildSystemPrompt(): string {
  return `You are an expert AP Physics 1 exam grader employed by College Board.

Your task is to grade a student's free-response answer against an official AP rubric.

Rules:
- Award points ONLY for criteria that are explicitly satisfied.
- Be strict but fair — partial credit is not allowed per rubric item.
- For each rubric point, decide: earned (true/false) and give a 1-2 sentence explanation.
- Write overallFeedback as a 2-3 sentence coaching note pointing to the biggest opportunity for improvement.

Respond ONLY with valid JSON in this exact shape — no markdown fences, no commentary:
{
  "totalScore": <int>,
  "maxScore": <int>,
  "points": [
    { "criterion": "<rubric criterion text>", "earned": <true|false>, "feedback": "<brief explanation>" }
  ],
  "overallFeedback": "<coaching paragraph>"
}`
}

function buildUserMessage(
  questionText: string,
  rubric: RubricCriterion[],
  answerText?: string
): string {
  const rubricLines = rubric
    .map((r, i) => `Point ${i + 1} (${r.points} pt${r.points > 1 ? 's' : ''}): ${r.criterion}`)
    .join('\n')

  return [
    `AP EXAM QUESTION:`,
    questionText,
    ``,
    `OFFICIAL RUBRIC (${rubric.reduce((s, r) => s + r.points, 0)} points total):`,
    rubricLines,
    ``,
    `STUDENT ANSWER:`,
    answerText ?? '(no written answer provided)',
  ].join('\n')
}

// ── Route ───────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // 1. Auth
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse body
  let body: {
    questionId?: unknown
    answerText?: unknown
    photoBase64?: unknown
  }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { questionId, answerText, photoBase64 } = body

  if (typeof questionId !== 'string' || !questionId.trim()) {
    return Response.json({ error: 'questionId is required' }, { status: 400 })
  }

  if (
    (typeof answerText !== 'string' || !answerText.trim()) &&
    (typeof photoBase64 !== 'string' || !photoBase64.trim())
  ) {
    return Response.json(
      { error: 'At least one of answerText or photoBase64 is required' },
      { status: 400 }
    )
  }

  // 3. Fetch the question + rubric from DB
  const { data: question, error: qErr } = await supabase
    .from('past_exam_questions')
    .select('*')
    .eq('id', questionId)
    .single()

  if (qErr || !question) {
    return Response.json({ error: 'Question not found' }, { status: 404 })
  }

  const rubric = question.rubric as RubricCriterion[]
  const maxScore = rubric.reduce((s: number, r: RubricCriterion) => s + r.points, 0)

  // 4. Build Claude request
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const userMessageContent: Anthropic.MessageParam['content'] = []

  if (typeof photoBase64 === 'string' && photoBase64.trim()) {
    // Vision: include the question text + rubric as text, image as base64
    userMessageContent.push({
      type: 'text',
      text: buildUserMessage(question.question_text as string, rubric),
    })
    // Strip data URL prefix if present (e.g. "data:image/jpeg;base64,...")
    const base64Data = photoBase64.replace(/^data:[^;]+;base64,/, '')
    const mimeType = photoBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg'

    userMessageContent.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mimeType,
        data: base64Data,
      },
    })
    userMessageContent.push({
      type: 'text',
      text: 'The image above is the student\'s handwritten answer. Grade it against the rubric.',
    })
  } else {
    // Text only
    userMessageContent.push({
      type: 'text',
      text: buildUserMessage(
        question.question_text as string,
        rubric,
        typeof answerText === 'string' ? answerText : undefined
      ),
    })
  }

  // 5. Call Claude
  let result: GradeResult

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2048,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: userMessageContent }],
    })

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text'
    )

    if (!textBlock) throw new Error('No text block in response')

    result = JSON.parse(textBlock.text) as GradeResult
  } catch (err) {
    console.error('[grade-frq] Claude error:', err)
    return Response.json({ error: 'AI grading failed. Please try again.' }, { status: 502 })
  }

  // 6. Save attempt to DB
  await supabase.from('past_exam_attempts').insert({
    user_id: user.id,
    question_id: questionId,
    answer_text: typeof answerText === 'string' ? answerText : null,
    total_score: result.totalScore,
    max_score: maxScore,
    points_detail: result.points,
    overall_feedback: result.overallFeedback,
  })

  return Response.json({ ...result, maxScore })
}
