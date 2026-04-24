import { NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * One-time seed endpoint.
 * Call once after deploying to Vercel to populate Neon DB.
 * Protected by REVALIDATE_SECRET.
 * DELETE this file after seeding.
 */
export async function POST(request) {
  const secret = request.headers.get("x-seed-secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Schema
    await query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await query(`
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
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)`);
    await query(`
      CREATE TABLE IF NOT EXISTS live_updates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'news',
        data JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Categories
    const cats = [
      ["JEE","jee","JEE Main and Advanced"],
      ["NEET","neet","NEET UG and PG"],
      ["CUET","cuet","CUET UG and PG"],
      ["Admissions","admissions","College admissions"],
      ["Results","results","Exam results"],
      ["News","news","General education news"],
    ];
    for (const [name, slug, description] of cats) {
      await query(
        `INSERT INTO categories (name,slug,description) VALUES ($1,$2,$3) ON CONFLICT (slug) DO NOTHING`,
        [name, slug, description]
      );
    }

    // Sample articles
    const articles = [
      {
        title: "JEE Main 2024 Session 2 Result Declared – Check Scorecard Now",
        slug: "jee-main-2024-session-2-result-declared",
        summary: "NTA has officially declared the JEE Main 2024 Session 2 results.",
        content: `<p>The National Testing Agency (NTA) has declared the <strong>JEE Main 2024 Session 2 results</strong>.</p><h2>How to Check Result</h2><ol><li>Visit jeemain.nta.ac.in</li><li>Enter Application Number and Date of Birth</li><li>Download scorecard</li></ol><h2>What it Means for Students</h2><p>Top 2.5 lakh qualifiers will be eligible for JEE Advanced 2024. Percentile score will be used for JoSAA counselling for IIT, NIT, and IIIT admissions.</p>`,
        category: "jee",
        image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
        hours_ago: 2,
      },
      {
        title: "NEET UG 2024 Counselling Round 2 Seat Allotment Released",
        slug: "neet-ug-2024-counselling-round-2-seat-allotment",
        summary: "MCC has released the NEET UG 2024 Round 2 seat allotment results.",
        content: `<p>MCC released the <strong>NEET UG 2024 Round 2 seat allotment</strong>.</p><h2>Important Dates</h2><ul><li>Reporting Deadline: Within 3 days</li><li>Round 3 Registration: Next week</li></ul><h2>What it Means for Students</h2><p>Pay acceptance fee and report with original documents. Students can participate in Round 3 for upgrades.</p>`,
        category: "neet",
        image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        hours_ago: 5,
      },
      {
        title: "CUET UG 2024 Result Out – Direct Link to Check Scorecard",
        slug: "cuet-ug-2024-result-out-direct-link",
        summary: "NTA has released the CUET UG 2024 results at cuet.samarth.ac.in.",
        content: `<p>NTA released the <strong>CUET UG 2024 results</strong>.</p><h2>Steps to Check</h2><ol><li>Go to cuet.samarth.ac.in</li><li>Login and click View Scorecard</li></ol><h2>What it Means for Students</h2><p>CUET scores accepted by 250+ universities. Apply based on subject-wise scores for DU, JNU, BHU admissions.</p>`,
        category: "cuet",
        image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
        hours_ago: 8,
      },
      {
        title: "JEE Advanced 2024 Registration Begins – Eligibility & How to Apply",
        slug: "jee-advanced-2024-registration-begins",
        summary: "IIT Madras opened JEE Advanced 2024 registrations for top 2.5 lakh JEE Main qualifiers.",
        content: `<p><strong>JEE Advanced 2024</strong> registrations open at jeeadv.ac.in.</p><h2>Eligibility</h2><ul><li>Top 2.5 lakh JEE Main qualifiers</li><li>Born on or after October 1, 1999</li></ul><h2>What it Means for Students</h2><p>Gateway to IITs. Qualifying students eligible for JoSAA counselling for IIT admissions.</p>`,
        category: "jee",
        image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
        hours_ago: 24,
      },
      {
        title: "DU Admission 2024: CSAS Round 3 Seat Allotment Released",
        slug: "du-admission-2024-csas-round-3-seat-allotment",
        summary: "Delhi University released CSAS Round 3 seat allotment for UG admissions 2024.",
        content: `<p>DU released <strong>CSAS Round 3 seat allotment</strong>.</p><h2>How to Check</h2><ol><li>Visit admission.uod.ac.in</li><li>Check allotted college and accept seat</li></ol><h2>What it Means for Students</h2><p>Pay admission fee and complete document verification. Choose Accept and Freeze or Accept and Upgrade.</p>`,
        category: "admissions",
        image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
        hours_ago: 72,
      },
      {
        title: "CBSE Class 12 Result 2024 Declared – Pass Percentage & Toppers",
        slug: "cbse-class-12-result-2024-declared",
        summary: "CBSE declared Class 12 board results 2024. Overall pass percentage: 87.98%.",
        content: `<p>CBSE declared <strong>Class 12 results 2024</strong>.</p><h2>Highlights</h2><ul><li>Pass percentage: 87.98%</li><li>Girls: 90.68%</li></ul><h2>What it Means for Students</h2><p>Class 12 marks crucial for CUET, JEE, NEET eligibility. Ensure 75% attendance criteria is met.</p>`,
        category: "results",
        image_url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&q=80",
        hours_ago: 120,
      },
    ];

    for (const a of articles) {
      const publishedAt = new Date(Date.now() - a.hours_ago * 3600000).toISOString();
      await query(
        `INSERT INTO articles (title,slug,summary,content,category,image_url,published_at,tags,seo_meta)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (slug) DO NOTHING`,
        [
          a.title, a.slug, a.summary, a.content, a.category, a.image_url, publishedAt,
          JSON.stringify([a.category]),
          JSON.stringify({ title: `${a.title} | Rank360`, description: a.summary }),
        ]
      );
    }

    // Live updates
    const updates = [
      { title: "JEE Main Session 2 Result Declared",  type: "result", link: "/news/jee-main-2024-session-2-result-declared" },
      { title: "NEET UG Round 2 Seat Allotment Out",  type: "cutoff", link: "/news/neet-ug-2024-counselling-round-2-seat-allotment" },
      { title: "CUET UG 2024 Scorecard Available",    type: "result", link: "/news/cuet-ug-2024-result-out-direct-link" },
      { title: "JEE Advanced 2024 Registration Open", type: "news",   link: "/news/jee-advanced-2024-registration-begins" },
      { title: "DU CSAS Round 3 Allotment Released",  type: "news",   link: "/news/du-admission-2024-csas-round-3-seat-allotment" },
    ];
    for (const u of updates) {
      await query(
        `INSERT INTO live_updates (title,type,data) VALUES ($1,$2,$3)`,
        [u.title, u.type, JSON.stringify({ link: u.link })]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully. DELETE /api/seed now.",
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
