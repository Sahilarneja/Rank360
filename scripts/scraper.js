/**
 * Rank360 Content Scraper & Pipeline
 * ------------------------------------
 * Scrapes education news headlines from public RSS feeds,
 * structures them, and inserts into PostgreSQL.
 *
 * Run: node scripts/scraper.js
 * Cron: *\/30 * * * * (every 30 min)
 */

// env loaded via: node --env-file=.env.local scripts/scraper.js
const { Pool } = require("pg");
const https = require("https");
const http = require("http");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── RSS sources ────────────────────────────────────────────────
const RSS_SOURCES = [
  {
    url: "https://www.ndtv.com/rss/education",
    category: "news",
    name: "NDTV Education",
  },
  {
    url: "https://timesofindia.indiatimes.com/rss/feed/etimes/education",
    category: "news",
    name: "Times of India Education",
  },
  {
    url: "https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml",
    category: "news",
    name: "Hindustan Times Education",
  },
];

// ── Category detection ─────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  jee: ["jee", "iit", "josaa", "jee main", "jee advanced", "nta jee"],
  neet: ["neet", "mbbs", "mcc", "medical admission", "neet ug", "neet pg"],
  cuet: ["cuet", "common university", "du admission", "central university"],
  admissions: ["admission", "counselling", "seat allotment", "cutoff", "merit list"],
  results: ["result", "scorecard", "answer key", "rank list", "marks"],
};

function detectCategory(title, description = "") {
  const text = `${title} ${description}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) return cat;
  }
  return "news";
}

// ── Slug generator ─────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200)
    .replace(/^-|-$/g, "");
}

function uniqueSlug(base) {
  const ts = Date.now().toString(36);
  return `${base}-${ts}`;
}

// ── HTTP fetch ─────────────────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timeout")); });
  });
}

// ── RSS parser (no external deps) ─────────────────────────────
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`));
      return m ? (m[1] || m[2] || "").trim() : "";
    };

    const title = get("title");
    const description = get("description");
    const link = get("link");
    const pubDate = get("pubDate");
    const enclosure = block.match(/enclosure[^>]+url="([^"]+)"/)?.[1] || "";
    const mediaUrl = block.match(/media:content[^>]+url="([^"]+)"/)?.[1] || enclosure;

    if (title && link) {
      items.push({ title, description, link, pubDate, image_url: mediaUrl });
    }
  }
  return items;
}

// ── Article content builder ────────────────────────────────────
function buildContent(title, summary, category) {
  const catLabel = category.toUpperCase();
  const insightMap = {
    jee: "Students should check their percentile carefully. The JoSAA counselling process will use this score for IIT, NIT, and IIIT seat allocation. Ensure your Class 12 marks meet the eligibility criteria.",
    neet: "NEET qualifiers must register for MCC counselling immediately. State quota seats require separate state counselling registration. Keep all original documents ready for verification.",
    cuet: "CUET scores are accepted by 250+ universities. Apply to multiple universities based on your subject-wise scores. DU, JNU, and BHU will release merit lists based on CUET performance.",
    admissions: "Read the official notice carefully before applying. Keep scanned copies of all documents ready. Pay the application fee only through official portals to avoid fraud.",
    results: "Download and save your scorecard immediately. Cross-check all details — name, roll number, marks. Raise a grievance within the stipulated time if you find any discrepancy.",
    news: "Stay updated with official notifications. Bookmark the official website and check regularly for updates. Avoid relying on unofficial sources for critical information.",
  };

  const insight = insightMap[category] || insightMap.news;

  return `<p>${summary}</p>

<h2>Key Highlights</h2>
<ul>
  <li>Official announcement regarding ${catLabel} 2024</li>
  <li>Students are advised to check the official website for complete details</li>
  <li>Important deadlines must be noted and adhered to</li>
</ul>

<h2>What it Means for Students</h2>
<p>${insight}</p>

<h2>Important Links</h2>
<ul>
  <li>Check the official website for the latest updates</li>
  <li>Download official notification PDF for complete details</li>
  <li>Contact the helpline for queries and grievances</li>
</ul>

<p><strong>Stay tuned to Rank360 for the latest ${catLabel} updates, results, and counselling news.</strong></p>`;
}

// ── Main pipeline ──────────────────────────────────────────────
async function runPipeline() {
  const client = await pool.connect();
  let inserted = 0;
  let skipped = 0;

  try {
    console.log(`\n🚀 Rank360 Scraper started at ${new Date().toISOString()}`);

    for (const source of RSS_SOURCES) {
      console.log(`\n📡 Fetching: ${source.name}`);

      let xml;
      try {
        xml = await fetchUrl(source.url);
      } catch (err) {
        console.warn(`  ⚠️  Failed to fetch ${source.url}: ${err.message}`);
        continue;
      }

      const items = parseRSS(xml);
      console.log(`  Found ${items.length} items`);

      for (const item of items.slice(0, 20)) {
        const category = detectCategory(item.title, item.description);
        const baseSlug = slugify(item.title);
        const slug = uniqueSlug(baseSlug);
        const summary = item.description
          ? item.description.replace(/<[^>]+>/g, "").slice(0, 300)
          : item.title;
        const content = buildContent(item.title, summary, category);
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        const tags = [category, ...item.title.toLowerCase().split(" ").filter((w) => w.length > 4).slice(0, 4)];
        const seoMeta = {
          title: `${item.title} | Rank360`,
          description: summary.slice(0, 160),
          keywords: `${category}, ${item.title.split(" ").slice(0, 5).join(", ")}`,
        };

        try {
          await client.query(
            `INSERT INTO articles (title, slug, summary, content, category, image_url, published_at, tags, seo_meta)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (slug) DO NOTHING`,
            [
              item.title,
              slug,
              summary,
              content,
              category,
              item.image_url || null,
              publishedAt,
              JSON.stringify(tags),
              JSON.stringify(seoMeta),
            ]
          );
          inserted++;
          console.log(`  ✅ ${item.title.slice(0, 60)}…`);
        } catch (err) {
          skipped++;
          console.warn(`  ⚠️  Skipped: ${err.message}`);
        }
      }
    }

    console.log(`\n✅ Pipeline complete: ${inserted} inserted, ${skipped} skipped\n`);
  } finally {
    client.release();
    await pool.end();
  }
}

runPipeline().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
