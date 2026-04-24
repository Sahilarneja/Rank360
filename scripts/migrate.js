// Load .env.local manually (no dotenv dependency)
const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) return;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (key) process.env[key] = val;
    });
}

const { Client } = require("pg");
const client = new Client({ connectionString: process.env.DATABASE_URL });

// Parameterized query helper
async function q(text, params = []) {
  return client.query(text, params);
}

async function migrate() {
  await client.connect();
  try {
    console.log("Running migrations...\n");

    // ── Schema ──────────────────────────────────────────────────
    await q(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await q(`
      CREATE TABLE IF NOT EXISTS categories (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name        VARCHAR(100) NOT NULL,
        slug        VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await q(`
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
      )
    `);

    await q(`CREATE INDEX IF NOT EXISTS idx_articles_slug         ON articles(slug)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_articles_category     ON articles(category)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)`);
    await q(`CREATE INDEX IF NOT EXISTS idx_articles_tags         ON articles USING GIN(tags)`);

    await q(`
      CREATE TABLE IF NOT EXISTS live_updates (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title      TEXT NOT NULL,
        type       VARCHAR(50) DEFAULT 'news',
        data       JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await q(`CREATE INDEX IF NOT EXISTS idx_live_updates_created ON live_updates(created_at DESC)`);
    console.log("✅ Schema ready");

    // ── Seed categories ─────────────────────────────────────────
    const cats = [
      ["JEE",        "jee",        "JEE Main and Advanced news, results, cutoffs"],
      ["NEET",       "neet",       "NEET UG and PG news, results, counselling"],
      ["CUET",       "cuet",       "CUET UG and PG news, results, admissions"],
      ["Admissions", "admissions", "College admissions, counselling, seat allotment"],
      ["Results",    "results",    "Exam results and scorecards"],
      ["News",       "news",       "General education news"],
    ];
    for (const [name, slug, description] of cats) {
      await q(
        `INSERT INTO categories (name, slug, description)
         VALUES ($1,$2,$3) ON CONFLICT (slug) DO NOTHING`,
        [name, slug, description]
      );
    }
    console.log("✅ Categories seeded");

    // ── Seed articles ───────────────────────────────────────────
    const articles = [
      {
        title: "JEE Main 2024 Session 2 Result Declared – Check Scorecard Now",
        slug: "jee-main-2024-session-2-result-declared",
        summary: "NTA has officially declared the JEE Main 2024 Session 2 results. Students can download their scorecards from jeemain.nta.ac.in.",
        content: `<p>The National Testing Agency (NTA) has declared the <strong>JEE Main 2024 Session 2 results</strong> on its official website.</p><h2>How to Check Result</h2><ol><li>Visit jeemain.nta.ac.in</li><li>Click on Session 2 Result link</li><li>Enter Application Number and Date of Birth</li><li>Download your scorecard</li></ol><h2>What it Means for Students</h2><p>Students who qualify will be eligible for JEE Advanced 2024. The top 2.5 lakh candidates will receive the JEE Advanced admit card. Percentile score will be used for JoSAA counselling.</p>`,
        category: "jee",
        image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
        hours_ago: 2,
        tags: ["jee", "result", "nta", "scorecard"],
        seo_title: "JEE Main 2024 Session 2 Result Declared | Rank360",
        seo_desc: "NTA declares JEE Main 2024 Session 2 results. Check scorecard and percentile at jeemain.nta.ac.in.",
        seo_kw: "JEE Main 2024 result, NTA JEE result",
      },
      {
        title: "NEET UG 2024 Counselling Round 2 Seat Allotment Released",
        slug: "neet-ug-2024-counselling-round-2-seat-allotment",
        summary: "MCC has released the NEET UG 2024 Round 2 seat allotment. Candidates must report to allotted colleges by the deadline.",
        content: `<p>The Medical Counselling Committee (MCC) has released the <strong>NEET UG 2024 Round 2 seat allotment</strong>.</p><h2>Important Dates</h2><ul><li>Reporting Deadline: Within 3 days</li><li>Round 3 Registration: Next week</li></ul><h2>What it Means for Students</h2><p>Students must pay the acceptance fee and report with original documents. Failure to report forfeits the seat. Students can participate in Round 3 for upgrades.</p>`,
        category: "neet",
        image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        hours_ago: 5,
        tags: ["neet", "counselling", "mcc", "seat-allotment"],
        seo_title: "NEET UG 2024 Round 2 Seat Allotment Released | Rank360",
        seo_desc: "MCC releases NEET UG 2024 Round 2 seat allotment. Check college allotment and reporting deadlines.",
        seo_kw: "NEET UG 2024 counselling, NEET seat allotment",
      },
      {
        title: "CUET UG 2024 Result Out – Direct Link to Check Scorecard",
        slug: "cuet-ug-2024-result-out-direct-link",
        summary: "NTA has released the CUET UG 2024 results. Students can check scores and download scorecards from cuet.samarth.ac.in.",
        content: `<p>NTA has officially released the <strong>CUET UG 2024 results</strong>.</p><h2>Steps to Check Result</h2><ol><li>Go to cuet.samarth.ac.in</li><li>Login with credentials</li><li>Click View Result / Scorecard</li><li>Download scorecard</li></ol><h2>What it Means for Students</h2><p>CUET scores are accepted by 250+ universities. Apply based on subject-wise scores. DU, JNU, BHU will release merit lists based on CUET performance.</p>`,
        category: "cuet",
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        hours_ago: 8,
        tags: ["cuet", "result", "nta", "university-admission"],
        seo_title: "CUET UG 2024 Result Out – Check Scorecard | Rank360",
        seo_desc: "NTA releases CUET UG 2024 results. Check scorecard and apply to top universities.",
        seo_kw: "CUET UG 2024 result, CUET scorecard",
      },
      {
        title: "JEE Advanced 2024 Registration Begins – Eligibility & How to Apply",
        slug: "jee-advanced-2024-registration-begins",
        summary: "IIT Madras has opened JEE Advanced 2024 registrations. Only top 2.5 lakh JEE Main qualifiers are eligible.",
        content: `<p><strong>JEE Advanced 2024</strong> registrations have begun at jeeadv.ac.in. IIT Madras is the organizing institute.</p><h2>Eligibility</h2><ul><li>Top 2.5 lakh JEE Main 2024 qualifiers</li><li>Born on or after October 1, 1999</li><li>Maximum 2 attempts in consecutive years</li></ul><h2>What it Means for Students</h2><p>JEE Advanced is the gateway to IITs. Qualifying students are eligible for JoSAA counselling for IIT admissions.</p>`,
        category: "jee",
        image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
        hours_ago: 24,
        tags: ["jee-advanced", "iit", "registration"],
        seo_title: "JEE Advanced 2024 Registration Begins | Rank360",
        seo_desc: "IIT Madras opens JEE Advanced 2024 registrations. Check eligibility and application process.",
        seo_kw: "JEE Advanced 2024 registration, IIT admission 2024",
      },
      {
        title: "NEET PG 2024 Exam Date Announced – Check Full Schedule",
        slug: "neet-pg-2024-exam-date-announced",
        summary: "NBE has announced the NEET PG 2024 exam date. The exam will be conducted in a single shift across multiple cities.",
        content: `<p>NBEMS has officially announced the <strong>NEET PG 2024 exam date</strong>.</p><h2>Key Dates</h2><ul><li>Application: Check official website</li><li>Admit Card: 3 days before exam</li></ul><h2>What it Means for Students</h2><p>NEET PG is the single entrance for MD/MS/PG Diploma admissions. Focus on high-yield topics. The exam is computer-based, conducted in a single day.</p>`,
        category: "neet",
        image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
        hours_ago: 48,
        tags: ["neet-pg", "nbems", "exam-date"],
        seo_title: "NEET PG 2024 Exam Date Announced | Rank360",
        seo_desc: "NBE announces NEET PG 2024 exam date. Check schedule and preparation tips.",
        seo_kw: "NEET PG 2024 exam date, NBE NEET PG",
      },
      {
        title: "DU Admission 2024: CSAS Round 3 Seat Allotment Released",
        slug: "du-admission-2024-csas-round-3-seat-allotment",
        summary: "Delhi University has released the CSAS Round 3 seat allotment for UG admissions 2024.",
        content: `<p>Delhi University released the <strong>CSAS Round 3 seat allotment</strong> for UG admissions 2024.</p><h2>How to Check</h2><ol><li>Visit admission.uod.ac.in</li><li>Login and check allotted college</li><li>Accept or upgrade before deadline</li></ol><h2>What it Means for Students</h2><p>Pay admission fee and complete document verification. Choose Accept and Freeze or Accept and Upgrade based on your preference.</p>`,
        category: "admissions",
        image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        hours_ago: 72,
        tags: ["du-admission", "csas", "delhi-university"],
        seo_title: "DU Admission 2024 CSAS Round 3 Allotment | Rank360",
        seo_desc: "Delhi University releases CSAS Round 3 seat allotment. Check college and complete admission.",
        seo_kw: "DU admission 2024, CSAS Round 3",
      },
      {
        title: "JoSAA 2024 Round 5 Seat Allotment – IIT, NIT, IIIT Results",
        slug: "josaa-2024-round-5-seat-allotment",
        summary: "JoSAA has released Round 5 seat allotment for IITs, NITs, IIITs and GFTIs.",
        content: `<p>JoSAA released the <strong>Round 5 seat allotment</strong> for IITs, NITs, IIITs, and GFTIs 2024.</p><h2>How to Check</h2><ol><li>Visit josaa.nic.in</li><li>Login with JEE credentials</li><li>View allotted institute and branch</li><li>Complete online reporting</li></ol><h2>What it Means for Students</h2><p>Complete online reporting by uploading documents and paying the seat acceptance fee. Physical reporting at the institute is required before the academic session.</p>`,
        category: "admissions",
        image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
        hours_ago: 96,
        tags: ["josaa", "iit", "nit", "seat-allotment"],
        seo_title: "JoSAA 2024 Round 5 Seat Allotment | Rank360",
        seo_desc: "JoSAA releases Round 5 allotment for IITs, NITs, IIITs. Check and complete online reporting.",
        seo_kw: "JoSAA 2024 Round 5, IIT seat allotment",
      },
      {
        title: "CBSE Class 12 Result 2024 Declared – Pass Percentage & Toppers",
        slug: "cbse-class-12-result-2024-declared",
        summary: "CBSE has declared Class 12 board exam results 2024. Overall pass percentage stands at 87.98%.",
        content: `<p>CBSE officially declared the <strong>Class 12 board exam results 2024</strong>.</p><h2>Key Highlights</h2><ul><li>Overall pass percentage: 87.98%</li><li>Girls: 90.68% pass rate</li><li>Trivandrum region: 99.91% pass rate</li></ul><h2>What it Means for Students</h2><p>CBSE Class 12 marks are crucial for CUET, JEE, and NEET eligibility. Ensure you meet the 75% attendance and minimum marks criteria for entrance exams.</p>`,
        category: "results",
        image_url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
        hours_ago: 120,
        tags: ["cbse", "class-12", "board-result"],
        seo_title: "CBSE Class 12 Result 2024 Declared | Rank360",
        seo_desc: "CBSE declares Class 12 result 2024. Check pass percentage and toppers list.",
        seo_kw: "CBSE Class 12 result 2024, CBSE board result",
      },
    ];

    for (const a of articles) {
      const publishedAt = new Date(Date.now() - a.hours_ago * 60 * 60 * 1000).toISOString();
      await q(
        `INSERT INTO articles (title,slug,summary,content,category,image_url,published_at,tags,seo_meta)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (slug) DO NOTHING`,
        [
          a.title, a.slug, a.summary, a.content, a.category, a.image_url, publishedAt,
          JSON.stringify(a.tags),
          JSON.stringify({ title: a.seo_title, description: a.seo_desc, keywords: a.seo_kw }),
        ]
      );
    }
    console.log("✅ Articles seeded");

    // ── Seed live updates ───────────────────────────────────────
    const updates = [
      { title: "JEE Main Session 2 Result Declared",  type: "result", link: "/news/jee-main-2024-session-2-result-declared" },
      { title: "NEET UG Round 2 Seat Allotment Out",  type: "cutoff", link: "/news/neet-ug-2024-counselling-round-2-seat-allotment" },
      { title: "CUET UG 2024 Scorecard Available",    type: "result", link: "/news/cuet-ug-2024-result-out-direct-link" },
      { title: "JEE Advanced 2024 Registration Open", type: "news",   link: "/news/jee-advanced-2024-registration-begins" },
      { title: "DU CSAS Round 3 Allotment Released",  type: "news",   link: "/news/du-admission-2024-csas-round-3-seat-allotment" },
      { title: "JoSAA Round 5 Allotment Out",         type: "result", link: "/news/josaa-2024-round-5-seat-allotment" },
      { title: "CBSE Class 12 Result 2024 Declared",  type: "result", link: "/news/cbse-class-12-result-2024-declared" },
    ];
    for (const u of updates) {
      await q(
        `INSERT INTO live_updates (title,type,data) VALUES ($1,$2,$3)`,
        [u.title, u.type, JSON.stringify({ link: u.link })]
      );
    }
    console.log("✅ Live updates seeded");
    console.log("\n🎉 Migration complete. Database is ready.\n");

  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
