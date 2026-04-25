/**
 * Rank360 multi-source content pipeline
 *
 * Usage:
 * node --env-file=.env.local scripts/scraper.js
 */

const { Pool } = require("pg");

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    const { runContentPipeline } = await import("../src/lib/content-pipeline.js");
    console.log(`Starting Rank360 content pipeline at ${new Date().toISOString()}`);

    const result = await runContentPipeline({
      query: (text, params = []) => client.query(text, params),
      client,
      limitPerSource: 10,
    });

    console.log(JSON.stringify(result, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error("Pipeline failed:", error);
  process.exit(1);
});
