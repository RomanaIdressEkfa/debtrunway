"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  compareStrategies,
  describeDuration,
  type Debt,
  type Strategy,
} from "@/lib/debt";
import { usd } from "@/lib/format";
import { decodePlan, encodePlan } from "@/lib/shareState";
import AnimatedNumber from "./AnimatedNumber";
import BalanceChart from "./BalanceChart";
import PerDebtTable from "./PerDebtTable";
import RunwayTimeline from "./RunwayTimeline";
import ScheduleTable from "./ScheduleTable";
import ShareButton from "./ShareButton";
import StrategyChoice from "./StrategyChoice";
import TwoFutures from "./TwoFutures";
import { Card, Disclosure, Notice } from "./ui";

/** Where the plan is kept between visits — this browser only, never a server. */
const STORAGE_KEY = "debtrunway:plan";

interface DebtInput {
  id: string;
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
}

interface Props {
  /** Pins the page to one method and hides the toggle. */
  lockedStrategy?: Strategy;
}

const STARTER: DebtInput[] = [
  { id: "d1", name: "Visa card", balance: "6200", apr: "22.9", minPayment: "155" },
  { id: "d2", name: "Store card", balance: "1850", apr: "26.99", minPayment: "55" },
  { id: "d3", name: "Car loan", balance: "11400", apr: "6.4", minPayment: "310" },
];

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

let nextId = 4;

export default function PayoffCalculator({ lockedStrategy }: Props) {
  const [debts, setDebts] = useState<DebtInput[]>(STARTER);
  const [extra, setExtra] = useState("200");
  const [picked, setPicked] = useState<Strategy>(lockedStrategy ?? "snowball");
  const strategy = lockedStrategy ?? picked;

  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);

  // Restore after mount rather than during render, so the page stays
  // statically rendered and hydration-safe. A shared link wins over the saved
  // plan: someone who followed a link came to see that plan, not their own.
  useEffect(() => {
    const shared = decodePlan(window.location.search);

    if (shared) {
      setDebts(
        shared.debts.map((d, i) => ({
          id: `shared-${i}`,
          name: d.name,
          balance: d.balance,
          apr: d.apr,
          minPayment: d.minPayment,
        })),
      );
      setExtra(shared.extra);
      if (shared.strategy && !lockedStrategy) setPicked(shared.strategy);
      setHydrated(true);
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const plan = JSON.parse(raw) as {
          debts?: DebtInput[];
          extra?: string;
          strategy?: Strategy;
        };
        if (Array.isArray(plan.debts) && plan.debts.length > 0) {
          setDebts(plan.debts);
          setSaved(true);
        }
        if (typeof plan.extra === "string") setExtra(plan.extra);
        if (plan.strategy && !lockedStrategy) setPicked(plan.strategy);
      }
    } catch {
      // Corrupt entry, or storage blocked. The example rows are a fine start.
    }

    setHydrated(true);
  }, [lockedStrategy]);

  // Keep the plan for next month. `hydrated` guards the first render, which
  // would otherwise write the example rows over whatever was saved.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ debts, extra, strategy }),
      );
      setSaved(true);
    } catch {
      // Private mode or a full quota: the calculator still works, it just
      // will not remember. Nothing to tell the reader about.
    }
  }, [debts, extra, strategy, hydrated]);

  const startOver = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Already gone, or storage blocked.
    }
    setDebts(STARTER);
    setExtra("200");
    setSaved(false);
  };

  const parsed: Debt[] = useMemo(
    () =>
      debts.map((d) => ({
        id: d.id,
        name: d.name.trim() || "Unnamed debt",
        balance: num(d.balance),
        apr: num(d.apr),
        minPayment: num(d.minPayment),
      })),
    [debts],
  );

  const extraAmount = num(extra);

  /**
   * The simulation runs at a lower priority than typing.
   *
   * Every keystroke would otherwise trigger three full payoff simulations of
   * up to 600 months each, on the same thread that has to paint the character
   * you just typed. On a mid-range phone that is felt as lag in the input.
   * Deferring lets React paint the keystroke first and recompute after, and
   * intermediate values are skipped when someone types quickly.
   */
  const deferredDebts = useDeferredValue(parsed);
  const deferredExtra = useDeferredValue(extraAmount);
  const result = useMemo(
    () => compareStrategies(deferredDebts, deferredExtra),
    [deferredDebts, deferredExtra],
  );

  const chosen = result[strategy];
  const baseline = result.minimumOnly;

  const totalBalance = parsed.reduce((s, d) => s + d.balance, 0);
  const totalMinimums = parsed.reduce((s, d) => s + d.minPayment, 0);

  const update = (id: string, field: keyof DebtInput, value: string) =>
    setDebts((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );

  const interestSaved = baseline.feasible
    ? Math.max(0, baseline.totalInterest - chosen.totalInterest)
    : 0;
  const monthsSaved = baseline.feasible
    ? Math.max(0, baseline.months - chosen.months)
    : 0;

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1: what you owe ---------- */}
      <Card className="no-print">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
              1
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight sm:text-xl">
                What you owe
              </h2>
              <p className="mt-1 text-sm text-muted">
                Replace the example rows with your own debts. All three figures
                are on your statement.
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-background px-3 py-1.5 text-sm font-semibold tabular-nums">
            {usd(totalBalance)} total
          </span>
        </div>

        {/* Everyone knows their balance; far fewer are sure which number on a
            statement is the APR. Saying so here prevents the commonest way to
            get a wrong answer out of this page. */}
        <details className="group mt-3 rounded-xl border border-line bg-background">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 text-sm font-medium">
            Where do I find these numbers?
            <span
              aria-hidden
              className="text-muted transition-transform group-open:rotate-180"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3">
                <path
                  d="M2 4.5 6 8.5 10 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </summary>
          <dl className="space-y-3 px-3.5 pb-3.5 text-sm">
            <div>
              <dt className="font-semibold">Debt</dt>
              <dd className="text-muted">
                Any name you will recognise — &ldquo;Visa&rdquo;, &ldquo;Store
                card&rdquo;, &ldquo;Car&rdquo;. It only labels the row.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Balance</dt>
              <dd className="text-muted">
                What you still owe <strong>today</strong>, not what you
                originally borrowed. On a statement it is the{" "}
                <em>current</em> or <em>statement balance</em>.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">APR %</dt>
              <dd className="text-muted">
                The yearly interest rate, near the interest charges on your
                statement. Cards often list several — use the{" "}
                <em>purchase APR</em>. Type <strong>22.9</strong>, not 0.229.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Minimum</dt>
              <dd className="text-muted">
                The smallest payment your lender will accept this month, shown
                as <em>minimum payment due</em>. On a loan it is your fixed
                monthly instalment.
              </dd>
            </div>
          </dl>
        </details>

        <div className="mt-4 space-y-2.5">
          <div className="hidden gap-2 px-1 text-xs font-medium tracking-wide text-muted uppercase sm:grid sm:grid-cols-[1.5fr_1fr_0.7fr_1fr_auto]">
            <span>Debt</span>
            <span>Balance</span>
            <span>APR %</span>
            <span>Minimum</span>
            <span className="w-8" />
          </div>

          {debts.map((debt) => (
            /* On a phone the name gets its own line and the three figures sit
               side by side — stacking all four made the form absurdly tall.
               `sm:contents` dissolves that wrapper on wider screens so the
               fields rejoin the parent grid as one row. */
            <div
              key={debt.id}
              className="relative rounded-xl border border-line p-2.5 sm:static sm:grid sm:grid-cols-[1.5fr_1fr_0.7fr_1fr_auto] sm:items-center sm:gap-2 sm:rounded-none sm:border-0 sm:p-0"
            >
              <div className="pr-9 sm:pr-0">
                <RowField
                  label="Debt"
                  value={debt.name}
                  placeholder="Credit card"
                  text
                  onChange={(v) => update(debt.id, "name", v)}
                />
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:contents">
                <RowField
                  label="Balance"
                  value={debt.balance}
                  placeholder="5000"
                  prefix="$"
                  onChange={(v) => update(debt.id, "balance", v)}
                />
                <RowField
                  label="APR %"
                  value={debt.apr}
                  placeholder="19.9"
                  onChange={(v) => update(debt.id, "apr", v)}
                />
                <RowField
                  label="Minimum"
                  value={debt.minPayment}
                  placeholder="120"
                  prefix="$"
                  onChange={(v) => update(debt.id, "minPayment", v)}
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setDebts((rows) =>
                    rows.length > 1 ? rows.filter((r) => r.id !== debt.id) : rows,
                  )
                }
                disabled={debts.length === 1}
                aria-label={`Remove ${debt.name || "debt"}`}
                className="press absolute top-2.5 right-2.5 rounded-lg border border-line px-2.5 py-2 text-sm text-muted hover:border-danger hover:text-danger disabled:cursor-not-allowed disabled:opacity-30 sm:static sm:justify-self-center sm:py-2.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setDebts((rows) => [
              ...rows,
              { id: `d${nextId++}`, name: "", balance: "", apr: "", minPayment: "" },
            ])
          }
          className="press mt-3 w-full rounded-xl border border-dashed border-line py-2.5 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
        >
          + Add another debt
        </button>

        {saved && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
            <span className="flex items-center gap-1.5 text-muted">
              <svg viewBox="0 0 16 16" className="h-4 w-4 text-brand" aria-hidden>
                <path
                  d="M3 8.5 6.5 12 13 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Saved on this device — it will be here next month
            </span>
            <button
              type="button"
              onClick={startOver}
              className="press rounded-lg border border-line px-3 py-1.5 font-medium text-muted hover:border-danger hover:text-danger"
            >
              Start over
            </button>
          </div>
        )}
      </Card>

      {/* ---------- Step 2: what you can pay ---------- */}
      <Card className="no-print">
        <label htmlFor="extra" className="font-semibold">
          What can you add each month?
        </label>
        <p className="mt-1 text-sm text-muted">
          On top of your {usd(totalMinimums)} of minimums. This one number does
          most of the work.
        </p>

        <div className="mt-3 flex items-center rounded-xl border border-line px-4 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
          <span className="text-xl text-muted">$</span>
          <input
            id="extra"
            inputMode="decimal"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            className="w-full bg-transparent px-2 py-3 text-2xl font-bold tabular-nums outline-none"
          />
          <span className="shrink-0 text-sm text-muted">/ month</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[0, 50, 100, 200, 400].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setExtra(String(amount))}
              className={`press rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                extraAmount === amount
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {amount === 0 ? "Nothing" : `+${usd(amount)}`}
            </button>
          ))}
        </div>

        {!lockedStrategy && (
          <StrategyChoice
            snowball={result.snowball}
            avalanche={result.avalanche}
            selected={strategy}
            onSelect={setPicked}
          />
        )}
      </Card>

      {/* ---------- The answer ---------- */}
      {!chosen.feasible ? (
        <Notice tone="danger">
          {chosen.reason ?? "Add a debt above to see your payoff plan."}
        </Notice>
      ) : (
        <>
          <TwoFutures
            baseline={baseline}
            plan={chosen}
            extra={extraAmount}
            action={
              <ShareButton
                query={encodePlan({ debts, extra, strategy })}
                headline={`I'll be debt-free in ${chosen.payoffLabel} — ${describeDuration(chosen.months)} from now.`}
              />
            }
          />

          {/* The runway leads, because it answers "what happens to each of my
              debts" — the thing a table of numbers makes you work out. The
              balance curve is the same story in a conventional form, so it
              waits behind a disclosure. */}
          <RunwayTimeline plan={chosen} baseline={baseline} />

          <Disclosure
            title="Debt by debt, and what to pay"
            hint={`${chosen.perDebt.length} debts, in the order you clear them`}
          >
            <PerDebtTable perDebt={chosen.perDebt} />
            <p className="mt-4 text-sm text-muted">
              Month 1 is this month. Each time a debt clears, its payment moves
              to the next one — which is why the amounts in the last column go
              up while your monthly total stays the same.
            </p>
          </Disclosure>

          <Disclosure
            title="Balance over time"
            hint="Your plan against minimum payments only"
          >
            <BalanceChart
              startingBalance={totalBalance}
              series={[
                {
                  label: `Your ${strategy} plan`,
                  color: "var(--brand)",
                  points: chosen.rows.map((r) => r.endingBalance),
                },
                ...(baseline.feasible
                  ? [
                      {
                        label: "Minimum payments only",
                        color: "var(--accent)",
                        points: baseline.rows.map((r) => r.endingBalance),
                        dashed: true,
                      },
                    ]
                  : []),
              ]}
            />
          </Disclosure>

          {result.snowball.feasible && result.avalanche.feasible && (
            <Disclosure
              title="Snowball vs. avalanche"
              hint={
                result.avalanche.totalInterest < result.snowball.totalInterest
                  ? `Avalanche saves ${usd(result.snowball.totalInterest - result.avalanche.totalInterest)}`
                  : "Both cost the same here"
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-line text-left">
                      <th className="py-2 pr-4 font-semibold">Method</th>
                      <th className="py-2 pr-4 text-right font-semibold">
                        Debt-free
                      </th>
                      <th className="py-2 text-right font-semibold">Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(["snowball", "avalanche"] as const).map((option) => {
                      const r = result[option];
                      return (
                        <tr
                          key={option}
                          className={`border-b border-line last:border-0 ${
                            option === strategy ? "font-medium text-brand" : ""
                          }`}
                        >
                          <td className="py-2.5 pr-4 capitalize">{option}</td>
                          <td className="py-2.5 pr-4 text-right tabular-nums">
                            {r.payoffLabel}
                          </td>
                          <td className="py-2.5 text-right tabular-nums">
                            {usd(r.totalInterest)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-muted">
                {result.avalanche.totalInterest < result.snowball.totalInterest
                  ? `Avalanche is cheaper, but snowball clears your first debt in ${result.snowball.perDebt[0]?.label ?? "the first few months"} — and that early win is why most people actually finish.`
                  : "With these balances both methods cost the same, so pick whichever order you will stick with."}
              </p>
            </Disclosure>
          )}

          <Disclosure
            title="Month-by-month schedule"
            hint={`All ${chosen.months} payments, printable`}
          >
            <ScheduleTable rows={chosen.rows} />
            <button
              type="button"
              onClick={() => window.print()}
              className="press no-print mt-4 w-full rounded-xl border border-line py-2.5 text-sm font-medium transition hover:border-brand hover:text-brand"
            >
              Print or save as PDF
            </button>
          </Disclosure>
        </>
      )}
    </div>
  );
}

/**
 * Compact input for the debt table: the column header carries the label on
 * desktop, so it only repeats it on narrow screens where the grid collapses.
 */
function RowField({
  label,
  value,
  placeholder,
  onChange,
  prefix,
  text,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  prefix?: string;
  text?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-muted sm:hidden">
        {label}
      </span>
      {/* Padding and type step down on narrow screens: at 320px a five-figure
          balance has to fit a third of the row without being clipped. */}
      <span className="flex items-center rounded-xl border border-line bg-surface px-2 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 sm:px-3">
        {prefix && <span className="text-sm text-muted">{prefix}</span>}
        <input
          value={value}
          placeholder={placeholder}
          inputMode={text ? "text" : "decimal"}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent px-1 py-2.5 text-sm outline-none sm:px-1.5 sm:text-base"
        />
      </span>
    </label>
  );
}
