import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLessonWithProblems, getUserProgress } from '@/lib/queries/lessons'
import { LessonShell } from '@/components/lesson/lesson-shell'

interface Props {
  params: Promise<{ subjectSlug: string; unitId: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { lessonId } = await params

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

  return (
    <LessonShell
      lesson={lesson}
      initialWeakConcepts={progress?.weak_concepts ?? []}
    />
  )
}
