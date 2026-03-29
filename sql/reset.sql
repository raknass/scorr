-- ============================================================
-- reset.sql — Wipe ALL seeded content (data only, not schema)
-- Run this in Supabase SQL Editor when you want a clean slate.
-- Order matters: children before parents.
-- ============================================================

TRUNCATE TABLE
  problems,
  progress,
  chat_sessions,
  ai_usage,
  lessons,
  units,
  subjects
RESTART IDENTITY CASCADE;
