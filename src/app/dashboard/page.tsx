import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { getUnit1Lessons } from '@/lib/queries/lessons'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/sign-in')

  const lessons = await getUnit1Lessons()

  // Fetch user progress for all lessons
  const { data: progressRows } = await supabase
    .from('progress')
    .select('lesson_id, completed, score, xp_earned')
    .eq('user_id', user.id)

  const progressMap = new Map(progressRows?.map(p => [p.lesson_id, p]) ?? [])
  const completedCount = [...progressMap.values()].filter(p => p.completed).length
  const totalXp = [...progressMap.values()].reduce((sum, p) => sum + (p.xp_earned ?? 0), 0)
  const firstIncomplete = lessons.find(l => !progressMap.get(l.id)?.completed)
  const nextLesson = firstIncomplete ?? lessons[0]

  // Predicted AP score (simple heuristic: 1 + progress × 4)
  const predictedScore = lessons.length > 0
    ? (1 + (completedCount / lessons.length) * 4).toFixed(1)
    : '—'

  const subjectSlug = 'ap-physics-1'
  const unitId = nextLesson?.unit_id ?? ''

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-slate-800">Scorr</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{user.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Your Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">AP Physics 1 · Unit 1: Kinematics</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Predicted AP Score', value: predictedScore, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: 'Lessons Completed', value: `${completedCount} / ${lessons.length}`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Total XP Earned', value: `⭐ ${totalXp}`, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-2xl ${bg} p-5 text-center`}>
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Unit card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Unit 1: Kinematics</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {completedCount} of {lessons.length} lessons complete
              </p>
            </div>
            {nextLesson && (
              <a
                href={`/learn/${subjectSlug}/${unitId}/${nextLesson.id}`}
                className="px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-all active:scale-95"
              >
                {completedCount === 0 ? 'Start Learning →' : 'Continue →'}
              </a>
            )}
          </div>

          {/* Progress bar */}
          <div className="px-6 py-3 bg-slate-50">
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Lesson list */}
          <div className="divide-y divide-slate-50">
            {lessons.map((lesson, idx) => {
              const progress = progressMap.get(lesson.id)
              const done = progress?.completed ?? false
              const isCurrent = nextLesson?.id === lesson.id
              const isLocked = !done && !isCurrent && idx > (completedCount)

              return (
                <a
                  key={lesson.id}
                  href={isLocked ? '#' : `/learn/${subjectSlug}/${lesson.unit_id}/${lesson.id}`}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                    isLocked
                      ? 'opacity-40 cursor-not-allowed'
                      : isCurrent
                      ? 'bg-teal-50 hover:bg-teal-100'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Status icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    done ? 'bg-teal-100 text-teal-600' :
                    isCurrent ? 'bg-indigo-100 text-indigo-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {done ? '✓' : idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isCurrent ? 'text-teal-700' :
                      done ? 'text-slate-500' :
                      'text-slate-700'
                    }`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      AP {lesson.ap_topic} · {lesson.estimated_minutes} min · {lesson.xp_reward} XP
                    </p>
                  </div>

                  {isCurrent && (
                    <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2.5 py-1 rounded-full shrink-0">
                      Next
                    </span>
                  )}
                  {done && (
                    <span className="text-xs font-semibold text-slate-400">
                      {progress?.score ?? 0} pts
                    </span>
                  )}
                </a>
              )
            })}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          AP Chemistry coming soon · AP Physics 2 on the roadmap
        </p>
      </div>
    </main>
  )
}
