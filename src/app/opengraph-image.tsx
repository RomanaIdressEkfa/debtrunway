/** Rendered once at build time — required by `output: "export"`. */
export const dynamic = "force-static";

import { ImageResponse } from "next/og";

/**
 * The card people see when a link to the site is pasted into a message,
 * Reddit, or a social post. A shared link that previews as a blank rectangle
 * gets far fewer clicks than one that looks like a real product.
 */
export const alt = "DebtRunway — Islamic inheritance and zakat calculators";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B5A4D",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <polygon
              points="16,6 18.93,8.93 23.07,8.93 23.07,13.07 26,16 23.07,18.93 23.07,23.07 18.93,23.07 16,26 13.07,23.07 8.93,23.07 8.93,18.93 6,16 8.93,13.07 8.93,8.93 13.07,8.93"
              fill="#E8C489"
            />
            <circle cx="16" cy="16" r="3.1" fill="#0F766E" />
          </svg>
          <span style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            DebtRunway
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2.5,
            }}
          >
            The shares, and the
            <br />
            ruling behind each one.
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 34,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Inheritance · Zakat · Nothing leaves your browser
          </span>
        </div>
      </div>
    ),
    size,
  );
}
