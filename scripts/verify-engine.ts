import {
  simulatePayoff,
  compareStrategies,
  orderDebts,
  effectiveMinimum,
  monthlyPaymentForTerm,
  type Debt,
} from "../src/lib/debt";

let failures = 0;
const check = (name: string, pass: boolean, detail = "") => {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
  if (!pass) failures++;
};

const START = new Date(2026, 0, 1); // Jan 2026, fixed so labels are predictable

// --- 1. Zero interest: pure division, easy to verify by hand ---
const zero: Debt[] = [
  { id: "a", name: "A", balance: 1000, apr: 0, minPayment: 100 },
];
const r1 = simulatePayoff(zero, 0, "snowball", { startDate: START });
check("0% APR, $1000 @ $100/mo takes 10 months", r1.months === 10, `got ${r1.months}`);
check("0% APR pays no interest", r1.totalInterest === 0, `got ${r1.totalInterest}`);
check("0% APR total paid is exactly the balance", r1.totalPaid === 1000, `got ${r1.totalPaid}`);
check("payoff label is Oct 2026", r1.payoffLabel === "Oct 2026", `got ${r1.payoffLabel}`);

// --- 2. Interest accrues before payment, verified month by month ---
const one: Debt[] = [
  { id: "a", name: "A", balance: 1000, apr: 12, minPayment: 100 },
];
const r2 = simulatePayoff(one, 0, "snowball", { startDate: START });
// Month 1: 1000 * 1% = 10 interest -> 1010, pay 100 -> 910
check("month 1 interest is $10.00", r2.rows[0].interest === 10, `got ${r2.rows[0].interest}`);
check("month 1 ends at $910.00", r2.rows[0].endingBalance === 910, `got ${r2.rows[0].endingBalance}`);
// Month 2: 910 * 1% = 9.10 -> 919.10, pay 100 -> 819.10
check("month 2 interest is $9.10", r2.rows[1].interest === 9.1, `got ${r2.rows[1].interest}`);
check("month 2 ends at $819.10", r2.rows[1].endingBalance === 819.1, `got ${r2.rows[1].endingBalance}`);
check("final balance is exactly zero", r2.rows[r2.rows.length - 1].endingBalance === 0);
check(
  "totals reconcile: paid = principal + interest",
  Math.abs(r2.totalPaid - (1000 + r2.totalInterest)) < 0.02,
  `paid ${r2.totalPaid}, interest ${r2.totalInterest}`,
);

// --- 3. Every row's arithmetic must add up ---
const messy: Debt[] = [
  { id: "d1", name: "Visa", balance: 6200, apr: 22.9, minPayment: 155 },
  { id: "d2", name: "Store", balance: 1850, apr: 26.99, minPayment: 55 },
  { id: "d3", name: "Car", balance: 11400, apr: 6.4, minPayment: 310 },
];
const r3 = simulatePayoff(messy, 200, "snowball", { startDate: START });
let rowMathOk = true;
let sumOk = true;
for (const row of r3.rows) {
  if (Math.abs(row.startingBalance + row.interest - row.payment - row.endingBalance) > 0.02) rowMathOk = false;
  if (Math.abs(row.payment - row.interest - row.principal) > 0.02) rowMathOk = false;
  const detailSum = row.detail.reduce((s, d) => s + d.payment, 0);
  if (Math.abs(detailSum - row.payment) > 0.02) sumOk = false;
}
check("every row: start + interest - payment = end", rowMathOk);
check("per-debt payments sum to the row total", sumOk);

// --- 4. Budget stays constant while more than one debt lives (rollover) ---
const budget = 155 + 55 + 310 + 200;
const fullMonths = r3.rows.filter((r) => r.endingBalance > 0);
check(
  "monthly outlay stays at the full budget until the end",
  fullMonths.every((r) => Math.abs(r.payment - budget) < 0.02),
  `budget ${budget}`,
);
check(
  "final month pays only what is left",
  r3.rows[r3.rows.length - 1].payment <= budget + 0.02,
);

// --- 5. Strategy ordering ---
check(
  "snowball targets the smallest balance first",
  orderDebts(messy, "snowball")[0].name === "Store",
);
check(
  "avalanche targets the highest APR first",
  orderDebts(messy, "avalanche")[0].name === "Store",
);
const spread: Debt[] = [
  { id: "x", name: "Small low-rate", balance: 500, apr: 5, minPayment: 25 },
  { id: "y", name: "Big high-rate", balance: 9000, apr: 24, minPayment: 200 },
];
check(
  "snowball and avalanche disagree when size and rate conflict",
  orderDebts(spread, "snowball")[0].name === "Small low-rate" &&
    orderDebts(spread, "avalanche")[0].name === "Big high-rate",
);

// --- 6. Avalanche is never more expensive than snowball ---
const cmp = compareStrategies(spread, 300, START);
check(
  "avalanche costs no more interest than snowball",
  cmp.avalanche.totalInterest <= cmp.snowball.totalInterest + 0.02,
  `avalanche ${cmp.avalanche.totalInterest} vs snowball ${cmp.snowball.totalInterest}`,
);
check(
  "snowball clears its first debt no later than avalanche does",
  cmp.snowball.perDebt[0].month <= cmp.avalanche.perDebt[0].month,
);

// --- 7. Baseline must be worse than the plan ---
const cmp2 = compareStrategies(messy, 200, START);
check(
  "minimum-only takes longer than the plan",
  cmp2.minimumOnly.months > cmp2.snowball.months,
  `${cmp2.minimumOnly.months} vs ${cmp2.snowball.months} months`,
);
check(
  "minimum-only costs more interest than the plan",
  cmp2.minimumOnly.totalInterest > cmp2.snowball.totalInterest,
  `${cmp2.minimumOnly.totalInterest} vs ${cmp2.snowball.totalInterest}`,
);
check(
  "every debt is reported as paid off exactly once",
  cmp2.snowball.perDebt.length === messy.length,
);

// --- 8. Impossible case is caught, not looped forever ---
const trap: Debt[] = [
  { id: "t", name: "Trap", balance: 10000, apr: 24, minPayment: 50 },
];
const r8 = simulatePayoff(trap, 0, "snowball", { startDate: START });
check("payment below the interest is reported as infeasible", !r8.feasible);
check("infeasible result explains itself", Boolean(r8.reason));

// --- 9. Empty / edge input does not crash ---
check("no debts returns a feasible empty result", simulatePayoff([], 100, "snowball").feasible);
check(
  "zero balances are ignored",
  simulatePayoff([{ id: "z", name: "Z", balance: 0, apr: 10, minPayment: 10 }], 50, "snowball").months === 0,
);

// --- 10. Amortisation formula against known values ---
// $10,000 at 6% over 60 months is $193.33 on any standard loan calculator.
check(
  "amortisation: $10,000 @ 6% over 60mo = $193.33",
  monthlyPaymentForTerm(10000, 6, 60) === 193.33,
  `got ${monthlyPaymentForTerm(10000, 6, 60)}`,
);
check(
  "amortisation: 0% APR is plain division",
  monthlyPaymentForTerm(12000, 0, 24) === 500,
  `got ${monthlyPaymentForTerm(12000, 0, 24)}`,
);
// A loan paid at exactly its scheduled instalment should end on schedule.
const term = monthlyPaymentForTerm(10000, 6, 60);
const scheduled = simulatePayoff(
  [{ id: "l", name: "Loan", balance: 10000, apr: 6, minPayment: term }],
  0,
  "avalanche",
  { startDate: START },
);
check(
  "a loan paid at its scheduled instalment clears in its term",
  scheduled.months === 60,
  `got ${scheduled.months}`,
);

// --- 11. Percentage-based minimums ---
const card: Debt = {
  id: "c",
  name: "Card",
  balance: 5000,
  apr: 20,
  minPayment: 25,
  minPercent: 2,
};
check(
  "percent minimum uses the percentage while it exceeds the floor",
  effectiveMinimum(card, 5000) === 100,
  `got ${effectiveMinimum(card, 5000)}`,
);
check(
  "percent minimum falls back to the fixed floor on small balances",
  effectiveMinimum(card, 500) === 25,
  `got ${effectiveMinimum(card, 500)}`,
);

const shrinking = simulatePayoff([card], 0, "avalanche", {
  startDate: START,
  rollover: false,
});
const fixedInstead = simulatePayoff(
  [{ id: "c", name: "Card", balance: 5000, apr: 20, minPayment: 100 }],
  0,
  "avalanche",
  { startDate: START, rollover: false },
);
check(
  "a shrinking minimum drags on far longer than a fixed one",
  shrinking.months > fixedInstead.months * 2,
  `${shrinking.months} vs ${fixedInstead.months} months`,
);
check(
  "the required payment declines month over month",
  shrinking.rows[0].payment > shrinking.rows[24].payment,
  `${shrinking.rows[0].payment} -> ${shrinking.rows[24].payment}`,
);
check(
  "row arithmetic still holds with percentage minimums",
  shrinking.rows.every(
    (r) =>
      Math.abs(r.startingBalance + r.interest - r.payment - r.endingBalance) <
      0.02,
  ),
);

// Under the payoff method the outlay must stay level even as minimums shrink.
const levelled = simulatePayoff([card], 150, "avalanche", { startDate: START });
const levelBudget = 100 + 150;
check(
  "rollover keeps the outlay level even as the minimum shrinks",
  levelled.rows
    .filter((r) => r.endingBalance > 0)
    .every((r) => Math.abs(r.payment - levelBudget) < 0.02),
  `budget ${levelBudget}`,
);
check(
  "paying a level amount beats letting the minimum shrink",
  levelled.months < shrinking.months &&
    levelled.totalInterest < shrinking.totalInterest,
  `${levelled.months}mo/$${levelled.totalInterest} vs ${shrinking.months}mo/$${shrinking.totalInterest}`,
);

// --- 12. Per-debt totals and payment instructions ---
const plan = simulatePayoff(messy, 200, "snowball", { startDate: START });

check(
  "per-debt totals add up to the plan total",
  Math.abs(
    plan.perDebt.reduce((s, d) => s + d.totalPaid, 0) - plan.totalPaid,
  ) < 0.05,
  `${plan.perDebt.reduce((s, d) => s + d.totalPaid, 0)} vs ${plan.totalPaid}`,
);
check(
  "per-debt interest adds up to the plan interest",
  Math.abs(
    plan.perDebt.reduce((s, d) => s + d.interestPaid, 0) - plan.totalInterest,
  ) < 0.05,
);
check(
  "each debt pays back its balance plus its interest",
  plan.perDebt.every((d) => {
    const original = messy.find((m) => m.id === d.id)!.balance;
    return Math.abs(d.totalPaid - (original + d.interestPaid)) < 0.05;
  }),
);

// The instructions are what a reader will actually follow, so they have to
// cover every month of the debt with no gaps and no invented payments.
check(
  "payment runs are contiguous and start at month 1",
  plan.perDebt.every((d) => {
    if (d.schedule[0].from !== 1) return false;
    for (let i = 1; i < d.schedule.length; i++) {
      if (d.schedule[i].from !== d.schedule[i - 1].to + 1) return false;
    }
    return d.schedule[d.schedule.length - 1].to === d.month;
  }),
);
check(
  "payment runs sum to what the debt was actually paid",
  plan.perDebt.every((d) => {
    const total = d.schedule.reduce(
      (s, r) => s + r.amount * (r.to - r.from + 1),
      0,
    );
    return Math.abs(total - d.totalPaid) < 0.05;
  }),
);
check(
  "consecutive runs never repeat the same amount",
  plan.perDebt.every((d) =>
    d.schedule.every(
      (r, i) => i === 0 || Math.abs(r.amount - d.schedule[i - 1].amount) >= 0.005,
    ),
  ),
);
// Rollover means the last debt standing should end up paid more than it
// started with — that is the snowball actually rolling.
const lastCleared = plan.perDebt[plan.perDebt.length - 1];
check(
  "the final debt's payment grows as earlier ones clear",
  lastCleared.schedule[lastCleared.schedule.length - 1].amount >
    lastCleared.schedule[0].amount ||
    lastCleared.schedule.length === 1,
  `${lastCleared.name}: ${lastCleared.schedule[0].amount} -> ${lastCleared.schedule[lastCleared.schedule.length - 1].amount}`,
);

console.log(
  failures === 0
    ? "\nAll checks passed."
    : `\n${failures} check(s) FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
