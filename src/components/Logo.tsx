/**
 * The DebtRunway logo system.
 *
 * Drawn on a 32×32 grid — the size it actually has to survive — rather than
 * scaled down from something large. Stroke weights and padding are chosen so
 * the mark still reads in a browser tab.
 *
 * Two forms, because one shape cannot do both jobs:
 *   LogoMark      thin strokes, for the header and footer at 20–24px
 *   LogoContainer solid teal tile, for favicons and social images at 16–64px,
 *                 where thin strokes disappear entirely
 */

interface MarkProps {
  size?: number;
  className?: string;
  /** Draw in a single colour — for one-colour print or a dark background. */
  mono?: string;
}

/** The descending balance settling onto its runway. */
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
      {/* The balance falling away to nothing. */}
      <path
        d="M6 5C6 15 11 22 27 22"
        stroke={mono ?? "var(--brand)"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* The runway it lands on. */}
      <path
        d="M5 28H27"
        stroke={mono ?? "var(--foreground)"}
        strokeWidth="4"
        strokeLinecap="round"
        opacity={mono ? 0.45 : 1}
      />
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
      <rect width="32" height="32" rx="8" fill="#0F766E" />
      <path
        d="M9.5 8.5C9.5 16 13 21 23 21"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M9 25.5H23"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

/** Descending steps — the alternate concept, kept for comparison. */
export function LogoSteps({ size = 24, className }: MarkProps) {
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
      <path d="M9 6V24" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" />
      <path d="M17 13V24" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" />
      <path d="M25 19V24" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M5 28H27"
        stroke="var(--foreground)"
        strokeWidth="4"
        strokeLinecap="round"
      />
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
    <span className={`inline-flex items-center gap-1.5 sm:gap-2 ${className}`}>
      {/* Sized in CSS rather than by the attribute, so the lockup can step
          down on a narrow header without a second component. */}
      <LogoMark size={size} className="h-5 w-5 sm:h-6 sm:w-6" />
      <span
        className="text-base font-bold tracking-tight whitespace-nowrap sm:text-lg"
        style={{ letterSpacing: "-0.02em" }}
      >
        Debt<span className="text-brand">Runway</span>
      </span>
    </span>
  );
}
