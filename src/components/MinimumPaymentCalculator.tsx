"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  describeDuration,
  effectiveMinimum,
  simulatePayoff,
  type Debt,
} from "@/lib/debt";
import { usd } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";
import BalanceChart from "./BalanceChart";
import ScheduleTable from "./ScheduleTable";
import { Card, Disclosure, Field, Notice, ResultHero } from "./ui";

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export default function MinimumPaymentCalculator() {
  const [balance, setBalance] = useState("5000");
  const [apr, setApr] = useState("22.9");
  const [percent, setPercent] = useState("2");
  const [floor, setFloor] = useState("25");
  const [extra, setExtra] = useState(100);

  const card: Debt = useMemo(
    () => ({
      id: "card",
      name: "Credit card",
      balance: num(balance),
      apr: num(apr),
      minPayment: num(floor),
      minPercent: num(percent),
    }),
    [balance, apr, floor, percent],
  );

  const todaysMinimum = effectiveMinimum(card, card.balance);
  const frozenCard = useMemo(
    () => ({ ...card, minPayment: todaysMinimum, minPercent: undefined }),
    [card, todaysMinimum],
  );

  // A shrinking minimum can run the full 600-month cap, so this page has the
  // longest single simulation on the site. Deferring keeps that off the
  // keystroke's critical path.
  const slowCard = useDeferredValue(card);
  const slowFrozen = useDeferredValue(frozenCard);

  /** The lender's way: the required payment shrinks along with the balance. */
  const shrinking = useMemo(
    () => simulatePayoff([slowCard], 0, "avalanche", { rollover: false }),
    [slowCard],
  );
  /** Same money today, but you never let the payment drop. */
  const frozen = useMemo(
    () => simulatePayoff([slowFrozen], 0, "avalanche"),
    [slowFrozen],
  );
  /** Frozen, plus whatever extra you can find. */
  const boosted = useMemo(
    () => simulatePayoff([slowFrozen], extra, "avalanche"),
    [slowFrozen, extra],
  );

  const multiple =
    shrinking.feasible && card.balance > 0
      ? shrinking.totalPaid / card.balance
      : 0;
  const freeSaving = shrinking.feasible && frozen.feasible
    ? Math.max(0, shrinking.totalInterest - frozen.totalInterest)
    : 0;

  return (
    <div className="stagger space-y-5">
      <Card className="no-print">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Card balance"
            value={balance}
            onChange={setBalance}
            placeholder="5000"
            prefix="$"
            large
          />
          <Field
            label="Interest rate (APR)"
            value={apr}
            onChange={setApr}
            placeholder="22.9"
            suffix="%"
            large
          />
        </div>

        <Disclosure
          title="Your card's minimum payment rule"
          hint={
            todaysMinimum > 0
              ? `Currently ${usd(todaysMinimum)} a month — tap to adjust`
              : "Tap to adjust"
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Minimum is this % of the balance"
              hint="Most US cards use 1% to 3%."
              value={percent}
              onChange={setPercent}
              placeholder="2"
              suffix="%"
            />
            <Field
              label="…or this much, whichever is greater"
              hint="The fixed floor, usually $25 to $35."
              value={floor}
              onChange={setFloor}
              placeholder="25"
              prefix="$"
            />
          </div>
        </Disclosure>
      </Card>

      {!shrinking.feasible ? (
        <Notice tone="danger">
          {shrinking.reason ??
            "Enter a balance and a rate to see what the minimum really costs."}
        </Notice>
      ) : (
        <>
          <ResultHero
            tone="danger"
            eyebrow="Paying only the minimum, you finish in"
            value={shrinking.payoffLabel}
            sub={`${describeDuration(shrinking.months)} from now`}
            stats={[
              {
                label: "Interest paid",
                value: (
                  <AnimatedNumber
                    value={shrinking.totalInterest}
                    format={usd}
                  />
                ),
              },
              {
                label: "Total handed over",
                value: (
                  <AnimatedNumber value={shrinking.totalPaid} format={usd} />
                ),
              },
              {
                label: "That is",
                value: (
                  <AnimatedNumber
                    value={multiple}
                    format={(n) => `${n.toFixed(1)}× what you owe`}
                  />
                ),
              },
            ]}
          />

          <Notice tone="danger">
            The trap is that the minimum <em>shrinks</em>. It starts at{" "}
            <strong>{usd(shrinking.rows[0].payment)}</strong> and falls as the
            balance does, so your progress slows every single month.
          </Notice>

          <Card>
            <h2 className="font-semibold">
              Now just stop letting it shrink
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Keep paying today&rsquo;s {usd(todaysMinimum)} every month instead
              of the falling minimum. This costs you nothing extra.
            </p>

            <div className="mt-4 rounded-xl bg-brand-soft p-5">
              <p className="text-xs font-semibold tracking-widest text-brand uppercase">
                You would finish in
              </p>
              <p className="mt-1.5 text-3xl font-bold text-brand tabular-nums">
                {frozen.payoffLabel}
              </p>
              <p className="mt-1 text-brand/80">
                {describeDuration(frozen.months)} instead of{" "}
                {describeDuration(shrinking.months)} — saving{" "}
                <strong>{usd(freeSaving)}</strong> for free.
              </p>
            </div>

            <fieldset className="mt-6 border-t border-line pt-5">
              <legend className="text-sm font-medium">
                And if you added a little more?
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {[0, 25, 50, 100, 200].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setExtra(step)}
                    aria-pressed={extra === step}
                    className={`press rounded-lg border px-3.5 py-2 text-sm font-medium transition ${
                      extra === step
                        ? "border-brand bg-brand-soft text-brand"
                        : "border-line text-muted hover:border-brand hover:text-brand"
                    }`}
                  >
                    {step === 0 ? "Nothing" : `+${usd(step)}`}
                  </button>
                ))}
              </div>

              {boosted.feasible && extra > 0 && (
                <p className="mt-4 text-sm">
                  Gone by <strong>{boosted.payoffLabel}</strong> —{" "}
                  {describeDuration(boosted.months)}, for{" "}
                  {usd(boosted.totalInterest)} of interest. That is{" "}
                  <strong className="text-brand">
                    {usd(
                      Math.max(
                        0,
                        shrinking.totalInterest - boosted.totalInterest,
                      ),
                    )}
                  </strong>{" "}
                  saved against the minimum.
                </p>
              )}
            </fieldset>
          </Card>

          <Card>
            <BalanceChart
              startingBalance={card.balance}
              series={[
                ...(boosted.feasible && extra > 0
                  ? [
                      {
                        label: `Frozen + ${usd(extra)}`,
                        color: "var(--brand)",
                        points: boosted.rows.map((r) => r.endingBalance),
                      },
                    ]
                  : []),
                {
                  label: `Today's payment, frozen (${usd(todaysMinimum)})`,
                  color: "#0ea5e9",
                  points: frozen.rows.map((r) => r.endingBalance),
                },
                {
                  label: "The shrinking minimum",
                  color: "var(--danger)",
                  points: shrinking.rows.map((r) => r.endingBalance),
                  dashed: true,
                },
              ]}
            />
          </Card>

          <Disclosure
            title="The minimum-payment schedule"
            hint="Watch the payment column fall, month after month"
          >
            <ScheduleTable rows={shrinking.rows} />
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
