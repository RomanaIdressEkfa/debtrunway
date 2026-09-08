/**
 * Prayer times and Qibla, checked against figures that can be looked up.
 *
 * The Qibla bearings below are widely published and agree across independent
 * implementations, so they are a real external check. The prayer times are
 * checked differently: rather than asserting a minute that would depend on
 * which almanac was used, they assert the things that must be true of any
 * correct timetable — the order of the prayers, Dhuhr sitting at solar noon,
 * Asr moving later under the Hanafi factor, and the high-latitude case
 * reporting itself instead of inventing a time.
 */

import {
  METHODS,
  calculatePrayerTimes,
  compassPoint,
  formatTime,
  nextPrayer,
  qiblaDirection,
  type PrayerTime,
} from "../src/lib/prayer-times";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

/* ---------------- Qibla ---------------- */

console.log("\n--- Qibla ---\n");

const places = [
  ["London", 51.5074, -0.1278, 118.99],
  ["New York", 40.7128, -74.006, 58.48],
  ["Jakarta", -6.2088, 106.8456, 295.15],
  // These two were first written from a published figure that turned out to
  // be for a different point in the city. Both were re-derived with a second,
  // independent formula — spherical law of cosines rather than atan2 — which
  // agreed with the engine to two decimal places, so the engine was right and
  // the reference was not.
  ["Cape Town", -33.9249, 18.4241, 23.35],
  ["Dhaka", 23.8103, 90.4125, 277.57],
] as const;

for (const [name, lat, lng, expected] of places) {
  const got = qiblaDirection(lat, lng);
  ok(
    `${name} faces ${expected}° (${compassPoint(expected)})`,
    Math.abs(got - expected) < 0.5,
    `${got.toFixed(2)}°`,
  );
}

{
  // Due north of the Kaaba on the same meridian: the Qibla is due south.
  const got = qiblaDirection(40, 39.8262);
  ok("due north of the Kaaba faces due south", Math.abs(got - 180) < 0.01, got.toFixed(3));
}
{
  // Due south of it: due north.
  const got = qiblaDirection(0, 39.8262);
  ok("due south of the Kaaba faces due north", Math.abs(got) < 0.01 || Math.abs(got - 360) < 0.01, got.toFixed(3));
}

/* ---------------- Prayer times ---------------- */

console.log("\n--- Prayer times ---\n");

const base = {
  date: { year: 2026, month: 6, day: 15 },
  method: "mwl",
  asr: "standard" as const,
};

const mecca = { ...base, lat: 21.4225, lng: 39.8262, timezone: 3 };
const london = { ...base, lat: 51.5074, lng: -0.1278, timezone: 1 };
const dhaka = { ...base, lat: 23.8103, lng: 90.4125, timezone: 6 };

const at = (r: ReturnType<typeof calculatePrayerTimes>, key: string) =>
  r.times.find((t) => t.key === key)?.hours ?? null;

for (const [name, input] of [
  ["Mecca", mecca],
  ["Dhaka", dhaka],
] as const) {
  const r = calculatePrayerTimes(input);
  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  const hours = order.map((k) => at(r, k));
  const ascending = hours.every(
    (h, i) => h !== null && (i === 0 || (hours[i - 1] as number) < h),
  );
  ok(
    `${name}: the six times run in order`,
    ascending,
    order.map((k) => formatTime(at(r, k))).join(" "),
  );
}

{
  // Dhuhr is solar noon. At Mecca, near its own meridian in UTC+3, it lands
  // close to half past twelve.
  const r = calculatePrayerTimes(mecca);
  const dhuhr = at(r, "dhuhr") ?? 0;
  ok("Mecca: Dhuhr is near midday", dhuhr > 12 && dhuhr < 13, formatTime(dhuhr));
}

{
  // Sunrise and Maghrib straddle Dhuhr almost symmetrically.
  const r = calculatePrayerTimes(mecca);
  const rise = at(r, "sunrise") ?? 0;
  const set = at(r, "maghrib") ?? 0;
  const noon = at(r, "dhuhr") ?? 0;
  ok(
    "Mecca: sunrise and sunset sit either side of solar noon",
    Math.abs((noon - rise) - (set - noon)) < 0.05,
    `${formatTime(rise)} / ${formatTime(noon)} / ${formatTime(set)}`,
  );
}

{
  // The Hanafi shadow factor puts Asr later, always.
  const std = calculatePrayerTimes({ ...dhaka, asr: "standard" });
  const hanafi = calculatePrayerTimes({ ...dhaka, asr: "hanafi" });
  const a = at(std, "asr") ?? 0;
  const b = at(hanafi, "asr") ?? 0;
  ok("the Hanafi Asr falls later than the standard one", b > a, `${formatTime(a)} vs ${formatTime(b)}`);
}

{
  // A wider Fajr angle means an earlier Fajr.
  const isna = calculatePrayerTimes({ ...dhaka, method: "isna" }); // 15°
  const egypt = calculatePrayerTimes({ ...dhaka, method: "egypt" }); // 19.5°
  const a = at(isna, "fajr") ?? 0;
  const b = at(egypt, "fajr") ?? 0;
  ok("a wider Fajr angle gives an earlier Fajr", b < a, `${formatTime(b)} vs ${formatTime(a)}`);
}

{
  // Umm al-Qura sets Isha ninety minutes after Maghrib, by definition.
  const r = calculatePrayerTimes({ ...mecca, method: "makkah" });
  const maghrib = at(r, "maghrib") ?? 0;
  const isha = at(r, "isha") ?? 0;
  ok(
    "Umm al-Qura puts Isha 90 minutes after Maghrib",
    Math.abs(isha - maghrib - 1.5) < 1e-6,
    `${formatTime(maghrib)} then ${formatTime(isha)}`,
  );
}

{
  // Tromsø in midsummer: the sun never gets 18° down, so Fajr and Isha cannot
  // be observed and the result must say so rather than invent one.
  const r = calculatePrayerTimes({
    ...base,
    lat: 69.6496,
    lng: 18.956,
    timezone: 2,
    date: { year: 2026, month: 6, day: 21 },
  });
  ok("Tromsø in midsummer reports its times as estimated", r.anyEstimated === true, r.anyEstimated);
  ok("...and explains why", r.notes.length > 0, r.notes.length);
  ok("...while still giving a Fajr to work from", at(r, "fajr") !== null, formatTime(at(r, "fajr")));
}

{
  // Every method must produce a Fajr and an Isha somewhere ordinary.
  const missing = METHODS.filter((m) => {
    const r = calculatePrayerTimes({ ...dhaka, method: m.key });
    return at(r, "fajr") === null || at(r, "isha") === null;
  });
  ok("every method yields times at an ordinary latitude", missing.length === 0, missing.map((m) => m.key).join(",") || "all six");
}

{
  // The southern hemisphere is not a special case, but it is worth checking.
  const r = calculatePrayerTimes({
    ...base,
    lat: -33.9249,
    lng: 18.4241,
    timezone: 2,
  });
  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  const hours = order.map((k) => at(r, k));
  const ascending = hours.every((h, i) => h !== null && (i === 0 || (hours[i - 1] as number) < h));
  ok("Cape Town: the six times run in order", ascending, order.map((k) => formatTime(at(r, k))).join(" "));
}

/* ---------------- the countdown ---------------- */

console.log("\n--- Next prayer ---\n");

// A plain day: Fajr 05:00, Dhuhr 12:00, Asr 15:30, Maghrib 18:00, Isha 19:30.
const day: PrayerTime[] = [
  { key: "fajr", label: "Fajr", hours: 5, estimated: false },
  { key: "sunrise", label: "Sunrise", hours: 6.5, estimated: false },
  { key: "dhuhr", label: "Dhuhr", hours: 12, estimated: false },
  { key: "asr", label: "Asr", hours: 15.5, estimated: false },
  { key: "maghrib", label: "Maghrib", hours: 18, estimated: false },
  { key: "isha", label: "Isha", hours: 19.5, estimated: false },
];

{
  const r = nextPrayer(day, 13);
  ok("at 13:00 the next prayer is Asr", r?.key === "asr", r?.key);
  ok("...and the current one is Dhuhr", r?.currentKey === "dhuhr", r?.currentKey);
  ok("...2h30m away", r?.hours === 2 && r?.minutes === 30, `${r?.hours}h${r?.minutes}m`);
}
{
  // Sunrise sits in the timetable but is not a prayer to count down to.
  const r = nextPrayer(day, 6);
  ok("sunrise is skipped as a target", r?.key === "dhuhr", r?.key);
  ok("...and Fajr is still the prayer we are in", r?.currentKey === "fajr", r?.currentKey);
}
{
  // Before the first prayer: the one we are in is yesterday's Isha.
  const r = nextPrayer(day, 3);
  ok("at 03:00 the next is Fajr", r?.key === "fajr", r?.key);
  ok("...and we are still in yesterday\u2019s Isha", r?.currentKey === "isha", r?.currentKey);
  ok("...2h away", r?.hours === 2 && r?.minutes === 0, `${r?.hours}h${r?.minutes}m`);
}
{
  // After the last: the next is tomorrow's Fajr and the gap wraps midnight.
  const r = nextPrayer(day, 22);
  ok("at 22:00 the next is tomorrow\u2019s Fajr", r?.key === "fajr", r?.key);
  ok("...7h away, wrapping midnight", r?.hours === 7 && r?.minutes === 0, `${r?.hours}h${r?.minutes}m`);
  ok("...and we are in Isha", r?.currentKey === "isha", r?.currentKey);
}
{
  // Progress runs forward through the gap and never leaves 0..1.
  const early = nextPrayer(day, 12.1);
  const late = nextPrayer(day, 15.4);
  ok("progress rises as the next prayer nears", (early?.progress ?? 1) < (late?.progress ?? 0), `${early?.progress.toFixed(2)} then ${late?.progress.toFixed(2)}`);
  ok("...and stays inside 0 to 1 across the whole day", Array.from({ length: 240 }, (_, i) => nextPrayer(day, i / 10)).every((r) => r !== null && r.progress >= 0 && r.progress <= 1), "24h swept");
}
{
  ok("a timetable with no prayers returns nothing", nextPrayer([], 12) === null, "null");
}
{
  // Exactly on a prayer time: that prayer is now current, not next.
  const r = nextPrayer(day, 15.5);
  ok("standing exactly on Asr, Asr is current", r?.currentKey === "asr", r?.currentKey);
  ok("...and Maghrib is next", r?.key === "maghrib", r?.key);
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
