import { createClient } from '@/lib/supabase/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseLessonMeta = {
  id: string
  title: string
  order_num: number
  estimated_minutes: number
  isCompleted: boolean
}

export type CourseUnit = {
  id: string
  title: string
  order_num: number
  totalMinutes: number
  lessons: CourseLessonMeta[]
  isLocked: boolean
  completedCount: number
}

export type CourseStructure = {
  subjectTitle: string
  subjectSlug: string
  units: CourseUnit[]
}

// ─── Query ────────────────────────────────────────────────────────────────────

export async function getCourseStructure(
  subjectSlug: string,
  userId: string
): Promise<CourseStructure | null> {
  const supabase = await createClient()

  // 1. Get subject
  const { data: subject } = await supabase
    .from('subjects')
    .select('id, title, slug')
    .eq('slug', subjectSlug)
    .single()

  if (!subject) return null

  // 2. Get all units for subject
  const { data: units } = await supabase
    .from('units')
    .select('id, title, order_num')
    .eq('subject_id', subject.id)
    .order('order_num', { ascending: true })

  if (!units || units.length === 0) return null

  // 3. Get all lessons for all units in one query
  const unitIds = units.map(u => u.id)
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, order_num, estimated_minutes, unit_id')
    .in('unit_id', unitIds)
    .order('order_num', { ascending: true })

  if (!lessons) return null

  // 4. Get user progress for all lessons
  const lessonIds = lessons.map(l => l.id)
  const { data: progressRows } = await supabase
    .from('progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)

  const completedSet = new Set(
    (progressRows ?? [])
      .filter(p => p.completed)
      .map(p => p.lesson_id)
  )

  // 5. Build course structure with lock logic
  const courseUnits: CourseUnit[] = units.map((unit, idx) => {
    const unitLessons = lessons
      .filter(l => l.unit_id === unit.id)
      .map(l => ({
        id: l.id,
        title: l.title,
        order_num: l.order_num,
        estimated_minutes: l.estimated_minutes,
        isCompleted: completedSet.has(l.id),
      }))

    const completedCount = unitLessons.filter(l => l.isCompleted).length
    const totalMinutes = unitLessons.reduce((s, l) => s + l.estimated_minutes, 0)

    // Unit N is locked if the previous unit is not fully complete
    let isLocked = false
    if (idx > 0) {
      const prevUnit = units[idx - 1]
      const prevUnitLessons = lessons.filter(l => l.unit_id === prevUnit.id)
      const prevCompleted = prevUnitLessons.filter(l => completedSet.has(l.id)).length
      isLocked = prevCompleted < prevUnitLessons.length
    }

    return {
      id: unit.id,
      title: unit.title,
      order_num: unit.order_num,
      totalMinutes,
      lessons: unitLessons,
      isLocked,
      completedCount,
    }
  })

  return {
    subjectTitle: subject.title,
    subjectSlug: subject.slug,
    units: courseUnits,
  }
}
