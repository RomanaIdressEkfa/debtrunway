/**
 * The Hijri arithmetic, checked at the places it could be wrong.
 *
 * There is a limit to what an external check can prove here: announced dates
 * come from sighting and the tabular calendar does not, so a one-day gap
 * against a published Ramadan is expected rather than a failure. What can be
 * checked is that the arithmetic is internally exact — every conversion
 * reverses, month lengths sum to the year, the leap rule matches the
 * thirty-year cycle — and that the epoch lands where the scheme says it does.
 */

import {
  formatGregorian,
  formatHijri,
  gregorianToHijri,
  gregorianToJD,
  hijriMonthLength,
  hijriToGregorian,
  hijriToJD,
  isHijriLeapYear,
  jdToGregorian,
  jdToHijri,
  nextHijriOccurrence,
} from "../src/lib/hijri";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

console.log("\n--- The epoch ---\n");

{
  // 1 Muharram 1 AH is 16 July 622 CE in the Julian calendar, which is
  // 19 July 622 in the proleptic Gregorian one.
  const g = hijriToGregorian(1, 1, 1);
  ok(
    "1 Muharram 1 AH falls in July 622",
    g.year === 622 && g.month === 7,
    formatGregorian(g),
  );
}

console.log("\n--- Conversions reverse ---\n");

{
  // Every day across four centuries, converted out and back.
  let broken = 0;
  let firstBad = "";
  const start = gregorianToJD(1900, 1, 1);
  const end = gregorianToJD(2200, 1, 1);
  for (let jd = start; jd < end; jd++) {
    const h = jdToHijri(jd);
    const back = hijriToJD(h.year, h.month, h.day);
    if (back !== jd) {
      broken++;
      if (!firstBad) firstBad = `${formatHijri(h)} at JD ${jd}`;
    }
  }
  ok(
    "every day from 1900 to 2200 converts out and back",
    broken === 0,
    broken === 0 ? "109,573 days" : `${broken} failed, first ${firstBad}`,
  );
}

{
  let broken = 0;
  for (let jd = gregorianToJD(1900, 1, 1); jd < gregorianToJD(2100, 1, 1); jd++) {
    const g = jdToGregorian(jd);
    if (gregorianToJD(g.year, g.month, g.day) !== jd) broken++;
  }
  ok("the Gregorian conversion also reverses", broken === 0, broken === 0 ? "clean" : broken);
}

console.log("\n--- The calendar holds together ---\n");

{
  // Month lengths must sum to the year, and the year must be 354 or 355.
  let bad = 0;
  let sample = "";
  for (let y = 1400; y <= 1500; y++) {
    let total = 0;
    for (let m = 1; m <= 12; m++) total += hijriMonthLength(y, m);
    const expected = isHijriLeapYear(y) ? 355 : 354;
    if (total !== expected) {
      bad++;
      if (!sample) sample = `${y} summed ${total}, expected ${expected}`;
    }
  }
  ok("months sum to the year across 1400–1500 AH", bad === 0, bad === 0 ? "101 years" : sample);
}

{
  const lengths = new Set<number>();
  for (let y = 1440; y <= 1460; y++) {
    for (let m = 1; m <= 12; m++) lengths.add(hijriMonthLength(y, m));
  }
  ok(
    "months are only ever 29 or 30 days",
    [...lengths].every((l) => l === 29 || l === 30),
    [...lengths].sort().join(" and "),
  );
}

{
  // Eleven leap years in every thirty.
  let leaps = 0;
  for (let y = 1441; y <= 1470; y++) if (isHijriLeapYear(y)) leaps++;
  ok("eleven leap years in a thirty-year cycle", leaps === 11, leaps);
}

console.log("\n--- Against the ordinary expectations ---\n");

{
  // The Hijri year advances about eleven days earlier each Gregorian year, so
  // a Gregorian year covers a little more than one Hijri year.
  const a = gregorianToHijri(2026, 1, 1);
  const b = gregorianToHijri(2027, 1, 1);
  ok(
    "a Gregorian year advances the Hijri year by one",
    b.year - a.year === 1,
    `${a.year} then ${b.year}`,
  );
}

{
  const start = gregorianToJD(2026, 1, 1);
  const ramadanThisYear = hijriToJD(gregorianToHijri(2026, 1, 1).year, 9, 1);
  const ramadanNext = hijriToJD(gregorianToHijri(2026, 1, 1).year + 1, 9, 1);
  const drift = ramadanNext - ramadanThisYear;
  ok(
    "Ramadan moves 354 or 355 days, not 365",
    drift === 354 || drift === 355,
    `${drift} days`,
  );
  void start;
}

{
  const today = gregorianToHijri(2026, 9, 8);
  ok(
    "8 September 2026 lands in a plausible Hijri year",
    today.year >= 1447 && today.year <= 1449,
    formatHijri(today),
  );
}

console.log("\n--- Finding the next occurrence ---\n");

{
  const r = nextHijriOccurrence({ year: 2026, month: 9, day: 8 }, 9, 1);
  ok("the next 1 Ramadan is in the future", r.daysAway > 0, `${r.daysAway} days, ${formatGregorian(r.gregorian)}`);
  ok("...and within a lunar year", r.daysAway <= 355, r.daysAway);
  const check = gregorianToHijri(r.gregorian.year, r.gregorian.month, r.gregorian.day);
  ok("...and really is 1 Ramadan", check.month === 9 && check.day === 1, formatHijri(check));
}

{
  // A date already past this Hijri year should roll to the next one.
  const r = nextHijriOccurrence({ year: 2026, month: 9, day: 8 }, 1, 1);
  const check = gregorianToHijri(r.gregorian.year, r.gregorian.month, r.gregorian.day);
  ok("a passed anniversary rolls into next year", r.daysAway > 0 && check.month === 1 && check.day === 1, `${r.daysAway} days, ${formatHijri(check)}`);
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
