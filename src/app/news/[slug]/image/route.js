import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { getCategoryLabel, truncate } from "@/lib/utils";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Rank360 article cover";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const CATEGORY_STYLES = {
  jee: ["#1d4ed8", "#0f172a"],
  neet: ["#059669", "#022c22"],
  cuet: ["#7c3aed", "#1e1b4b"],
  admissions: ["#ea580c", "#431407"],
  results: ["#dc2626", "#450a0a"],
  news: ["#2563eb", "#111827"],
};

function getPalette(category) {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.news;
}

export async function GET(_request, { params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return new Response("Not found", { status: 404 });
  }

  const [accent, deep] = getPalette(article.category);
  const categoryLabel = getCategoryLabel(article.category);
  const summary = truncate(article.summary || "Fresh education coverage from Rank360.", 170);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          background: `linear-gradient(135deg, ${deep} 0%, ${accent} 62%, #dbeafe 100%)`,
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.10)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "48px",
            bottom: "52px",
            width: "180px",
            height: "180px",
            borderRadius: "36px",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.16)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "28px",
              }}
            >
              R
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "28px", fontWeight: 900 }}>Rank360</div>
              <div style={{ fontSize: "18px", opacity: 0.88 }}>Student-first article cover</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.14)",
              padding: "12px 18px",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            <span>{categoryLabel}</span>
            {article.source_name ? <span style={{ opacity: 0.85 }}>· {article.source_name}</span> : null}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px", maxWidth: "880px", zIndex: 1 }}>
          <div style={{ fontSize: "62px", fontWeight: 900, lineHeight: 1.06 }}>
            {truncate(article.title, 100)}
          </div>
          <div
            style={{
              fontSize: "28px",
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.92)",
              maxWidth: "760px",
            }}
          >
            {summary}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "20px", opacity: 0.82 }}>Generated for direct site use</div>
            <div style={{ fontSize: "22px", fontWeight: 700 }}>No raw AI image dependency</div>
          </div>
          <div style={{ fontSize: "18px", opacity: 0.78 }}>
            {article.reading_time_minutes ? `${article.reading_time_minutes} min read` : "Fresh coverage"}
          </div>
        </div>
      </div>
    ),
    size
  );
}
