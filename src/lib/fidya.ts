/**
 * Fidya and kaffarah — what is owed for fasts of Ramadan not kept.
 *
 * Three different things get called by each other's names constantly, and
 * conflating them is how people end up paying for days they should have
 * fasted, or fasting sixty days for something that needed none. They are:
 *
 *   Qada — making the fast up. A day missed for illness, travel,
 *   menstruation or pregnancy is repaid by fasting another day. Nothing is
 *   owed in money. This is the ordinary case and it covers most missed days.
 *
 *   Fidya — feeding a poor person for each day, owed only by someone who
 *   cannot fast and will not be able to: chronic illness with no prospect of
 *   recovery, or old age. It is a substitute for the fast, not a way of
 *   buying out of one that could still be kept.
 *
 *   Kaffarah — expiation for deliberately breaking a fast of Ramadan without
 *   an excuse. Sixty consecutive days of fasting, or, for someone genuinely
 *   unable, feeding sixty poor people. It is far heavier than fidya on
 *   purpose, and it does not replace the qada: the day is still made up.
 *
 * The fourth question — a fast delayed past the following Ramadan — is where
 * the schools split, so the position is asked for rather than assumed.
 */

/** Half a sa' of wheat, the measure most often quoted for one day's fidya. */
export const HALF_SAA_WHEAT_KG = 1.75;

/** Kaffarah feeds sixty, where fasting sixty days is not possible. */
export const KAFFARAH_PEOPLE = 60;
export const KAFFARAH_DAYS = 60;

/** How the per-day amount is arrived at. */
export type RateMethod = "published" | "weight";

/**
 * Whether a fast delayed past the next Ramadan carries fidya on top of the
 * qada. The Hanafi position is that it does not; the other three hold that it
 * does, one feeding per day, and the make-up is still owed either way.
 */
export type DelayView = "hanafi" | "majority";

export interface FidyaInput {
  /** Missed for a reason that has passed — repaid by fasting. */
  makeUpDays: number;
  /** Missed with no prospect of ever fasting them. */
  fidyaDays: number;
  /** Deliberately broken without an excuse. */
  kaffarahDays: number;
  /** Of the make-up days, how many are already past a Ramadan. */
  delayedDays: number;
  delayView: DelayView;

  rateMethod: RateMethod;
  /** Money for one day's feeding, where a mosque publishes a figure. */
  publishedRate: number;
  /** Local price of a kilogram of wheat, for the weight method. */
  wheatPricePerKg: number;
  /** Whether the person owing kaffarah is able to fast sixty days. */
  canFastSixty: boolean;
}

export interface FidyaLine {
  label: string;
  detail: string;
  /** Money owed, or zero where the duty is a fast rather than a payment. */
  amount: number;
  /** Days of fasting owed, where that is the duty. */
  fasts: number;
}

export interface FidyaResult {
  /** Money for one day's feeding, however it was arrived at. */
  perDay: number;
  lines: FidyaLine[];
  totalMoney: number;
  totalFasts: number;
  /** Fidya added because a make-up was delayed past a Ramadan. */
  delayFidya: number;
  needsRate: boolean;
  notes: string[];
}

const clean = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);
const days = (n: number) => Math.max(0, Math.floor(clean(n)));

export function calculateFidya(input: FidyaInput): FidyaResult {
  const notes: string[] = [];

  const perDay =
    input.rateMethod === "published"
      ? clean(input.publishedRate)
      : HALF_SAA_WHEAT_KG * clean(input.wheatPricePerKg);

  const makeUp = days(input.makeUpDays);
  const fidyaDays = days(input.fidyaDays);
  const kaffarahDays = days(input.kaffarahDays);
  // A delay cannot apply to more days than are actually being made up.
  const delayed = Math.min(days(input.delayedDays), makeUp);

  const lines: FidyaLine[] = [];

  if (makeUp > 0) {
    lines.push({
      label: "Fasts to make up",
      detail:
        "Missed for a reason that has passed — illness, travel, menstruation, pregnancy. Repaid by fasting, not by paying.",
      amount: 0,
      fasts: makeUp,
    });
  }

  if (fidyaDays > 0) {
    lines.push({
      label: "Fidya",
      detail: `${fidyaDays} ${fidyaDays === 1 ? "day" : "days"} that cannot be fasted, at one person fed per day`,
      amount: fidyaDays * perDay,
      fasts: 0,
    });
    notes.push(
      "Fidya is for someone who cannot fast and will not be able to — chronic illness with no prospect of recovery, or old age. It is not a way of paying for a fast that could still be kept later. Where the fast can be made up, it must be.",
    );
  }

  // A delayed make-up carries fidya on three of the four schools. The fast is
  // still owed either way, so this adds money without removing a fast.
  const delayFidya =
    input.delayView === "majority" ? delayed * perDay : 0;

  if (delayed > 0) {
    lines.push({
      label: "Delayed past a Ramadan",
      detail:
        input.delayView === "majority"
          ? `${delayed} ${delayed === 1 ? "day" : "days"} carried past the following Ramadan — one feeding each, and the fast still owed`
          : `${delayed} ${delayed === 1 ? "day" : "days"} carried past the following Ramadan — no payment on the Hanafi view, the fast is still owed`,
      amount: delayFidya,
      fasts: 0,
    });
  }

  if (kaffarahDays > 0) {
    if (input.canFastSixty) {
      lines.push({
        label: "Kaffarah",
        detail: `${kaffarahDays} ${kaffarahDays === 1 ? "day" : "days"} broken deliberately, at ${KAFFARAH_DAYS} consecutive fasts each`,
        amount: 0,
        fasts: kaffarahDays * KAFFARAH_DAYS,
      });
      notes.push(
        "The sixty days of kaffarah must be consecutive. Breaking the run without an excuse starts it again from the first day, which is why it is generally begun outside Ramadan and away from the days on which fasting is forbidden.",
      );
    } else {
      lines.push({
        label: "Kaffarah",
        detail: `${kaffarahDays} ${kaffarahDays === 1 ? "day" : "days"} broken deliberately, at ${KAFFARAH_PEOPLE} people fed each`,
        amount: kaffarahDays * KAFFARAH_PEOPLE * perDay,
        fasts: 0,
      });
      notes.push(
        "Feeding sixty is the alternative for someone genuinely unable to fast sixty consecutive days. It is the second option and not a choice between equals — the fasting comes first, and inability has to be real.",
      );
    }
    notes.push(
      "Kaffarah does not replace the make-up. The day broken is still owed as a fast, on top of the expiation.",
    );
  }

  const totalMoney = lines.reduce((s, l) => s + l.amount, 0);
  const totalFasts = lines.reduce((s, l) => s + l.fasts, 0);

  return {
    perDay,
    lines,
    totalMoney,
    totalFasts,
    delayFidya,
    needsRate: perDay <= 0 && (fidyaDays > 0 || kaffarahDays > 0 || delayFidya > 0),
    notes,
  };
}
