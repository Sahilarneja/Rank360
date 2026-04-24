-- ── Extensions ─────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Tables ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  slug         VARCHAR(300) UNIQUE NOT NULL,
  summary      TEXT,
  content      TEXT,
  category     VARCHAR(100) NOT NULL DEFAULT 'news',
  image_url    TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  tags         JSONB DEFAULT '[]',
  seo_meta     JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS live_updates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  type       VARCHAR(50) DEFAULT 'news',
  data       JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_articles_slug         ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category     ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags         ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_live_updates_created  ON live_updates(created_at DESC);

-- ── Seed categories ─────────────────────────────────────────────
INSERT INTO categories (name, slug, description) VALUES
  ('JEE',        'jee',        'JEE Main and Advanced news, results, cutoffs'),
  ('NEET',       'neet',       'NEET UG and PG news, results, counselling'),
  ('CUET',       'cuet',       'CUET UG and PG news, results, admissions'),
  ('Admissions', 'admissions', 'College admissions, counselling, seat allotment'),
  ('Results',    'results',    'Exam results and scorecards'),
  ('News',       'news',       'General education news')
ON CONFLICT (slug) DO NOTHING;

-- ── Seed articles ───────────────────────────────────────────────
INSERT INTO articles (title, slug, summary, content, category, image_url, published_at, tags, seo_meta) VALUES
(
  'JEE Main 2024 Session 2 Result Declared – Check Scorecard Now',
  'jee-main-2024-session-2-result-declared',
  'NTA has officially declared the JEE Main 2024 Session 2 results. Students can download their scorecards from jeemain.nta.ac.in.',
  '<p>The National Testing Agency (NTA) has declared the <strong>JEE Main 2024 Session 2 results</strong>.</p><h2>How to Check Result</h2><ol><li>Visit jeemain.nta.ac.in</li><li>Click on Session 2 Result link</li><li>Enter Application Number and Date of Birth</li><li>Download your scorecard</li></ol><h2>What it Means for Students</h2><p>Students who qualify will be eligible for JEE Advanced 2024. The top 2.5 lakh candidates will receive the JEE Advanced admit card.</p>',
  'jee',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
  NOW() - INTERVAL '2 hours',
  '["jee","result","nta","scorecard"]',
  '{"title":"JEE Main 2024 Session 2 Result Declared | Rank360","description":"NTA declares JEE Main 2024 Session 2 results.","keywords":"JEE Main 2024 result, NTA JEE result"}'
),
(
  'NEET UG 2024 Counselling Round 2 Seat Allotment Released',
  'neet-ug-2024-counselling-round-2-seat-allotment',
  'MCC has released the NEET UG 2024 Round 2 seat allotment. Candidates must report to allotted colleges by the deadline.',
  '<p>The Medical Counselling Committee (MCC) has released the <strong>NEET UG 2024 Round 2 seat allotment</strong>.</p><h2>What it Means for Students</h2><p>Students must pay the acceptance fee and report with original documents. Failure to report forfeits the seat.</p>',
  'neet',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
  NOW() - INTERVAL '5 hours',
  '["neet","counselling","mcc","seat-allotment"]',
  '{"title":"NEET UG 2024 Round 2 Seat Allotment Released | Rank360","description":"MCC releases NEET UG 2024 Round 2 seat allotment.","keywords":"NEET UG 2024 counselling, NEET seat allotment"}'
),
(
  'CUET UG 2024 Result Out – Direct Link to Check Scorecard',
  'cuet-ug-2024-result-out-direct-link',
  'NTA has released the CUET UG 2024 results. Students can check scores and download scorecards from cuet.samarth.ac.in.',
  '<p>NTA has officially released the <strong>CUET UG 2024 results</strong>.</p><h2>What it Means for Students</h2><p>CUET scores are accepted by 250+ universities. Apply based on subject-wise scores.</p>',
  'cuet',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
  NOW() - INTERVAL '8 hours',
  '["cuet","result","nta","university-admission"]',
  '{"title":"CUET UG 2024 Result Out | Rank360","description":"NTA releases CUET UG 2024 results.","keywords":"CUET UG 2024 result, CUET scorecard"}'
),
(
  'JEE Advanced 2024 Registration Begins – Eligibility & How to Apply',
  'jee-advanced-2024-registration-begins',
  'IIT Madras has opened JEE Advanced 2024 registrations. Only top 2.5 lakh JEE Main qualifiers are eligible.',
  '<p><strong>JEE Advanced 2024</strong> registrations have begun at jeeadv.ac.in.</p><h2>Eligibility</h2><ul><li>Top 2.5 lakh JEE Main 2024 qualifiers</li><li>Born on or after October 1, 1999</li></ul>',
  'jee',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
  NOW() - INTERVAL '24 hours',
  '["jee-advanced","iit","registration"]',
  '{"title":"JEE Advanced 2024 Registration Begins | Rank360","description":"IIT Madras opens JEE Advanced 2024 registrations.","keywords":"JEE Advanced 2024 registration, IIT admission 2024"}'
),
(
  'JoSAA 2024 Round 5 Seat Allotment – IIT, NIT, IIIT Results',
  'josaa-2024-round-5-seat-allotment',
  'JoSAA has released Round 5 seat allotment for IITs, NITs, IIITs and GFTIs.',
  '<p>JoSAA released the <strong>Round 5 seat allotment</strong> for IITs, NITs, IIITs, and GFTIs 2024.</p><h2>What it Means for Students</h2><p>Complete online reporting by uploading documents and paying the seat acceptance fee.</p>',
  'admissions',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  NOW() - INTERVAL '48 hours',
  '["josaa","iit","nit","seat-allotment"]',
  '{"title":"JoSAA 2024 Round 5 Seat Allotment | Rank360","description":"JoSAA releases Round 5 allotment for IITs, NITs, IIITs.","keywords":"JoSAA 2024 Round 5, IIT seat allotment"}'
),
(
  'CBSE Class 12 Result 2024 Declared – Pass Percentage & Toppers',
  'cbse-class-12-result-2024-declared',
  'CBSE has declared Class 12 board exam results 2024. Overall pass percentage stands at 87.98%.',
  '<p>CBSE officially declared the <strong>Class 12 board exam results 2024</strong>.</p><h2>Key Highlights</h2><ul><li>Overall pass percentage: 87.98%</li><li>Girls: 90.68% pass rate</li></ul>',
  'results',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80',
  NOW() - INTERVAL '72 hours',
  '["cbse","class-12","board-result"]',
  '{"title":"CBSE Class 12 Result 2024 Declared | Rank360","description":"CBSE declares Class 12 result 2024.","keywords":"CBSE Class 12 result 2024, CBSE board result"}'
)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed live updates ───────────────────────────────────────────
INSERT INTO live_updates (title, type, data) VALUES
  ('JEE Main Session 2 Result Declared',  'result', '{"link":"/news/jee-main-2024-session-2-result-declared"}'),
  ('NEET UG Round 2 Seat Allotment Out',  'cutoff', '{"link":"/news/neet-ug-2024-counselling-round-2-seat-allotment"}'),
  ('CUET UG 2024 Scorecard Available',    'result', '{"link":"/news/cuet-ug-2024-result-out-direct-link"}'),
  ('JEE Advanced 2024 Registration Open', 'news',   '{"link":"/news/jee-advanced-2024-registration-begins"}'),
  ('JoSAA Round 5 Allotment Out',         'result', '{"link":"/news/josaa-2024-round-5-seat-allotment"}'),
  ('CBSE Class 12 Result 2024 Declared',  'result', '{"link":"/news/cbse-class-12-result-2024-declared"}');
