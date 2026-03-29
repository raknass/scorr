-- ============================================================
-- seeds/ap-physics-1/unit-1/unit.sql
-- Creates Unit 1: Kinematics (idempotent).
-- Run AFTER subject.sql.
-- ============================================================

DO $outer$
DECLARE
  v_subject_id UUID;
BEGIN
  SELECT id INTO v_subject_id FROM subjects WHERE slug = 'ap-physics-1';

  INSERT INTO units (subject_id, title, description, order_num, total_lessons)
  VALUES (
    v_subject_id,
    'Unit 1: Kinematics',
    'Describes motion using position, velocity, and acceleration — the language of all AP Physics.',
    1,
    5
  )
  ON CONFLICT (subject_id, order_num) DO UPDATE SET
    title         = EXCLUDED.title,
    description   = EXCLUDED.description,
    total_lessons = EXCLUDED.total_lessons;
END $outer$;
