/**
 * The build-day metal prices, converted into whichever currency is asked for.
 *
 * The JSON beside this file is written by scripts/fetch-metals.ts during the
 * build. Nothing here reaches the network: by the time this runs the numbers
 * are already in the bundle.
 */

import prices from "./metal-prices.json";

export interface MetalPrices {
  /** Price of one gram, in the requested currency. */
  gold: number;
  silver: number;
  /** The day the figures were taken, so the page can say so. */
  fetchedAt: string;
  currency: string;
  /** False when the build had no price to bake in. */
  available: boolean;
}

/** Currency codes with a rate in this build, in the order the picker shows. */
export const CURRENCIES = Object.keys(prices.rates ?? {});

/** Symbols where one is short and well known; the code is shown otherwise. */
const SYMBOLS: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  CAD: "CA$",
  AUD: "A$",
  INR: "₹",
  BDT: "৳",
  PKR: "₨",
  TRY: "₺",
  NGN: "₦",
};

export const symbolFor = (code: string) => SYMBOLS[code] ?? code;

/**
 * Prices per gram in one currency.
 *
 * A currency with no rate in this build returns available: false rather than
 * silently falling back to dollars, which would put a dollar nisab under a
 * taka label — a wrong answer that looks like a right one.
 */
export function pricesIn(currency: string): MetalPrices {
  const rate = (prices.rates as Record<string, number>)?.[currency];
  const usable =
    Number.isFinite(rate) &&
    rate > 0 &&
    Number.isFinite(prices.goldPerGramUSD) &&
    prices.goldPerGramUSD > 0;

  return {
    gold: usable ? prices.goldPerGramUSD * rate : 0,
    silver: usable ? prices.silverPerGramUSD * rate : 0,
    fetchedAt: prices.fetchedAt ?? "",
    currency,
    available: Boolean(usable),
  };
}

/**
 * How the page should describe the price it filled in.
 *
 * Deliberately plain about the date. A figure presented as live when it is
 * three weeks old is worse than one that says how old it is.
 */
export const priceNote = (p: MetalPrices) =>
  p.available
    ? `Market price on ${p.fetchedAt}, filled in for you. Change it if your local rate differs.`
    : "No price for this currency in this build — enter today's rate.";
