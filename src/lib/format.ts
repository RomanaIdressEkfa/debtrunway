const whole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const cents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Headline figures: nobody reads a payoff total to the penny. */
export const usd = (n: number) => whole.format(n);

/** Schedule rows, where the arithmetic has to visibly add up. */
export const usdExact = (n: number) => cents.format(n);

/**
 * Plain grouped numbers, no currency symbol.
 *
 * Inheritance shares are ratios, so the estate can be entered in any currency
 * and the answer holds. Stamping a dollar sign on it would only mislead the
 * majority of readers, who are not counting in dollars.
 */
const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export const plain = (n: number) => grouped.format(n);
