/**
 * One source of truth for every calculator on the site.
 * The nav, the homepage grid, the related-links block and the sitemap all read
 * from here, so adding a calculator means adding a page and one entry.
 */
export interface CalculatorMeta {
  slug: string;
  /** Short label for navigation and cards. */
  nav: string;
  /** The <title> and the card heading. */
  title: string;
  /** Meta description and card body. Keep it under ~155 characters. */
  description: string;
  group: "plan" | "cards" | "loans";
}

export const calculators: CalculatorMeta[] = [
  {
    slug: "/",
    nav: "Debt payoff",
    title: "Debt Payoff Calculator",
    description:
      "List every debt you owe and see your exact debt-free date, total interest, and a month-by-month schedule you can print.",
    group: "plan",
  },
  {
    slug: "/debt-snowball-calculator",
    nav: "Debt snowball",
    title: "Debt Snowball Calculator",
    description:
      "Pay the smallest balance first and roll each cleared payment onto the next. See how fast the snowball builds.",
    group: "plan",
  },
  {
    slug: "/debt-avalanche-calculator",
    nav: "Debt avalanche",
    title: "Debt Avalanche Calculator",
    description:
      "Attack the highest interest rate first — the mathematically cheapest route out of debt. See exactly what it saves.",
    group: "plan",
  },
  {
    slug: "/snowball-vs-avalanche",
    nav: "Snowball vs avalanche",
    title: "Snowball vs. Avalanche Calculator",
    description:
      "Run both methods on your own debts side by side and see what the choice really costs in time and interest.",
    group: "plan",
  },
  {
    slug: "/credit-card-payoff-calculator",
    nav: "Credit card payoff",
    title: "Credit Card Payoff Calculator",
    description:
      "Find out how long one credit card takes to clear, what the interest costs, and how much sooner extra payments finish it.",
    group: "cards",
  },
  {
    slug: "/minimum-payment-calculator",
    nav: "Minimum payment",
    title: "Credit Card Minimum Payment Calculator",
    description:
      "See what happens if you only ever pay the minimum. The answer is usually decades and several times the original balance.",
    group: "cards",
  },
  {
    slug: "/extra-payment-calculator",
    nav: "Extra payment",
    title: "Extra Payment Calculator",
    description:
      "See what $25, $50, $100 or $250 extra a month does to your payoff date and your total interest, side by side.",
    group: "cards",
  },
  {
    slug: "/debt-consolidation-calculator",
    nav: "Debt consolidation",
    title: "Debt Consolidation Calculator",
    description:
      "Compare your current debts against a single consolidation loan and find out whether consolidating actually saves you money.",
    group: "loans",
  },
  {
    slug: "/loan-payoff-calculator",
    nav: "Loan payoff",
    title: "Loan Payoff Calculator",
    description:
      "Work out the payoff date and total interest on any fixed loan, and see how much extra payments shorten it.",
    group: "loans",
  },
  {
    slug: "/student-loan-payoff-calculator",
    nav: "Student loan payoff",
    title: "Student Loan Payoff Calculator",
    description:
      "See your student loan payoff date, the lifetime interest cost, and how much faster extra payments get you there.",
    group: "loans",
  },
  {
    slug: "/debt-to-income-calculator",
    nav: "Debt-to-income",
    title: "Debt-to-Income Ratio Calculator",
    description:
      "Work out the DTI ratio lenders check before approving a mortgage or loan, and see which band you fall into.",
    group: "loans",
  },
];

export const groupLabels: Record<CalculatorMeta["group"], string> = {
  plan: "Build a payoff plan",
  cards: "Credit cards",
  loans: "Loans and ratios",
};

export const bySlug = (slug: string) =>
  calculators.find((c) => c.slug === slug);

/** Everything except the page you are on, for the related-links block. */
export const others = (slug: string, limit = 4) =>
  calculators.filter((c) => c.slug !== slug).slice(0, limit);
