import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 0,
            color: "#2563EB",
            fontFamily: "sans-serif",
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          <span style={{ fontSize: 24 }}>R</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
