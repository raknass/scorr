import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLessonWithProblems, getUserProgress } from '@/lib/queries/lessons'
import { getCourseStructure } from '@/lib/queries/course'
import { LessonShell } from '@/components/lesson/lesson-shell'

interface Props {
  params: Promise<{ subjectSlug: string; unitId: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { subjectSlug, unitId, lessonId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  // Fetch all data in parallel
  const [lesson, progress, courseStructure] = await Promise.all([
    getLessonWithProblems(lessonId),
    getUserProgress(user.id, lessonId),
    getCourseStructure(subjectSlug, user.id),
  ])

  if (!lesson || !courseStructure) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500 text-sm">
        Lesson not found.
      </div>
    )
  }

  // Find next lesson in same unit
  const { data: nextLessonRow } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('unit_id', lesson.unit_id)
    .gt('order_num', lesson.order_num)
    .order('order_num', { ascending: true })
    .limit(1)
    .single()

  // Find previous lesson in same unit
  const { data: prevLessonRow } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('unit_id', lesson.unit_id)
    .lt('order_num', lesson.order_num)
    .order('order_num', { ascending: false })
    .limit(1)
    .single()

  const nextLessonHref  = nextLessonRow
    ? `/learn/${subjectSlug}/${unitId}/${nextLessonRow.id}`
    : '/dashboard'
  const prevLessonHref  = prevLessonRow
    ? `/learn/${subjectSlug}/${unitId}/${prevLessonRow.id}`
    : null

  // Derive user initials from email
  const emailPrefix = user.email?.split('@')[0] ?? 'U'
  const userInitials = emailPrefix.slice(0, 2).toUpperCase()

  return (
    <LessonShell
      lesson={lesson}
      initialWeakConcepts={progress?.weak_concepts ?? []}
      nextLessonHref={nextLessonHref}
      nextLessonTitle={nextLessonRow?.title ?? null}
      prevLessonHref={prevLessonHref}
      prevLessonTitle={prevLessonRow?.title ?? null}
      courseStructure={courseStructure}
      subjectSlug={subjectSlug}
      userInitials={userInitials}
    />
  )
}
