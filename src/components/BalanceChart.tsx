import { usd } from "@/lib/format";

export interface ChartSeries {
  label: string;
  color: string;
  /** Ending balance for each month, index 0 being month 1. */
  points: number[];
  dashed?: boolean;
}

interface Props {
  series: ChartSeries[];
  startingBalance: number;
}

/**
 * Hand-rolled chart rather than a library: two lines and an axis do not
 * justify a dependency, and inline SVG prints cleanly.
 *
 * The axis labels are HTML, not SVG text. Text inside a viewBox scales with
 * the box, so a chart that fits a phone would have unreadable labels and a
 * desktop one would have enormous ones. Keeping the labels in HTML lets the
 * plot stretch to any width while the type stays exactly 11px — which is what
 * makes this readable on a 360px screen with no sideways scrolling.
 */
export default function BalanceChart({ series, startingBalance }: Props) {
  const longest = Math.max(1, ...series.map((s) => s.points.length));
  const peak = Math.max(startingBalance, ...series.flatMap((s) => s.points), 1);

  // Everything is drawn in a 0–100 square and stretched by the browser.
  const x = (monthIndex: number) => (monthIndex / longest) * 100;
  const y = (value: number) => 100 - (value / peak) * 100;

  const path = (points: number[]) =>
    [`M ${x(0)} ${y(startingBalance)}`]
      .concat(points.map((v, i) => `L ${x(i + 1)} ${y(v)}`))
      .join(" ");

  const gridFractions = [0, 0.25, 0.5, 0.75, 1];

  // One tick per year, thinned out on long plans so labels never collide.
  const years = Math.floor(longest / 12);
  const step = years > 8 ? Math.ceil(years / 6) : 1;
  const yearTicks = Array.from({ length: years + 1 }, (_, i) => i).filter(
    (i) => i % step === 0,
  );

  return (
    <figure className="w-full">
      <div className="flex gap-2">
        {/* Value axis */}
        <div className="relative h-[200px] w-11 shrink-0 sm:h-[240px] sm:w-14">
          {gridFractions.map((f) => (
            <span
              key={f}
              className="absolute right-0 -translate-y-1/2 text-[10px] text-muted tabular-nums sm:text-[11px]"
              style={{ top: `${(1 - f) * 100}%` }}
            >
              {usd(peak * f)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-[200px] w-full sm:h-[240px]"
            role="img"
            aria-label={`Balance over time. Starting at ${usd(startingBalance)} and reaching zero after ${longest} months.`}
          >
            {gridFractions.map((f) => (
              <line
                key={f}
                x1="0"
                x2="100"
                y1={(1 - f) * 100}
                y2={(1 - f) * 100}
                stroke="var(--line)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {series.map((s, i) =>
              s.dashed ? (
                <path
                  key={s.label}
                  d={path(s.points)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeDasharray="5 4"
                  opacity="0.75"
                  /* Keeps the stroke an even weight despite the stretch. */
                  vectorEffect="non-scaling-stroke"
                />
              ) : (
                /* pathLength normalises the line to 1 unit, so the same dash
                   offset draws any path from start to finish exactly. */
                <path
                  key={s.label}
                  className="chart-line"
                  pathLength={1}
                  style={
                    {
                      "--draw-length": 1,
                      animationDelay: `${0.15 + i * 0.12}s`,
                    } as React.CSSProperties
                  }
                  d={path(s.points)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              ),
            )}
          </svg>

          {/* Time axis */}
          <div className="relative mt-1.5 h-4">
            {yearTicks.map((yearIndex) => (
              <span
                key={yearIndex}
                className="absolute -translate-x-1/2 text-[10px] text-muted whitespace-nowrap sm:text-[11px]"
                style={{ left: `${x(yearIndex * 12)}%` }}
              >
                {yearIndex === 0 ? "now" : `yr ${yearIndex}`}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-0.5 w-5 rounded"
              style={{
                backgroundColor: s.color,
                opacity: s.dashed ? 0.55 : 1,
              }}
            />
            <span className="text-muted">{s.label}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
