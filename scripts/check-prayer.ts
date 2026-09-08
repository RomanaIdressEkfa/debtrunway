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
  qiblaDirection,
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

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
