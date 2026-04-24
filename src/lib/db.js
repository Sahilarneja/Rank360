/**
 * db.js — Universal DB client
 *
 * - Local dev  → uses `pg` Pool (connects to local Postgres)
 * - Production → uses `@neondatabase/serverless` HTTP driver (Neon)
 *
 * Auto-detected via DATABASE_URL: if it contains "neon.tech" → use Neon driver.
 */

const isNeon = process.env.DATABASE_URL?.includes("neon.tech");

let _query;

async function getQuery() {
  if (_query) return _query;

  if (isNeon) {
    const { neon, neonConfig } = await import("@neondatabase/serverless");
    neonConfig.fetchConnectionCache = true;
    const sql = neon(process.env.DATABASE_URL);
    _query = async (text, params = []) => {
      const rows = await sql(text, params);
      return { rows };
    };
  } else {
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    _query = async (text, params) => pool.query(text, params);
  }

  return _query;
}

export async function query(text, params) {
  const q = await getQuery();
  return q(text, params);
}
