"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { describeDuration, simulatePayoff, type Debt } from "@/lib/debt";
import { usd } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";
import BalanceChart from "./BalanceChart";
import { Card, Disclosure, Field, Notice, ResultHero } from "./ui";

const STEPS = [10, 25, 50, 100, 200, 350, 500];

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export default function ExtraPaymentCalculator() {
  const [balance, setBalance] = useState("8500");
  const [apr, setApr] = useState("19.9");
  const [payment, setPayment] = useState("220");
  const [chosen, setChosen] = useState(100);

  const debt: Debt = useMemo(
    () => ({
      id: "d",
      name: "Balance",
      balance: num(balance),
      apr: num(apr),
      minPayment: num(payment),
    }),
    [balance, apr, payment],
  );

  // The heaviest page on the site: the comparison table alone is one full
  // payoff run per row. Deferring keeps all nine off the keystroke's critical
  // path, so the input stays responsive while the table catches up.
  const slowDebt = useDeferredValue(debt);

  const base = useMemo(
    () => simulatePayoff([slowDebt], 0, "avalanche"),
    [slowDebt],
  );
  const picked = useMemo(
    () => simulatePayoff([slowDebt], chosen, "avalanche"),
    [slowDebt, chosen],
  );
  const rows = useMemo(
    () =>
      STEPS.map((step) => ({
        step,
        result: simulatePayoff([slowDebt], step, "avalanche"),
      })),
    [slowDebt],
  );

  const saved =
    base.feasible && picked.feasible
      ? Math.max(0, base.totalInterest - picked.totalInterest)
      : 0;
  const sooner =
    base.feasible && picked.feasible
      ? Math.max(0, base.months - picked.months)
      : 0;

  return (
    <div className="stagger space-y-5">
      <Card className="no-print">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Balance you owe"
            value={balance}
            onChange={setBalance}
            placeholder="8500"
            prefix="$"
            large
          />
          <Field
            label="Interest rate (APR)"
            value={apr}
            onChange={setApr}
            placeholder="19.9"
            suffix="%"
            large
          />
          <Field
            label="What you pay now"
            value={payment}
            onChange={setPayment}
            placeholder="220"
            prefix="$"
            large
          />
        </div>

        <fieldset className="mt-6 border-t border-line pt-5">
          <legend className="text-sm font-medium">
            How much extra could you add each month?
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {STEPS.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setChosen(step)}
                aria-pressed={chosen === step}
                className={`press rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  chosen === step
                    ? "border-brand bg-brand-soft text-brand"
                    : "border-line text-muted hover:border-brand hover:text-brand"
                }`}
              >
                +{usd(step)}
              </button>
            ))}
          </div>
        </fieldset>
      </Card>

      {!base.feasible ? (
        <Notice tone="danger">
          {base.reason ??
            "Enter a balance, a rate, and your current payment to begin."}
        </Notice>
      ) : (
        <>
          <ResultHero
            eyebrow={`Adding ${usd(chosen)} a month, you finish`}
            value={picked.payoffLabel}
            sub={`instead of ${base.payoffLabel} — ${describeDuration(sooner)} sooner`}
            stats={[
              {
                label: "Interest saved",
                value: <AnimatedNumber value={saved} format={usd} />,
              },
              {
                label: "Interest now",
                value: (
                  <AnimatedNumber value={picked.totalInterest} format={usd} />
                ),
              },
              {
                label: "Was",
                value: (
                  <AnimatedNumber value={base.totalInterest} format={usd} />
                ),
              },
            ]}
          />

          {saved > 0 && (
            <Notice>
              Spread across {picked.months} payments, that {usd(chosen)} a month
              is effectively earning you{" "}
              <strong>{usd(saved / picked.months)}</strong> every month you make
              it.
            </Notice>
          )}

          <Card>
            <BalanceChart
              startingBalance={num(balance)}
              series={[
                {
                  label: `Paying ${usd(num(payment) + chosen)} a month`,
                  color: "var(--brand)",
                  points: picked.rows.map((r) => r.endingBalance),
                },
                {
                  label: `Paying ${usd(num(payment))} a month`,
                  color: "var(--accent)",
                  points: base.rows.map((r) => r.endingBalance),
                  dashed: true,
                },
              ]}
            />
          </Card>

          <Disclosure
            title="Every amount, side by side"
            hint="The first few dollars do the most work"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Extra</th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Monthly
                    </th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Paid off
                    </th>
                    <th className="py-2 text-right font-semibold">Saved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <td className="py-2.5 pr-4 text-muted">Nothing</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {usd(num(payment))}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {base.payoffLabel}
                    </td>
                    <td className="py-2.5 text-right text-muted">—</td>
                  </tr>
                  {rows.map(({ step, result }) =>
                    result.feasible ? (
                      <tr
                        key={step}
                        className={`border-b border-line last:border-0 ${
                          step === chosen ? "bg-brand-soft/40 font-medium" : ""
                        }`}
                      >
                        <td className="py-2.5 pr-4">+{usd(step)}</td>
                        <td className="py-2.5 pr-4 text-right tabular-nums">
                          {usd(num(payment) + step)}
                        </td>
                        <td className="py-2.5 pr-4 text-right tabular-nums">
                          {result.payoffLabel}
                        </td>
                        <td className="py-2.5 text-right font-medium tabular-nums text-brand">
                          {usd(
                            Math.max(
                              0,
                              base.totalInterest - result.totalInterest,
                            ),
                          )}
                        </td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </div>
          </Disclosure>
        </>
      )}
    </div>
  );
}
