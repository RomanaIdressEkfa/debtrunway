/**
 * Zakat on wealth (zakat al-mal).
 *
 * Two things decide whether zakat is due: whether net zakatable wealth reaches
 * the nisab, and whether it has been held for a lunar year (hawl). Only the
 * first can be calculated from a form — the second is a date the giver knows
 * and the page has to ask about rather than assume.
 *
 * Zakat on crops, livestock and mined wealth follows different rates and
 * thresholds entirely and is deliberately out of scope here.
 */

/** The rate on monetary wealth: a fortieth. */
export const RATE = 0.025;

/**
 * The two thresholds, as weights rather than prices.
 *
 * The Prophet set nisab at 20 dinars of gold or 200 dirhams of silver, which
 * the standard conversions put at these weights. Prices move, so the page
 * asks for a price per gram and derives the threshold from it; hardcoding a
 * currency value would be wrong within a week.
 */
export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;

export type Standard = "silver" | "gold";

export interface ZakatInput {
  /** Price of one gram of gold, in the giver's own currency. */
  goldPrice: number;
  /** Price of one gram of silver, in the same currency. */
  silverPrice: number;
  /** Which threshold to measure against. */
  standard: Standard;

  // Assets that zakat is due on.
  cash: number;
  bank: number;
  /** Weight held, not value — the price above turns it into money. */
  goldGrams: number;
  silverGrams: number;
  /** Shares, funds and pensions the giver can access. */
  investments: number;
  /** Stock held for resale, valued at what it would sell for today. */
  businessStock: number;
  /** Loans made out that the giver expects to be repaid. */
  receivables: number;

  // What comes off the top.
  /** Debts and bills due now, not the whole balance of a long-term loan. */
  debts: number;
}

export interface ZakatLine {
  label: string;
  amount: number;
  hint?: string;
}

export interface ZakatResult {
  /** The threshold in the giver's currency, from the price they entered. */
  nisab: number;
  /** Which standard produced it, and the weight behind it. */
  standard: Standard;
  nisabGrams: number;
  assets: ZakatLine[];
  totalAssets: number;
  totalDebts: number;
  /** Assets minus debts — what the threshold is measured against. */
  net: number;
  /** Whether net wealth reaches the threshold. */
  due: boolean;
  /** 2.5% of net, or zero when below nisab. */
  zakat: number;
  /** How far below the threshold, when it is not reached. */
  shortfall: number;
  /** Nisab could not be worked out because no price was entered. */
  needsPrice: boolean;
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculateZakat(input: ZakatInput): ZakatResult {
  const goldPrice = clean(input.goldPrice);
  const silverPrice = clean(input.silverPrice);

  const nisabGrams =
    input.standard === "gold" ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS;
  const unitPrice = input.standard === "gold" ? goldPrice : silverPrice;
  const nisab = nisabGrams * unitPrice;

  const assets: ZakatLine[] = [
    { label: "Cash in hand", amount: clean(input.cash) },
    { label: "Money in bank accounts", amount: clean(input.bank) },
    {
      label: "Gold",
      amount: clean(input.goldGrams) * goldPrice,
      hint: clean(input.goldGrams)
        ? `${clean(input.goldGrams)}g at the price you entered`
        : undefined,
    },
    {
      label: "Silver",
      amount: clean(input.silverGrams) * silverPrice,
      hint: clean(input.silverGrams)
        ? `${clean(input.silverGrams)}g at the price you entered`
        : undefined,
    },
    { label: "Shares, funds and accessible pensions", amount: clean(input.investments) },
    { label: "Business stock", amount: clean(input.businessStock) },
    { label: "Money owed to you", amount: clean(input.receivables) },
  ].filter((line) => line.amount > 0);

  const totalAssets = assets.reduce((sum, line) => sum + line.amount, 0);
  const totalDebts = clean(input.debts);
  const net = Math.max(0, totalAssets - totalDebts);

  // A threshold of zero would make every amount "above nisab", including an
  // empty form, so an unpriced calculation reports as unanswerable instead.
  const needsPrice = unitPrice <= 0;
  const due = !needsPrice && net >= nisab && net > 0;

  return {
    nisab,
    standard: input.standard,
    nisabGrams,
    assets,
    totalAssets,
    totalDebts,
    net,
    due,
    zakat: due ? net * RATE : 0,
    shortfall: !needsPrice && net < nisab ? nisab - net : 0,
    needsPrice,
  };
}
