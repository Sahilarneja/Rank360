import { NextResponse } from "next/server";
import { getArticles } from "@/lib/articles";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const category = searchParams.get("category") || null;
  const search = searchParams.get("search") || null;
  const limit = Math.min(parseInt(searchParams.get("limit") || "12", 10), 50);

  try {
    const data = await getArticles({ page, category, search, limit });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
