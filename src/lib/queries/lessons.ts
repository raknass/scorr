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

export type LessonWithProblems = Lesson & { problems: Problem[] }

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

  return { ...lesson, problems: problems ?? [] }
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

  const { data } = await supabase
    .from('lessons')
    .select('*')
    .order('order_num', { ascending: true })
    .limit(5)

  return data ?? []
}
