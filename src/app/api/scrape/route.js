import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { runContentPipeline } from "@/lib/content-pipeline";

// Called by external cron (cron-job.org) every 10 minutes
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
    const stats = await runContentPipeline({ query, limitPerSource: 12 });

    // Bust ISR cache so homepage and news page show fresh content immediately
    if (stats.inserted > 0 || stats.updated > 0) {
      revalidatePath("/");
      revalidatePath("/news");
    }

    return NextResponse.json(stats);
  } catch (err) {
    console.error("Scrape pipeline error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
