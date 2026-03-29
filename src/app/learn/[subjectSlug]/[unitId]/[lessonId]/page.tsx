import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLessonWithProblems, getUserProgress } from '@/lib/queries/lessons'
import { LessonShell } from '@/components/lesson/lesson-shell'

interface Props {
  params: Promise<{ subjectSlug: string; unitId: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { subjectSlug, unitId, lessonId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const [lesson, progress] = await Promise.all([
    getLessonWithProblems(lessonId),
    getUserProgress(user.id, lessonId),
  ])

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 text-sm">
        Lesson not found.
      </div>
    )
  }

  // Find the next lesson in the same unit
  const { data: nextLessonRow } = await supabase
    .from('lessons')
    .select('id')
    .eq('unit_id', lesson.unit_id)
    .gt('order_num', lesson.order_num)
    .order('order_num', { ascending: true })
    .limit(1)
    .single()

  const nextLessonHref = nextLessonRow
    ? `/learn/${subjectSlug}/${unitId}/${nextLessonRow.id}`
    : '/dashboard'

  return (
    <LessonShell
      lesson={lesson}
      initialWeakConcepts={progress?.weak_concepts ?? []}
      nextLessonHref={nextLessonHref}
    />
  )
}
