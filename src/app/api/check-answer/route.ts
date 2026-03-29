import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { problemId?: unknown; selectedIndex?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { problemId, selectedIndex } = body

  if (typeof problemId !== 'string' || typeof selectedIndex !== 'number') {
    return Response.json({ error: 'problemId and selectedIndex are required' }, { status: 400 })
  }

  // Fetch the correct answer server-side — never exposed to client
  const { data: problem, error } = await supabase
    .from('problems')
    .select('correct_index, explanation, concept, lesson_id')
    .eq('id', problemId)
    .single()

  if (error || !problem) {
    return Response.json({ error: 'Problem not found' }, { status: 404 })
  }

  const correct = selectedIndex === problem.correct_index

  // Update progress: track weak concepts when wrong
  if (!correct) {
    const { data: existing } = await supabase
      .from('progress')
      .select('weak_concepts, attempts')
      .eq('user_id', user.id)
      .eq('lesson_id', problem.lesson_id)
      .single()

    const weakConcepts: string[] = existing?.weak_concepts ?? []
    if (problem.concept && !weakConcepts.includes(problem.concept)) {
      weakConcepts.push(problem.concept)
    }

    await supabase
      .from('progress')
      .upsert({
        user_id: user.id,
        lesson_id: problem.lesson_id,
        attempts: (existing?.attempts ?? 0) + 1,
        weak_concepts: weakConcepts,
        last_seen: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })
  }

  return Response.json({
    correct,
    explanation: problem.explanation,
  })
}
