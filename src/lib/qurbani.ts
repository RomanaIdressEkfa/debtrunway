/**
 * Qurbani — the sacrifice of Eid al-Adha.
 *
 * The arithmetic is small and the mistakes are large, and they come from two
 * places.
 *
 * The first is shares. A sheep or a goat is one sacrifice for one person and
 * cannot be divided; a cow, a buffalo or a camel carries seven, and seven is
 * a ceiling rather than a target. People routinely try to put a household of
 * nine into one cow, or assume a goat can be split between a couple. Neither
 * works, and both are found out at the abattoir.
 *
 * The second is who is actually obliged. The Hanafi position makes qurbani
 * wajib on anyone holding the nisab on the days of Eid — the same threshold
 * as zakat, but with no lunar year to wait out, so someone who owes no zakat
 * this year can still owe a qurbani. The other three schools treat it as a
 * confirmed sunnah rather than an obligation. That is a real difference and
 * it is asked for rather than decided here.
 */

export type Animal = "sheep" | "goat" | "cow" | "buffalo" | "camel";

export interface AnimalSpec {
  key: Animal;
  label: string;
  /** How many people one animal can stand for. */
  shares: number;
  /** Minimum age, as the schools generally state it. */
  age: string;
}

export const ANIMALS: AnimalSpec[] = [
  { key: "sheep", label: "Sheep", shares: 1, age: "One year, or a well-grown lamb of six months" },
  { key: "goat", label: "Goat", shares: 1, age: "One full year" },
  { key: "cow", label: "Cow", shares: 7, age: "Two full years" },
  { key: "buffalo", label: "Buffalo", shares: 7, age: "Two full years" },
  { key: "camel", label: "Camel", shares: 7, age: "Five full years" },
];

/** Whether qurbani is treated as an obligation or a confirmed sunnah. */
export type Ruling = "hanafi" | "majority";

export interface QurbaniInput {
  /** People the household is sacrificing for. */
  people: number;
  animal: Animal;
  /** Price of one whole animal. */
  animalPrice: number;
  /** Price of a single share, where a share is bought rather than an animal. */
  sharePrice: number;
  /** Buying whole animals, or shares in one. */
  buyingShares: boolean;
  ruling: Ruling;
  /** Wealth held over the days of Eid, for the Hanafi threshold. */
  wealth: number;
  nisab: number;
}

export interface QurbaniResult {
  spec: AnimalSpec;
  /** Whole animals needed to cover everyone. */
  animals: number;
  /** Shares taken, where shares are being bought. */
  shares: number;
  /** Places paid for but not used — a cow bought for four people has three. */
  sparePlaces: number;
  cost: number;
  costPerPerson: number;
  /** Whether the animal can be shared at all. */
  divisible: boolean;
  /** True when the Hanafi threshold is met, or the school makes it a sunnah. */
  obliged: boolean;
  rulingNote: string;
  /** The meat, divided the way the sunnah recommends. */
  thirds: { label: string; note: string }[];
  needsPrice: boolean;
  notes: string[];
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const whole = (n: number) => Math.max(0, Math.floor(clean(n)));

export function planQurbani(input: QurbaniInput): QurbaniResult {
  const spec = ANIMALS.find((a) => a.key === input.animal) ?? ANIMALS[0];
  const people = Math.max(1, whole(input.people));
  const notes: string[] = [];

  const divisible = spec.shares > 1;

  // Buying shares only makes sense in an animal that carries several.
  const buyingShares = input.buyingShares && divisible;

  const animals = buyingShares ? 0 : Math.ceil(people / spec.shares);
  const shares = buyingShares ? people : 0;
  const placesBought = buyingShares ? people : animals * spec.shares;
  const sparePlaces = placesBought - people;

  const animalPrice = clean(input.animalPrice);
  const sharePrice = clean(input.sharePrice);
  const cost = buyingShares ? shares * sharePrice : animals * animalPrice;
  const needsPrice = buyingShares ? sharePrice <= 0 : animalPrice <= 0;

  if (!divisible && people > 1) {
    notes.push(
      `A ${spec.label.toLowerCase()} stands for one person and cannot be divided, so ${people} people need ${people} of them. Only a cow, a buffalo or a camel can be shared, and then between no more than seven.`,
    );
  }

  if (sparePlaces > 0 && !buyingShares) {
    notes.push(
      `The ${animals === 1 ? "animal" : "animals"} you are buying carry ${placesBought} places and you need ${people}, so ${sparePlaces} would go unused. Those places can be sold or given to others who intend a qurbani — a share left empty is simply paid for and wasted, not stored for next year.`,
    );
  }

  // The Hanafi threshold is the zakat nisab measured on the days of Eid, with
  // no lunar year required.
  const nisab = clean(input.nisab);
  const wealth = clean(input.wealth);
  const meetsNisab = nisab > 0 && wealth >= nisab;
  const obliged = input.ruling === "hanafi" ? meetsNisab : true;

  const rulingNote =
    input.ruling === "hanafi"
      ? meetsNisab
        ? "Wajib on you. On the Hanafi view qurbani is obligatory for anyone holding the nisab on the days of Eid — and unlike zakat there is no lunar year to wait out, so this can fall due in a year you owe no zakat at all."
        : nisab > 0
          ? "Not obligatory on the Hanafi view, since your wealth is below the nisab over the days of Eid. It remains a great and recommended act if you are able."
          : "Enter your wealth and a metal price to see whether the Hanafi threshold is met."
      : "A confirmed sunnah — sunnah mu'akkadah — on the Maliki, Shafi'i and Hanbali views: strongly urged on anyone able to afford it, without being an obligation whose omission is sinful.";

  const thirds = [
    {
      label: "Your household",
      note: "Keeping a third for the family is expressly permitted, and there is no virtue in going hungry on Eid.",
    },
    {
      label: "Relatives, neighbours and friends",
      note: "Given whether or not they are in need — this share is about the bond, not the charity.",
    },
    {
      label: "The poor",
      note: "The share the sacrifice exists for. Where it is given through a charity abroad, it should reach people before the days of Eid are out.",
    },
  ];

  notes.push(
    "The division into thirds is the recommended practice rather than a fixed obligation. Giving more away is better; keeping more is permitted.",
  );

  return {
    spec,
    animals,
    shares,
    sparePlaces,
    cost,
    costPerPerson: people > 0 ? cost / people : 0,
    divisible,
    obliged,
    rulingNote,
    thirds,
    needsPrice,
    notes,
  };
}
