import { createClient } from '@/lib/supabase/server'

export type Lesson = {
  id: string
  title: string
  ap_topic: string
  concept_note: string
  sim_type: string | null
  estimated_minutes: number
  xp_reward: number
  order_num: number
  unit_id: string
  podcast_url: string | null
  podcast_duration: string | null
  podcast_transcript: string | null
}

export type Problem = {
  id: string
  lesson_id: string
  question: string
  options: string[]
  explanation: string
  difficulty: number
  concept: string
}

export type UserProgress = {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number
  attempts: number
  xp_earned: number
  weak_concepts: string[]
}

export type RubricCriterion = {
  criterion: string
  points: number
}

export type PastExamQuestion = {
  id: string
  lesson_id: string
  year: number
  exam_type: string
  question_ref: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  question_text: string
  diagram_url: string | null
  rubric: RubricCriterion[]
  created_at: string
}

export type LessonWithProblems = Lesson & {
  problems: Problem[]
  pastExamQuestions: PastExamQuestion[]
}

export async function getLessonWithProblems(
  lessonId: string
): Promise<LessonWithProblems | null> {
  const supabase = await createClient()

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()

  if (lessonError || !lesson) return null

  // Fetch problems WITHOUT correct_index — never send answer to client
  const { data: problems, error: probError } = await supabase
    .from('problems')
    .select('id, lesson_id, question, options, explanation, difficulty, concept')
    .eq('lesson_id', lessonId)
    .order('difficulty', { ascending: true })

  if (probError) return null

  // Fetch past exam questions for this lesson
  const { data: pastExamQuestions } = await supabase
    .from('past_exam_questions')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('year', { ascending: false })

  return {
    ...lesson,
    problems: problems ?? [],
    pastExamQuestions: (pastExamQuestions ?? []) as PastExamQuestion[],
  }
}

export async function getUserProgress(
  userId: string,
  lessonId: string
): Promise<UserProgress | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  return data ?? null
}

export async function getUnit1Lessons(): Promise<Lesson[]> {
  const supabase = await createClient()

  // Join through units to scope to AP Physics 1 only
  const { data: units } = await supabase
    .from('units')
    .select('id')
    .eq('subject_id', (
      await supabase
        .from('subjects')
        .select('id')
        .eq('slug', 'ap-physics-1')
        .single()
    ).data?.id ?? '')
    .order('order_num', { ascending: true })
    .limit(1)

  const unitId = units?.[0]?.id
  if (!unitId) return []

  const { data } = await supabase
    .from('lessons')
    .select('*')
    .eq('unit_id', unitId)
    .order('order_num', { ascending: true })

  return data ?? []
}

export async function markLessonComplete(
  userId: string,
  lessonId: string,
  xpEarned: number,
  score: number
): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      xp_earned: xpEarned,
      score,
      last_seen: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })
}
