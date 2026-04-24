// Quick DB connection + health check
const fs = require("fs");
const path = require("path");

// Load .env.local
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

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("❌  DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const masked = dbUrl.replace(/:([^@]+)@/, ":****@");
console.log(`\n🔌  Connecting to: ${masked}\n`);

const isNeon = dbUrl.includes("neon.tech");

async function testConnection() {
  try {
    let rows;

    if (isNeon) {
      const { neon } = require("@neondatabase/serverless");
      const sql = neon(dbUrl);
      rows = async (text) => sql(text);
    } else {
      const { Pool } = require("pg");
      const pool = new Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 5000,
      });
      let ended = false;
      rows = async (text) => {
        const res = await pool.query(text);
        if (!ended) { ended = true; }
        return res.rows;
      };
      // end pool after all queries
      process.on("exit", () => pool.end());
    }

    const ver = await rows("SELECT version()");
    console.log("✅  Connected successfully");
    console.log("📦  " + (isNeon ? ver[0].version : ver[0].version).split(",")[0]);

    const tables = await rows(
      "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename"
    );
    const names = (isNeon ? tables : tables).map((r) => r.tablename);
    console.log(`\n📋  Tables (${names.length}): ${names.join(", ") || "none"}`);

    if (!names.includes("articles")) {
      console.warn("\n⚠️   Run: node scripts/migrate.js");
      return;
    }

    const counts = await rows(
      `SELECT (SELECT COUNT(*) FROM articles) AS articles,
              (SELECT COUNT(*) FROM categories) AS categories,
              (SELECT COUNT(*) FROM live_updates) AS live_updates`
    );
    const c = isNeon ? counts[0] : counts[0];
    console.log(`\n📊  Row counts:`);
    console.log(`    articles:     ${c.articles}`);
    console.log(`    categories:   ${c.categories}`);
    console.log(`    live_updates: ${c.live_updates}`);

    if (parseInt(c.articles) > 0) {
      const latest = await rows(
        "SELECT title, category, published_at FROM articles ORDER BY published_at DESC LIMIT 1"
      );
      const a = isNeon ? latest[0] : latest[0];
      console.log(`\n🗞️   Latest: "${a.title}" [${a.category}]`);
    } else {
      console.warn("\n⚠️   No articles — run: node scripts/migrate.js");
    }

    console.log("\n🎉  Database is healthy and ready!\n");
  } catch (err) {
    console.error("\n❌  Connection failed:", err.message);
    if (err.message.includes("ECONNREFUSED")) {
      console.error("💡  PostgreSQL not running. Start it: brew services start postgresql@18");
    } else if (err.message.includes("role") || err.message.includes("does not exist")) {
      console.error("💡  Wrong DB user in DATABASE_URL");
    } else if (err.message.includes("ETIMEDOUT") || err.message.includes("fetch failed")) {
      console.error("💡  Network blocking Neon. Use local DB for dev, Neon only on Vercel.");
    }
    process.exit(1);
  }
}

testConnection();
