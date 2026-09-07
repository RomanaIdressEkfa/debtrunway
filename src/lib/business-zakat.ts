/**
 * Zakat on a business.
 *
 * The main zakat calculator has one field for business stock, which is fine
 * for someone who sells a few things and wrong for anyone who actually runs
 * a shop. A trading business has stock at three stages, money owed to it,
 * money it owes, and a great deal of property that is not zakatable at all.
 *
 * The line that decides almost everything is old and simple: zakat falls on
 * wealth that turns over, not on the means of turning it. Stock bought to
 * sell is zakatable. The shelves it sits on are not. The van that delivers it
 * is not. The premises are not, however much they are worth. This is the same
 * rule that exempts a home and a craftsman's tools, applied to a business.
 *
 * The two questions where scholars differ are receivables and stage of
 * production, and both are asked rather than assumed.
 */

export const RATE = 0.025;

/** What to do about money owed to the business that may not arrive. */
export type DoubtfulView = "exclude" | "include";

export interface BusinessInput {
  /** Finished goods held for sale, valued at what they would sell for. */
  finishedStock: number;
  /** Raw materials waiting to be worked. */
  rawMaterials: number;
  /** Part-finished goods, at their value as they stand. */
  workInProgress: number;
  /** Cash in the till, the safe and the business accounts. */
  cash: number;
  /** Invoices you expect to be paid. */
  goodReceivables: number;
  /** Invoices you may never collect. */
  doubtfulReceivables: number;
  doubtfulView: DoubtfulView;

  /** Suppliers, wages and bills falling due now. */
  payables: number;

  /** Premises, machinery, vehicles, fittings — recorded, then excluded. */
  fixedAssets: number;
  /** The owner's share, where the business is not wholly theirs. */
  ownershipPct: number;

  /** Threshold in the same currency, from the metal price. */
  nisab: number;
  /** The owner's personal zakatable wealth, since nisab is measured on all. */
  personalWealth: number;
}

export interface BusinessLine {
  label: string;
  amount: number;
  note: string;
  counted: boolean;
}

export interface BusinessResult {
  lines: BusinessLine[];
  /** Everything zakatable, before liabilities. */
  grossAssets: number;
  payables: number;
  /** Assets less liabilities, before the ownership share is applied. */
  netBusiness: number;
  /** The owner's slice of that. */
  ownerShare: number;
  /** Owner's slice plus their personal wealth — what the threshold meets. */
  total: number;
  nisab: number;
  due: boolean;
  zakat: number;
  shortfall: number;
  /** Value recorded and then deliberately left out, with the reason. */
  excluded: { label: string; amount: number; reason: string }[];
  needsNisab: boolean;
  notes: string[];
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const pct = (n: number) =>
  Math.min(100, Math.max(0, Number.isFinite(n) && n > 0 ? n : 100));

export function calculateBusinessZakat(
  input: BusinessInput,
): BusinessResult {
  const notes: string[] = [];
  const excluded: BusinessResult["excluded"] = [];

  const finished = clean(input.finishedStock);
  const raw = clean(input.rawMaterials);
  const wip = clean(input.workInProgress);
  const cash = clean(input.cash);
  const good = clean(input.goodReceivables);
  const doubtful = clean(input.doubtfulReceivables);
  const payables = clean(input.payables);
  const fixed = clean(input.fixedAssets);
  const share = pct(input.ownershipPct);

  const lines: BusinessLine[] = [
    {
      label: "Finished stock",
      amount: finished,
      note: "At what it would sell for today, not what it cost you",
      counted: true,
    },
    {
      label: "Raw materials",
      amount: raw,
      note: "Bought to become goods for sale, so they turn over like stock",
      counted: true,
    },
    {
      label: "Work in progress",
      amount: wip,
      note: "Part-finished goods, valued as they stand",
      counted: true,
    },
    {
      label: "Cash in the business",
      amount: cash,
      note: "Till, safe and business accounts",
      counted: true,
    },
    {
      label: "Invoices you expect to collect",
      amount: good,
      note: "A debt you will be paid is wealth you hold",
      counted: true,
    },
  ].filter((l) => l.amount > 0);

  // Doubtful debts. The cautious position counts them now; the common one
  // waits until the money actually arrives and pays for that year.
  if (doubtful > 0) {
    if (input.doubtfulView === "include") {
      lines.push({
        label: "Doubtful invoices",
        amount: doubtful,
        note: "Counted now, on the cautious view",
        counted: true,
      });
      notes.push(
        "You have chosen to pay on invoices you may not collect. If one is later written off, most scholars allow the zakat paid on it to be set against a later year rather than treated as lost.",
      );
    } else {
      excluded.push({
        label: "Doubtful invoices",
        amount: doubtful,
        reason:
          "Left out until collected. The common position is that a debt you may never recover is not wealth in hand, and zakat is paid for the year it actually arrives.",
      });
    }
  }

  if (fixed > 0) {
    excluded.push({
      label: "Premises, machinery, vehicles and fittings",
      amount: fixed,
      reason:
        "Not zakatable at any value. Zakat falls on wealth that turns over, not on the means of turning it — the same rule that exempts a home and a craftsman's tools. These are only recorded here so the working shows what was set aside and why.",
    });
  }

  const grossAssets = lines.reduce((s, l) => s + l.amount, 0);
  const netBusiness = Math.max(0, grossAssets - payables);
  const ownerShare = netBusiness * (share / 100);
  const personal = clean(input.personalWealth);
  const total = ownerShare + personal;

  const nisab = clean(input.nisab);
  const needsNisab = nisab <= 0;
  const due = !needsNisab && total >= nisab && total > 0;

  if (share < 100) {
    notes.push(
      `The business is treated as ${share}% yours, so that share of its net zakatable wealth is what you owe on. Each partner works out their own zakat on their own share — zakat is an obligation on a person, not on a company.`,
    );
  }

  if (payables > 0) {
    notes.push(
      "Only the liabilities falling due now have been deducted. A long-term loan is not taken off in full, or a business carrying one would owe nothing while its shelves are full — the common position deducts what is payable in the immediate term.",
    );
  }

  return {
    lines,
    grossAssets,
    payables,
    netBusiness,
    ownerShare,
    total,
    nisab,
    due,
    zakat: due ? total * RATE : 0,
    shortfall: !needsNisab && total < nisab ? nisab - total : 0,
    excluded,
    needsNisab,
    notes,
  };
}
