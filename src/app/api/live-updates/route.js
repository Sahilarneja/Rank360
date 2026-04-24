import { NextResponse } from "next/server";
import { getLiveUpdates } from "@/lib/articles";

export async function GET() {
  try {
    const updates = await getLiveUpdates(12);
    return NextResponse.json(updates, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("GET /api/live-updates error:", err);
    return NextResponse.json({ error: "Failed to fetch updates" }, { status: 500 });
  }
}
