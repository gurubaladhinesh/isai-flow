import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/src/lib/site";

export const alt = `${SITE_NAME} – Listen to Tamil Radio Online`;
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
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0a100e 0%, #121a17 45%, #1a2b24 100%)",
          color: "#e8f5f1",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "24px",
              background: "#1f4f44",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "#3ecfb4",
            }}
          >
            இ
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, color: "#d4a574", letterSpacing: "0.2em" }}>
              {SITE_NAME.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, color: "#8aa39a" }}>Tamil Internet Radio</div>
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "900px",
            background: "linear-gradient(90deg, #3ecfb4, #d4a574)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Live Tamil radio, tuned for listening.
        </div>
        <div style={{ marginTop: "28px", fontSize: 28, color: "#9bb5ab", maxWidth: "820px" }}>
          Stream film hits, Carnatic, and FM stations from around the world.
        </div>
      </div>
    ),
    size,
  );
}
