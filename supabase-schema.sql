-- ============================================================
-- NearGo Database Schema for Supabase (PostgreSQL)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. QUESTIONS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id            TEXT PRIMARY KEY DEFAULT 'q-' || extract(epoch from now())::bigint,
  community     TEXT DEFAULT 'c/DelhiLocal',
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  city          TEXT DEFAULT 'Delhi NCR',
  location_name TEXT,
  lat           FLOAT,
  lng           FLOAT,
  category      TEXT DEFAULT 'general',
  vibe_category TEXT DEFAULT 'student_budget',
  tags          TEXT[] DEFAULT '{}',

  -- Author (denormalised for simplicity — no auth yet)
  author_name       TEXT DEFAULT 'Anonymous Traveler',
  author_badge      TEXT DEFAULT 'Curious Traveler',
  author_badge_color TEXT DEFAULT 'amber',
  author_verified   BOOLEAN DEFAULT FALSE,
  author_reputation INT DEFAULT 10,

  upvotes    INT DEFAULT 1,
  photos     TEXT[] DEFAULT '{}',

  -- Fare check snapshot (JSON blob)
  fare_check  JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 2. ANSWERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS answers (
  id          TEXT PRIMARY KEY DEFAULT 'ans-' || extract(epoch from now())::bigint,
  question_id TEXT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,

  body        TEXT NOT NULL,
  insider_tip TEXT,
  photos      TEXT[] DEFAULT '{}',
  upvotes     INT DEFAULT 1,

  -- Map pin
  pin_lat          FLOAT,
  pin_lng          FLOAT,
  pin_name         TEXT,
  pin_neighborhood TEXT,
  pin_type         TEXT DEFAULT 'gem',

  -- Author
  author_name       TEXT DEFAULT 'Verified Local',
  author_badge      TEXT DEFAULT 'Verified Local',
  author_badge_color TEXT DEFAULT 'emerald',
  author_verified   BOOLEAN DEFAULT TRUE,
  author_reputation INT DEFAULT 150,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- 3. UPVOTES TABLE (prevent duplicate upvotes later)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upvotes (
  id          SERIAL PRIMARY KEY,
  target_type TEXT NOT NULL, -- 'question' or 'answer'
  target_id   TEXT NOT NULL,
  session_id  TEXT NOT NULL, -- browser fingerprint / future user id
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(target_type, target_id, session_id)
);

-- ─────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY (open read, open write for now)
-- ─────────────────────────────────────────────
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes   ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read answers"   ON answers   FOR SELECT USING (true);

-- Allow anyone to insert (open community — add auth later)
CREATE POLICY "Public insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert answers"   ON answers   FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert upvotes"   ON upvotes   FOR INSERT WITH CHECK (true);

-- Allow upvote count updates
CREATE POLICY "Public update question upvotes" ON questions FOR UPDATE USING (true);
CREATE POLICY "Public update answer upvotes"   ON answers   FOR UPDATE USING (true);

-- ─────────────────────────────────────────────
-- 5. INDEXES for fast map + search queries
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_questions_city     ON questions(city);
CREATE INDEX IF NOT EXISTS idx_questions_vibe     ON questions(vibe_category);
CREATE INDEX IF NOT EXISTS idx_questions_location ON questions(lat, lng);
CREATE INDEX IF NOT EXISTS idx_answers_question   ON answers(question_id);
