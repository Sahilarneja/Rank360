import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/utils";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "linear-gradient(135deg, rgb(15,23,42) 0%, rgb(37,99,235) 58%, rgb(191,219,254) 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.16)",
                fontSize: "38px",
                fontWeight: 900,
              }}
            >
              R
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "54px", fontWeight: 900 }}>{SITE_NAME}</div>
              <div style={{ fontSize: "24px", opacity: 0.88 }}>{SITE_TAGLINE}</div>
            </div>
          </div>
          <div
            style={{
              borderRadius: "999px",
              padding: "12px 18px",
              background: "rgba(255,255,255,0.14)",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            Education News
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "920px" }}>
          <div style={{ fontSize: "74px", fontWeight: 900, lineHeight: 1.02 }}>
            Fresh student-first coverage with site-safe visuals
          </div>
          <div style={{ fontSize: "28px", lineHeight: 1.35, opacity: 0.92 }}>
            AI-refined education updates for JEE, NEET, CUET, results, counselling, and admissions.
          </div>
        </div>
      </div>
    ),
    size
  );
}
