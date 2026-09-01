import { describeDuration, type PayoffResult, type Strategy } from "@/lib/debt";
import { usd } from "@/lib/format";

interface Props {
  snowball: PayoffResult;
  avalanche: PayoffResult;
  selected: Strategy;
  onSelect: (strategy: Strategy) => void;
}

const COPY: Record<Strategy, { title: string; rule: string }> = {
  snowball: { title: "Snowball", rule: "Smallest balance first" },
  avalanche: { title: "Avalanche", rule: "Highest rate first" },
};

/**
 * A choice that shows its own consequence.
 *
 * Two plain buttons gave no reason to press either, and worse: when a set of
 * debts happens to order the same way under both rules — the smallest balance
 * also carrying the highest rate — pressing them changes nothing at all, and
 * the reader is left wondering whether the page is broken. Each option now
 * carries its own payoff date and interest, and when the two agree the page
 * says so outright.
 */
export default function StrategyChoice({
  snowball,
  avalanche,
  selected,
  onSelect,
}: Props) {
  const options: { key: Strategy; result: PayoffResult }[] = [
    { key: "snowball", result: snowball },
    { key: "avalanche", result: avalanche },
  ];

  const bothWork = snowball.feasible && avalanche.feasible;
  const gap = bothWork
    ? Math.abs(snowball.totalInterest - avalanche.totalInterest)
    : 0;
  const identical = bothWork && gap < 1 && snowball.months === avalanche.months;
  const cheaper =
    avalanche.totalInterest < snowball.totalInterest ? "avalanche" : "snowball";

  return (
    <fieldset className="mt-6 border-t border-line pt-5">
      <legend className="text-sm font-medium">Which debt goes first?</legend>

      <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {options.map(({ key, result }) => {
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              aria-pressed={active}
              className={`press rounded-xl border p-4 text-left ${
                active
                  ? "border-brand bg-brand-soft"
                  : "border-line hover:border-brand"
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span
                  className={`font-bold ${active ? "text-brand" : "text-foreground"}`}
                >
                  {COPY[key].title}
                </span>
                <span
                  aria-hidden
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    active ? "border-brand bg-brand" : "border-line"
                  }`}
                >
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </span>
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                {COPY[key].rule}
              </span>

              {/* The reason to press this one rather than the other. */}
              {result.feasible && (
                <span className="mt-3 block border-t border-line/70 pt-2.5 text-sm">
                  <span className="block font-semibold tabular-nums">
                    {result.payoffLabel}
                  </span>
                  <span className="block text-muted tabular-nums">
                    {usd(result.totalInterest)} interest
                    {result.perDebt[0] &&
                      ` · first win ${result.perDebt[0].label}`}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {bothWork && (
        <p className="mt-3 text-sm text-muted">
          {identical ? (
            <>
              With these debts both methods clear in the same order, so the
              result is identical — <strong>pick either</strong>.
            </>
          ) : (
            <>
              <strong className="text-foreground">
                {cheaper === "avalanche" ? "Avalanche" : "Snowball"} costs{" "}
                {usd(gap)} less.
              </strong>{" "}
              {snowball.perDebt[0] &&
                avalanche.perDebt[0] &&
                snowball.perDebt[0].month < avalanche.perDebt[0].month && (
                  <>
                    Snowball clears your first debt{" "}
                    {describeDuration(
                      avalanche.perDebt[0].month - snowball.perDebt[0].month,
                    )}{" "}
                    sooner, which is why some people choose it anyway.
                  </>
                )}
            </>
          )}
        </p>
      )}
    </fieldset>
  );
}
