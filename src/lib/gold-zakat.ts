/**
 * Zakat on gold and silver.
 *
 * The main zakat calculator takes a weight and a price. This one exists
 * because a real jewellery box is not a weight: it is a 22-carat bangle, an
 * 18-carat ring and a coin, and the answer turns on two things that a single
 * field cannot express.
 *
 * Purity. Zakat is owed on the gold, not on the alloy it is mixed with. A
 * 22-carat chain weighing 40 grams contains 36.7 grams of gold and 3.3 grams
 * of copper and silver, and only the first is weighed for zakat. Carat is
 * twenty-fourths: 22 carat is 22/24 pure.
 *
 * Whether it is worn. The Hanafi school holds gold and silver zakatable
 * whatever they are used for. The Maliki, Shafi'i and Hanbali schools exempt
 * jewellery a woman wears lawfully and in normal quantity, treating it as
 * something in use rather than wealth stored. This is a live difference in
 * many households and it is not the calculator's place to settle it, so the
 * position is chosen and the consequence is shown.
 */

/** Carat is twenty-fourths of pure gold. */
export const CARATS = [24, 22, 21, 18, 14, 10, 9] as const;
export type Carat = (typeof CARATS)[number];

export const purityOf = (carat: number) => carat / 24;

/** Silver is sold by millesimal fineness rather than carat. */
export const SILVER_GRADES = [
  { key: "999", label: "Fine silver (999)", purity: 0.999 },
  { key: "925", label: "Sterling (925)", purity: 0.925 },
  { key: "800", label: "Continental (800)", purity: 0.8 },
] as const;

export type Metal = "gold" | "silver";
export type Use = "stored" | "worn";

/** Which schools' position on worn jewellery to apply. */
export type School = "hanafi" | "majority";

export interface Item {
  id: string;
  metal: Metal;
  /** Gross weight as it sits on the scale, alloy included. */
  grams: number;
  /** Carat for gold; millesimal purity for silver. */
  purity: number;
  use: Use;
  label: string;
}

export interface ItemResult extends Item {
  /** Weight of the metal itself, once the alloy is taken out. */
  pureGrams: number;
  value: number;
  counted: boolean;
  reason: string;
}

export interface GoldZakatInput {
  items: Item[];
  school: School;
  /** Price of one gram of pure metal, in the giver's currency. */
  goldPricePerGram: number;
  silverPricePerGram: number;
  /** Which nisab to measure against. */
  standard: Metal;
  /** Other zakatable wealth, so the nisab is measured on the whole. */
  otherWealth: number;
}

export interface GoldZakatResult {
  results: ItemResult[];
  /** Pure metal by weight, of what actually counts. */
  countedGoldGrams: number;
  countedSilverGrams: number;
  /** Value of the counted metal. */
  metalValue: number;
  /** Metal plus other wealth — what the threshold is measured against. */
  total: number;
  nisab: number;
  nisabGrams: number;
  due: boolean;
  zakat: number;
  shortfall: number;
  /** Value left out because the school exempts worn jewellery. */
  exemptValue: number;
  /** What the other school's position would have produced. */
  alternativeZakat: number;
  needsPrice: boolean;
}

/** The two thresholds, as weights. */
export const GOLD_NISAB_GRAMS = 87.48;
export const SILVER_NISAB_GRAMS = 612.36;
export const RATE = 0.025;

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

function assess(input: GoldZakatInput, school: School) {
  const gold = clean(input.goldPricePerGram);
  const silver = clean(input.silverPricePerGram);

  let countedGoldGrams = 0;
  let countedSilverGrams = 0;
  let metalValue = 0;
  let exemptValue = 0;

  const results: ItemResult[] = input.items.map((item) => {
    const grams = clean(item.grams);
    const purity = Math.min(1, Math.max(0, item.purity));
    const pureGrams = grams * purity;
    const perGram = item.metal === "gold" ? gold : silver;
    const value = pureGrams * perGram;

    // The only exemption is worn jewellery under the majority position.
    // Bullion, coins and stored jewellery are zakatable on every view.
    const exempt = school === "majority" && item.use === "worn";

    if (exempt) {
      exemptValue += value;
    } else {
      metalValue += value;
      if (item.metal === "gold") countedGoldGrams += pureGrams;
      else countedSilverGrams += pureGrams;
    }

    return {
      ...item,
      grams,
      pureGrams,
      value,
      counted: !exempt,
      reason: exempt
        ? "Worn in normal use — exempt on the Maliki, Shafi'i and Hanbali view"
        : item.use === "worn"
          ? "Worn, but counted — the Hanafi position makes no exception for use"
          : "Stored as wealth, which every school counts",
    };
  });

  return { results, countedGoldGrams, countedSilverGrams, metalValue, exemptValue };
}

export function calculateGoldZakat(input: GoldZakatInput): GoldZakatResult {
  const chosen = assess(input, input.school);
  const other = assess(input, input.school === "hanafi" ? "majority" : "hanafi");

  const perGram =
    input.standard === "gold"
      ? clean(input.goldPricePerGram)
      : clean(input.silverPricePerGram);
  const nisabGrams =
    input.standard === "gold" ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS;
  const nisab = nisabGrams * perGram;

  const otherWealth = clean(input.otherWealth);
  const total = chosen.metalValue + otherWealth;
  const otherTotal = other.metalValue + otherWealth;

  const needsPrice = perGram <= 0;
  const due = !needsPrice && total >= nisab && total > 0;

  return {
    ...chosen,
    total,
    nisab,
    nisabGrams,
    due,
    zakat: due ? total * RATE : 0,
    shortfall: !needsPrice && total < nisab ? nisab - total : 0,
    alternativeZakat:
      !needsPrice && otherTotal >= nisab ? otherTotal * RATE : 0,
    needsPrice,
  };
}
