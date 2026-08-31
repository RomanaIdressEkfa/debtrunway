import type { ReactNode } from "react";
import { describeDuration, type PayoffResult } from "@/lib/debt";
import { usd } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  /** What happens if the reader changes nothing. */
  baseline: PayoffResult;
  /** What happens with the extra payment they just entered. */
  plan: PayoffResult;
  extra: number;
  /** The share button, shown beside the plan. */
  action?: ReactNode;
}

/**
 * The fork in the road, stated as two futures side by side.
 *
 * Every other payoff calculator shows a single outcome. The number that
 * actually changes behaviour is not the payoff date — it is the distance
 * between the date you are heading for and the date you could have. Putting
 * both on screen at once, permanently, is the whole argument of this site.
 */
export default function TwoFutures({ baseline, plan, extra, action }: Props) {
  const interestSaved = baseline.feasible
    ? Math.max(0, baseline.totalInterest - plan.totalInterest)
    : 0;
  const monthsSaved = baseline.feasible
    ? Math.max(0, baseline.months - plan.months)
    : 0;

  return (
    <section>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Left: the road you are already on. Deliberately flat and grey — it
            should feel like the duller of the two. */}
        <div className="card-shadow rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <p className="text-xs font-semibold tracking-widest text-muted uppercase">
            If nothing changes
          </p>
          {baseline.feasible ? (
            <>
              <p className="mt-2 text-3xl font-bold tracking-tight text-muted tabular-nums sm:text-4xl">
                {baseline.payoffLabel}
              </p>
              <p className="mt-1 text-muted">
                {describeDuration(baseline.months)} of minimum payments
              </p>
              <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
                Interest handed over
              </p>
              <p className="text-2xl font-semibold text-accent tabular-nums">
                <AnimatedNumber value={baseline.totalInterest} format={usd} />
              </p>
            </>
          ) : (
            <p className="mt-3 text-muted">
              On minimum payments alone this balance never clears — the interest
              keeps pace with what you pay.
            </p>
          )}
        </div>

        {/* Right: the road they could take. */}
        <div className="shimmer card-shadow rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              {extra > 0 ? `Adding ${usd(extra)} a month` : "With your plan"}
            </p>
            {action}
          </div>
          <p
            key={plan.payoffLabel}
            className="animate-pop mt-2 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl"
          >
            {plan.payoffLabel}
          </p>
          <p className="mt-1 text-white/85">
            {describeDuration(plan.months)} and you are done
          </p>
          <p className="mt-5 border-t border-white/20 pt-4 text-sm text-white/70">
            Interest handed over
          </p>
          <p className="text-2xl font-semibold tabular-nums">
            <AnimatedNumber value={plan.totalInterest} format={usd} />
          </p>
        </div>
      </div>

      {/* The gap between them, which is the actual product. */}
      {baseline.feasible && interestSaved > 0 && (
        <p className="mt-3 rounded-2xl border border-brand/25 bg-brand-soft px-5 py-4 text-center text-brand">
          <span className="text-lg font-semibold">
            <AnimatedNumber value={interestSaved} format={usd} /> saved
          </span>
          {monthsSaved > 0 && (
            <>
              <span className="mx-2 opacity-40">·</span>
              <span className="text-lg font-semibold">
                {describeDuration(monthsSaved)} sooner
              </span>
            </>
          )}
          <span className="mt-1 block text-sm opacity-80">
            That is what the extra {usd(extra)} a month is worth to you.
          </span>
        </p>
      )}
    </section>
  );
}
