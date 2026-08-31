/** Rendered once at build time — required by `output: "export"`. */
export const dynamic = "force-static";

import { ImageResponse } from "next/og";

/**
 * The card people see when a link to the site is pasted into a message,
 * Reddit, or a social post. A shared link that previews as a blank rectangle
 * gets far fewer clicks than one that looks like a real product.
 */
export const alt = "DebtRunway — debt payoff calculator";
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
          background: "#0F766E",
          padding: 72,
          fontFamily: "sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 5C6 15 11 22 27 22"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M5 28H27"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="4"
              strokeLinecap="round"
            />
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
            Find out exactly when
            <br />
            you will be debt-free.
          </span>
          <span
            style={{
              marginTop: 28,
              fontSize: 34,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Free calculator · No sign-up · Nothing leaves your browser
          </span>
        </div>
      </div>
    ),
    size,
  );
}
