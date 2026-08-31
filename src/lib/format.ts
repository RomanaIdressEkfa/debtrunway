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
