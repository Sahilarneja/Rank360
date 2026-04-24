import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

// ── RSS sources ────────────────────────────────────────────────
const RSS_SOURCES = [
  {
    url: "https://www.ndtv.com/rss/education",
    name: "NDTV Education",
  },
  {
    url: "https://timesofindia.indiatimes.com/rss/feed/etimes/education",
    name: "Times of India Education",
  },
  {
    url: "https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml",
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
function makeSlug(text) {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200)
    .replace(/^-|-$/g, "");
  return `${base}-${Date.now().toString(36)}`;
}

// ── RSS fetch ──────────────────────────────────────────────────
async function fetchRSS(url) {
  const res = await fetch(url, {
    next: { revalidate: 0 }, // always fresh
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ── RSS parser ─────────────────────────────────────────────────
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(
        new RegExp(
          `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`
        )
      );
      return m ? (m[1] || m[2] || "").trim() : "";
    };

    const title = get("title");
    const description = get("description");
    const link = get("link");
    const pubDate = get("pubDate");
    const enclosure = block.match(/enclosure[^>]+url="([^"]+)"/)?.[1] || "";
    const mediaUrl =
      block.match(/media:content[^>]+url="([^"]+)"/)?.[1] || enclosure;

    if (title && link) {
      items.push({ title, description, link, pubDate, image_url: mediaUrl });
    }
  }
  return items;
}

// ── Article content builder ────────────────────────────────────
function buildContent(summary, category) {
  const catLabel = category.toUpperCase();
  const insightMap = {
    jee: "Students should check their percentile carefully. The JoSAA counselling process will use this score for IIT, NIT, and IIIT seat allocation. Ensure your Class 12 marks meet the eligibility criteria.",
    neet: "NEET qualifiers must register for MCC counselling immediately. State quota seats require separate state counselling registration. Keep all original documents ready for verification.",
    cuet: "CUET scores are accepted by 250+ universities. Apply to multiple universities based on your subject-wise scores. DU, JNU, and BHU will release merit lists based on CUET performance.",
    admissions: "Read the official notice carefully before applying. Keep scanned copies of all documents ready. Pay the application fee only through official portals to avoid fraud.",
    results: "Download and save your scorecard immediately. Cross-check all details — name, roll number, marks. Raise a grievance within the stipulated time if you find any discrepancy.",
    news: "Stay updated with official notifications. Bookmark the official website and check regularly for updates. Avoid relying on unofficial sources for critical information.",
  };

  return `<p>${summary}</p>

<h2>Key Highlights</h2>
<ul>
  <li>Official announcement regarding ${catLabel} 2025</li>
  <li>Students are advised to check the official website for complete details</li>
  <li>Important deadlines must be noted and adhered to</li>
</ul>

<h2>What it Means for Students</h2>
<p>${insightMap[category] || insightMap.news}</p>

<h2>Important Links</h2>
<ul>
  <li>Check the official website for the latest updates</li>
  <li>Download official notification PDF for complete details</li>
  <li>Contact the helpline for queries and grievances</li>
</ul>

<p><strong>Stay tuned to Rank360 for the latest ${catLabel} updates, results, and counselling news.</strong></p>`;
}

// ── Main scrape handler ────────────────────────────────────────
export async function GET(request) {
  // Auth check
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let inserted = 0;
  let skipped = 0;
  const errors = [];

  for (const source of RSS_SOURCES) {
    let xml;
    try {
      xml = await fetchRSS(source.url);
    } catch (err) {
      errors.push(`${source.name}: ${err.message}`);
      continue;
    }

    const items = parseRSS(xml);

    for (const item of items.slice(0, 20)) {
      const category = detectCategory(item.title, item.description);
      const slug = makeSlug(item.title);
      const summary = item.description
        ? item.description.replace(/<[^>]+>/g, "").slice(0, 300)
        : item.title;
      const content = buildContent(summary, category);
      const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
      const tags = [
        category,
        ...item.title
          .toLowerCase()
          .split(" ")
          .filter((w) => w.length > 4)
          .slice(0, 4),
      ];
      const seoMeta = {
        title: `${item.title} | Rank360`,
        description: summary.slice(0, 160),
        keywords: `${category}, ${item.title.split(" ").slice(0, 5).join(", ")}`,
      };

      try {
        await query(
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
      } catch (err) {
        skipped++;
        errors.push(`Insert skipped: ${err.message}`);
      }
    }
  }

  // Bust ISR cache so homepage and news page show fresh content immediately
  if (inserted > 0) {
    revalidatePath("/");
    revalidatePath("/news");
  }

  return NextResponse.json({
    ok: true,
    inserted,
    skipped,
    errors: errors.length ? errors : undefined,
    timestamp: new Date().toISOString(),
  });
}
