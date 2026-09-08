/**
 * Prayer times and the direction of the Qibla.
 *
 * This is the most consequential thing on the site. A zakat figure that is
 * wrong by a little can be corrected next year; a Fajr time that is wrong by
 * ten minutes means a prayer prayed before its time, every day, until someone
 * notices. So a few things are deliberate:
 *
 *   The astronomy is the standard solar-position algorithm used by PrayTimes
 *   and by most published implementations — low-precision formulae from the
 *   Astronomical Almanac, accurate to well under a minute for this purpose,
 *   with the day's times solved iteratively because each depends on the sun's
 *   declination at the time being solved for.
 *
 *   The convention is chosen by the reader, never assumed. Fajr and Isha are
 *   defined by how far the sun sits below the horizon, and the authorities
 *   disagree by up to four and a half degrees — twenty minutes or more at a
 *   British latitude. There is no neutral default; picking one silently would
 *   be picking a side.
 *
 *   Asr is likewise a choice, not a setting. Shadow length of one for the
 *   Maliki, Shafi'i and Hanbali schools, two for the Hanafi.
 *
 *   Where a convention cannot produce a time — a summer night at high
 *   latitude where the sun never goes far enough below the horizon — the
 *   result says so rather than returning a plausible-looking number. An
 *   estimate is offered and labelled as one.
 *
 * None of that makes this authoritative. Every page carrying it says to check
 * against a local mosque, because a mosque's timetable also carries a local
 * judgement about the horizon, the altitude and the season that no formula
 * has.
 */

/** The Kaaba, to five decimal places. */
export const KAABA = { lat: 21.4225, lng: 39.8262 };

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

const sin = (d: number) => Math.sin(d * D2R);
const cos = (d: number) => Math.cos(d * D2R);
const tan = (d: number) => Math.tan(d * D2R);
const arcsin = (x: number) => Math.asin(x) * R2D;
const arccos = (x: number) => Math.acos(x) * R2D;
const arctan2 = (y: number, x: number) => Math.atan2(y, x) * R2D;
const arccot = (x: number) => Math.atan(1 / x) * R2D;

const fixAngle = (a: number) => ((a % 360) + 360) % 360;
const fixHour = (h: number) => ((h % 24) + 24) % 24;

/** Julian day for a civil date at 0h UT. */
function julian(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5
  );
}

/**
 * The sun's declination and the equation of time.
 * Low-precision formulae from the Astronomical Almanac: good to about a
 * hundredth of a degree, which is far finer than a prayer timetable needs.
 */
function sunPosition(jd: number) {
  const d = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const l = fixAngle(q + 1.915 * sin(g) + 0.02 * sin(2 * g));
  const e = 23.439 - 0.00000036 * d;

  const declination = arcsin(sin(e) * sin(l));
  const rightAscension = arctan2(cos(e) * sin(l), cos(l)) / 15;
  const equation = q / 15 - fixHour(rightAscension);

  return { declination, equation };
}

/** Which method fixes the Fajr and Isha angles. */
export interface Method {
  key: string;
  label: string;
  region: string;
  fajr: number;
  /** Degrees below the horizon, or null when Isha is a fixed interval. */
  isha: number | null;
  /** Minutes after Maghrib, for methods that use an interval. */
  ishaMinutes?: number;
}

export const METHODS: Method[] = [
  {
    key: "mwl",
    label: "Muslim World League",
    region: "Europe, the Far East, much of the world",
    fajr: 18,
    isha: 17,
  },
  {
    key: "isna",
    label: "ISNA",
    region: "North America",
    fajr: 15,
    isha: 15,
  },
  {
    key: "egypt",
    label: "Egyptian General Authority",
    region: "Africa, Syria, Iraq, Lebanon, Malaysia",
    fajr: 19.5,
    isha: 17.5,
  },
  {
    key: "makkah",
    label: "Umm al-Qura",
    region: "Saudi Arabia",
    fajr: 18.5,
    isha: null,
    ishaMinutes: 90,
  },
  {
    key: "karachi",
    label: "University of Islamic Sciences, Karachi",
    region: "Pakistan, Bangladesh, India, Afghanistan",
    fajr: 18,
    isha: 18,
  },
  {
    key: "tehran",
    label: "Institute of Geophysics, Tehran",
    region: "Iran, some Shia communities",
    fajr: 17.7,
    isha: 14,
  },
];

/** Shadow length that defines Asr. */
export type AsrSchool = "standard" | "hanafi";

export interface PrayerInput {
  lat: number;
  lng: number;
  /** Offset from UTC in hours, including any summer time. */
  timezone: number;
  date: { year: number; month: number; day: number };
  method: string;
  asr: AsrSchool;
  /** Metres above sea level, which moves sunrise and sunset slightly. */
  elevation?: number;
}

export interface PrayerTime {
  key: string;
  label: string;
  /** Hours after local midnight, or null where the sun never reaches the angle. */
  hours: number | null;
  /** Set when the time could not be computed and an estimate is shown. */
  estimated: boolean;
}

export interface PrayerResult {
  times: PrayerTime[];
  method: Method;
  asr: AsrSchool;
  /** True when any time had to be estimated at high latitude. */
  anyEstimated: boolean;
  notes: string[];
}

/** "05:14" from hours after midnight. */
export const formatTime = (h: number | null): string => {
  if (h === null || !Number.isFinite(h)) return "—";
  const t = fixHour(h + 0.5 / 60); // round to the nearest minute
  const hh = Math.floor(t);
  const mm = Math.floor((t - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export function calculatePrayerTimes(input: PrayerInput): PrayerResult {
  const method =
    METHODS.find((m) => m.key === input.method) ?? METHODS[0];
  const { lat, lng, timezone } = input;
  const notes: string[] = [];

  const jd = julian(input.date.year, input.date.month, input.date.day) - lng / 15;

  // Sunrise and sunset are taken at 0.833° below the horizon: the sun's
  // semi-diameter plus atmospheric refraction. Height above sea level pushes
  // the horizon down a little further.
  const elevation = Math.max(0, input.elevation ?? 0);
  const riseSetAngle = 0.833 + 0.0347 * Math.sqrt(elevation);

  /** Hours from local midnight at which the sun sits `angle` below the horizon. */
  const sunAngleTime = (
    angle: number,
    guess: number,
    direction: "before" | "after",
  ): number | null => {
    const { declination } = sunPosition(jd + guess / 24);
    const numerator = -sin(angle) - sin(declination) * sin(lat);
    const denominator = cos(declination) * cos(lat);
    const ratio = numerator / denominator;
    // Outside [-1, 1] the sun never reaches that angle on this date.
    if (ratio > 1 || ratio < -1) return null;
    const noon = midday(guess);
    const offset = arccos(ratio) / 15;
    return direction === "before" ? noon - offset : noon + offset;
  };

  function midday(guess: number): number {
    const { equation } = sunPosition(jd + guess / 24);
    return fixHour(12 - equation);
  }

  const asrTime = (factor: number, guess: number): number | null => {
    const { declination } = sunPosition(jd + guess / 24);
    const angle = -arccot(factor + tan(Math.abs(lat - declination)));
    return sunAngleTime(angle, guess, "after");
  };

  // Each time depends on the sun's position at that time, so the whole set is
  // solved twice from a rough first guess. A third pass moves nothing.
  let dhuhr = midday(12);
  let sunrise = sunAngleTime(riseSetAngle, 6, "before");
  let sunset = sunAngleTime(riseSetAngle, 18, "after");
  let fajr = sunAngleTime(method.fajr, 5, "before");
  let isha =
    method.isha !== null ? sunAngleTime(method.isha, 18, "after") : null;
  const factor = input.asr === "hanafi" ? 2 : 1;
  let asr = asrTime(factor, 13);

  for (let pass = 0; pass < 2; pass++) {
    dhuhr = midday(dhuhr);
    sunrise = sunAngleTime(riseSetAngle, sunrise ?? 6, "before");
    sunset = sunAngleTime(riseSetAngle, sunset ?? 18, "after");
    fajr = sunAngleTime(method.fajr, fajr ?? 5, "before");
    asr = asrTime(factor, asr ?? 13);
    if (method.isha !== null) {
      isha = sunAngleTime(method.isha, isha ?? 18, "after");
    }
  }

  // Umm al-Qura sets Isha a fixed interval after Maghrib rather than by angle.
  if (method.isha === null && sunset !== null) {
    isha = sunset + (method.ishaMinutes ?? 90) / 60;
  }

  // High latitude, in two degrees of severity.
  //
  // The milder case is a night that never gets dark enough for the Fajr or
  // Isha angle, though the sun still rises and sets. There the night can be
  // divided in proportion to the angle, which is a recognised approach.
  //
  // The severe case is a sun that does not set at all, or does not rise. Then
  // there is no night to divide and no formula can produce a time — the
  // scholarly answers are to follow the timings of the nearest latitude at
  // which the prayers do occur, or to follow Mecca. This takes the first, at
  // 48.5°, which is the usual choice, and says plainly that it has done so.
  let anyEstimated = false;

  if (sunrise === null || sunset === null) {
    const NEAREST = 48.5;
    const substitute = calculatePrayerTimes({
      ...input,
      lat: lat < 0 ? -NEAREST : NEAREST,
      // The longitude and timezone stay, so the substitute times land on this
      // reader's clock rather than on a clock 20 degrees away.
    });
    notes.push(
      `On this date the sun at this latitude does not ${
        lat > 0 && input.date.month > 3 && input.date.month < 10
          ? "set"
          : "rise"
      }, so there is no night to measure the prayers against and no formula can give you a timetable. The times below are those of latitude ${NEAREST}°, the nearest at which the prayers occur normally — one of two accepted approaches, the other being to follow the timings of Mecca. Which to follow is a ruling rather than a calculation, so ask locally before relying on either.`,
    );
    return {
      times: substitute.times.map((t) => ({ ...t, estimated: true })),
      method,
      asr: input.asr,
      anyEstimated: true,
      notes,
    };
  }

  if (fajr === null || isha === null) {
    const night = 24 - (sunset - sunrise);
    if (fajr === null) {
      fajr = sunrise - (night * method.fajr) / 60;
      anyEstimated = true;
    }
    if (isha === null) {
      const ishaAngle = method.isha ?? 17;
      isha = sunset + (night * ishaAngle) / 60;
      anyEstimated = true;
    }
    notes.push(
      "At this latitude and date the sun never falls far enough below the horizon for the Fajr or Isha angle to occur at all. The times shown for them are estimates produced by dividing the night in proportion to the angle — a common approach, but an approach rather than an observation. Follow your local mosque here; this is exactly the case their timetable is built to handle and a formula is not.",
    );
  }

  // Everything so far is local mean time. Shift to the reader's clock.
  const toLocal = (h: number | null) =>
    h === null ? null : fixHour(h + timezone - lng / 15);

  const times: PrayerTime[] = [
    { key: "fajr", label: "Fajr", hours: toLocal(fajr), estimated: anyEstimated && fajr !== null },
    { key: "sunrise", label: "Sunrise", hours: toLocal(sunrise), estimated: false },
    { key: "dhuhr", label: "Dhuhr", hours: toLocal(dhuhr), estimated: false },
    { key: "asr", label: "Asr", hours: toLocal(asr), estimated: false },
    { key: "maghrib", label: "Maghrib", hours: toLocal(sunset), estimated: false },
    { key: "isha", label: "Isha", hours: toLocal(isha), estimated: anyEstimated && isha !== null },
  ];

  return { times, method, asr: input.asr, anyEstimated, notes };
}

/**
 * The great-circle bearing from a point to the Kaaba, in degrees clockwise
 * from true north.
 *
 * Not the bearing you would read off a flat map: on a sphere the shortest
 * path between two points is a great circle, and a Mercator projection bends
 * it. From London the Qibla is about 119° — south-east — which surprises
 * people who expect to face roughly south-east-by-south towards a point on
 * an atlas.
 *
 * A phone compass reads magnetic north, which differs from true north by up
 * to tens of degrees depending where you stand, so this figure is true
 * bearing and the page says so.
 */
export function qiblaDirection(lat: number, lng: number): number {
  const dLng = KAABA.lng - lng;
  const y = sin(dLng);
  const x = cos(lat) * tan(KAABA.lat) - sin(lat) * cos(dLng);
  return fixAngle(arctan2(y, x));
}

/** "South-east" for 119°, for readers who would rather have a word. */
export function compassPoint(bearing: number): string {
  const points = [
    "North", "North-north-east", "North-east", "East-north-east",
    "East", "East-south-east", "South-east", "South-south-east",
    "South", "South-south-west", "South-west", "West-south-west",
    "West", "West-north-west", "North-west", "North-north-west",
  ];
  return points[Math.round(fixAngle(bearing) / 22.5) % 16];
}

/**
 * Which prayer is next, which is current, and how far through the gap we are.
 *
 * This lived inside the component, where it could not be tested — and it is
 * the piece most likely to be quietly wrong, because every interesting case
 * happens at a boundary. Before Fajr the current prayer is yesterday's Isha;
 * after Isha the next one is tomorrow's Fajr and the gap wraps past midnight;
 * at high latitude a prayer may be missing from the list altogether.
 *
 * Sunrise is not a prayer and is skipped, though it stays in the timetable.
 */
export interface NextPrayer {
  key: string;
  label: string;
  /** The prayer now in, which is the previous one. */
  currentKey: string;
  /** When the next one falls, in hours after midnight. */
  at: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** How far through the gap between the two, from 0 to 1. */
  progress: number;
}

const PRAYER_KEYS = new Set(["fajr", "dhuhr", "asr", "maghrib", "isha"]);

export function nextPrayer(
  times: PrayerTime[],
  hoursNow: number,
): NextPrayer | null {
  const prayers = times
    .filter((t) => PRAYER_KEYS.has(t.key) && t.hours !== null)
    .map((t) => ({ ...t, hours: t.hours as number }))
    .sort((a, b) => a.hours - b.hours);

  if (prayers.length === 0) return null;

  const later = prayers.find((t) => t.hours > hoursNow);
  // Past the last prayer of the day, the next is the first one tomorrow.
  const target = later ?? prayers[0];
  const gap = later ? target.hours - hoursNow : 24 - hoursNow + target.hours;

  // Before the first prayer of the day, the one we are in is the last of
  // yesterday.
  const current =
    [...prayers].reverse().find((t) => t.hours <= hoursNow) ??
    prayers[prayers.length - 1];

  // The span between them, wrapping midnight wherever it has to.
  let span = target.hours - current.hours;
  if (span <= 0) span += 24;

  const totalSeconds = Math.max(0, Math.round(gap * 3600));

  return {
    key: target.key,
    label: target.label,
    currentKey: current.key,
    at: target.hours,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    progress: span > 0 ? Math.min(1, Math.max(0, (span - gap) / span)) : 0,
  };
}
