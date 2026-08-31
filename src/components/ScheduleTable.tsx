"use client";

import { useMemo, useState } from "react";
import type { MonthRow } from "@/lib/debt";
import { usdExact } from "@/lib/format";

const PREVIEW_ROWS = 12;

/**
 * The combined schedule, plus one tab per debt.
 *
 * The totals answer "what do I pay each month". A single debt's tab answers
 * "when does *this* card go away", which is the question people actually ask
 * while holding a statement for one account.
 */
export default function ScheduleTable({ rows }: { rows: MonthRow[] }) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState("all");

  // Every debt that appears anywhere in the plan, in the order it is attacked.
  const debts = useMemo(() => {
    const seen = new Map<string, string>();
    for (const row of rows) {
      for (const d of row.detail) if (!seen.has(d.id)) seen.set(d.id, d.name);
    }
    return [...seen].map(([id, name]) => ({ id, name }));
  }, [rows]);

  // A debt drops out of `detail` once cleared, so its tab ends by itself.
  const view = useMemo(() => {
    if (selected === "all") {
      return rows.map((row) => ({
        month: row.month,
        label: row.label,
        payment: row.payment,
        interest: row.interest,
        endingBalance: row.endingBalance,
        cleared: row.clearedThisMonth,
      }));
    }

    return rows.flatMap((row) => {
      const d = row.detail.find((x) => x.id === selected);
      if (!d) return [];
      return [
        {
          month: row.month,
          label: row.label,
          payment: d.payment,
          interest: d.interest,
          endingBalance: d.endingBalance,
          cleared: d.endingBalance <= 0.005 ? [d.name] : [],
        },
      ];
    });
  }, [rows, selected]);

  const visible = expanded ? view : view.slice(0, PREVIEW_ROWS);
  const hidden = view.length - visible.length;

  return (
    <div>
      {debts.length > 1 && (
        <div
          className="no-print mb-4 flex flex-wrap gap-1.5"
          role="tablist"
          aria-label="Schedule for"
        >
          {[{ id: "all", name: "All debts" }, ...debts].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected === tab.id}
              onClick={() => {
                setSelected(tab.id);
                setExpanded(false);
              }}
              className={`press rounded-lg border px-3 py-1.5 text-sm font-medium ${
                selected === tab.id
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-background text-left">
              <th className="px-3 py-3 font-semibold sm:px-4">Month</th>
              <th className="px-3 py-3 text-right font-semibold sm:px-4">
                Payment
              </th>
              <th className="px-3 py-3 text-right font-semibold sm:px-4">
                Interest
              </th>
              <th className="px-3 py-3 text-right font-semibold sm:px-4">
                Balance left
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.month}
                className="border-b border-line last:border-0 even:bg-background/60"
              >
                <td className="px-3 py-2.5 whitespace-nowrap sm:px-4">
                  <span className="text-muted tabular-nums">{row.month}.</span>{" "}
                  {row.label}
                  {row.cleared.length > 0 && (
                    <span className="mt-1 block text-xs font-medium text-brand">
                      🎉 {row.cleared.join(", ")} paid off
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums sm:px-4">
                  {usdExact(row.payment)}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums text-accent sm:px-4">
                  {usdExact(row.interest)}
                </td>
                <td className="px-3 py-2.5 text-right font-medium tabular-nums sm:px-4">
                  {usdExact(row.endingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="press no-print mt-3 w-full rounded-xl border border-line bg-surface py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
        >
          Show all {view.length} months ({hidden} more)
        </button>
      )}
    </div>
  );
}
