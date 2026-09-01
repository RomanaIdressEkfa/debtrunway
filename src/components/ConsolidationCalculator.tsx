"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  describeDuration,
  monthlyPaymentForTerm,
  simulatePayoff,
  type Debt,
} from "@/lib/debt";
import { usd } from "@/lib/format";
import AnimatedNumber from "./AnimatedNumber";
import { Card, Field, Notice, ResultHero } from "./ui";

interface Row {
  id: string;
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
}

const STARTER: Row[] = [
  { id: "c1", name: "Visa", balance: "7400", apr: "23.9", minPayment: "185" },
  { id: "c2", name: "Mastercard", balance: "3100", apr: "26.5", minPayment: "80" },
  { id: "c3", name: "Personal loan", balance: "4500", apr: "14.0", minPayment: "160" },
];

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

let nextId = 4;

export default function ConsolidationCalculator() {
  const [rows, setRows] = useState<Row[]>(STARTER);
  const [loanApr, setLoanApr] = useState("11.5");
  const [term, setTerm] = useState("48");
  const [fee, setFee] = useState("3");

  const debts: Debt[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        name: r.name.trim() || "Debt",
        balance: num(r.balance),
        apr: num(r.apr),
        minPayment: num(r.minPayment),
      })),
    [rows],
  );

  const totalBalance = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinimums = debts.reduce((s, d) => s + d.minPayment, 0);

  // The consolidation offer. Origination fees are normally rolled into the
  // amount financed, so you borrow more than you owe.
  const feeAmount = (totalBalance * num(fee)) / 100;
  const financed = totalBalance + feeAmount;
  const months = Math.round(num(term));
  const loanPayment = monthlyPaymentForTerm(financed, num(loanApr), months);
  const loanTotalPaid = loanPayment * months;
  const loanCost = Math.max(0, loanTotalPaid - totalBalance);

  // Both routes are simulated at a lower priority than typing, so editing a
  // balance never waits on two full payoff runs.
  const slowDebts = useDeferredValue(debts);
  const slowLoanPayment = useDeferredValue(loanPayment);

  // Path A: leave things as they are and pay the minimums.
  const minimums = useMemo(
    () => simulatePayoff(slowDebts, 0, "avalanche", { rollover: false }),
    [slowDebts],
  );

  // Path B: keep your current debts but pay the SAME monthly amount the
  // consolidation loan would demand. This is the comparison lenders leave out.
  const sameMoney = useMemo(
    () =>
      simulatePayoff(
        slowDebts,
        Math.max(0, slowLoanPayment - totalMinimums),
        "avalanche",
      ),
    [slowDebts, slowLoanPayment, totalMinimums],
  );

  const consolidationWins =
    sameMoney.feasible && loanCost < sameMoney.totalInterest;

  return (
    <div className="stagger space-y-4">
      <Card className="no-print">
        <h2 className="text-lg font-semibold">What you owe now</h2>
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="relative rounded-xl border border-line p-2.5 sm:static sm:grid sm:grid-cols-[1.4fr_1fr_0.8fr_1fr_auto] sm:items-end sm:gap-3 sm:rounded-none sm:border-0 sm:p-0"
            >
              <div className="pr-9 sm:pr-0">
                <Field
                  label="Debt"
                  value={row.name}
                  text
                  placeholder="Credit card"
                  onChange={(v) =>
                    setRows((s) =>
                      s.map((r) => (r.id === row.id ? { ...r, name: v } : r)),
                    )
                  }
                />
              </div>

              {/* Three short figures read better in a row than in a stack. */}
              <div className="mt-3 grid grid-cols-3 gap-1.5 sm:contents">
              <Field
                label="Balance"
                value={row.balance}
                prefix="$"
                placeholder="5000"
                onChange={(v) =>
                  setRows((s) =>
                    s.map((r) => (r.id === row.id ? { ...r, balance: v } : r)),
                  )
                }
              />
              <Field
                label="APR"
                value={row.apr}
                suffix="%"
                placeholder="22.9"
                onChange={(v) =>
                  setRows((s) =>
                    s.map((r) => (r.id === row.id ? { ...r, apr: v } : r)),
                  )
                }
              />
              <Field
                label="Minimum"
                value={row.minPayment}
                prefix="$"
                placeholder="120"
                onChange={(v) =>
                  setRows((s) =>
                    s.map((r) =>
                      r.id === row.id ? { ...r, minPayment: v } : r,
                    ),
                  )
                }
              />
              </div>

              <button
                type="button"
                onClick={() =>
                  setRows((s) =>
                    s.length > 1 ? s.filter((r) => r.id !== row.id) : s,
                  )
                }
                disabled={rows.length === 1}
                aria-label={`Remove ${row.name || "debt"}`}
                className="press absolute top-2.5 right-2.5 rounded-lg border border-line px-2.5 py-2 text-sm text-muted hover:border-danger hover:text-danger disabled:opacity-30 sm:static sm:py-2.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setRows((s) => [
              ...s,
              {
                id: `c${nextId++}`,
                name: "",
                balance: "",
                apr: "",
                minPayment: "",
              },
            ])
          }
          className="mt-4 rounded-lg border border-dashed border-line px-4 py-2 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
        >
          + Add another debt
        </button>

        <h2 className="mt-8 border-t border-line pt-6 text-lg font-semibold">
          The consolidation loan you are offered
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field
            label="Loan APR"
            value={loanApr}
            onChange={setLoanApr}
            placeholder="11.5"
            suffix="%"
            large
          />
          <Field
            label="Term"
            value={term}
            onChange={setTerm}
            placeholder="48"
            suffix="mo"
            large
          />
          <Field
            label="Origination fee"
            hint="Often 1–8%, added to what you borrow."
            value={fee}
            onChange={setFee}
            placeholder="3"
            suffix="%"
            large
          />
        </div>
      </Card>

      {totalBalance <= 0 || loanPayment <= 0 ? (
        <Notice tone="danger">
          Enter your balances and the loan terms to compare the two routes.
        </Notice>
      ) : (
        <>
          <ResultHero
            eyebrow="The consolidation loan would cost"
            value={`${usd(loanPayment)}/mo`}
            sub={`for ${months} months, clearing ${usd(totalBalance)} of debt`}
            stats={[
              {
                label: "Interest and fees",
                value: <AnimatedNumber value={loanCost} format={usd} />,
              },
              {
                label: "You would borrow",
                value: <AnimatedNumber value={financed} format={usd} />,
              },
              {
                label: "Origination fee",
                value:
                  feeAmount > 0 ? (
                    <AnimatedNumber value={feeAmount} format={usd} />
                  ) : (
                    "None"
                  ),
              },
            ]}
          />

          <Card>
            <h2 className="text-lg font-semibold">The honest comparison</h2>
            <p className="mt-1 text-sm text-muted">
              A consolidation loan looks cheap next to minimum payments. The
              real question is what the <em>same monthly payment</em> would do
              if you kept your existing debts.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Route</th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Monthly
                    </th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Time
                    </th>
                    <th className="py-2 text-right font-semibold">
                      Interest &amp; fees
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {minimums.feasible && (
                    <tr className="border-b border-line">
                      <td className="py-3 pr-4">
                        Keep paying minimums
                        <span className="block text-xs text-muted">
                          change nothing
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {usd(totalMinimums)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {describeDuration(minimums.months)}
                      </td>
                      <td className="py-3 text-right tabular-nums">
                        {usd(minimums.totalInterest)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-b border-line">
                    <td className="py-3 pr-4">
                      Take the consolidation loan
                      <span className="block text-xs text-muted">
                        one payment, fixed term
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      {usd(loanPayment)}
                    </td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      {describeDuration(months)}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {usd(loanCost)}
                    </td>
                  </tr>
                  {sameMoney.feasible && (
                    <tr
                      className={
                        consolidationWins ? "" : "bg-brand-soft/40 font-medium"
                      }
                    >
                      <td className="py-3 pr-4">
                        Pay the same, no new loan
                        <span className="block text-xs text-muted">
                          avalanche order on what you already owe
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {usd(loanPayment)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {describeDuration(sameMoney.months)}
                      </td>
                      <td className="py-3 text-right tabular-nums">
                        {usd(sameMoney.totalInterest)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {sameMoney.feasible && (
              <div className="mt-5">
                <Notice tone={consolidationWins ? "brand" : "danger"}>
                  {consolidationWins ? (
                    <>
                      On these numbers the loan is worth it: it costs{" "}
                      <strong>
                        {usd(sameMoney.totalInterest - loanCost)}
                      </strong>{" "}
                      less than putting the same {usd(loanPayment)} a month
                      against your current debts. Check that the rate is fixed
                      and that there is no prepayment penalty.
                    </>
                  ) : (
                    <>
                      On these numbers the loan is not worth it. Paying the same{" "}
                      {usd(loanPayment)} a month against your existing debts
                      costs <strong>{usd(loanCost - sameMoney.totalInterest)}</strong>{" "}
                      less — the fee and the term are working against you. The
                      loan buys convenience, not savings.
                    </>
                  )}
                </Notice>
              </div>
            )}

            <p className="mt-5 text-sm text-muted">
              One risk no calculator can price: consolidating clears your cards
              to a zero balance. If they get used again, you end up owing the
              loan <em>and</em> the cards.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
