/**
 * The decorative vocabulary the rest of the site borrows from.
 *
 * Islamic ornament is architectural before it is graphic: the pointed arch of
 * a mihrab, the scalloped edge of a niche, the star field that fills a wall.
 * These are the same three, cut down to what a calculator can carry without
 * getting in the way of a number someone came here to read.
 *
 * All of it is inline SVG and CSS. No images, no font icons, nothing to
 * download, and every stroke takes its colour from the element it sits in, so
 * a shape works on the cream ground and on the green panel without a second
 * copy for the dark theme.
 */

/**
 * A corner of interlaced arcs, for the top-right of a filled panel.
 *
 * It is the piece that reads as "this is an Islamic page" from across a room,
 * which is exactly why it belongs on the result panel and nowhere near the
 * form: ornament on an input is noise, ornament on an answer is a frame.
 */
export function CornerMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.1" opacity="0.5">
        {/* Concentric eight-point stars, the khatam again at a larger scale. */}
        <g transform="translate(120 40)">
          <rect x="-34" y="-34" width="68" height="68" />
          <rect x="-34" y="-34" width="68" height="68" transform="rotate(45)" />
          <rect x="-22" y="-22" width="44" height="44" />
          <rect x="-22" y="-22" width="44" height="44" transform="rotate(45)" />
          <circle r="11" />
        </g>
        {/* Two arcs sweeping out of it, which is what keeps the motif from
            reading as a sticker dropped on the corner. */}
        <path d="M14 6 A 106 106 0 0 1 120 112" opacity="0.55" />
        <path d="M2 30 A 128 128 0 0 1 130 158" opacity="0.3" />
      </g>
    </svg>
  );
}

/**
 * The pointed arch, drawn once and used as a header crown on a card.
 *
 * The proportions are the four-centred arch of Mughal and Persian work rather
 * than the horseshoe of the Maghreb — a flatter shoulder and a short point,
 * which sits better above a block of text than a tall Gothic rise would.
 */
export function ArchCrown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 44"
      aria-hidden
      className={`pointer-events-none ${className}`}
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 44 L0 22 Q0 6 22 4 Q52 2 60 0 Q68 2 98 4 Q120 6 120 22 L120 44"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

/**
 * A scalloped rule, for closing a section the way a niche closes a wall.
 *
 * It repeats a single lobe across the full width rather than stretching one
 * long path, so the lobes stay round at any container width instead of
 * flattening out on a wide screen.
 */
export function ScallopRule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`scallop-rule pointer-events-none ${className}`}
    />
  );
}

/**
 * The full mihrab outline, as a watermark behind a heading.
 *
 * Kept very faint and given aria-hidden: it is atmosphere, and a screen reader
 * announcing "image" here would be an interruption for no gain.
 */
export function MihrabWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 260"
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      fill="none"
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <path d="M20 260 L20 110 Q20 40 100 8 Q180 40 180 110 L180 260" />
        <path
          d="M42 260 L42 116 Q42 58 100 32 Q158 58 158 116 L158 260"
          opacity="0.6"
        />
        <path
          d="M64 260 L64 122 Q64 76 100 56 Q136 76 136 122 L136 260"
          opacity="0.35"
        />
      </g>
    </svg>
  );
}

/**
 * The wave that closes a band.
 *
 * A straight edge between the green and the page is the one place the site
 * still looked like a stack of rectangles. This cuts the boundary as a shallow
 * S — the same move a dome makes against a sky, which is where the vocabulary
 * on the rest of the page comes from.
 *
 * It is drawn as a filled shape in the page colour rather than as a clip on
 * the band, because a clip-path in bounding-box units would stretch the wave
 * taller on a tall hero and flatter on a short one. This keeps one wave at one
 * height whatever the band above it is doing, and `preserveAspectRatio="none"`
 * lets it span any width without the curve going lumpy at the ends.
 *
 * `flip` puts it at the top instead, for the footer, where the band arrives
 * from below.
 */
export function BandCurve({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 z-10 h-9 w-full sm:h-16 ${
        flip ? "top-0 -scale-y-100" : "bottom-0"
      }`}
    >
      <path
        d="M0 40 C 300 2, 600 0, 900 30 C 1120 52, 1285 66, 1440 46 L1440 80 L0 80 Z"
        fill="var(--background)"
      />
    </svg>
  );
}
