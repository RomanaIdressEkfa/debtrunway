"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { describeDuration, simulatePayoff, type Debt } from "@/lib/debt";
import { usd } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";
import BalanceChart from "./BalanceChart";
import ScheduleTable from "./ScheduleTable";
import { Card, Disclosure, Field, Notice, ResultHero } from "./ui";

interface Props {
  /** Wording changes per page: "card balance" reads wrong on a student loan. */
  labels: { balance: string; apr: string; payment: string };
  defaults: { balance: string; apr: string; payment: string };
  /** Extra amounts offered in the "what if you paid more" table. */
  extraSteps?: number[];
  chartLabel: string;
}

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

export default function SingleDebtCalculator({
  labels,
  defaults,
  extraSteps = [25, 50, 100, 250],
  chartLabel,
}: Props) {
  const [balance, setBalance] = useState(defaults.balance);
  const [apr, setApr] = useState(defaults.apr);
  const [payment, setPayment] = useState(defaults.payment);
  const [extra, setExtra] = useState(0);

  const debt: Debt = useMemo(
    () => ({
      id: "single",
      name: "Balance",
      balance: num(balance),
      apr: num(apr),
      minPayment: num(payment),
    }),
    [balance, apr, payment],
  );

  // Typing is painted first; the simulations follow at a lower priority.
  // Without this, one keystroke schedules six payoff runs before the browser
  // gets to draw the character, which a mid-range phone shows as input lag.
  const slowDebt = useDeferredValue(debt);

  const asIs = useMemo(
    () => simulatePayoff([slowDebt], 0, "avalanche"),
    [slowDebt],
  );
  const withExtra = useMemo(
    () => simulatePayoff([slowDebt], extra, "avalanche"),
    [slowDebt, extra],
  );
  const scenarios = useMemo(
    () =>
      extraSteps.map((step) => ({
        step,
        result: simulatePayoff([slowDebt], step, "avalanche"),
      })),
    [slowDebt, extraSteps],
  );

  const active = extra > 0 ? withExtra : asIs;
  const saved =
    asIs.feasible && withExtra.feasible
      ? Math.max(0, asIs.totalInterest - withExtra.totalInterest)
      : 0;
  const sooner =
    asIs.feasible && withExtra.feasible
      ? Math.max(0, asIs.months - withExtra.months)
      : 0;

  return (
    <div className="stagger space-y-5">
      <Card className="no-print">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label={labels.balance}
            value={balance}
            onChange={setBalance}
            placeholder="5000"
            prefix="$"
            large
          />
          <Field
            label={labels.apr}
            value={apr}
            onChange={setApr}
            placeholder="19.9"
            suffix="%"
            large
          />
          <Field
            label={labels.payment}
            value={payment}
            onChange={setPayment}
            placeholder="150"
            prefix="$"
            large
          />
        </div>

        <fieldset className="mt-6 border-t border-line pt-5">
          <legend className="text-sm font-medium">
            Could you add anything extra?
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {[0, ...extraSteps].map((step) => (
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
        </fieldset>
      </Card>

      {!active.feasible ? (
        <Notice tone="danger">
          {active.reason ??
            "Enter a balance, a rate, and a monthly payment to see your payoff."}
        </Notice>
      ) : (
        <>
          <ResultHero
            eyebrow="Paid off by"
            value={active.payoffLabel}
            sub={`${describeDuration(active.months)} from now`}
            stats={[
              {
                label: "Interest you pay",
                value: (
                  <AnimatedNumber value={active.totalInterest} format={usd} />
                ),
              },
              {
                label: "Total you pay",
                value: <AnimatedNumber value={active.totalPaid} format={usd} />,
              },
              extra > 0
                ? {
                    label: "Interest saved",
                    value: <AnimatedNumber value={saved} format={usd} />,
                  }
                : {
                    label: "Every month",
                    value: (
                      <AnimatedNumber value={num(payment)} format={usd} />
                    ),
                  },
            ]}
          />

          {extra > 0 && saved > 0 && (
            <Notice>
              That {usd(extra)} a month clears the balance{" "}
              <strong>{describeDuration(sooner)}</strong> sooner and saves you{" "}
              <strong>{usd(saved)}</strong> in interest.
            </Notice>
          )}

          <Card>
            <BalanceChart
              startingBalance={num(balance)}
              series={[
                {
                  label: chartLabel,
                  color: "var(--brand)",
                  points: active.rows.map((r) => r.endingBalance),
                },
                ...(extra > 0 && asIs.feasible
                  ? [
                      {
                        label: "Without the extra payment",
                        color: "var(--accent)",
                        points: asIs.rows.map((r) => r.endingBalance),
                        dashed: true,
                      },
                    ]
                  : []),
              ]}
            />
          </Card>

          <Disclosure
            title="What paying more would do"
            hint="Same balance and rate, different monthly payment"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Extra</th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Paid off
                    </th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Interest
                    </th>
                    <th className="py-2 text-right font-semibold">Saved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <td className="py-2.5 pr-4 text-muted">Nothing</td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {asIs.payoffLabel}
                    </td>
                    <td className="py-2.5 pr-4 text-right tabular-nums">
                      {usd(asIs.totalInterest)}
                    </td>
                    <td className="py-2.5 text-right text-muted">—</td>
                  </tr>
                  {scenarios.map(({ step, result }) =>
                    result.feasible ? (
                      <tr
                        key={step}
                        className={`border-b border-line last:border-0 ${
                          step === extra ? "bg-brand-soft/40 font-medium" : ""
                        }`}
                      >
                        <td className="py-2.5 pr-4">+{usd(step)}</td>
                        <td className="py-2.5 pr-4 text-right tabular-nums">
                          {result.payoffLabel}
                        </td>
                        <td className="py-2.5 pr-4 text-right tabular-nums">
                          {usd(result.totalInterest)}
                        </td>
                        <td className="py-2.5 text-right font-medium tabular-nums text-brand">
                          {usd(
                            Math.max(
                              0,
                              asIs.totalInterest - result.totalInterest,
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

          <Disclosure
            title="Month-by-month schedule"
            hint={`All ${active.months} payments, printable`}
          >
            <ScheduleTable rows={active.rows} />
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
