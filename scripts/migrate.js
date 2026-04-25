const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function run() {
  loadEnv();

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    console.log("Running migrations...");

    await client.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await client.query(`
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
        seo_meta JSONB DEFAULT '{}'
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS live_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'news',
        data JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const articleColumns = [
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS raw_title TEXT",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS raw_summary TEXT",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_name TEXT",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_url TEXT",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS external_url TEXT",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS source_type VARCHAR(40) DEFAULT 'rss'",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_name TEXT",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS reading_time_minutes INT DEFAULT 3",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_refined BOOLEAN DEFAULT FALSE",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_data JSONB DEFAULT '{}'",
      "ALTER TABLE articles ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'",
    ];

    for (const statement of articleColumns) {
      await client.query(statement);
    }

    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_tags ON articles USING GIN(tags)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_faq ON articles USING GIN(faq)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_articles_ai_data ON articles USING GIN(ai_data)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_live_updates_created ON live_updates(created_at DESC)`);

    const categories = [
      ["JEE", "jee", "JEE Main and Advanced news, results, cutoffs"],
      ["NEET", "neet", "NEET UG and PG news, results, counselling"],
      ["CUET", "cuet", "CUET UG and PG news, results, admissions"],
      ["Admissions", "admissions", "College admissions, counselling, seat allotment"],
      ["Results", "results", "Exam results and scorecards"],
      ["News", "news", "General education news"],
    ];

    for (const [name, slug, description] of categories) {
      await client.query(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO NOTHING`,
        [name, slug, description]
      );
    }

    await client.query(
      `INSERT INTO articles (
        title, slug, summary, content, category, published_at, tags, seo_meta,
        raw_title, raw_summary, source_name, source_url, external_url, source_type,
        reading_time_minutes, ai_refined, ai_data, faq
      ) VALUES (
        $1, $2, $3, $4, $5, NOW() - INTERVAL '3 hours', $6::jsonb, $7::jsonb,
        $8, $9, $10, $11, $12, $13,
        $14, $15, $16::jsonb, $17::jsonb
      )
      ON CONFLICT (slug) DO NOTHING`,
      [
        "JEE Main session result update with counselling next steps",
        "jee-main-session-result-update-with-counselling-next-steps",
        "A student-friendly JEE update with scorecard context, counselling implications, and the next actions candidates should track.",
        "<p>Rank360 keeps this seeded article available before live ingestion runs.</p><h2>What to watch</h2><ul><li>Official notice timing</li><li>Scorecard verification</li><li>JoSAA or institute-level follow-up steps</li></ul>",
        "jee",
        JSON.stringify(["jee", "nta", "counselling"]),
        JSON.stringify({
          title: "JEE Main session result update | Rank360",
          description: "Student-friendly JEE result and counselling coverage.",
          keywords: "jee result, nta, counselling",
        }),
        "JEE Main session result update",
        "JEE Main session result update",
        "Rank360 Seed",
        "https://rank360.in",
        "https://rank360.in/news/jee-main-session-result-update-with-counselling-next-steps",
        "seed",
        3,
        true,
        JSON.stringify({
          focusKeywords: ["jee result", "nta update", "counselling"],
          socialHook: "JEE update with the next steps students should not miss.",
        }),
        JSON.stringify([
          {
            question: "Where should students verify the update?",
            answer: "Students should verify the final details on the official exam portal.",
          },
          {
            question: "What comes next after the update?",
            answer: "Students should watch counselling and document deadlines immediately after the result notice.",
          },
        ]),
      ]
    );

    await client.query(
      `INSERT INTO live_updates (title, type, data)
       VALUES ($1, $2, $3::jsonb)`,
      [
        "Fresh multi-source education coverage enabled",
        "news",
        JSON.stringify({
          link: "/news/jee-main-session-result-update-with-counselling-next-steps",
        }),
      ]
    );

    console.log("Migration complete.");
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
