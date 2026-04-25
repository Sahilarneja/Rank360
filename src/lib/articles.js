import { query } from "./db";

const PER_PAGE = 12;

// ── Article queries ────────────────────────────────────────────

export async function getArticles({
  page = 1,
  category = null,
  limit = PER_PAGE,
  search = null,
} = {}) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (search) {
    params.push(search);
    conditions.push(
      `to_tsvector('english', title || ' ' || COALESCE(summary,'')) @@ plainto_tsquery('english', $${params.length})`
    );
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  // Save filter params count before adding limit/offset
  const filterParams = [...params];
  params.push(limit, offset);
  const limitIdx = params.length - 1;
  const offsetIdx = params.length;

  const [rows, countResult] = await Promise.all([
    query(
      `SELECT id, title, slug, summary, category, image_url, published_at, tags,
              source_name, reading_time_minutes, ai_refined
       FROM articles ${where}
       ORDER BY published_at DESC
       LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
      params
    ),
    query(
      `SELECT COUNT(*) FROM articles ${where}`,
      filterParams
    ),
  ]);

  const total = parseInt(countResult.rows[0].count, 10);
  return {
    articles: rows.rows,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit,
  };
}

export async function getArticleBySlug(slug) {
  const result = await query(`SELECT * FROM articles WHERE slug = $1 LIMIT 1`, [slug]);
  return result.rows[0] || null;
}

export async function getFeaturedArticle() {
  const result = await query(
    `SELECT id, title, slug, summary, category, image_url, published_at, tags,
            source_name, reading_time_minutes, ai_refined
     FROM articles ORDER BY published_at DESC LIMIT 1`
  );
  return result.rows[0] || null;
}

export async function getHeroArticles() {
  const result = await query(
    `SELECT id, title, slug, summary, category, image_url, published_at,
            source_name, reading_time_minutes, ai_refined
     FROM articles ORDER BY published_at DESC LIMIT 5`
  );
  return result.rows;
}

export async function getLatestArticles({ skip = 5, limit = 9 } = {}) {
  const result = await query(
    `SELECT id, title, slug, summary, category, image_url, published_at,
            source_name, reading_time_minutes, ai_refined
     FROM articles ORDER BY published_at DESC LIMIT $1 OFFSET $2`,
    [limit, skip]
  );
  return result.rows;
}

export async function getArticlesByCategory(category, limit = 4) {
  const result = await query(
    `SELECT id, title, slug, summary, category, image_url, published_at,
            source_name, reading_time_minutes, ai_refined
     FROM articles WHERE category = $1 ORDER BY published_at DESC LIMIT $2`,
    [category, limit]
  );
  return result.rows;
}

export async function getRelatedArticles(category, excludeSlug, limit = 4) {
  // Single query: prefer same category, fill remainder with latest from other categories
  const result = await query(
    `(
       SELECT id, title, slug, summary, category, image_url, published_at,
              source_name, reading_time_minutes, ai_refined, 1 AS priority
       FROM articles
       WHERE category = $1 AND slug != $2
       ORDER BY published_at DESC
       LIMIT $3
     )
     UNION ALL
     (
       SELECT id, title, slug, summary, category, image_url, published_at,
              source_name, reading_time_minutes, ai_refined, 2 AS priority
       FROM articles
       WHERE category != $1 AND slug != $2
       ORDER BY published_at DESC
       LIMIT $3
     )
     ORDER BY priority ASC, published_at DESC
     LIMIT $3`,
    [category, excludeSlug, limit]
  );
  return result.rows;
}

export async function getAllSlugs() {
  const result = await query(
    `SELECT slug, title, published_at, updated_at FROM articles ORDER BY published_at DESC`
  );
  return result.rows;
}

export async function getLiveUpdates(limit = 12) {
  const result = await query(
    `SELECT id, title, type, data, created_at
     FROM live_updates ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getCategories() {
  const result = await query(
    `SELECT id, name, slug, description FROM categories ORDER BY name ASC`
  );
  return result.rows;
}

export async function getCategoryCounts() {
  const result = await query(
    `SELECT category, COUNT(*) as count FROM articles GROUP BY category`
  );
  return result.rows.reduce((acc, row) => {
    acc[row.category] = parseInt(row.count, 10);
    return acc;
  }, {});
}

export async function getHomepageInsights(limit = 3) {
  const result = await query(
    `SELECT category, title, summary, slug, source_name, published_at
     FROM articles
     WHERE ai_refined = true OR jsonb_array_length(faq) > 0
     ORDER BY published_at DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map((row) => ({
    title: row.title,
    body: row.summary,
    href: `/news/${row.slug}`,
    category: row.category,
    source: row.source_name,
    published_at: row.published_at,
  }));
}

export async function getTrendingTags(limit = 8) {
  const result = await query(
    `SELECT value AS tag, COUNT(*)::int AS count
     FROM articles, jsonb_array_elements_text(tags) AS value
     GROUP BY value
     ORDER BY COUNT(*) DESC, value ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}
