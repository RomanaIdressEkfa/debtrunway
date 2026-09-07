/**
 * Faraid — the fixed shares of Islamic inheritance (mirath).
 *
 * This implements the majority Sunni position as set out in the standard
 * texts: the Qur'anic fixed shares (furud) of Surah an-Nisa 4:11, 4:12 and
 * 4:176, the residuary heirs (asaba) who take what is left, the blocking
 * rules (hajb) that remove an heir when a nearer one stands in the way, and
 * the two corrections — awl when the shares overflow the estate, radd when
 * they fall short of it.
 *
 * It is a calculator, not a fatwa. Real estates carry facts this cannot see:
 * a disputed or missing heir, an unborn child, an heir who died in the same
 * event, jointly owned property, contested debts, or a school of law that
 * differs on a point. Every result here is meant to be taken to a qualified
 * scholar, not acted on alone.
 */

// ---------- exact fractions ----------
//
// Every share in faraid is a half, third, quarter, sixth or eighth, and the
// whole system turns on them summing to exactly one. In floating point 1/3 is
// 0.3333… and 1/6 + 1/6 + 2/3 lands at 0.9999999999999999, so radd would fire
// on estates that are in fact exact. Shares are therefore kept as integer
// pairs, which also lets the page print "1/6" the way the books write it
// rather than a decimal nobody can check against a text.

export interface Frac {
  n: number;
  d: number;
}

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

export const frac = (n: number, d = 1): Frac => {
  if (d === 0) return { n: 0, d: 1 };
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  return { n: n / g, d: d / g };
};

const add = (a: Frac, b: Frac) => frac(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Frac, b: Frac) => frac(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Frac, b: Frac) => frac(a.n * b.n, a.d * b.d);
const div = (a: Frac, b: Frac) => frac(a.n * b.d, a.d * b.n);
/** Positive when a is the larger share. */
const cmp = (a: Frac, b: Frac) => a.n * b.d - b.n * a.d;

export const isZero = (f: Frac) => f.n === 0;
export const toNumber = (f: Frac) => f.n / f.d;
/** "1/6", "2/3", "1" — the form the texts use. */
export const fracLabel = (f: Frac) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);

const SIXTH = frac(1, 6);
const THIRD = frac(1, 3);
const HALF = frac(1, 2);
const QUARTER = frac(1, 4);
const EIGHTH = frac(1, 8);
const TWO_THIRDS = frac(2, 3);
const ONE = frac(1, 1);
const ZERO = frac(0, 1);

// ---------- who survived ----------

export interface Heirs {
  /** A widow inherits from her husband, a widower from his wife. */
  husband: boolean;
  /** Up to four wives divide a single portion between them. */
  wives: number;
  father: boolean;
  mother: boolean;
  /** Father's father. Stands in the father's place when the father is gone. */
  paternalGrandfather: boolean;
  /** Father's mother. */
  paternalGrandmother: boolean;
  /** Mother's mother. */
  maternalGrandmother: boolean;
  sons: number;
  daughters: number;
  /** Son's sons. */
  grandsons: number;
  /** Son's daughters. */
  granddaughters: number;
  /** Same father and mother. */
  fullBrothers: number;
  fullSisters: number;
  /** Same father only. */
  paternalBrothers: number;
  paternalSisters: number;
  /** Same mother only — the one group where male and female take equally. */
  maternalSiblings: number;
}

export const emptyHeirs = (): Heirs => ({
  husband: false,
  wives: 0,
  father: false,
  mother: false,
  paternalGrandfather: false,
  paternalGrandmother: false,
  maternalGrandmother: false,
  sons: 0,
  daughters: 0,
  grandsons: 0,
  granddaughters: 0,
  fullBrothers: 0,
  fullSisters: 0,
  paternalBrothers: 0,
  paternalSisters: 0,
  maternalSiblings: 0,
});

// ---------- what comes out ----------

export interface Award {
  key: string;
  label: string;
  count: number;
  /** The group's combined share of the distributable estate. */
  share: Frac;
  /** What one person in the group receives. */
  each: Frac;
  amount: number;
  eachAmount: number;
  basis: "fixed" | "residue" | "fixed+residue";
  /** Plain-language reason, shown beside the figure. */
  reason: string;
}

export interface Blocked {
  label: string;
  /** The nearer heir who stands in the way. */
  by: string;
}

export interface Estate {
  /** Everything owned at death, before anything is taken out. */
  total: number;
  funeral: number;
  debts: number;
  /** Wasiyyah — binding only up to a third, and only to a non-heir. */
  bequest: number;
}

export interface FaraidResult {
  /** What is left for the heirs after funeral, debts and bequest. */
  distributable: number;
  funeral: number;
  debts: number;
  bequest: number;
  awards: Award[];
  blocked: Blocked[];
  /** Shares overflowed the estate and were scaled down together. */
  awl: boolean;
  /** Shares fell short and the surplus returned to the sharers. */
  radd: boolean;
  /** Sum of the fixed shares before any correction — 7/6 in an awl case. */
  totalBefore: Frac;
  /** Nobody who could inherit was entered. */
  empty: boolean;
  /** The bequest was cut back to one third. */
  bequestCapped: boolean;
  /** Debts swallow the estate; there is nothing to divide. */
  insolvent: boolean;
  notes: string[];
}

/**
 * Divides a group's share two parts to one between males and females.
 *
 * This is the ratio named in 4:11. It sits in a law that also puts the whole
 * burden of maintaining a household on the man and none of it on the woman,
 * whose share stays hers.
 */
const splitByGender = (share: Frac, males: number, females: number) => {
  const parts = males * 2 + females;
  return {
    perMale: parts ? mul(share, frac(2, parts)) : ZERO,
    perFemale: parts ? mul(share, frac(1, parts)) : ZERO,
  };
};

export function distribute(estate: Estate, heirs: Heirs): FaraidResult {
  const notes: string[] = [];
  const blocked: Blocked[] = [];

  // --- 1. What is actually divisible -------------------------------------
  // The order is settled and not negotiable: burial, then debts, then the
  // bequest, and only then the heirs.
  const funeral = Math.max(0, estate.funeral);
  const debts = Math.max(0, estate.debts);
  const afterDebts = estate.total - funeral - debts;

  if (afterDebts <= 0) {
    return {
      distributable: 0,
      funeral,
      debts,
      bequest: 0,
      awards: [],
      blocked: [],
      awl: false,
      radd: false,
      totalBefore: ZERO,
      empty: false,
      bequestCapped: false,
      insolvent: true,
      notes: [
        "Funeral costs and debts take the whole estate, so there is nothing left to divide. Debts are settled before anyone inherits — heirs receive only what survives them.",
      ],
    };
  }

  // A bequest binds only up to a third of what remains after debts. Past that
  // it depends on the heirs agreeing, so the calculator caps it and says so.
  const cap = afterDebts / 3;
  const wanted = Math.max(0, estate.bequest);
  const bequestCapped = wanted > cap + 1e-9;
  const bequest = Math.min(wanted, cap);
  if (bequestCapped) {
    notes.push(
      "A bequest is valid only up to one third of what remains after debts. The amount above that third has been left with the heirs, since it binds only if they agree to it.",
    );
  }

  const distributable = afterDebts - bequest;

  // --- 2. Blocking (hajb) -------------------------------------------------
  const sons = Math.max(0, heirs.sons);
  const daughters = Math.max(0, heirs.daughters);
  const wives = Math.min(4, Math.max(0, heirs.wives));

  // A son shuts out his own nephews and nieces: son's children inherit only
  // through a son who is no longer alive.
  const grandsons = sons > 0 ? 0 : Math.max(0, heirs.grandsons);
  let granddaughters = sons > 0 ? 0 : Math.max(0, heirs.granddaughters);
  if (sons > 0 && (heirs.grandsons > 0 || heirs.granddaughters > 0)) {
    blocked.push({ label: "Son's children", by: "a son of the deceased" });
  }
  // Two daughters already take the entire two thirds set aside for daughters,
  // so son's daughters get nothing — unless a son's son is present to bring
  // them in as residuaries beside him.
  if (daughters >= 2 && grandsons === 0 && granddaughters > 0) {
    blocked.push({
      label: "Son's daughters",
      by: "two or more daughters, who take the full two thirds",
    });
    granddaughters = 0;
  }

  const hasMaleDescendant = sons > 0 || grandsons > 0;
  const hasDescendant =
    sons > 0 || daughters > 0 || grandsons > 0 || granddaughters > 0;

  const father = heirs.father;
  // The grandfather steps into an absent father's place throughout.
  const grandfather = !father && heirs.paternalGrandfather;
  if (father && heirs.paternalGrandfather) {
    blocked.push({ label: "Paternal grandfather", by: "the father" });
  }

  const mother = heirs.mother;
  // A mother shuts out every grandmother; a father shuts out his own mother.
  let paternalGrandmother = heirs.paternalGrandmother;
  if (paternalGrandmother && mother) {
    blocked.push({ label: "Paternal grandmother", by: "the mother" });
    paternalGrandmother = false;
  } else if (paternalGrandmother && father) {
    blocked.push({ label: "Paternal grandmother", by: "the father" });
    paternalGrandmother = false;
  }
  let maternalGrandmother = heirs.maternalGrandmother;
  if (maternalGrandmother && mother) {
    blocked.push({ label: "Maternal grandmother", by: "the mother" });
    maternalGrandmother = false;
  }

  // Maternal half-siblings are cut out by any child or grandchild, and by the
  // father or the grandfather.
  const maternalBlocker = hasDescendant
    ? "a child or grandchild"
    : father
      ? "the father"
      : grandfather
        ? "the paternal grandfather"
        : "";
  const maternalSiblings = maternalBlocker
    ? 0
    : Math.max(0, heirs.maternalSiblings);
  if (maternalBlocker && heirs.maternalSiblings > 0) {
    blocked.push({ label: "Maternal half-siblings", by: maternalBlocker });
  }

  // Full siblings are cut out by a son, a son's son, or the father.
  const fullBlocker = hasMaleDescendant
    ? "a son or son's son"
    : father
      ? "the father"
      : "";
  const fullBrothers = fullBlocker ? 0 : Math.max(0, heirs.fullBrothers);
  const fullSisters = fullBlocker ? 0 : Math.max(0, heirs.fullSisters);
  if (fullBlocker && (heirs.fullBrothers > 0 || heirs.fullSisters > 0)) {
    blocked.push({ label: "Full siblings", by: fullBlocker });
  }

  // A full sister standing beside a daughter becomes residuary, and in that
  // position she shuts out the paternal half-siblings just as a brother would.
  const sisterTakesResidue =
    fullSisters > 0 && fullBrothers === 0 && hasDescendant;

  const paternalBlocker = fullBlocker
    ? fullBlocker
    : fullBrothers > 0
      ? "a full brother"
      : sisterTakesResidue
        ? "a full sister inheriting beside a daughter"
        : "";
  const paternalBrothers = paternalBlocker
    ? 0
    : Math.max(0, heirs.paternalBrothers);
  const paternalSisters = paternalBlocker
    ? 0
    : Math.max(0, heirs.paternalSisters);
  if (
    paternalBlocker &&
    (heirs.paternalBrothers > 0 || heirs.paternalSisters > 0)
  ) {
    blocked.push({ label: "Paternal half-siblings", by: paternalBlocker });
  }

  // The "two or more siblings" that cut the mother down to a sixth are counted
  // as they stand, including siblings who are themselves blocked from taking
  // anything. Their presence is what matters, not their share.
  const siblingHeadcount =
    Math.max(0, heirs.fullBrothers) +
    Math.max(0, heirs.fullSisters) +
    Math.max(0, heirs.paternalBrothers) +
    Math.max(0, heirs.paternalSisters) +
    Math.max(0, heirs.maternalSiblings);

  // --- 3. The fixed shares (furud) ----------------------------------------
  interface Slot {
    key: string;
    label: string;
    count: number;
    share: Frac;
    reason: string;
    /** A spouse takes no part in radd. */
    noRadd?: boolean;
  }

  const fixed: Slot[] = [];

  if (heirs.husband) {
    fixed.push({
      key: "husband",
      label: "Husband",
      count: 1,
      share: hasDescendant ? QUARTER : HALF,
      reason: hasDescendant
        ? "One quarter — his wife left a child"
        : "One half — no child or grandchild",
      noRadd: true,
    });
  }
  if (wives > 0) {
    fixed.push({
      key: "wives",
      label: wives > 1 ? "Wives" : "Wife",
      count: wives,
      share: hasDescendant ? EIGHTH : QUARTER,
      reason: hasDescendant
        ? wives > 1
          ? "One eighth, divided equally between them — their husband left a child"
          : "One eighth — her husband left a child"
        : wives > 1
          ? "One quarter, divided equally between them — no child or grandchild"
          : "One quarter — no child or grandchild",
      noRadd: true,
    });
  }

  if (mother) {
    const toSixth = hasDescendant || siblingHeadcount >= 2;
    fixed.push({
      key: "mother",
      label: "Mother",
      count: 1,
      share: toSixth ? SIXTH : THIRD,
      reason: hasDescendant
        ? "One sixth — her child left children of their own"
        : siblingHeadcount >= 2
          ? "One sixth — two or more siblings survive"
          : "One third — no child, and fewer than two siblings",
    });
  }

  if (!mother && (paternalGrandmother || maternalGrandmother)) {
    const count = (paternalGrandmother ? 1 : 0) + (maternalGrandmother ? 1 : 0);
    fixed.push({
      key: "grandmothers",
      label: count > 1 ? "Grandmothers" : "Grandmother",
      count,
      share: SIXTH,
      reason:
        count > 1
          ? "One sixth, divided equally between them, in the mother's place"
          : "One sixth, in the mother's place",
    });
  }

  // The father takes a sixth when a son survives; a sixth plus the remainder
  // when only daughters do; and the entire residue when no child survives at
  // all — that last case is handled with the residuaries below.
  if (father || grandfather) {
    const label = father ? "Father" : "Paternal grandfather";
    const key = father ? "father" : "grandfather";
    if (hasMaleDescendant) {
      fixed.push({
        key,
        label,
        count: 1,
        share: SIXTH,
        reason: "One sixth — a son or son's son takes the residue",
      });
    } else if (hasDescendant) {
      fixed.push({
        key,
        label,
        count: 1,
        share: SIXTH,
        reason: "One sixth as a fixed share, plus whatever is left over",
      });
    }
  }

  if (maternalSiblings > 0) {
    fixed.push({
      key: "maternal",
      label:
        maternalSiblings > 1
          ? "Maternal half-siblings"
          : "Maternal half-sibling",
      count: maternalSiblings,
      share: maternalSiblings === 1 ? SIXTH : THIRD,
      reason:
        maternalSiblings === 1
          ? "One sixth"
          : "One third, divided equally — brothers and sisters alike",
    });
  }

  // Daughters hold a fixed share on their own and become residuary beside a
  // son, where the two-to-one ratio applies instead.
  if (daughters > 0 && sons === 0) {
    fixed.push({
      key: "daughters",
      label: daughters > 1 ? "Daughters" : "Daughter",
      count: daughters,
      share: daughters === 1 ? HALF : TWO_THIRDS,
      reason:
        daughters === 1
          ? "One half — an only daughter, with no son"
          : "Two thirds, divided equally — two or more daughters, with no son",
    });
  }

  // Son's daughters take a daughter's share when no daughter survives, and the
  // sixth that tops up a single daughter's half to the full two thirds.
  if (granddaughters > 0 && grandsons === 0) {
    const label =
      granddaughters > 1 ? "Son's daughters" : "Son's daughter";
    if (daughters === 1) {
      fixed.push({
        key: "granddaughters",
        label,
        count: granddaughters,
        share: SIXTH,
        reason:
          "One sixth, completing the two thirds set aside for the daughters",
      });
    } else if (daughters === 0) {
      fixed.push({
        key: "granddaughters",
        label,
        count: granddaughters,
        share: granddaughters === 1 ? HALF : TWO_THIRDS,
        reason:
          granddaughters === 1
            ? "One half, standing in a daughter's place"
            : "Two thirds, divided equally, standing in the daughters' place",
      });
    }
  }

  // Full sisters, with no brother and no child and no father in the way, take
  // a sister's fixed share outright. Beside a daughter they take the residue
  // instead, which is handled below.
  if (
    fullSisters > 0 &&
    fullBrothers === 0 &&
    !hasDescendant &&
    !father &&
    !grandfather
  ) {
    fixed.push({
      key: "fullSisters",
      label: fullSisters > 1 ? "Full sisters" : "Full sister",
      count: fullSisters,
      share: fullSisters === 1 ? HALF : TWO_THIRDS,
      reason:
        fullSisters === 1
          ? "One half — an only full sister"
          : "Two thirds, divided equally",
    });
  }

  if (
    paternalSisters > 0 &&
    paternalBrothers === 0 &&
    !hasDescendant &&
    !father &&
    !grandfather &&
    fullSisters === 0
  ) {
    fixed.push({
      key: "paternalSisters",
      label:
        paternalSisters > 1 ? "Paternal half-sisters" : "Paternal half-sister",
      count: paternalSisters,
      share: paternalSisters === 1 ? HALF : TWO_THIRDS,
      reason:
        paternalSisters === 1
          ? "One half — an only paternal half-sister"
          : "Two thirds, divided equally",
    });
  }

  // --- 4. The Umariyyatan --------------------------------------------------
  // Spouse and both parents, nobody else: the mother's third is measured
  // against what is left after the spouse, not against the whole estate. Two
  // rulings of Umar ibn al-Khattab that the majority of scholars follow.
  const onlyParentsAndSpouse =
    mother &&
    father &&
    !hasDescendant &&
    siblingHeadcount === 0 &&
    (heirs.husband || wives > 0);

  if (onlyParentsAndSpouse) {
    const spouse = fixed.find((s) => s.key === "husband" || s.key === "wives");
    const mum = fixed.find((s) => s.key === "mother");
    if (spouse && mum) {
      mum.share = mul(sub(ONE, spouse.share), THIRD);
      mum.reason = `One third of what is left after the ${
        heirs.husband ? "husband" : "wife"
      } — the case decided by Umar ibn al-Khattab`;
      notes.push(
        "With only a spouse and both parents surviving, the mother takes a third of what remains after the spouse rather than a third of the whole estate. This is the ruling of Umar ibn al-Khattab, followed by the majority of scholars.",
      );
    }
  }

  let totalFixed = fixed.reduce((sum, s) => add(sum, s.share), ZERO);
  const totalBefore = totalFixed;

  // --- 5. The residue (asaba) ----------------------------------------------
  // Whatever the fixed shares leave passes to the nearest line, sons first.
  // Daughters and sisters join that group where the texts place them.
  let residue = sub(ONE, totalFixed);
  if (residue.n < 0) residue = ZERO;

  interface ResidueGroup {
    key: string;
    males: number;
    females: number;
    maleLabel: string;
    femaleLabel: string;
    reason: string;
  }

  let group: ResidueGroup | null = null;

  if (sons > 0) {
    group = {
      key: "children",
      males: sons,
      females: daughters,
      maleLabel: sons > 1 ? "Sons" : "Son",
      femaleLabel: daughters > 1 ? "Daughters" : "Daughter",
      reason: "Everything the fixed shares leave behind",
    };
  } else if (grandsons > 0) {
    group = {
      key: "grandchildren",
      males: grandsons,
      females: granddaughters,
      maleLabel: grandsons > 1 ? "Son's sons" : "Son's son",
      femaleLabel: granddaughters > 1 ? "Son's daughters" : "Son's daughter",
      reason: "Everything the fixed shares leave behind",
    };
  } else if (sisterTakesResidue) {
    group = {
      key: "fullSisters",
      males: 0,
      females: fullSisters,
      maleLabel: "",
      femaleLabel: fullSisters > 1 ? "Full sisters" : "Full sister",
      reason: "What remains once the daughters have taken their share",
    };
  } else if ((father || grandfather) && !hasDescendant) {
    group = {
      key: father ? "father" : "grandfather",
      males: 1,
      females: 0,
      maleLabel: father ? "Father" : "Paternal grandfather",
      femaleLabel: "",
      reason: "Everything the fixed shares leave behind",
    };
  } else if (father || grandfather) {
    // He already holds a sixth; the remainder is folded into it below.
    group = null;
  } else if (fullBrothers > 0) {
    group = {
      key: "fullSiblings",
      males: fullBrothers,
      females: fullSisters,
      maleLabel: fullBrothers > 1 ? "Full brothers" : "Full brother",
      femaleLabel: fullSisters > 1 ? "Full sisters" : "Full sister",
      reason: "Everything the fixed shares leave behind",
    };
  } else if (paternalBrothers > 0) {
    group = {
      key: "paternalSiblings",
      males: paternalBrothers,
      females: paternalSisters,
      maleLabel:
        paternalBrothers > 1
          ? "Paternal half-brothers"
          : "Paternal half-brother",
      femaleLabel:
        paternalSisters > 1 ? "Paternal half-sisters" : "Paternal half-sister",
      reason: "Everything the fixed shares leave behind",
    };
  }

  // A father holding his sixth beside daughters also sweeps up the remainder.
  const fatherSlot = fixed.find(
    (s) => s.key === "father" || s.key === "grandfather",
  );
  const fatherTakesRemainder =
    !group && !!fatherSlot && hasDescendant && !hasMaleDescendant && residue.n > 0;

  // --- 6. Awl and radd ------------------------------------------------------
  let awl = false;
  let radd = false;

  if (cmp(totalFixed, ONE) > 0) {
    // The shares between them ask for more than the estate holds. Under awl
    // every share shrinks in the same proportion: the denominator rises and
    // nobody is singled out to bear the shortfall.
    awl = true;
    const scale = div(ONE, totalFixed);
    for (const s of fixed) s.share = mul(s.share, scale);
    totalFixed = ONE;
    residue = ZERO;
    notes.push(
      `The fixed shares come to ${fracLabel(totalBefore)} of the estate — more than the whole of it. Under awl each share is reduced in the same proportion, so every heir receives a little less than the named fraction while the ratio between them is untouched.`,
    );
  } else if (
    !group &&
    !fatherTakesRemainder &&
    residue.n > 0 &&
    fixed.length > 0
  ) {
    const eligible = fixed.filter((s) => !s.noRadd);
    if (eligible.length > 0) {
      radd = true;
      const base = eligible.reduce((sum, s) => add(sum, s.share), ZERO);
      for (const s of eligible) {
        s.share = add(s.share, mul(residue, div(s.share, base)));
      }
      residue = ZERO;
      notes.push(
        "The fixed shares do not use up the estate and no residuary heir survives to take the rest. Under radd the surplus goes back to the sharers in proportion to what each already holds. On the majority view a surviving spouse takes no part in that return.",
      );
    } else {
      notes.push(
        "The only heir entered holds a fixed share, and a spouse does not receive the surplus by radd. What is left passes to the wider family, and failing that to the public treasury — a question to put to a scholar on the facts of the estate.",
      );
    }
  }

  // --- 7. Build the table ---------------------------------------------------
  const awards: Award[] = [];
  const push = (
    key: string,
    label: string,
    count: number,
    share: Frac,
    basis: Award["basis"],
    reason: string,
  ) => {
    if (isZero(share) || count <= 0) return;
    const each = frac(share.n, share.d * count);
    awards.push({
      key,
      label,
      count,
      share,
      each,
      amount: toNumber(share) * distributable,
      eachAmount: toNumber(each) * distributable,
      basis,
      reason,
    });
  };

  for (const s of fixed) {
    if ((s.key === "father" || s.key === "grandfather") && fatherTakesRemainder) {
      push(
        s.key,
        s.label,
        1,
        add(s.share, residue),
        "fixed+residue",
        `One sixth as a fixed share, plus the ${fracLabel(residue)} the others leave behind`,
      );
      residue = ZERO;
      continue;
    }
    push(s.key, s.label, s.count, s.share, "fixed", s.reason);
  }

  if (group && residue.n > 0) {
    const { perMale, perFemale } = splitByGender(
      residue,
      group.males,
      group.females,
    );
    if (group.males > 0) {
      push(
        `${group.key}-m`,
        group.maleLabel,
        group.males,
        mul(perMale, frac(group.males)),
        "residue",
        group.females > 0
          ? "Two shares of the remainder to each son for every one to a daughter"
          : group.reason,
      );
    }
    if (group.females > 0) {
      push(
        `${group.key}-f`,
        group.femaleLabel,
        group.females,
        mul(perFemale, frac(group.females)),
        "residue",
        group.males > 0
          ? "One share of the remainder to each daughter for every two to a son"
          : group.reason,
      );
    }
  }

  // Largest first, so the table reads as a ranking rather than a form order.
  awards.sort((a, b) => toNumber(b.share) - toNumber(a.share));

  return {
    distributable,
    funeral,
    debts,
    bequest,
    awards,
    blocked,
    awl,
    radd,
    totalBefore,
    empty: awards.length === 0,
    bequestCapped,
    insolvent: false,
    notes,
  };
}
