import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/articles";

export async function GET(request, { params }) {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    return NextResponse.json(article, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    console.error(`GET /api/articles/${slug} error:`, err);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
