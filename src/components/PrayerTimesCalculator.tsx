"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  METHODS,
  calculatePrayerTimes,
  compassPoint,
  formatTime,
  nextPrayer,
  qiblaDirection,
  type AsrSchool,
} from "@/lib/prayer-times";
import { placeFromTimezone, type Place } from "@/lib/timezone-places";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField } from "./ui";

/**
 * The page opens with times rather than with a form.
 *
 * A browser will not give up a location without a permission prompt, and
 * several will not even prompt unless the reader has clicked something first
 * — so a page built around the location button shows nothing at all to
 * someone who arrived from a search. The time zone costs no permission, no
 * prompt and no request: Intl reports it, a table in the bundle turns it into
 * a city, and the times are on screen before the reader has done anything.
 *
 * It is a city rather than a street, so it is right to a couple of minutes
 * rather than to the second. The page says which city it assumed, and the
 * exact location is one button away for anyone who wants those minutes.
 * Nothing is sent anywhere in either case.
 */

/**
 * A one-second clock as an external store.
 *
 * The obvious version sets state from inside an effect on mount and again on
 * every tick, which works and causes the cascading render the effect rules
 * warn about. useSyncExternalStore is the shape React provides for this: the
 * server snapshot is zero, so the panel renders its waiting state during
 * hydration and swaps to the real time immediately after, with no mismatch.
 *
 * The interval starts with the first subscriber and stops with the last, so a
 * page with the component unmounted is not still ticking.
 */
const clock = (() => {
  const listeners = new Set<() => void>();
  let snapshot = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  return {
    subscribe(notify: () => void) {
      listeners.add(notify);
      if (timer === null) {
        snapshot = Date.now();
        timer = setInterval(() => {
          snapshot = Date.now();
          listeners.forEach((l) => l());
        }, 1000);
      }
      return () => {
        listeners.delete(notify);
        if (listeners.size === 0 && timer !== null) {
          clearInterval(timer);
          timer = null;
        }
      };
    },
    get: () => (snapshot === 0 ? (snapshot = Date.now()) : snapshot),
    /** Zero on the server, which renders the waiting state. */
    getServer: () => 0,
  };
})();

/** The time zone never changes while a page is open, so nothing to subscribe to. */
const noSubscription = () => () => {};
const readZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
};
const zoneOnServer = () => "";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

export default function PrayerTimesCalculator() {
  // Both of these are read from the environment rather than held in state,
  // so nothing has to be copied in after mount.
  const ms = useSyncExternalStore(clock.subscribe, clock.get, clock.getServer);
  const zone = useSyncExternalStore(noSubscription, readZone, zoneOnServer);

  // Wrapped so the Date is one object per tick rather than a fresh one on
  // every render — the memos below take it as a dependency.
  const now = useMemo(() => (ms === 0 ? null : new Date(ms)), [ms]);
  const guess = useMemo(() => placeFromTimezone(), []);
  const zoneKnown = guess.known;

  // A place chosen by hand wins over the one the zone implies; until then
  // there is nothing to store.
  const [chosen, setChosen] = useState<Place | null>(null);
  const place = zone === "" && !chosen ? null : (chosen ?? guess.place);

  // Likewise the convention: the region's is used until the reader picks.
  const [methodOverride, setMethodOverride] = useState<string | null>(null);
  const method = methodOverride ?? guess.place.method;
  const setMethod = setMethodOverride;

  const [source, setSource] = useState<"zone" | "exact" | "typed">("zone");
  const [asr, setAsr] = useState<AsrSchool>("standard");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const timezone = now ? -now.getTimezoneOffset() / 60 : 0;

  const result = useMemo(() => {
    if (!place || !now) return null;
    return calculatePrayerTimes({
      lat: place.lat,
      lng: place.lng,
      timezone,
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
      },
      method,
      asr,
    });
  }, [place, now, timezone, method, asr]);

  const qibla = place ? qiblaDirection(place.lat, place.lng) : null;

  // The boundary cases here — before Fajr, after Isha, exactly on a prayer —
  // are the ones most likely to be quietly wrong, so the logic lives in the
  // library where check-prayer can exercise all of them.
  const next = useMemo(() => {
    if (!result || !now) return null;
    return nextPrayer(
      result.times,
      now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600,
    );
  }, [result, now]);

  const useExactLocation = () => {
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationError(
        "This browser has no location service, so the time zone stays. You can type coordinates below instead.",
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setChosen({
          city: "Your location",
          country: "",
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          method,
        });
        setSource("exact");
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location was declined, which is fair. The times below stay on your time zone, which is right to within a couple of minutes."
            : "Your location could not be read. The times below stay on your time zone.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  const setCoord = (which: "lat" | "lng", v: string) => {
    if (!place) return;
    setChosen({ ...place, [which]: num(v), city: "Your coordinates", country: "" });
    setSource("typed");
  };

  // Before mount there is no time zone and no clock, so the panel shows its
  // own shape rather than a flash of nothing.
  if (!place || !result || !now) {
    return (
      <div className="answer-panel relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <p className="text-lg text-white/85">Working out your times…</p>
      </div>
    );
  }

  return (
    <div className="stagger space-y-4">
      {/* ---------- The clock ---------- */}
      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/30 sm:h-52 sm:w-52" />

        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            {place.city}
            {place.country && `, ${place.country}`}
          </p>
          <p className="text-sm text-white/60 tabular-nums">
            {formatTime(
              now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600,
            )}
          </p>
        </div>

        {next && (
          <>
            <p className="mt-5 text-base text-white/80">
              {next.label} in
            </p>
            <p
              className="mt-1 text-5xl font-bold tracking-tight tabular-nums sm:text-6xl"
              aria-live="off"
            >
              {String(next.hours).padStart(2, "0")}
              <span className="text-white/50">:</span>
              {String(next.minutes).padStart(2, "0")}
              <span className="text-white/50">:</span>
              {String(next.seconds).padStart(2, "0")}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              at {formatTime(next.at)}
            </p>

            {/* How far through the gap we are. A bar rather than a number,
                because nobody needs the percentage — they need the feeling of
                how much is left. */}
            <div
              className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15"
              role="presentation"
            >
              <div
                className="h-full rounded-full bg-[var(--gold)] transition-[width] duration-1000 ease-linear"
                style={{ width: `${(next.progress * 100).toFixed(2)}%` }}
              />
            </div>
          </>
        )}

        {/* The Qibla, given the room it deserves. */}
        {qibla !== null && (
          <div className="mt-8 flex flex-col items-center border-t border-white/20 pt-8">
            <QiblaDial bearing={qibla} />
            <p className="mt-4 text-4xl font-bold tabular-nums sm:text-5xl">
              {qibla.toFixed(1)}°
            </p>
            <p className="mt-1 text-lg text-white/85">
              Qibla — {compassPoint(qibla)} of true north
            </p>
          </div>
        )}
      </section>

      {/* ---------- The five, plus sunrise ---------- */}
      <Card>
        <ul className="divide-y divide-line">
          {result.times.map((t) => {
            const isNext = next?.key === t.key;
            const isCurrent = next?.currentKey === t.key;
            return (
              <li
                key={t.key}
                className={`flex items-center justify-between gap-4 px-1 py-3.5 ${
                  isNext ? "bg-brand-soft/60" : ""
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      isNext
                        ? "bg-brand"
                        : isCurrent
                          ? "bg-accent"
                          : "bg-line"
                    }`}
                  />
                  <span
                    className={`text-lg ${isNext || isCurrent ? "font-semibold" : ""}`}
                  >
                    {t.label}
                  </span>
                  {isNext && (
                    <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-semibold text-white">
                      next
                    </span>
                  )}
                  {isCurrent && !isNext && (
                    <span className="text-sm text-muted">now</span>
                  )}
                  {t.estimated && (
                    <span className="text-sm text-accent">estimated</span>
                  )}
                </span>
                <span
                  className={`text-xl tabular-nums ${isNext ? "font-bold text-brand" : "font-medium"}`}
                >
                  {formatTime(t.hours)}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
          {source === "exact"
            ? "Using the exact location your browser gave, which stayed in this tab."
            : source === "typed"
              ? "Using the coordinates you entered."
              : zoneKnown
                ? `Taken from your time zone, which puts you near ${place.city} — right to within a couple of minutes. Use your exact location below for the rest.`
                : `Your time zone is not one we have a city for, so these are ${place.city}'s times. Set your location below.`}{" "}
          Following {result.method.label}, Asr at shadow{" "}
          {asr === "hanafi" ? "×2" : "×1"}.
        </p>
      </Card>

      {/* ---------- Everything adjustable, folded away ---------- */}
      <Card className="no-print">
        <button
          type="button"
          onClick={() => setShowSettings((v) => !v)}
          aria-expanded={showSettings}
          className="press flex w-full items-center justify-between gap-3 text-left"
        >
          <span>
            <span className="block text-lg font-bold tracking-tight">
              Location and convention
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              Change the place, the Fajr angle, or the Asr school
            </span>
          </span>
          <span
            aria-hidden
            className={`shrink-0 text-muted transition-transform ${showSettings ? "rotate-180" : ""}`}
          >
            <svg viewBox="0 0 12 12" className="h-4 w-4">
              <path
                d="M2 4.5 6 8.5 10 4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>

        {showSettings && (
          <div className="mt-6 space-y-6 border-t border-line pt-6">
            <div>
              <button
                type="button"
                onClick={useExactLocation}
                disabled={locating}
                className="press w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {locating ? "Asking your browser…" : "Use my exact location"}
              </button>
              {locationError && (
                <p className="mt-3 rounded-xl border border-line bg-background p-4 text-base leading-relaxed text-muted">
                  {locationError}
                </p>
              )}
              <div className="field-row mt-4 grid gap-4 sm:grid-cols-2">
                <NumberField
                  label="Latitude"
                  hint="Positive north, negative south"
                  value={String(place.lat)}
                  onChange={(v) => setCoord("lat", v)}
                />
                <NumberField
                  label="Longitude"
                  hint="Positive east, negative west"
                  value={String(place.lng)}
                  onChange={(v) => setCoord("lng", v)}
                />
              </div>
            </div>

            <fieldset>
              <legend className="text-base font-semibold">
                Fajr and Isha convention
              </legend>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                The authorities differ by up to four and a half degrees, which
                is twenty minutes or more at a northern latitude. Yours is
                pre-selected from your region; change it to whatever your
                community follows.
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {METHODS.map((m) => {
                  const active = method === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMethod(m.key)}
                      aria-pressed={active}
                      className={`press rounded-xl border px-4 py-3 text-left transition ${
                        active ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
                      }`}
                    >
                      <span className={`block text-base font-semibold ${active ? "text-brand" : ""}`}>
                        {m.label}
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-muted">
                        {m.region} — Fajr {m.fajr}°,{" "}
                        {m.isha === null
                          ? `Isha ${m.ishaMinutes} min after Maghrib`
                          : `Isha ${m.isha}°`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-base font-semibold">Asr</legend>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                The Hanafi school waits until a shadow is twice an
                object&rsquo;s length; the others use once, which puts Asr an
                hour or so earlier.
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {(
                  [
                    ["standard", "Shadow ×1", "Maliki, Shafi'i, Hanbali"],
                    ["hanafi", "Shadow ×2", "Hanafi"],
                  ] as const
                ).map(([value, label, who]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAsr(value)}
                    aria-pressed={asr === value}
                    className={`press rounded-xl border px-4 py-3 text-left transition ${
                      asr === value ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
                    }`}
                  >
                    <span className={`block text-base font-semibold ${asr === value ? "text-brand" : ""}`}>
                      {label}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{who}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </Card>

      {result.notes.length > 0 && (
        <Notice tone="danger">
          {result.notes.map((n) => (
            <span key={n} className="block">
              {n}
            </span>
          ))}
        </Notice>
      )}

      <Notice>
        <strong>A phone compass points at magnetic north.</strong> The bearing
        above is from <em>true</em> north, and the two differ by anything from
        a fraction of a degree to more than twenty depending where you stand.
        Most compass apps can be set to true north — do that before turning.
      </Notice>

      <Notice tone="danger">
        <strong>Check these against your local mosque.</strong> The astronomy
        is standard and the arithmetic is tested, but a mosque timetable also
        carries judgements a formula has not got — the horizon you actually
        see, the altitude, the caution a community applies to Fajr in summer.
        Where the two differ, the mosque is the one people pray by.
      </Notice>
    </div>
  );
}

/**
 * The Qibla, drawn large.
 *
 * A bearing in degrees means nothing to most people until they see it against
 * a circle, so the dial is the answer and the number is the caption — not the
 * other way round.
 */
function QiblaDial({ bearing }: { bearing: number }) {
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-44 w-44 sm:h-56 sm:w-56"
      role="img"
      aria-label={`Qibla is ${bearing.toFixed(1)} degrees from true north`}
    >
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />

      {ticks.map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="8"
          x2="100"
          y2={deg % 90 === 0 ? 22 : 15}
          stroke="currentColor"
          strokeOpacity={deg % 90 === 0 ? 0.5 : 0.22}
          strokeWidth={deg % 90 === 0 ? 2 : 1}
          transform={`rotate(${deg} 100 100)`}
        />
      ))}

      {[
        ["N", 0],
        ["E", 90],
        ["S", 180],
        ["W", 270],
      ].map(([letter, deg]) => (
        <text
          key={letter as string}
          x="100"
          y="36"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="currentColor"
          fillOpacity="0.6"
          transform={`rotate(${deg} 100 100)`}
        >
          <tspan transform={`rotate(${-(deg as number)} 100 36)`}>
            {letter}
          </tspan>
        </text>
      ))}

      {/* The needle. Gold, because it is the one thing on the dial that is an
          answer rather than a scale. */}
      <g transform={`rotate(${bearing} 100 100)`}>
        <line x1="100" y1="100" x2="100" y2="30" stroke="var(--gold)" strokeWidth="4" strokeLinecap="round" />
        <polygon points="100,16 91,38 109,38" fill="var(--gold)" />
        <circle cx="100" cy="100" r="6" fill="var(--gold)" />
      </g>
      <circle cx="100" cy="100" r="2.5" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}
