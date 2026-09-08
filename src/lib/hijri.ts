/**
 * The Hijri calendar, by arithmetic.
 *
 * A thing has to be said before any of the code: this is a calculated
 * calendar, and the Hijri calendar is not, in principle, calculated. A month
 * begins when the new crescent is sighted, and sighting depends on where you
 * are standing, on the weather, and on which authority your country follows.
 * So a computed date can differ from an announced one by a day, and around
 * Ramadan and the two Eids it frequently does.
 *
 * That is not a defect to be papered over. It is why every page carrying this
 * says so, and why the tool is framed as "what the arithmetic gives" rather
 * than as the date.
 *
 * What it is good for is everything that does not turn on a single day: how
 * old a lunar year is, when a zakat anniversary falls, roughly when Ramadan
 * is coming, what year it is. For those it is exact enough and always
 * available, which a sighting is not.
 *
 * The algorithm is the tabular civil Islamic calendar — the arithmetic scheme
 * in which years follow a thirty-year cycle with eleven leap years, months
 * alternate 30 and 29 days, and 1 Muharram 1 AH is 16 July 622 CE in the
 * Julian calendar. It is the scheme most software uses when it is not
 * consulting a sighting table.
 */

/** Julian day of 1 Muharram 1 AH, at noon. */
const EPOCH = 1948439.5;

export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Ula",
  "Jumada al-Akhirah",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qa'dah",
  "Dhu al-Hijjah",
] as const;

export const GREGORIAN_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export interface HijriDate {
  year: number;
  /** 1 to 12. */
  month: number;
  day: number;
  monthName: string;
}

export interface GregorianDate {
  year: number;
  month: number;
  day: number;
}

/** Julian day number for a Gregorian date. */
export function gregorianToJD(y: number, m: number, d: number): number {
  let year = y;
  let month = m;
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    d +
    b -
    1524.5
  );
}

export function jdToGregorian(jd: number): GregorianDate {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { year, month, day: Math.floor(day) };
}

/** Julian day of a Hijri date under the tabular scheme. */
export function hijriToJD(y: number, m: number, d: number): number {
  return (
    d +
    Math.ceil(29.5 * (m - 1)) +
    (y - 1) * 354 +
    Math.floor((3 + 11 * y) / 30) +
    EPOCH -
    1
  );
}

export function jdToHijri(jdIn: number): HijriDate {
  const jd = Math.floor(jdIn) + 0.5;
  const year = Math.floor((30 * (jd - EPOCH) + 10646) / 10631);
  const month = Math.min(
    12,
    Math.ceil((jd - (29 + hijriToJD(year, 1, 1))) / 29.5) + 1,
  );
  const day = jd - hijriToJD(year, month, 1) + 1;
  return {
    year,
    month,
    day: Math.round(day),
    monthName: HIJRI_MONTHS[month - 1],
  };
}

export const gregorianToHijri = (y: number, m: number, d: number): HijriDate =>
  jdToHijri(gregorianToJD(y, m, d));

export const hijriToGregorian = (
  y: number,
  m: number,
  d: number,
): GregorianDate => jdToGregorian(hijriToJD(y, m, d));

/** Days in a Hijri month under the tabular scheme. */
export const hijriMonthLength = (y: number, m: number): number =>
  hijriToJD(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1) - hijriToJD(y, m, 1);

/** Whether a Hijri year has 355 days rather than 354. */
export const isHijriLeapYear = (y: number): boolean =>
  (14 + 11 * y) % 30 < 11;

/**
 * The next occurrence of a Hijri month and day, from a Gregorian starting
 * point. Used for the zakat anniversary and for the run-up to Ramadan.
 */
export function nextHijriOccurrence(
  from: GregorianDate,
  month: number,
  day: number,
): { gregorian: GregorianDate; hijriYear: number; daysAway: number } {
  const fromJD = gregorianToJD(from.year, from.month, from.day);
  const here = jdToHijri(fromJD);

  let targetJD = hijriToJD(here.year, month, day);
  if (targetJD < fromJD) targetJD = hijriToJD(here.year + 1, month, day);

  return {
    gregorian: jdToGregorian(targetJD),
    hijriYear: jdToHijri(targetJD).year,
    daysAway: Math.round(targetJD - fromJD),
  };
}

/** "12 Rabi' al-Awwal 1447". */
export const formatHijri = (h: HijriDate): string =>
  `${h.day} ${h.monthName} ${h.year}`;

/** "8 September 2026". */
export const formatGregorian = (g: GregorianDate): string =>
  `${g.day} ${GREGORIAN_MONTHS[g.month - 1]} ${g.year}`;
