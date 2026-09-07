/**
 * The DebtRunway logo system.
 *
 * The mark used to be a balance curve settling onto a runway, which said what
 * the site did when the site computed interest. It computes shares of an
 * estate and thresholds of zakat now, and a falling-debt line would be telling
 * a visitor something untrue about the page they are on.
 *
 * So the mark is the khatam — the same eight-point star as the ground the
 * pages stand on and the tab icon. One shape carries the identity across the
 * favicon, the header and the social card instead of three drawings that have
 * to be kept in step.
 *
 * Two forms, because one shape cannot do both jobs:
 *   LogoMark      open star, for the header and footer at 20–36px
 *   LogoContainer solid tile, for favicons and social images at 16–64px,
 *                 where an open shape loses its ground
 */

interface MarkProps {
  size?: number;
  className?: string;
  /** Draw in a single colour — for one-colour print or a dark background. */
  mono?: string;
}

/**
 * The sixteen vertices of a khatam, alternating between an outer radius of 10
 * and an inner one of 10 × cos45 / cos22.5 — the radius at which two squares
 * set at forty-five degrees actually cross. Written out rather than computed
 * so the mark is one string in the markup and not a loop the browser runs.
 */
const STAR =
  "16,6 18.93,8.93 23.07,8.93 23.07,13.07 26,16 23.07,18.93 23.07,23.07 18.93,23.07 16,26 13.07,23.07 8.93,23.07 8.93,18.93 6,16 8.93,13.07 8.93,8.93 13.07,8.93";

/** The eight-point star, open, with the centre cut out of it. */
export function LogoMark({ size = 24, className, mono }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="DebtRunway"
    >
      <polygon points={STAR} fill={mono ?? "var(--brand)"} />
      {/* The rosette at the centre. It reads as a hole rather than a dot,
          which is what stops the star looking like a sticker. */}
      <circle
        cx="16"
        cy="16"
        r="4.2"
        fill={mono ?? "var(--gold, #d9a441)"}
        opacity={mono ? 0.4 : 1}
      />
      <circle cx="16" cy="16" r="1.7" fill={mono ?? "var(--brand)"} />
    </svg>
  );
}

/** Solid tile version. Survives 16px, where the open mark does not. */
export function LogoContainer({ size = 32, className }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      role="img"
      aria-label="DebtRunway"
    >
      <rect width="32" height="32" rx="8" fill="#0B5A4D" />
      <polygon points={STAR} fill="#E8C489" />
      <circle cx="16" cy="16" r="3.1" fill="#0B5A4D" />
    </svg>
  );
}

/**
 * Mark plus wordmark. The wordmark is real type in the site's own font, never
 * an image — it stays sharp at every size and is selectable and searchable.
 */
export default function Logo({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* Sized in CSS rather than by the attribute, so the lockup can step
          down on a narrow header without a second component. */}
      <LogoMark size={size} className="h-7 w-7 sm:h-9 sm:w-9" />
      <span
        className="text-xl font-bold tracking-tight whitespace-nowrap sm:text-2xl"
        style={{ letterSpacing: "-0.02em" }}
      >
        Debt<span className="accent-text">Runway</span>
      </span>
    </span>
  );
}
