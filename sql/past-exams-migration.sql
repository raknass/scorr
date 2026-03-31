-- Past Exam Questions tab schema migration
-- Run this in the Supabase SQL Editor

-- ── past_exam_questions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.past_exam_questions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id     uuid REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  year          int NOT NULL,                         -- e.g. 2023
  exam_type     text NOT NULL DEFAULT 'AP Physics 1',
  question_ref  text NOT NULL,                        -- e.g. "Free Response Q2, Part (a)"
  points        int NOT NULL DEFAULT 4,
  difficulty    text CHECK (difficulty IN ('easy', 'medium', 'hard')) NOT NULL DEFAULT 'medium',
  question_text text NOT NULL,
  diagram_url   text,                                 -- optional Supabase Storage URL
  rubric        jsonb NOT NULL DEFAULT '[]',          -- [{criterion, points}]
  created_at    timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.past_exam_questions ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read questions
CREATE POLICY "Authenticated users can read past exam questions"
  ON public.past_exam_questions FOR SELECT
  USING (auth.role() = 'authenticated');

-- ── past_exam_attempts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.past_exam_attempts (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id      uuid REFERENCES public.past_exam_questions(id) ON DELETE CASCADE NOT NULL,
  answer_text      text,
  photo_url        text,
  total_score      int,
  max_score        int,
  points_detail    jsonb,    -- [{criterion, earned, feedback}]
  overall_feedback text,
  created_at       timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.past_exam_attempts ENABLE ROW LEVEL SECURITY;

-- Users can only see and insert their own attempts
CREATE POLICY "Users can read own attempts"
  ON public.past_exam_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON public.past_exam_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);


-- ── Example seed data (uncomment and edit IDs to test) ────────────────────────
-- INSERT INTO public.past_exam_questions (lesson_id, year, exam_type, question_ref, points, difficulty, question_text, rubric)
-- VALUES (
--   '<your-lesson-id-here>',
--   2023,
--   'AP Physics 1',
--   'Free Response Q1, Part (a)',
--   4,
--   'medium',
--   'A student stands at position x = +5 m east of a lamppost and walks to x = −2 m west of the lamppost. (a) Calculate the distance traveled and (b) the displacement of the student. Include appropriate units and direction for displacement.',
--   '[
--     {"criterion": "Correctly identifies distance as total path length", "points": 1},
--     {"criterion": "Correct distance value with units: 7 m", "points": 1},
--     {"criterion": "Correctly identifies displacement as change in position (Δx = x_f − x_i)", "points": 1},
--     {"criterion": "Correct displacement value with direction: −7 m (or 7 m west)", "points": 1}
--   ]'::jsonb
-- );
