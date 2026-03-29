-- ============================================================
-- CLEANUP: Remove duplicate lessons and units
-- Run this ONCE in Supabase SQL Editor to fix duplicates
-- ============================================================

-- Step 1: Delete problems linked to duplicate lessons (keep earliest per unit+order)
DELETE FROM problems
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE id NOT IN (
    SELECT DISTINCT ON (unit_id, order_num) id
    FROM lessons
    ORDER BY unit_id, order_num, created_at ASC
  )
);

-- Step 2: Delete the duplicate lesson rows themselves
DELETE FROM lessons
WHERE id NOT IN (
  SELECT DISTINCT ON (unit_id, order_num) id
  FROM lessons
  ORDER BY unit_id, order_num, created_at ASC
);

-- Step 3: Delete problems linked to duplicate units (keep earliest per subject+order)
DELETE FROM lessons
WHERE unit_id IN (
  SELECT id FROM units
  WHERE id NOT IN (
    SELECT DISTINCT ON (subject_id, order_num) id
    FROM units
    ORDER BY subject_id, order_num, created_at ASC
  )
);

-- Step 4: Delete the duplicate unit rows
DELETE FROM units
WHERE id NOT IN (
  SELECT DISTINCT ON (subject_id, order_num) id
  FROM units
  ORDER BY subject_id, order_num, created_at ASC
);

-- Step 5: Add unique constraints so this can never happen again
ALTER TABLE lessons
  DROP CONSTRAINT IF EXISTS lessons_unit_order_unique,
  ADD CONSTRAINT lessons_unit_order_unique UNIQUE (unit_id, order_num);

ALTER TABLE units
  DROP CONSTRAINT IF EXISTS units_subject_order_unique,
  ADD CONSTRAINT units_subject_order_unique UNIQUE (subject_id, order_num);

-- Verify: should show exactly 5 rows
SELECT order_num, title FROM lessons ORDER BY order_num;
