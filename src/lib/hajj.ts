/**
 * Saving for Hajj, with the zakat on the savings taken into account.
 *
 * Every Hajj calculator divides a target by a number of months. That answer
 * is wrong for most people who use it, and wrong in the same direction, for a
 * reason nobody mentions: money set aside for Hajj is still your wealth. Once
 * the pot is above the nisab and a lunar year has passed over it, zakat is
 * due on it — every year, on the whole balance, while it sits there.
 *
 * On a pot growing towards the cost of Hajj, that is not a rounding error.
 * Five years of 2.5% on a balance averaging half the target takes a real bite
 * out of it, and a plan built on plain division arrives short.
 *
 * So this simulates the pot month by month, applies zakat each lunar year the
 * balance clears the threshold, and reports both the date and the zakat paid
 * along the way. It assumes no growth on the savings at all — no interest,
 * and no investment return either, since a return is not a thing a plan
 * should count on.
 *
 * The lunar year is 354 days against a solar month of about 30.44, so the
 * zakat anniversary drifts earlier through the calendar rather than landing
 * on the same date. The simulation carries days rather than months for that
 * reason.
 */

export const RATE = 0.025;
const LUNAR_YEAR_DAYS = 354;
const DAYS_PER_MONTH = 30.436875;

/** Hard stop, so a contribution that never reaches the target still returns. */
const MAX_MONTHS = 720;

export interface HajjInput {
  /** What the journey is expected to cost. */
  target: number;
  /** What is already put by. */
  saved: number;
  /** What can be added each month. */
  monthly: number;
  /** Threshold in the same currency — from the metal price. */
  nisab: number;
  /** Other zakatable wealth held alongside, which affects the threshold. */
  otherWealth: number;
  /** Whether to model the zakat due on the pot as it grows. */
  applyZakat: boolean;
}

export interface HajjResult {
  /** Months until the target is reached, or null if it never is. */
  months: number | null;
  years: number;
  remainingMonths: number;
  /** Total put in by the saver. */
  contributed: number;
  /** Total zakat paid out of the pot on the way. */
  zakatPaid: number;
  /** Number of zakat anniversaries that fell during the plan. */
  zakatYears: number;
  /** Reached without saving anything more. */
  alreadyThere: boolean;
  /** The contribution is too small to outrun the zakat, so it never arrives. */
  neverReaches: boolean;
  /** What plain division would have said, for comparison. */
  naiveMonths: number | null;
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function planHajj(input: HajjInput): HajjResult {
  const target = clean(input.target);
  const monthly = clean(input.monthly);
  const nisab = clean(input.nisab);
  const other = clean(input.otherWealth);
  let balance = clean(input.saved);

  const naiveMonths =
    monthly > 0 ? Math.ceil(Math.max(0, target - balance) / monthly) : null;

  if (target > 0 && balance >= target) {
    return {
      months: 0,
      years: 0,
      remainingMonths: 0,
      contributed: 0,
      zakatPaid: 0,
      zakatYears: 0,
      alreadyThere: true,
      neverReaches: false,
      naiveMonths: 0,
    };
  }

  let contributed = 0;
  let zakatPaid = 0;
  let zakatYears = 0;
  let daysSinceZakat = 0;
  let months = 0;

  while (months < MAX_MONTHS) {
    months++;
    balance += monthly;
    contributed += monthly;
    daysSinceZakat += DAYS_PER_MONTH;

    // A lunar year has passed. Zakat falls on total wealth, so the threshold
    // is tested against the pot plus whatever else is held — but it is only
    // taken out of the pot, which is the money this plan is about.
    if (input.applyZakat && daysSinceZakat >= LUNAR_YEAR_DAYS) {
      daysSinceZakat -= LUNAR_YEAR_DAYS;
      if (nisab > 0 && balance + other >= nisab) {
        const due = balance * RATE;
        balance -= due;
        zakatPaid += due;
        zakatYears++;
      }
    }

    if (target > 0 && balance >= target) break;
  }

  const reached = target > 0 && balance >= target;

  return {
    months: reached ? months : null,
    years: reached ? Math.floor(months / 12) : 0,
    remainingMonths: reached ? months % 12 : 0,
    contributed,
    zakatPaid,
    zakatYears,
    alreadyThere: false,
    neverReaches: !reached,
    naiveMonths,
  };
}

/**
 * The monthly amount needed to arrive by a given month, found by bisection.
 *
 * There is no closed form once zakat is in the loop: each year's deduction
 * depends on the balance, which depends on every contribution before it. Forty
 * iterations of halving take the answer well inside a currency unit, which is
 * far finer than a plan that will be revised twice before it is finished.
 */
export function monthlyForTarget(
  input: Omit<HajjInput, "monthly">,
  byMonths: number,
): number | null {
  const target = clean(input.target);
  const want = Math.max(1, Math.floor(byMonths));
  if (target <= 0) return null;
  if (clean(input.saved) >= target) return 0;

  const reaches = (monthly: number) => {
    const r = planHajj({ ...input, monthly });
    return r.months !== null && r.months <= want;
  };

  let low = 0;
  let high = Math.max(target / want, 1);
  // Push the ceiling up until it is known to work, so bisection has a bracket.
  for (let i = 0; i < 40 && !reaches(high); i++) high *= 2;
  if (!reaches(high)) return null;

  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    if (reaches(mid)) high = mid;
    else low = mid;
  }
  return high;
}
