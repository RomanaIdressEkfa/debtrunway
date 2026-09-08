/**
 * The weights gold and silver are actually bought in.
 *
 * The gram figures for nisab — 87.48g of gold, 612.36g of silver — look like
 * arbitrary decimals in a way that makes people suspect a rounding error. They
 * are not. The classical nisab is 20 dinars of gold and 200 dirhams of silver,
 * which South Asia has recorded for centuries as 7.5 tola and 52.5 tola. The
 * tola is 11.664 grams, and 7.5 x 11.664 is 87.48 exactly.
 *
 * So a jeweller in Dhaka, Karachi or Kolkata weighs in bhori and quotes a price
 * in bhori, and asking that customer for grams makes them do a conversion the
 * page could do for them — and get wrong, since most people reach for 11.66 or
 * 11.7 and the error compounds across a heavy set of jewellery.
 *
 * The unit is the same quantity under three names: bhori in Bangladesh, tola in
 * Pakistan and northern India, and 180 troy grains historically. One tola is
 * sixteen anna (anna), which is how smaller pieces are quoted.
 */

export interface WeightUnit {
  id: string;
  /** Shown in the picker. */
  label: string;
  /** Shown as the field suffix, so it must be short. */
  short: string;
  /** How many grams one of these is. */
  grams: number;
  /** Where the unit is used, for the note under the picker. */
  note: string;
}

/**
 * 11.664 rather than the 11.6638 of the physical tola.
 *
 * The two differ by two parts in a hundred thousand, which is nothing on a
 * bangle, but 11.664 is the figure the fiqh tables are built from — it is what
 * makes 7.5 tola come out at exactly 87.48g. Using the physical value would
 * put the nisab 0.015g away from the number every other source prints, and
 * invite exactly the "your calculator disagrees" email the precision was meant
 * to prevent.
 */
export const GRAMS_PER_TOLA = 11.664;

/** Sixteen anna to the bhori, which is how smaller pieces are quoted. */
export const ANNA_PER_TOLA = 16;

export const WEIGHT_UNITS: WeightUnit[] = [
  {
    id: "g",
    label: "Grams",
    short: "g",
    grams: 1,
    note: "The unit most of the world weighs gold in.",
  },
  {
    id: "tola",
    label: "Bhori / tola",
    short: "bhori",
    grams: GRAMS_PER_TOLA,
    note: "Bangladesh, Pakistan and India. One bhori is 11.664g, and the nisab is 7.5 bhori of gold or 52.5 bhori of silver.",
  },
  {
    id: "anna",
    label: "Anna",
    short: "anna",
    grams: GRAMS_PER_TOLA / ANNA_PER_TOLA,
    note: "Sixteen anna to the bhori — how a jeweller quotes a piece under one bhori.",
  },
  {
    id: "ozt",
    label: "Troy ounce",
    short: "ozt",
    grams: 31.1034768,
    note: "How bullion is priced on the international market.",
  },
];

export const unitById = (id: string): WeightUnit =>
  WEIGHT_UNITS.find((u) => u.id === id) ?? WEIGHT_UNITS[0];

/** A quantity in the chosen unit, as grams. */
export const toGrams = (amount: number, unitId: string): number =>
  amount * unitById(unitId).grams;

/** Grams back into the chosen unit. */
export const fromGrams = (grams: number, unitId: string): number =>
  grams / unitById(unitId).grams;

/**
 * A weight written the way the chosen unit is normally written.
 *
 * Grams get one decimal because a tenth of a gram is a visible amount of gold;
 * bhori and troy ounces get three, because a thousandth of a bhori is about a
 * hundredth of a gram and people compare these figures against a receipt.
 */
export function formatWeight(grams: number, unitId: string): string {
  const u = unitById(unitId);
  const v = fromGrams(grams, unitId);
  const dp = u.id === "g" ? 1 : u.id === "anna" ? 2 : 3;
  const trimmed = Number(v.toFixed(dp)).toLocaleString("en-US", {
    maximumFractionDigits: dp,
  });
  return `${trimmed} ${u.short}`;
}

/**
 * bhori and anna together, as a jeweller says it: "3 bhori 8 anna".
 *
 * Returned only for the tola unit, where the pair is idiomatic. Everywhere
 * else a decimal is what people expect.
 */
export function tolaAndAnna(grams: number): string {
  const total = grams / GRAMS_PER_TOLA;
  const whole = Math.floor(total + 1e-9);
  const anna = (total - whole) * ANNA_PER_TOLA;
  const roundedAnna = Math.round(anna * 10) / 10;
  if (whole === 0) return `${Number(roundedAnna.toFixed(1))} anna`;
  if (roundedAnna < 0.05) return `${whole} bhori`;
  return `${whole} bhori ${Number(roundedAnna.toFixed(1))} anna`;
}

/**
 * The same quantity, rewritten for a different unit.
 *
 * Switching the picker has to keep the metal the same. If a field holding
 * 40 grams simply kept the digits when the unit changed, the box would
 * silently become 40 vori — twelve times the gold — and the answer would be
 * wrong without a single figure on screen looking odd.
 *
 * Anything that is not a positive number is handed back untouched, so a blank
 * field stays blank and a half-typed "1." is not destroyed mid-keystroke.
 */
export function restate(value: string, from: string, to: string): string {
  if (from === to) return value;
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n <= 0) return value;
  const converted = fromGrams(toGrams(n, from), to);
  // Rounded to a tenth of a milligram of actual metal rather than to a fixed
  // number of decimals, so a troy ounce is not held to the same digit count as
  // a gram. A fixed four decimals lost 0.0015g on every pass through the ounce,
  // which stacked if someone flipped the picker back and forth.
  //
  // Trailing zeros are trimmed by Number(), so a weight that lands cleanly
  // still reads cleanly: 87.48g becomes "7.5", not "7.500000".
  const decimals = Math.ceil(Math.log10(unitById(to).grams * 1e4));
  return String(Number(converted.toFixed(Math.max(0, decimals))));
}
