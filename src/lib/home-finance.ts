/**
 * Islamic home finance — what the three common structures actually cost.
 *
 * A word about what this file is and is not.
 *
 * It does not compute interest. Each of these is a contract of sale or of
 * partnership, and the money the financier makes is profit on a thing rather
 * than a charge for time on a debt. That distinction is the whole point of the
 * structures, and it is also the thing critics say is cosmetic — so this file
 * takes no position on whether any of them is lawful. Serious scholars
 * disagree, the disagreement is live, and a calculator is not where it gets
 * settled. What it does is show what each one costs, so that the question put
 * to a scholar is a specific one.
 *
 * The three:
 *
 *   Murabaha. The financier buys the house and sells it to you at a disclosed
 *   mark-up, payable in instalments. The price is fixed at the outset and
 *   cannot rise afterwards — not if rates move, not if you are late. Total
 *   cost is known on day one, which no interest-bearing mortgage can promise.
 *
 *   Ijara. The financier buys the house and leases it to you, with the rent
 *   including a portion that buys ownership over the term. Rent is usually
 *   reviewed periodically, so the cost is not fixed.
 *
 *   Diminishing musharakah. You and the financier own the house together. You
 *   pay rent on their share and buy pieces of it back over time; as your share
 *   grows, the rent falls. This is the structure most widely used in the UK
 *   and the US, and the one whose arithmetic differs most from a mortgage —
 *   the payment falls over the term rather than staying level.
 */

export type Structure = "murabaha" | "ijara" | "musharakah";

export interface HomeFinanceInput {
  /** Price of the property. */
  price: number;
  /** What you put in at the start. */
  deposit: number;
  /** Length of the agreement. */
  years: number;
  /**
   * The financier's return, as a yearly percentage of what they have in the
   * property. Called a profit rate or a rental yield depending on the
   * structure; it is not interest, and it is not compounded on arrears.
   */
  rate: number;
  structure: Structure;
}

export interface Payment {
  month: number;
  /** What you pay that month. */
  total: number;
  /** The part that buys ownership. */
  acquisition: number;
  /** The part that is the financier's return. */
  profit: number;
  /** What proportion of the house is yours after this payment. */
  ownedPct: number;
}

export interface HomeFinanceResult {
  structure: Structure;
  financed: number;
  months: number;
  /** First payment. Level for murabaha and ijara, highest for musharakah. */
  firstPayment: number;
  /** Last payment. Only musharakah differs from the first. */
  lastPayment: number;
  totalPaid: number;
  /** Everything above the financed amount — the cost of the arrangement. */
  totalProfit: number;
  schedule: Payment[];
  /** Whether the total is knowable at the outset. */
  fixed: boolean;
  notes: string[];
  invalid: string | null;
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function planHomeFinance(
  input: HomeFinanceInput,
): HomeFinanceResult {
  const price = clean(input.price);
  const deposit = Math.min(clean(input.deposit), price);
  const financed = price - deposit;
  const years = Math.max(0, Math.min(40, clean(input.years)));
  const months = Math.round(years * 12);
  const rate = clean(input.rate) / 100;
  const notes: string[] = [];

  const empty: HomeFinanceResult = {
    structure: input.structure,
    financed,
    months,
    firstPayment: 0,
    lastPayment: 0,
    totalPaid: 0,
    totalProfit: 0,
    schedule: [],
    fixed: input.structure === "murabaha",
    notes,
    invalid: null,
  };

  if (price <= 0 || months <= 0) {
    return { ...empty, invalid: "Enter a price and a term to see the cost." };
  }
  if (financed <= 0) {
    return {
      ...empty,
      invalid:
        "Your deposit covers the whole price, so there is nothing to finance — which is the position every one of these structures exists to get you to.",
    };
  }

  const schedule: Payment[] = [];

  if (input.structure === "musharakah") {
    // You buy the financier's share back in equal instalments, and pay rent on
    // whatever of it they still hold. The rent therefore falls every month and
    // so does the payment — the defining difference from a mortgage, where the
    // payment is level and the split inside it moves instead.
    const acquisition = financed / months;
    let outstanding = financed;

    for (let m = 1; m <= months; m++) {
      const profit = (outstanding * rate) / 12;
      outstanding = Math.max(0, outstanding - acquisition);
      schedule.push({
        month: m,
        total: acquisition + profit,
        acquisition,
        profit,
        ownedPct: ((price - outstanding) / price) * 100,
      });
    }

    notes.push(
      "The payment falls every month. You are buying the financier's share back in equal pieces and paying rent only on what they still hold, so as your share grows the rent shrinks. A mortgage keeps the payment level and moves the split inside it instead — which is why the totals here are not comparable line for line.",
    );
  } else {
    // Murabaha and ijara are both level payments over the term. Murabaha fixes
    // the price at the outset; ijara reviews the rent, so the same arithmetic
    // describes only the first review period.
    const totalProfit = financed * rate * years;
    const total = (financed + totalProfit) / months;
    const acquisition = financed / months;
    const profit = totalProfit / months;
    let outstanding = financed;

    for (let m = 1; m <= months; m++) {
      outstanding = Math.max(0, outstanding - acquisition);
      schedule.push({
        month: m,
        total,
        acquisition,
        profit,
        ownedPct: ((price - outstanding) / price) * 100,
      });
    }

    if (input.structure === "murabaha") {
      notes.push(
        "The price is agreed at the outset and cannot change afterwards — not if rates move, and not if you fall behind. Late payment cannot increase what you owe, since the debt is a fixed sale price rather than a balance accruing charges. That certainty is the structure's main advantage, and it is usually paid for with a higher mark-up than a variable arrangement would quote.",
      );
    } else {
      notes.push(
        "Rent under an ijara is normally reviewed at intervals, often against a published benchmark, so the figure below describes the current period rather than the whole term. Ask the financier how often it is reviewed and what it is reviewed against — that answer, not the headline rate, is what decides the real cost.",
      );
    }
  }

  const totalPaid = schedule.reduce((s, p) => s + p.total, 0);

  return {
    structure: input.structure,
    financed,
    months,
    firstPayment: schedule[0]?.total ?? 0,
    lastPayment: schedule[schedule.length - 1]?.total ?? 0,
    totalPaid,
    totalProfit: totalPaid - financed,
    schedule,
    fixed: input.structure === "murabaha",
    notes,
    invalid: null,
  };
}

/** All three costed on the same figures, for comparison. */
export function compareStructures(
  input: Omit<HomeFinanceInput, "structure">,
): Record<Structure, HomeFinanceResult> {
  return {
    murabaha: planHomeFinance({ ...input, structure: "murabaha" }),
    ijara: planHomeFinance({ ...input, structure: "ijara" }),
    musharakah: planHomeFinance({ ...input, structure: "musharakah" }),
  };
}
