import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            color: "#2563EB",
            fontFamily: "sans-serif",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: 90 }}>R</span>
          <span style={{ fontSize: 44, letterSpacing: "-1px" }}>360</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
