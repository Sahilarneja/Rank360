CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug VARCHAR(300) UNIQUE NOT NULL,
  summary TEXT,
  content TEXT,
  category VARCHAR(100) NOT NULL DEFAULT 'news',
  image_url TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags JSONB DEFAULT '[]',
  seo_meta JSONB DEFAULT '{}',
  raw_title TEXT,
  raw_summary TEXT,
  source_name TEXT,
  source_url TEXT,
  external_url TEXT,
  source_type VARCHAR(40) DEFAULT 'rss',
  author_name TEXT,
  reading_time_minutes INT DEFAULT 3,
  ai_refined BOOLEAN DEFAULT FALSE,
  ai_data JSONB DEFAULT '{}',
  faq JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS live_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'news',
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_articles_faq ON articles USING GIN(faq);
CREATE INDEX IF NOT EXISTS idx_articles_ai_data ON articles USING GIN(ai_data);
CREATE INDEX IF NOT EXISTS idx_live_updates_created ON live_updates(created_at DESC);

INSERT INTO categories (name, slug, description) VALUES
  ('JEE', 'jee', 'JEE Main and Advanced news, results, cutoffs'),
  ('NEET', 'neet', 'NEET UG and PG news, results, counselling'),
  ('CUET', 'cuet', 'CUET UG and PG news, results, admissions'),
  ('Admissions', 'admissions', 'College admissions, counselling, seat allotment'),
  ('Results', 'results', 'Exam results and scorecards'),
  ('News', 'news', 'General education news')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO articles (
  title, slug, summary, content, category, published_at, tags, seo_meta,
  raw_title, raw_summary, source_name, source_url, external_url, source_type,
  reading_time_minutes, ai_refined, ai_data, faq
) VALUES
(
  'JEE Main session result update with counselling next steps',
  'jee-main-session-result-update-with-counselling-next-steps',
  'A student-friendly JEE update with scorecard context, counselling implications, and the next actions candidates should track.',
  '<p>Rank360 keeps this JEE article seeded so the site has a realistic article shape before automated ingestion runs.</p><h2>What to watch</h2><ul><li>Official notice timing</li><li>Scorecard verification</li><li>JoSAA or institute-level follow-up steps</li></ul>',
  'jee',
  NOW() - INTERVAL '3 hours',
  '["jee","nta","counselling"]',
  '{"title":"JEE Main session result update | Rank360","description":"Student-friendly JEE result and counselling coverage.","keywords":"jee result, nta, counselling"}',
  'JEE Main session result update',
  'JEE Main session result update',
  'Rank360 Seed',
  'https://rank360.in',
  'https://rank360.in/news/jee-main-session-result-update-with-counselling-next-steps',
  'seed',
  3,
  TRUE,
  '{"focusKeywords":["jee result","nta update","counselling"],"socialHook":"JEE update with the next steps students should not miss."}',
  '[{"question":"Where should students verify the update?","answer":"Students should verify the final details on the official exam portal."},{"question":"What comes next after the update?","answer":"Students should watch counselling and document deadlines immediately after the result notice."}]'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO live_updates (title, type, data) VALUES
  ('Fresh multi-source education coverage enabled', 'news', '{"link":"/news/jee-main-session-result-update-with-counselling-next-steps"}')
ON CONFLICT DO NOTHING;
