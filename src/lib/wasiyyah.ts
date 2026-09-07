/**
 * Wasiyyah — the part of an estate a Muslim may direct by will.
 *
 * Two limits do almost all the work, and they are limits rather than
 * guidelines:
 *
 *   The third. Sa'd ibn Abi Waqqas asked the Prophet whether he could will
 *   away two thirds of his wealth, then a half. The answer was a third, "and
 *   a third is a lot" — the reason given being that leaving heirs provided for
 *   is better than leaving them to beg. So a third of what survives the debts
 *   is the ceiling, not a target to reach.
 *
 *   No bequest to an heir. "Allah has given each entitled one his due, so
 *   there is no bequest for an heir." An heir already has a fixed share; a
 *   bequest on top of it would let a testator quietly rewrite the shares that
 *   were taken out of their hands. Such a bequest is not void in the sense of
 *   being ignored — it depends on the other heirs agreeing to it after death.
 *
 * What is left after all of that is not the testator's to direct. It goes by
 * faraid, which is what the inheritance calculator works out.
 */

export interface Bequest {
  id: string;
  /** Who it is for — a person, a mosque, a charity. */
  to: string;
  amount: number;
  /** Whether that person would inherit anyway under faraid. */
  isHeir: boolean;
}

export interface WillInput {
  total: number;
  funeral: number;
  /** Every debt, including unpaid zakat, an unpaid mahr, and missed fasts
   *  compensated in money — these are obligations, not bequests. */
  debts: number;
  bequests: Bequest[];
}

export interface BequestOutcome extends Bequest {
  /** What actually takes effect without anyone's permission. */
  binding: number;
  /** The part that only takes effect if the heirs agree. */
  needsConsent: number;
  reason: string;
}

export interface WillResult {
  /** Estate after funeral and debts — everything below is measured on this. */
  net: number;
  /** The ceiling: a third of the net estate. */
  maxBequest: number;
  outcomes: BequestOutcome[];
  /** Bequests to non-heirs, before the third is applied. */
  requestedToNonHeirs: number;
  /** Bequests to heirs, which need consent at any size. */
  requestedToHeirs: number;
  /** What takes effect on its own authority. */
  totalBinding: number;
  /** What waits on the heirs agreeing. */
  totalNeedingConsent: number;
  /** What passes to the heirs by faraid. */
  toHeirs: number;
  /** Non-heir bequests asked for more than a third and were scaled back. */
  overThird: boolean;
  /** Debts swallow the estate: there is nothing to will. */
  insolvent: boolean;
  /** Room still available under the third. */
  unusedThird: number;
  notes: string[];
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function planWill(input: WillInput): WillResult {
  const notes: string[] = [];
  const funeral = clean(input.funeral);
  const debts = clean(input.debts);
  const net = input.total - funeral - debts;

  if (net <= 0) {
    return {
      net: 0,
      maxBequest: 0,
      outcomes: [],
      requestedToNonHeirs: 0,
      requestedToHeirs: 0,
      totalBinding: 0,
      totalNeedingConsent: 0,
      toHeirs: 0,
      overThird: false,
      insolvent: true,
      unusedThird: 0,
      notes: [
        "Funeral costs and debts take the whole estate. A will has nothing to operate on: debts are an obligation on the estate and are paid in full before any bequest, and before any heir receives anything.",
      ],
    };
  }

  const maxBequest = net / 3;

  const list = input.bequests.filter((b) => clean(b.amount) > 0);
  const toHeirsRequested = list
    .filter((b) => b.isHeir)
    .reduce((sum, b) => sum + clean(b.amount), 0);
  const toNonHeirsRequested = list
    .filter((b) => !b.isHeir)
    .reduce((sum, b) => sum + clean(b.amount), 0);

  // The third is spent by the bequests that are valid on their own — those to
  // people who would not otherwise inherit. A bequest to an heir does not get
  // to consume the third ahead of them, since it needs permission regardless.
  const overThird = toNonHeirsRequested > maxBequest + 1e-9;
  const scale = overThird ? maxBequest / toNonHeirsRequested : 1;

  if (overThird) {
    notes.push(
      "The bequests to people who are not heirs come to more than a third of the estate. Everything above the third takes effect only if the heirs agree to it after death, so each of those bequests is shown reduced in the same proportion, with the excess marked as needing consent.",
    );
  }

  if (toHeirsRequested > 0) {
    notes.push(
      "A bequest to someone who already inherits is a separate matter from the third. An heir has a fixed share set out in the Qur'an, and a bequest on top of it would quietly rewrite shares the testator does not control — so it takes effect only if the other heirs agree after death, at any size.",
    );
  }

  const outcomes: BequestOutcome[] = list.map((b) => {
    const amount = clean(b.amount);
    if (b.isHeir) {
      return {
        ...b,
        amount,
        binding: 0,
        needsConsent: amount,
        reason: "Goes to an heir — valid only if the other heirs agree",
      };
    }
    const binding = amount * scale;
    return {
      ...b,
      amount,
      binding,
      needsConsent: amount - binding,
      reason: overThird
        ? "Reduced to fit within the third; the rest needs the heirs to agree"
        : "Within the third, and takes effect on its own",
    };
  });

  const totalBinding = outcomes.reduce((s, o) => s + o.binding, 0);
  const totalNeedingConsent = outcomes.reduce((s, o) => s + o.needsConsent, 0);
  const unusedThird = Math.max(0, maxBequest - totalBinding);

  if (list.length > 0 && !overThird && toHeirsRequested === 0 && unusedThird > 0) {
    notes.push(
      "There is room left under the third. Nothing requires it to be used — the third is a ceiling, and the hadith that sets it calls a third a lot. Leaving it to the heirs is the default the law prefers.",
    );
  }

  return {
    net,
    maxBequest,
    outcomes,
    requestedToNonHeirs: toNonHeirsRequested,
    requestedToHeirs: toHeirsRequested,
    totalBinding,
    totalNeedingConsent,
    toHeirs: net - totalBinding,
    overThird,
    insolvent: false,
    unusedThird,
    notes,
  };
}
