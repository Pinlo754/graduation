import { ImageResponse } from "next/og";

export const alt = "Graduation invitation — You're Invited";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generic share preview. It deliberately contains no guest names (so one
 * guest's link never previews another guest) and only ASCII text, since the
 * built-in OG font has no Vietnamese glyphs.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 20%, #2a1a3f 0%, #15112B 40%, #080B18 100%)",
          color: "#FFF7E8",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "#F4D58D", marginBottom: 24 }}>GRADUATION CEREMONY</div>
        <div style={{ display: "flex", fontSize: 120, fontStyle: "italic" }}>You&apos;re Invited</div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#F36B3F", fontFamily: "monospace" }}>
          {"<FPT University · Software Engineering />"}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            padding: "14px 32px",
            border: "2px solid rgba(244,213,141,.5)",
            borderRadius: 999,
            fontSize: 24,
            fontFamily: "monospace",
            color: "#F4D58D",
          }}
        >
          $ open invitation
        </div>
      </div>
    ),
    size,
  );
}
