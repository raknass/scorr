-- ============================================================
-- seeds/ap-physics-1/subject.sql
-- Creates the AP Physics 1 subject row (idempotent).
-- Run once before any unit/lesson files.
-- ============================================================

INSERT INTO subjects (slug, title, description, ap_exam_date, total_units)
VALUES (
  'ap-physics-1',
  'AP Physics 1',
  'Algebra-based AP Physics covering mechanics, waves, and circuits.',
  '2026-05-11',
  7
)
ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  description  = EXCLUDED.description,
  ap_exam_date = EXCLUDED.ap_exam_date,
  total_units  = EXCLUDED.total_units;
