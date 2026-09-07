/**
 * Zakat on shares, funds and pensions.
 *
 * This is the part of zakat where contemporary scholars genuinely disagree,
 * and the disagreement is not a detail — the two main positions on a
 * long-held share portfolio can differ by a factor of four. So the calculator
 * does not pick one. It asks which position the giver follows, applies it,
 * and says on the page what the alternative would have produced.
 *
 * The three questions that actually decide the answer:
 *
 *   Why the shares are held. Bought to trade, they are stock in trade and
 *   zakatable at full market value like any other inventory. Bought to hold
 *   for dividends, the classical reasoning looks through the share to the
 *   company: you owe zakat on your slice of what the company holds in cash,
 *   receivables and inventory, not on its factories and its goodwill.
 *
 *   Whether a pension can be reached. Wealth you cannot take possession of is
 *   not, on the majority contemporary view, wealth you owe zakat on yet.
 *   A pension you may draw today is different from one locked for thirty
 *   years behind an employer's vesting rules.
 *
 *   What you would actually receive. Where a withdrawal would be cut by tax
 *   and an early-access penalty, many scholars assess the net rather than the
 *   headline balance, on the ground that the rest was never yours to take.
 */

export const RATE = 0.025;

/** How to value shares held for the long term rather than for trading. */
export type LongTermMethod = "market" | "portion";

/** What to do about a pension that cannot be drawn yet. */
export type LockedView = "defer" | "vested";

/**
 * The share of a typical listed company's value that sits in zakatable form —
 * cash, receivables and inventory rather than plant and goodwill.
 *
 * Where you can read the balance sheet, use the real figure. Where you cannot,
 * AAOIFI and several contemporary councils accept a proportion of market value
 * as a working estimate, and the figures usually quoted fall around a quarter
 * to three tenths. The default here is the more cautious end of that.
 */
export const DEFAULT_PORTION = 30;

export interface InvestmentInput {
  /** Bought to sell on. Stock in trade. */
  trading: number;
  /** Bought to hold for dividends or growth. */
  longTerm: number;
  longTermMethod: LongTermMethod;
  /** Percentage of market value taken as zakatable, for the portion method. */
  portionPct: number;
  /** Digital assets, which nearly all contemporary councils treat as wealth. */
  crypto: number;
  /** A pension or account you could draw on today. */
  accessible: number;
  /** Tax and penalty a withdrawal would actually cost. */
  deductions: number;
  /** A pension you cannot draw yet. */
  locked: number;
  lockedView: LockedView;
  /** How much of the locked pot is vested — yours if you left tomorrow. */
  vestedPct: number;
}

export interface Line {
  label: string;
  /** What goes into the zakatable base from this holding. */
  amount: number;
  /** The holding as entered, before the rule was applied. */
  entered: number;
  basis: string;
}

export interface InvestmentResult {
  lines: Line[];
  base: number;
  zakat: number;
  /** What the other position on long-term shares would have produced. */
  alternativeBase: number;
  alternativeZakat: number;
  alternativeLabel: string;
  /** Amount excluded entirely, and why — shown so nothing vanishes silently. */
  excluded: { label: string; amount: number; reason: string }[];
  notes: string[];
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const pct = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));

export function calculateInvestmentZakat(
  input: InvestmentInput,
): InvestmentResult {
  const lines: Line[] = [];
  const excluded: InvestmentResult["excluded"] = [];
  const notes: string[] = [];

  const trading = clean(input.trading);
  const longTerm = clean(input.longTerm);
  const crypto = clean(input.crypto);
  const accessible = clean(input.accessible);
  const deductions = clean(input.deductions);
  const locked = clean(input.locked);
  const portion = pct(input.portionPct);
  const vested = pct(input.vestedPct);

  if (trading > 0) {
    lines.push({
      label: "Shares held for trading",
      entered: trading,
      amount: trading,
      basis:
        "Full market value — bought to sell on, so they are stock in trade",
    });
  }

  if (longTerm > 0) {
    if (input.longTermMethod === "market") {
      lines.push({
        label: "Shares held long term",
        entered: longTerm,
        amount: longTerm,
        basis: "Full market value — the cautious position",
      });
    } else {
      lines.push({
        label: "Shares held long term",
        entered: longTerm,
        amount: longTerm * (portion / 100),
        basis: `${portion}% of market value — your share of what the companies hold in zakatable form`,
      });
    }
  }

  if (crypto > 0) {
    lines.push({
      label: "Digital assets",
      entered: crypto,
      amount: crypto,
      basis: "Full market value, as wealth held",
    });
  }

  if (accessible > 0) {
    // Deductions cannot take the figure below zero, which a mistyped penalty
    // otherwise would.
    const net = Math.max(0, accessible - deductions);
    lines.push({
      label: "Pension or account you can draw on",
      entered: accessible,
      amount: net,
      basis:
        deductions > 0
          ? "Net of the tax and penalty a withdrawal would actually cost"
          : "Wealth you can take possession of today",
    });
    if (deductions > 0) {
      notes.push(
        "The tax and penalty on an early withdrawal have been taken off before the rate was applied. Many contemporary scholars assess what you would actually receive rather than the headline balance, on the ground that the rest was never yours to take. Others assess the gross figure — if you follow that view, leave the deductions at zero.",
      );
    }
  }

  if (locked > 0) {
    if (input.lockedView === "defer") {
      excluded.push({
        label: "Pension you cannot draw yet",
        amount: locked,
        reason:
          "Left out entirely. On the majority contemporary view, wealth you cannot take possession of is not yet wealth you owe zakat on — the obligation begins when access does.",
      });
    } else {
      lines.push({
        label: "Pension you cannot draw yet",
        entered: locked,
        amount: locked * (vested / 100),
        basis: `${vested}% vested — the part that would be yours if you left tomorrow`,
      });
      notes.push(
        "You have chosen to pay on the locked pension as it vests. This is the more cautious of the two positions and it does not require access; the alternative is to leave it out until you can draw on it, and pay from that year onward.",
      );
    }
  }

  const base = lines.reduce((sum, l) => sum + l.amount, 0);

  // What the other position on long-term shares would have given. Shown
  // because a reader deciding between two views deserves both numbers rather
  // than being told one is correct.
  const otherLongTerm =
    input.longTermMethod === "market"
      ? longTerm * (portion / 100)
      : longTerm;
  const alternativeBase = base - (lines.find((l) => l.label === "Shares held long term")?.amount ?? 0) + otherLongTerm;

  return {
    lines,
    base,
    zakat: base * RATE,
    alternativeBase,
    alternativeZakat: alternativeBase * RATE,
    alternativeLabel:
      input.longTermMethod === "market"
        ? `Valuing long-term shares at ${portion}% instead`
        : "Valuing long-term shares at full market value instead",
    excluded,
    notes,
  };
}
