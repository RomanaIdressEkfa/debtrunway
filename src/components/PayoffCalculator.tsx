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
        <details className="group mt-3">
          <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
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
          <dl className="mt-3 space-y-3 rounded-xl border border-line bg-background p-4 text-sm">
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

        {/* One bordered table rather than sixteen separate boxes. Four outlined
            inputs per row read as clutter; cells divided by hairlines read as
            a statement, which is where these figures come from anyway. */}
        <div className="mt-5 overflow-hidden rounded-xl border border-line">
          <div className="hidden gap-3 bg-background px-4 py-2.5 sm:grid sm:grid-cols-[1.4fr_1fr_0.9fr_1fr_auto]">
            {[
              ["Debt", "Card or loan name"],
              ["Current balance", "What you owe today"],
              ["Interest rate", "Yearly, from your statement"],
              ["Minimum payment", "Least your lender accepts"],
            ].map(([label, hint]) => (
              <span key={label}>
                <span className="block text-xs font-semibold">{label}</span>
                <span className="mt-0.5 block text-[11px] leading-tight text-muted">
                  {hint}
                </span>
              </span>
            ))}
            <span className="w-8" />
          </div>

          {debts.map((debt, i) => (
            /* On a phone the name gets its own line and the three figures sit
               side by side — stacking all four made the form absurdly tall.
               `sm:contents` dissolves that wrapper on wider screens so the
               fields rejoin the parent grid as one row. */
            <div
              key={debt.id}
              className={`group/row relative p-3 sm:static sm:grid sm:grid-cols-[1.4fr_1fr_0.9fr_1fr_auto] sm:items-center sm:gap-3 sm:p-0 sm:pr-3 ${
                i > 0 ? "border-t border-line" : "sm:border-t sm:border-line"
              }`}
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

              {/* Short labels on a phone keep each one to a single line, so the
                  three boxes land on the same baseline; `items-end` holds that
                  line even if a label ever does wrap. */}
              <div className="mt-2.5 grid grid-cols-3 items-end gap-1.5 sm:contents">
                <RowField
                  label="Current balance"
                  short="Balance"
                  value={debt.balance}
                  placeholder="5000"
                  prefix="$"
                  onChange={(v) => update(debt.id, "balance", v)}
                />
                <RowField
                  label="Interest rate"
                  short="Rate"
                  value={debt.apr}
                  placeholder="19.9"
                  suffix="%"
                  onChange={(v) => update(debt.id, "apr", v)}
                />
                <RowField
                  label="Minimum payment"
                  short="Minimum"
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
                title="Remove this debt"
                className="press absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-25 sm:static sm:opacity-0 sm:group-hover/row:opacity-100 sm:focus-visible:opacity-100"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
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
  short,
  value,
  placeholder,
  onChange,
  prefix,
  suffix,
  text,
}: {
  label: string;
  /** Phone-width label. The full names wrap to two lines inside a third of a
      row, which knocked the boxes out of line with one another. */
  short?: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  text?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1 block truncate text-xs font-medium whitespace-nowrap text-muted sm:hidden">
        {short ?? label}
      </span>
      {/* Bordered on a phone, where each row is its own card; borderless inside
          the table on wider screens, where the row divider already separates
          the cells. Padding and type step down at 320px so a five-figure
          balance still fits a third of the row. */}
      <span className="flex items-center rounded-xl border border-line bg-surface px-1.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 sm:rounded-lg sm:border-transparent sm:bg-transparent sm:px-1.5 sm:focus-within:border-brand sm:focus-within:bg-surface">
        {prefix && <span className="shrink-0 text-sm text-muted">{prefix}</span>}
        <input
          value={value}
          placeholder={placeholder}
          inputMode={text ? "text" : "decimal"}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-w-0 bg-transparent px-0.5 py-2.5 text-sm outline-none sm:px-1.5 sm:py-3 sm:text-base ${
            text ? "" : "tabular-nums"
          }`}
        />
        {suffix && <span className="shrink-0 text-sm text-muted">{suffix}</span>}
      </span>
    </label>
  );
}
