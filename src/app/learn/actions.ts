'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeLessonAction(
  lessonId: string,
  xpEarned: number,
  score: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  await supabase
    .from('progress')
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      xp_earned: xpEarned,
      score,
      last_seen: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' })

  revalidatePath('/dashboard')
  return { ok: true }
}
