import { enrichArticleWithAI } from "./ai";

const DEFAULT_QUERY = "JEE OR NEET OR CUET OR NTA OR counselling OR admission OR university exam";

const RSS_SOURCES = [
  { url: "https://www.ndtv.com/rss/education", category: "news", name: "NDTV Education" },
  { url: "https://timesofindia.indiatimes.com/rss/feed/etimes/education", category: "news", name: "Times of India Education" },
  { url: "https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml", category: "news", name: "Hindustan Times Education" },
  { url: "https://feeds.feedburner.com/ndtveducation-latest", category: "news", name: "NDTV Education Latest" },
  // Targeted Google News queries — high-intent, exam-specific
  { url: "https://news.google.com/rss/search?q=JEE+OR+NEET+OR+CUET+when:7d&hl=en-IN&gl=IN&ceid=IN:en", category: "news", name: "Google News Education India" },
  { url: "https://news.google.com/rss/search?q=NTA+exam+OR+college+admission+India&hl=en-IN&gl=IN&ceid=IN:en", category: "news", name: "Google News Admissions India" },
  { url: "https://news.google.com/rss/search?q=JEE+Main+2026+OR+JEE+Advanced+2026&hl=en-IN&gl=IN&ceid=IN:en", category: "jee", name: "Google News JEE 2026" },
  { url: "https://news.google.com/rss/search?q=NEET+2026+counselling+OR+NEET+result+2026&hl=en-IN&gl=IN&ceid=IN:en", category: "neet", name: "Google News NEET 2026" },
  { url: "https://news.google.com/rss/search?q=CUET+2026+OR+DU+admission+2026&hl=en-IN&gl=IN&ceid=IN:en", category: "cuet", name: "Google News CUET 2026" },
  { url: "https://news.google.com/rss/search?q=JoSAA+counselling+OR+NIT+seat+allotment&hl=en-IN&gl=IN&ceid=IN:en", category: "admissions", name: "Google News JoSAA" },
  // Education-specific publishers
  { url: "https://www.careers360.com/rss/news", category: "news", name: "Careers360" },
  { url: "https://www.shiksha.com/rss/news", category: "news", name: "Shiksha" },
];

const CATEGORY_KEYWORDS = {
  jee: ["jee", "iit", "josaa", "jee main", "jee advanced", "btech", "nit", "iiit"],
  neet: ["neet", "mbbs", "mcc", "medical admission", "neet ug", "neet pg", "nmc"],
  cuet: ["cuet", "common university", "du admission", "central university", "csas"],
  admissions: ["admission", "counselling", "seat allotment", "cutoff", "merit list", "csas"],
  results: ["result", "scorecard", "answer key", "rank list", "marks", "percentile"],
};

const BLOCKED_IMAGE_HOSTS = [
  "hindustantimes.com",
  "htmedia.in",
];

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = (item.external_url || item.title || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    // Decode common HTML entities that appear in RSS feeds
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .trim();
}

function makeSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200)
    .replace(/^-|-$/g, "");
}

function detectCategory(title, description = "") {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => text.includes(keyword))) return category;
  }
  return "news";
}

function buildSourceUrl(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function isBlockedImageSource(url = "", sourceName = "") {
  const loweredSource = sourceName.toLowerCase();
  if (loweredSource.includes("hindustan times")) return true;

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return BLOCKED_IMAGE_HOSTS.some(
      (blocked) => hostname === blocked || hostname.endsWith(`.${blocked}`)
    );
  } catch {
    return false;
  }
}

function sanitizeImageUrl(url, sourceName = "") {
  if (!url || isBlockedImageSource(url, sourceName)) return null;
  return url;
}

function toIsoDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 0 },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const get = (tag) => {
      const found = block.match(
        new RegExp(
          `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`
        )
      );
      return found ? stripHtml(found[1] || found[2] || "") : "";
    };

    const title = get("title");
    const description = get("description");
    const link = get("link");
    const pubDate = get("pubDate");

    if (title && link) {
      items.push({
        title,
        summary: description,
        raw_summary: description,
        raw_title: title,
        external_url: link,
        source_url: buildSourceUrl(link),
        source_name: "RSS Source",
        source_type: "rss",
        published_at: toIsoDate(pubDate),
      });
    }
  }

  return items;
}

async function fetchRSSItems(source) {
  const xml = await fetchText(source.url);
  return parseRSS(xml).map((item) => ({
    ...item,
    source_name: source.name,
    source_url: source.url,
    source_type: "rss",
    category: detectCategory(item.title, item.summary) || source.category,
  }));
}

async function fetchNewsApiItems() {
  if (!process.env.NEWSAPI_KEY) return [];

  const url = new URL("https://newsapi.org/v2/everything");
  url.searchParams.set("q", DEFAULT_QUERY);
  url.searchParams.set("language", "en");
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("pageSize", "20");

  const data = await fetchJson(url.toString(), {
    headers: { "X-Api-Key": process.env.NEWSAPI_KEY },
  });

  return (data.articles || []).map((item) => ({
    raw_title: item.title,
    title: item.title,
    raw_summary: item.description || item.content || item.title,
    summary: item.description || item.content || item.title,
    external_url: item.url,
    image_url: sanitizeImageUrl(item.urlToImage, item.source?.name || "NewsAPI"),
    source_name: item.source?.name || "NewsAPI",
    source_url: item.url,
    source_type: "newsapi",
    author_name: item.author || null,
    published_at: toIsoDate(item.publishedAt),
    category: detectCategory(item.title, item.description || item.content),
  }));
}

async function fetchGNewsItems() {
  if (!process.env.GNEWS_API_KEY) return [];

  const url = new URL("https://gnews.io/api/v4/search");
  url.searchParams.set("q", DEFAULT_QUERY);
  url.searchParams.set("lang", "en");
  url.searchParams.set("country", "in");
  url.searchParams.set("max", "20");
  url.searchParams.set("apikey", process.env.GNEWS_API_KEY);

  const data = await fetchJson(url.toString());

  return (data.articles || []).map((item) => ({
    raw_title: item.title,
    title: item.title,
    raw_summary: item.description || item.content || item.title,
    summary: item.description || item.content || item.title,
    external_url: item.url,
    image_url: sanitizeImageUrl(item.image, item.source?.name || "GNews"),
    source_name: item.source?.name || "GNews",
    source_url: item.source?.url || item.url,
    source_type: "gnews",
    published_at: toIsoDate(item.publishedAt),
    category: detectCategory(item.title, item.description || item.content),
  }));
}

async function fetchMediastackItems() {
  if (!process.env.MEDIASTACK_API_KEY) return [];

  const url = new URL("https://api.mediastack.com/v1/news");
  url.searchParams.set("access_key", process.env.MEDIASTACK_API_KEY);
  url.searchParams.set("languages", "en");
  url.searchParams.set("countries", "in");
  url.searchParams.set("keywords", "JEE,NEET,CUET,NTA,admission,counselling");
  url.searchParams.set("sort", "published_desc");
  url.searchParams.set("limit", "20");

  const data = await fetchJson(url.toString());

  return (data.data || []).map((item) => ({
    raw_title: item.title,
    title: item.title,
    raw_summary: item.description || item.title,
    summary: item.description || item.title,
    external_url: item.url,
    image_url: sanitizeImageUrl(item.image, item.source || "Mediastack"),
    source_name: item.source || "Mediastack",
    source_url: item.url,
    source_type: "mediastack",
    author_name: item.author || null,
    published_at: toIsoDate(item.published_at),
    category: detectCategory(item.title, item.description),
  }));
}

async function fetchCurrentsItems() {
  if (!process.env.CURRENTS_API_KEY) return [];

  const url = new URL("https://api.currentsapi.services/v1/latest-news");
  url.searchParams.set("language", "en");
  url.searchParams.set("country", "IN");
  url.searchParams.set("keywords", "JEE,NEET,CUET,NTA,admissions,counselling");
  url.searchParams.set("apiKey", process.env.CURRENTS_API_KEY);

  const data = await fetchJson(url.toString());

  return (data.news || []).map((item) => ({
    raw_title: item.title,
    title: item.title,
    raw_summary: item.description || item.title,
    summary: item.description || item.title,
    external_url: item.url,
    image_url: sanitizeImageUrl(item.image, item.author || item.id || "Currents"),
    source_name: item.author || item.id || "Currents",
    source_url: item.url,
    source_type: "currents",
    published_at: toIsoDate(item.published),
    category: detectCategory(item.title, item.description),
  }));
}

async function fetchTheNewsApiItems() {
  if (!process.env.THENEWSAPI_TOKEN) return [];

  const url = new URL("https://api.thenewsapi.com/v1/news/top");
  url.searchParams.set("api_token", process.env.THENEWSAPI_TOKEN);
  url.searchParams.set("search", DEFAULT_QUERY);
  url.searchParams.set("language", "en");
  url.searchParams.set("locale", "in");
  url.searchParams.set("limit", "20");

  const data = await fetchJson(url.toString());

  return (data.data || []).map((item) => ({
    raw_title: item.title,
    title: item.title,
    raw_summary: item.description || item.snippet || item.title,
    summary: item.description || item.snippet || item.title,
    external_url: item.url,
    image_url: sanitizeImageUrl(item.image_url, item.source || "TheNewsAPI"),
    source_name: item.source || "TheNewsAPI",
    source_url: item.url,
    source_type: "thenewsapi",
    published_at: toIsoDate(item.published_at),
    category: detectCategory(item.title, item.description || item.snippet),
  }));
}

function normalizeItems(items) {
  return dedupe(
    items
      .filter((item) => item?.title && item?.external_url)
      .map((item) => {
        const cleanSummary = stripHtml(item.summary || item.raw_summary || item.title).slice(0, 320);
        const category = item.category || detectCategory(item.title, cleanSummary);

        return {
          raw_title: item.raw_title || item.title,
          title: item.title,
          raw_summary: item.raw_summary || cleanSummary,
          summary: cleanSummary,
          slug: makeSlug(item.title),
          category,
          image_url: sanitizeImageUrl(item.image_url, item.source_name || item.source_type),
          source_name: item.source_name || "Unknown Source",
          source_url: item.source_url || buildSourceUrl(item.external_url),
          external_url: item.external_url,
          source_type: item.source_type || "api",
          author_name: item.author_name || null,
          published_at: toIsoDate(item.published_at),
        };
      })
  );
}

function buildSeoMeta(payload) {
  return {
    title: payload.seoTitle,
    description: payload.seoDescription,
    keywords: payload.focusKeywords.join(", "),
    social_hook: payload.socialHook,
  };
}

// Injects a contextual internal link to the relevant exam hub after the first </p>
// This passes PageRank to evergreen hub pages and improves crawl depth.
const HUB_LINKS = {
  jee:        { href: "/exams/jee",        label: "JEE Hub — dates, cutoffs, counselling" },
  neet:       { href: "/exams/neet",       label: "NEET Hub — counselling, scorecards, MCC" },
  cuet:       { href: "/exams/cuet",       label: "CUET Hub — syllabus, scores, admissions" },
  admissions: { href: "/exams/admissions", label: "Admissions Hub — seat allotment, merit lists" },
  results:    { href: "/news?category=results", label: "Latest Results — scorecards and answer keys" },
  news:       { href: "/news",             label: "All Education News" },
};

function injectHubLink(html, category) {
  const hub = HUB_LINKS[category] || HUB_LINKS.news;
  const linkHtml = `\n<p class="rank360-hub-link">📌 <strong>Track every update:</strong> <a href="${hub.href}">${hub.label}</a></p>\n`;
  // Insert after the first closing </p> tag
  const idx = html.indexOf("</p>");
  if (idx === -1) return html + linkHtml;
  return html.slice(0, idx + 4) + linkHtml + html.slice(idx + 4);
}

function buildLiveUpdate(article) {
  return {
    title: article.title,
    type: article.category === "results" ? "result" : article.category,
    data: {
      link: `/news/${article.slug}`,
      source: article.source_name,
      externalUrl: article.external_url,
    },
  };
}

async function upsertArticle(query, article, client) {
  await query(
    `INSERT INTO articles (
      title, slug, summary, content, category, image_url, published_at, tags, seo_meta,
      raw_title, raw_summary, source_name, source_url, external_url, source_type,
      author_name, reading_time_minutes, ai_refined, ai_data, faq, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb,
      $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19::jsonb, $20::jsonb, NOW()
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      summary = EXCLUDED.summary,
      content = EXCLUDED.content,
      category = EXCLUDED.category,
      published_at = EXCLUDED.published_at,
      tags = EXCLUDED.tags,
      seo_meta = EXCLUDED.seo_meta,
      raw_title = EXCLUDED.raw_title,
      raw_summary = EXCLUDED.raw_summary,
      source_name = EXCLUDED.source_name,
      source_url = EXCLUDED.source_url,
      external_url = EXCLUDED.external_url,
      source_type = EXCLUDED.source_type,
      author_name = EXCLUDED.author_name,
      reading_time_minutes = EXCLUDED.reading_time_minutes,
      ai_refined = EXCLUDED.ai_refined,
      ai_data = EXCLUDED.ai_data,
      faq = EXCLUDED.faq,
      updated_at = NOW()`,
    [
      article.title,
      article.slug,
      article.summary,
      article.content,
      article.category,
      article.image_url,
      article.published_at,
      JSON.stringify(article.tags),
      JSON.stringify(article.seo_meta),
      article.raw_title,
      article.raw_summary,
      article.source_name,
      article.source_url,
      article.external_url,
      article.source_type,
      article.author_name,
      article.reading_time_minutes,
      article.ai_refined,
      JSON.stringify(article.ai_data),
      JSON.stringify(article.faq),
    ]
  );

  await query(
    `INSERT INTO live_updates (title, type, data)
     VALUES ($1, $2, $3::jsonb)`,
    [
      buildLiveUpdate(article).title,
      buildLiveUpdate(article).type,
      JSON.stringify(buildLiveUpdate(article).data),
    ]
  );

  if (client) {
    await query(
      `DELETE FROM live_updates
       WHERE id IN (
         SELECT id FROM live_updates ORDER BY created_at DESC OFFSET 60
       )`
    );
  }
}

export async function runContentPipeline({ query, client = null, limitPerSource = 12 } = {}) {
  if (!query) {
    throw new Error("runContentPipeline requires a query function");
  }

  const providers = [
    ...RSS_SOURCES.map((source) => ({
      name: source.name,
      run: () => fetchRSSItems(source),
    })),
    { name: "NewsAPI", run: fetchNewsApiItems },
    { name: "GNews", run: fetchGNewsItems },
    { name: "Mediastack", run: fetchMediastackItems },
    { name: "Currents", run: fetchCurrentsItems },
    { name: "TheNewsAPI", run: fetchTheNewsApiItems },
  ];

  const stats = {
    fetched: 0,
    inserted: 0,
    updated: 0,
    aiRefined: 0,
    skipped: 0,
    sources: [],
    errors: [],
  };

  const allItems = [];

  for (const provider of providers) {
    try {
      const items = normalizeItems(await provider.run());
      const limited = items.slice(0, limitPerSource);
      stats.fetched += limited.length;
      stats.sources.push({ name: provider.name, count: limited.length });
      allItems.push(...limited);
    } catch (error) {
      stats.errors.push(`${provider.name}: ${error.message}`);
    }
  }

  const finalItems = dedupe(allItems);

  for (const item of finalItems) {
    try {
      const enrichment = await enrichArticleWithAI(item);
      const record = {
        ...item,
        title: enrichment.refinedTitle,
        slug: makeSlug(enrichment.refinedTitle || item.title),
        summary: enrichment.refinedSummary,
        content: injectHubLink(enrichment.articleHtml, item.category),
        tags: enrichment.tags.length ? enrichment.tags : [item.category],
        seo_meta: buildSeoMeta(enrichment),
        reading_time_minutes: enrichment.readingTimeMinutes,
        ai_refined: enrichment.usedAI,
        ai_data: {
          focusKeywords: enrichment.focusKeywords,
          socialHook: enrichment.socialHook,
          generatedAt: new Date().toISOString(),
        },
        faq: enrichment.faq,
      };

      const existing = await query(`SELECT id FROM articles WHERE slug = $1 LIMIT 1`, [record.slug]);
      await upsertArticle(query, record, client);

      if (existing.rows.length > 0) stats.updated += 1;
      else stats.inserted += 1;
      if (record.ai_refined) stats.aiRefined += 1;
    } catch (error) {
      stats.skipped += 1;
      stats.errors.push(`${item.source_name}: ${error.message}`);
    }
  }

  return {
    ok: true,
    ...stats,
    totalProcessed: finalItems.length,
    timestamp: new Date().toISOString(),
  };
}
