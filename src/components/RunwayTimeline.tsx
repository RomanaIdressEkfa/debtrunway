import type { PayoffResult } from "@/lib/debt";
import { describeDuration } from "@/lib/debt";
import { usd } from "@/lib/format";

interface Props {
  plan: PayoffResult;
  baseline: PayoffResult;
}

/**
 * The runway the site is named after.
 *
 * Every other payoff calculator answers "when am I done" with a date and a
 * table. This shows the shape of the journey instead: one lane per debt,
 * each ending where it clears, and beneath them the far longer strip you are
 * on if nothing changes. The argument is made by length rather than by
 * numbers, which is why it lands before anyone reads a figure.
 */
export default function RunwayTimeline({ plan, baseline }: Props) {
  if (!plan.feasible || plan.perDebt.length === 0) return null;

  // Both strips are measured against the same scale, so the gap between the
  // plan and the do-nothing path is literally the distance on screen.
  const span = Math.max(
    plan.months,
    baseline.feasible ? baseline.months : plan.months,
  );
  const pct = (months: number) => Math.max(2, (months / span) * 100);

  const years = Math.floor(span / 12);
  const step = years > 8 ? Math.ceil(years / 6) : 1;
  const ticks = Array.from({ length: years + 1 }, (_, i) => i).filter(
    (i) => i % step === 0,
  );

  return (
    <section className="card-shadow overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="border-b border-line px-5 py-4 sm:px-7 sm:py-5">
        <h2 className="font-semibold">Your runway</h2>
        <p className="mt-0.5 text-sm text-muted">
          Each debt runs until the month it clears.
        </p>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-7">
        {/* Year markers, drawn behind the lanes so they read as a ruler. */}
        <div className="relative mb-3 h-4">
          {ticks.map((year) => (
            <span
              key={year}
              className="absolute text-[10px] text-muted sm:text-xs"
              style={{
                left: `${(year * 12 * 100) / span}%`,
                transform: year === 0 ? "none" : "translateX(-50%)",
              }}
            >
              {year === 0 ? "now" : `yr ${year}`}
            </span>
          ))}
        </div>

        <ol className="space-y-3.5">
          {plan.perDebt.map((debt, i) => (
            <li key={debt.id}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
                    {i + 1}
                  </span>
                  {debt.name}
                </span>
                <span className="text-sm font-semibold whitespace-nowrap text-brand tabular-nums">
                  {debt.label}
                </span>
              </div>

              {/* The lane. Its length is the debt's life; the cap marks the
                  month it disappears. */}
              <div className="relative h-3 overflow-hidden rounded-full bg-background">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-brand"
                  style={{ width: `${pct(debt.month)}%` }}
                />
                <div
                  className="absolute inset-y-0 w-1 rounded-full bg-brand-panel"
                  style={{
                    left: `calc(${pct(debt.month)}% - 4px)`,
                  }}
                />
              </div>

              <p className="mt-1 text-xs text-muted">
                {describeDuration(debt.month)} · {usd(debt.interestPaid)} of
                interest
              </p>
            </li>
          ))}
        </ol>

        {/* The road not taken, on the same scale. */}
        {baseline.feasible && baseline.months > plan.months && (
          <div className="mt-7 border-t border-line pt-6">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-muted">
                If nothing changes
              </span>
              <span className="text-sm font-semibold whitespace-nowrap text-accent tabular-nums">
                {baseline.payoffLabel}
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-background">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent/35"
                style={{ width: `${pct(baseline.months)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {describeDuration(baseline.months)} ·{" "}
              {usd(baseline.totalInterest)} of interest —{" "}
              <strong className="text-accent">
                {describeDuration(baseline.months - plan.months)} longer
              </strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
