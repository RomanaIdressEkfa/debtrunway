import type { DebtPayoffInfo, PaymentRun } from "@/lib/debt";
import { describeDuration } from "@/lib/debt";
import { usd, usdExact } from "@/lib/format";

/**
 * Turns the payment runs into instructions a person can follow.
 *
 * A payoff date tells you the outcome; this tells you what to do on the first
 * of every month, which is the part that actually gets a debt paid.
 */
function describeRuns(runs: PaymentRun[]): string {
  if (runs.length === 0) return "—";

  const parts = runs.map((run, i) => {
    const amount = usdExact(run.amount);
    const first = i === 0;
    const last = i === runs.length - 1;

    // A single trailing month is almost always the smaller closing payment.
    if (run.from === run.to) {
      return last && !first
        ? `then ${amount} in month ${run.to} to finish`
        : `${first ? "Pay " : "then "}${amount} in month ${run.to}`;
    }

    return first
      ? `Pay ${amount} a month through month ${run.to}`
      : `then ${amount} through month ${run.to}`;
  });

  return parts.join(", ") + ".";
}

export default function PerDebtTable({
  perDebt,
}: {
  perDebt: DebtPayoffInfo[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="py-2 pr-4 font-semibold">Debt</th>
            <th className="py-2 pr-4 font-semibold">Cleared in</th>
            <th className="py-2 pr-4 text-right font-semibold">Interest</th>
            <th className="py-2 pr-4 text-right font-semibold">Total paid</th>
            <th className="py-2 font-semibold">What to pay</th>
          </tr>
        </thead>
        <tbody>
          {perDebt.map((d, i) => (
            <tr key={d.id} className="border-b border-line last:border-0">
              <td className="py-3 pr-4 align-top">
                <span className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
                    {i + 1}
                  </span>
                  <span className="font-medium">{d.name}</span>
                </span>
              </td>
              <td className="py-3 pr-4 align-top whitespace-nowrap">
                {d.label}
                <span className="block text-xs text-muted">
                  {describeDuration(d.month)}
                </span>
              </td>
              <td className="py-3 pr-4 text-right align-top tabular-nums text-accent">
                {usd(d.interestPaid)}
              </td>
              <td className="py-3 pr-4 text-right align-top tabular-nums">
                {usd(d.totalPaid)}
              </td>
              <td className="py-3 align-top text-muted">
                {describeRuns(d.schedule)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
