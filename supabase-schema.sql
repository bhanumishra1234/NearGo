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
-- 4. ROW LEVEL SECURITY (OWASP Hardened Zero-Trust)
-- ─────────────────────────────────────────────
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes   ENABLE ROW LEVEL SECURITY;

-- 4a. Public Read: Anyone can read questions and answers
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Public read answers"   ON answers   FOR SELECT USING (true);
CREATE POLICY "Public read upvotes"   ON upvotes   FOR SELECT USING (true);

-- 4b. Controlled Insert: Validate title & body non-empty
CREATE POLICY "Public insert questions" ON questions FOR INSERT WITH CHECK (
  length(trim(title)) > 0 AND length(trim(body)) > 0
);
CREATE POLICY "Public insert answers"   ON answers   FOR INSERT WITH CHECK (
  length(trim(body)) > 0
);
CREATE POLICY "Public insert upvotes"   ON upvotes   FOR INSERT WITH CHECK (true);

-- 4c. Atomic Stored Procedures for Secure Upvoting (Prevents Arbitrary Column Modification)
CREATE OR REPLACE FUNCTION increment_question_upvote(target_q_id TEXT)
RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE questions
  SET upvotes = upvotes + 1
  WHERE id = target_q_id
  RETURNING upvotes INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_answer_upvote(target_ans_id TEXT)
RETURNS INT AS $$
DECLARE
  new_count INT;
BEGIN
  UPDATE answers
  SET upvotes = upvotes + 1
  WHERE id = target_ans_id
  RETURNING upvotes INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4d. Anti-Tampering Trigger: Disallow client modification of verified status or reputation directly on INSERT or UPDATE
CREATE OR REPLACE FUNCTION protect_verified_credentials()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent anonymous callers from claiming verified badges or arbitrary reputation on INSERT
  IF (auth.role() = 'anon' OR auth.role() IS NULL) THEN
    IF (NEW.author_verified IS TRUE) THEN
      NEW.author_verified = FALSE;
      NEW.author_badge = 'Community Traveler';
    END IF;
    IF (NEW.author_reputation > 50) THEN
      NEW.author_reputation = 10;
    END IF;
  END IF;

  -- On UPDATE: Disallow untrusted elevation from false to true
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.author_verified IS FALSE AND NEW.author_verified IS TRUE AND (auth.role() = 'anon' OR auth.role() IS NULL)) THEN
      NEW.author_verified = FALSE;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_protect_question_verified ON questions;
CREATE TRIGGER trg_protect_question_verified
  BEFORE INSERT OR UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION protect_verified_credentials();

DROP TRIGGER IF EXISTS trg_protect_answer_verified ON answers;
CREATE TRIGGER trg_protect_answer_verified
  BEFORE INSERT OR UPDATE ON answers
  FOR EACH ROW EXECUTE FUNCTION protect_verified_credentials();

-- ─────────────────────────────────────────────
-- 5. INDEXES for fast map + search queries
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_questions_city     ON questions(city);
CREATE INDEX IF NOT EXISTS idx_questions_vibe     ON questions(vibe_category);
CREATE INDEX IF NOT EXISTS idx_questions_location ON questions(lat, lng);
CREATE INDEX IF NOT EXISTS idx_answers_question   ON answers(question_id);
