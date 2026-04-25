import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Keeps the article archive intact — only prunes articles beyond the 2000-article cap
// and live_updates older than 24 hours (ticker only needs recent items).
// Called by external cron (cron-job.org) every 6 hours.
// Protected by CRON_SECRET header.

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Keep the 2000 most recent articles — delete anything beyond that cap.
    // This preserves the full archive for SEO while preventing unbounded DB growth.
    const result = await query(
      `DELETE FROM articles
       WHERE id IN (
         SELECT id FROM articles
         ORDER BY published_at DESC
         OFFSET 2000
       )
       RETURNING id`
    );

    const deleted = result.rows.length;

    // Clean up live_updates older than 24 hours — ticker only needs recent items
    const liveResult = await query(
      `DELETE FROM live_updates
       WHERE created_at < NOW() - INTERVAL '24 hours'
       RETURNING id`
    );

    const deletedLive = liveResult.rows.length;

    return NextResponse.json({
      ok: true,
      deleted_articles: deleted,
      deleted_live_updates: deletedLive,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
