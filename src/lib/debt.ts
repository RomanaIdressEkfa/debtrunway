/**
 * Debt payoff simulation engine.
 *
 * Everything here is deterministic month-by-month arithmetic:
 * interest accrues first, then payments are applied. All money is rounded to
 * cents at every step so the schedule we show adds up exactly the way a reader
 * checking it against their own statement expects.
 */

export type Strategy = "snowball" | "avalanche";

export interface Debt {
  id: string;
  name: string;
  balance: number;
  /** Annual percentage rate, e.g. 22.9 for 22.9% */
  apr: number;
  /** Fixed floor for the monthly minimum, e.g. the usual $25-$35 card minimum. */
  minPayment: number;
  /**
   * Percentage of the current balance the lender demands each month, e.g. 2.
   * Real credit cards work this way, which is the whole reason minimum payments
   * drag on for decades: as the balance falls, so does the required payment,
   * and progress slows to a crawl. Loans with a fixed instalment omit this.
   */
  minPercent?: number;
}

/**
 * What the lender actually demands this month. Percentage-based minimums are
 * recalculated against the current balance; the fixed amount is the floor.
 */
export function effectiveMinimum(debt: Debt, balance: number): number {
  const percentPortion = debt.minPercent
    ? balance * (debt.minPercent / 100)
    : 0;
  return Math.max(debt.minPayment, percentPortion);
}

/**
 * Level payment that clears an amortising loan in exactly `months`.
 * The standard annuity formula, with the zero-interest case handled separately
 * because the general form divides by zero there.
 */
export function monthlyPaymentForTerm(
  principal: number,
  apr: number,
  months: number,
): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = apr / 1200;
  if (r === 0) return r2(principal / months);
  return r2((principal * r) / (1 - Math.pow(1 + r, -months)));
}

export interface DebtMonthDetail {
  id: string;
  name: string;
  interest: number;
  payment: number;
  endingBalance: number;
}

export interface MonthRow {
  month: number;
  label: string;
  startingBalance: number;
  interest: number;
  principal: number;
  payment: number;
  endingBalance: number;
  detail: DebtMonthDetail[];
  clearedThisMonth: string[];
}

/**
 * A stretch of months where the payment on one debt stays the same.
 * Consecutive equal payments are collapsed into a single run so the plan can
 * be stated as a handful of instructions rather than a column of numbers.
 */
export interface PaymentRun {
  amount: number;
  from: number;
  to: number;
}

export interface DebtPayoffInfo {
  id: string;
  name: string;
  /** The month this debt reaches zero. */
  month: number;
  label: string;
  interestPaid: number;
  totalPaid: number;
  /** What to actually pay, month by month, compressed into runs. */
  schedule: PaymentRun[];
}

/** Groups a per-month payment history into runs of an unchanging amount. */
function toRuns(history: { month: number; amount: number }[]): PaymentRun[] {
  const runs: PaymentRun[] = [];

  for (const { month, amount } of history) {
    if (amount <= EPSILON) continue;
    const last = runs[runs.length - 1];

    if (last && Math.abs(last.amount - amount) < 0.005 && last.to === month - 1) {
      last.to = month;
    } else {
      runs.push({ amount, from: month, to: month });
    }
  }

  return runs;
}

export interface PayoffResult {
  feasible: boolean;
  reason?: string;
  rows: MonthRow[];
  months: number;
  totalInterest: number;
  totalPaid: number;
  payoffLabel: string;
  perDebt: DebtPayoffInfo[];
}

export interface SimulateOptions {
  /**
   * When true (the payoff-method behaviour), the total monthly outlay stays
   * constant: a cleared debt's minimum rolls onto the next target. When false,
   * you simply stop paying a debt once it is gone, which is the
   * "minimum payments only" baseline we compare against.
   */
  rollover?: boolean;
  startDate?: Date;
  maxMonths?: number;
}

const MAX_MONTHS = 600;
/** Balances under this are treated as cleared, so cent-level dust cannot stall a loop. */
const EPSILON = 0.005;

const r2 = (n: number) => Math.round(n * 100) / 100;

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

function monthLabel(start: Date, offset: number): string {
  return MONTH_LABEL.format(
    new Date(start.getFullYear(), start.getMonth() + offset, 1),
  );
}

/**
 * Snowball targets the smallest balance first (fast wins keep people going).
 * Avalanche targets the highest rate first (mathematically cheapest).
 * The second comparison is a tie-breaker so ordering is always stable.
 */
export function orderDebts(debts: Debt[], strategy: Strategy): Debt[] {
  return [...debts].sort((a, b) =>
    strategy === "snowball"
      ? a.balance - b.balance || b.apr - a.apr
      : b.apr - a.apr || a.balance - b.balance,
  );
}

function emptyResult(reason?: string): PayoffResult {
  return {
    feasible: !reason,
    reason,
    rows: [],
    months: 0,
    totalInterest: 0,
    totalPaid: 0,
    payoffLabel: "",
    perDebt: [],
  };
}

export function simulatePayoff(
  debts: Debt[],
  extra: number,
  strategy: Strategy,
  options: SimulateOptions = {},
): PayoffResult {
  const rollover = options.rollover ?? true;
  const startDate = options.startDate ?? new Date();
  const maxMonths = options.maxMonths ?? MAX_MONTHS;
  const extraBudget = Math.max(0, extra);

  const active = debts.filter((d) => d.balance > EPSILON);
  if (active.length === 0) return emptyResult();

  const baseMinimums = r2(
    active.reduce((sum, d) => sum + effectiveMinimum(d, d.balance), 0),
  );
  const fixedBudget = r2(baseMinimums + extraBudget);
  if (fixedBudget <= 0) {
    return emptyResult("Enter a monthly payment above $0.");
  }

  const balances = new Map(active.map((d) => [d.id, d.balance]));
  const interestPaid = new Map(active.map((d) => [d.id, 0]));
  const paidByDebt = new Map(active.map((d) => [d.id, 0]));
  const historyByDebt = new Map<string, { month: number; amount: number }[]>(
    active.map((d) => [d.id, []]),
  );
  const priority = orderDebts(active, strategy);

  const rows: MonthRow[] = [];
  const perDebt: DebtPayoffInfo[] = [];
  let totalInterest = 0;
  let totalPaid = 0;

  for (let month = 1; month <= maxMonths; month++) {
    const living = priority.filter((d) => (balances.get(d.id) ?? 0) > EPSILON);
    if (living.length === 0) break;

    const label = monthLabel(startDate, month - 1);
    const startingBalance = r2(
      living.reduce((sum, d) => sum + (balances.get(d.id) ?? 0), 0),
    );

    // 1. Interest accrues on the balance carried into the month.
    const monthInterest = new Map<string, number>();
    for (const d of living) {
      const accrued = r2((balances.get(d.id) ?? 0) * (d.apr / 1200));
      monthInterest.set(d.id, accrued);
      balances.set(d.id, r2((balances.get(d.id) ?? 0) + accrued));
      interestPaid.set(d.id, r2((interestPaid.get(d.id) ?? 0) + accrued));
    }

    // Percentage minimums shrink as balances fall. Under the payoff method the
    // total outlay is held constant anyway, so that shrinkage frees up money
    // for the target debt. Paying only the minimum, it just slows you down.
    const budget = rollover
      ? fixedBudget
      : r2(
          living.reduce(
            (sum, d) => sum + effectiveMinimum(d, balances.get(d.id) ?? 0),
            0,
          ) + extraBudget,
        );

    // 2. Every debt gets its minimum, capped at what is actually owed.
    const payments = new Map<string, number>();
    let spent = 0;
    for (const d of living) {
      const owed = balances.get(d.id) ?? 0;
      const pay = r2(
        Math.min(effectiveMinimum(d, owed), owed, Math.max(0, budget - spent)),
      );
      balances.set(d.id, r2(owed - pay));
      payments.set(d.id, pay);
      spent = r2(spent + pay);
    }

    // 3. Whatever is left attacks the target debt, in strategy order.
    let remaining = Math.max(0, r2(budget - spent));
    for (const d of priority) {
      if (remaining <= EPSILON) break;
      const owed = balances.get(d.id) ?? 0;
      if (owed <= EPSILON) continue;
      const pay = r2(Math.min(remaining, owed));
      balances.set(d.id, r2(owed - pay));
      payments.set(d.id, r2((payments.get(d.id) ?? 0) + pay));
      remaining = r2(remaining - pay);
    }

    const paymentTotal = r2(
      living.reduce((sum, d) => sum + (payments.get(d.id) ?? 0), 0),
    );
    const interestTotal = r2(
      living.reduce((sum, d) => sum + (monthInterest.get(d.id) ?? 0), 0),
    );
    const endingBalance = r2(
      priority.reduce((sum, d) => sum + Math.max(0, balances.get(d.id) ?? 0), 0),
    );

    // Record what each debt was actually paid this month, for the instructions.
    for (const d of living) {
      const paid = payments.get(d.id) ?? 0;
      paidByDebt.set(d.id, r2((paidByDebt.get(d.id) ?? 0) + paid));
      historyByDebt.get(d.id)?.push({ month, amount: paid });
    }

    const clearedThisMonth: string[] = [];
    for (const d of living) {
      if ((balances.get(d.id) ?? 0) <= EPSILON) {
        clearedThisMonth.push(d.name);
        perDebt.push({
          id: d.id,
          name: d.name,
          month,
          label,
          interestPaid: interestPaid.get(d.id) ?? 0,
          totalPaid: paidByDebt.get(d.id) ?? 0,
          schedule: toRuns(historyByDebt.get(d.id) ?? []),
        });
      }
    }

    totalInterest = r2(totalInterest + interestTotal);
    totalPaid = r2(totalPaid + paymentTotal);

    rows.push({
      month,
      label,
      startingBalance,
      interest: interestTotal,
      principal: r2(paymentTotal - interestTotal),
      payment: paymentTotal,
      endingBalance,
      detail: living.map((d) => ({
        id: d.id,
        name: d.name,
        interest: monthInterest.get(d.id) ?? 0,
        payment: payments.get(d.id) ?? 0,
        endingBalance: Math.max(0, balances.get(d.id) ?? 0),
      })),
      clearedThisMonth,
    });

    if (endingBalance <= EPSILON) break;
  }

  const cleared =
    rows.length > 0 && rows[rows.length - 1].endingBalance <= EPSILON;

  if (!cleared) {
    // Not literally never — a 2% minimum on a 22.9% card does finish, after
    // about 102 years. Saying "never" would be a small lie, and on a page whose
    // whole value is being accurate about interest, that matters.
    return emptyResult(
      `These payments do not clear the balance within ${Math.floor(maxMonths / 12)} years. Almost all of each payment is going to interest, so the monthly amount needs to go up.`,
    );
  }

  return {
    feasible: true,
    rows,
    months: rows.length,
    totalInterest,
    totalPaid,
    payoffLabel: rows[rows.length - 1].label,
    perDebt,
  };
}

export interface Comparison {
  snowball: PayoffResult;
  avalanche: PayoffResult;
  minimumOnly: PayoffResult;
}

/**
 * Runs both strategies plus the do-nothing baseline, so a page can show what
 * the plan actually saves rather than a bare payoff date.
 */
export function compareStrategies(
  debts: Debt[],
  extra: number,
  startDate?: Date,
): Comparison {
  return {
    snowball: simulatePayoff(debts, extra, "snowball", { startDate }),
    avalanche: simulatePayoff(debts, extra, "avalanche", { startDate }),
    minimumOnly: simulatePayoff(debts, 0, "avalanche", {
      startDate,
      rollover: false,
    }),
  };
}

export function describeDuration(months: number): string {
  if (months <= 0) return "0 months";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? "month" : "months"}`);
  return parts.join(" ");
}
