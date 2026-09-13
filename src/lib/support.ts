/**
 * The donation ledger.
 *
 * Every entry here is a donation that has been checked against the bKash
 * account before it was written down. That check is the whole reason the page
 * is worth reading.
 *
 * The obvious design — a form on the site that writes straight into a public
 * list — cannot work, and it is worth writing down why so nobody rebuilds it
 * later. bKash offers no way for a website to confirm that a transaction ID
 * is real, so anyone could type a made-up ID and a large figure and appear at
 * the top of the list without sending a taka. A ledger that can be faked is
 * worse than no ledger: it claims a transparency it does not have.
 *
 * So the flow is: someone sends money, tells us, and the entry appears here
 * only once it has been matched against the account. Entries reach this file
 * through a commit, which means they pass through the one person who can
 * actually verify them.
 *
 * Amounts are in Bangladeshi taka, because that is what bKash sends. The
 * running costs are in US dollars, because that is what they are billed in,
 * so the page converts at a rate stated on the page rather than silently.
 */

export interface Donation {
  /** YYYY-MM-DD, the day it arrived. */
  date: string;
  /** Taka. */
  amount: number;
  /**
   * How the donor wants to be listed. An empty name is listed as anonymous —
   * giving without being named is the better of the two in any case, and the
   * page should never make someone feel they have to be named to be counted.
   */
  name?: string;
  /** Their own words, if they left any. Shown as given. */
  note?: string;
}

export interface Expense {
  date: string;
  /** Taka, converted at the rate on the page. */
  amount: number;
  item: string;
  /** What it was for, in a sentence. */
  why: string;
}

/** What the money is being collected towards right now. */
export interface Goal {
  /** Taka. */
  target: number;
  title: string;
  why: string;
}

/**
 * Nothing has been received yet, and the page says so rather than seeding a
 * figure to look established. A ledger that starts with invented entries is
 * the same lie as a fakeable form, made by the person who built it.
 */
export const DONATIONS: Donation[] = [];

/**
 * What has actually been spent. The domain is the only real cost so far —
 * everything else the site uses is on a free tier, and the page says that
 * plainly instead of implying a server bill that does not exist.
 */
export const EXPENSES: Expense[] = [
  {
    date: "2026-08-31",
    amount: 1450,
    item: "debtrunway.com — one year",
    why: "The domain. It is the only thing this site costs money to keep, and it was paid for before any of this was asked for.",
  },
];

export const GOAL: Goal = {
  target: 35000,
  title: "A scholar's review of the inheritance engine",
  why: "The faraid calculator is checked against 78 worked examples from the classical texts, which proves the arithmetic and proves nothing about the fiqh. Paying a qualified scholar to go through it properly is the single thing that would most improve this site, and it is the one thing that cannot be done for free.",
};

/** The number money is sent to. */
export const BKASH = "01307957682";

/**
 * Stated on the page next to every converted figure, so a reader can check
 * the arithmetic rather than take it on trust. Update it when it drifts.
 */
export const USD_TO_BDT = 121;

export const totalReceived = () =>
  DONATIONS.reduce((sum, d) => sum + d.amount, 0);

export const totalSpent = () => EXPENSES.reduce((sum, e) => sum + e.amount, 0);

/** What is actually sitting there, unspent. */
export const balance = () => totalReceived() - totalSpent();

/** How far along the current goal is, capped so the bar cannot overflow. */
export const goalProgress = () =>
  Math.min(100, GOAL.target === 0 ? 0 : (totalReceived() / GOAL.target) * 100);

export const taka = (n: number) => `৳${n.toLocaleString("en-US")}`;
