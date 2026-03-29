-- ============================================================
-- seeds/ap-physics-1/unit-1/lesson-05-projectile.sql
-- Lesson 5: Projectile Motion
-- Paste your concept note and problems below, then run in Supabase.
-- ============================================================

DO $outer$
DECLARE
  v_subject_id UUID;
  v_unit_id    UUID;
  v_lesson_id  UUID;
  v_note       TEXT;
BEGIN

SELECT id INTO v_subject_id FROM subjects WHERE slug = 'ap-physics-1';
SELECT id INTO v_unit_id    FROM units    WHERE subject_id = v_subject_id AND order_num = 1;

-- ── Concept Note — PASTE YOUR CONTENT BETWEEN THE $note$ TAGS ────────────────
v_note := $note$
TODO: Replace this line with the full lesson 5 concept note content.
$note$;

-- ── Upsert Lesson ─────────────────────────────────────────────────────────────
INSERT INTO lessons (unit_id, title, ap_topic, concept_note, sim_type, estimated_minutes, xp_reward, order_num)
VALUES (v_unit_id, 'Projectile Motion', '1.E', v_note, 'projectile', 20, 30, 5)
ON CONFLICT (unit_id, order_num) DO UPDATE SET
  title             = EXCLUDED.title,
  ap_topic          = EXCLUDED.ap_topic,
  concept_note      = EXCLUDED.concept_note,
  sim_type          = EXCLUDED.sim_type,
  estimated_minutes = EXCLUDED.estimated_minutes,
  xp_reward         = EXCLUDED.xp_reward;

SELECT id INTO v_lesson_id FROM lessons WHERE unit_id = v_unit_id AND order_num = 5;

-- ── Problems — ADD YOUR 10 PROBLEMS HERE ──────────────────────────────────────
DELETE FROM problems WHERE lesson_id = v_lesson_id;

-- INSERT INTO problems (lesson_id, question, options, correct_index, explanation, difficulty, concept) VALUES
-- (v_lesson_id, 'Question text?', '["A","B","C","D"]', 0, 'Explanation.', 1, 'concept name');

RAISE NOTICE 'Lesson 5 seeded (id = %)', v_lesson_id;

END $outer$;
