/**
 * Zakat al-Fitr — the charity due at the end of Ramadan.
 *
 * It is not zakat on wealth. There is no nisab, no lunar year and no
 * percentage: it is a fixed measure of staple food, one sa' per person, owed
 * by the head of a household for everyone in it, and it must reach the poor
 * before the Eid prayer to count as zakat al-Fitr rather than ordinary
 * sadaqah.
 *
 * The sa' is a volume, not a weight, so the kilogram figures below are the
 * conversions the contemporary councils publish for each staple. That is why
 * the food matters: a sa' of rice and a sa' of wheat do not weigh the same.
 */

/** A sa' is four mudd. This is what that comes to for each staple. */
export interface Staple {
  key: string;
  label: string;
  /** Kilograms in one sa' of this food. */
  kgPerSaa: number;
  note?: string;
}

export const STAPLES: Staple[] = [
  { key: "rice", label: "Rice", kgPerSaa: 2.4 },
  { key: "wheat", label: "Wheat or flour", kgPerSaa: 2.2 },
  { key: "barley", label: "Barley", kgPerSaa: 2.2 },
  { key: "dates", label: "Dates", kgPerSaa: 2.0 },
  {
    key: "raisins",
    label: "Raisins",
    kgPerSaa: 2.0,
  },
];

/**
 * The Hanafi school permits half a sa' of wheat in place of a full sa', on the
 * basis that wheat was the more valuable staple. It is a real difference in
 * the amount owed, so it is a choice the giver makes rather than a default
 * this file picks for them.
 */
export type Measure = "full" | "halfWheat";

export interface FitrInput {
  /** Everyone the head of the household pays for, including infants. */
  people: number;
  staple: string;
  measure: Measure;
  /** Local price of one kilogram of that staple. */
  pricePerKg: number;
}

export interface FitrResult {
  staple: Staple;
  /** Kilograms owed for one person. */
  kgPerPerson: number;
  totalKg: number;
  /** Money equivalent, when a price was given. */
  perPerson: number;
  total: number;
  people: number;
  /** Half-sa' applies to wheat and its flour only. */
  halfSaaApplies: boolean;
  needsPrice: boolean;
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function calculateFitr(input: FitrInput): FitrResult {
  const staple =
    STAPLES.find((s) => s.key === input.staple) ?? STAPLES[0];

  // The half-sa' concession is about wheat specifically; applying it to rice
  // or dates would halve an amount no school halves.
  const halfSaaApplies =
    input.measure === "halfWheat" && staple.key === "wheat";

  const kgPerPerson = halfSaaApplies ? staple.kgPerSaa / 2 : staple.kgPerSaa;
  const people = Math.max(0, Math.floor(input.people));
  const price = clean(input.pricePerKg);

  return {
    staple,
    kgPerPerson,
    totalKg: kgPerPerson * people,
    perPerson: kgPerPerson * price,
    total: kgPerPerson * price * people,
    people,
    halfSaaApplies,
    needsPrice: price <= 0,
  };
}
