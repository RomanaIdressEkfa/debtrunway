import type { Strategy } from "./debt";

/**
 * Encodes a payoff plan into the URL and back.
 *
 * The point is the share loop: someone works out their debt-free date, sends
 * the link to a partner or a friend, and the friend opens the page with the
 * same numbers already filled in rather than a blank form. Nothing is stored
 * on a server — the plan travels entirely inside the link.
 */

export interface SharedDebt {
  name: string;
  balance: string;
  apr: string;
  minPayment: string;
}

export interface SharedPlan {
  debts: SharedDebt[];
  extra: string;
  strategy?: Strategy;
}

/** Names may contain anything, so the separators are stripped from them. */
const clean = (value: string) => value.replace(/[|~]/g, " ").trim();

export function encodePlan(plan: SharedPlan): string {
  const params = new URLSearchParams();

  const debts = plan.debts
    .filter((d) => Number.parseFloat(d.balance) > 0)
    .map((d) =>
      [clean(d.name) || "Debt", d.balance, d.apr, d.minPayment].join("~"),
    )
    .join("|");

  if (debts) params.set("d", debts);
  if (plan.extra) params.set("x", plan.extra);
  if (plan.strategy) params.set("s", plan.strategy);

  return params.toString();
}

export function decodePlan(search: string): SharedPlan | null {
  const params = new URLSearchParams(search);
  const raw = params.get("d");
  if (!raw) return null;

  const debts = raw
    .split("|")
    .map((entry) => entry.split("~"))
    .filter((parts) => parts.length === 4)
    .map(([name, balance, apr, minPayment]) => ({
      name,
      balance,
      apr,
      minPayment,
    }));

  if (debts.length === 0) return null;

  const strategy = params.get("s");

  return {
    debts,
    extra: params.get("x") ?? "0",
    strategy:
      strategy === "snowball" || strategy === "avalanche"
        ? strategy
        : undefined,
  };
}

/** A single balance, for the card and loan pages. */
export function encodeSingle(fields: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (value) params.set(key, value);
  }
  return params.toString();
}

export function decodeSingle(
  search: string,
  keys: string[],
): Record<string, string> | null {
  const params = new URLSearchParams(search);
  if (!keys.some((k) => params.has(k))) return null;

  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value !== null) out[key] = value;
  }
  return out;
}
