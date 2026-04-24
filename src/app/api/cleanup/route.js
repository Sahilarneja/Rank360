import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// Deletes articles older than 48 hours
// Called by external cron (cron-job.org) every 6 hours
// Protected by CRON_SECRET header

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await query(
      `DELETE FROM articles
       WHERE published_at < NOW() - INTERVAL '6 hours'
       RETURNING id`
    );

    const deleted = result.rows.length;

    // Also clean up live_updates older than 3 hours
    const liveResult = await query(
      `DELETE FROM live_updates
       WHERE created_at < NOW() - INTERVAL '3 hours'
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
