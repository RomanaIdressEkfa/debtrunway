"use client";

import { useMemo, useState } from "react";
import {
  METHODS,
  calculatePrayerTimes,
  compassPoint,
  formatTime,
  qiblaDirection,
  type AsrSchool,
} from "@/lib/prayer-times";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField } from "./ui";

/**
 * Location comes from the browser or from two typed numbers, and goes no
 * further than the tab. The geolocation permission prompt is the browser's,
 * the coordinates are never sent anywhere, and the arithmetic runs here — so
 * the promise the rest of the site makes holds on this page too, which is not
 * true of most prayer-time sites.
 */

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const today = () => {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
};

export default function PrayerTimesCalculator() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [method, setMethod] = useState("mwl");
  const [asr, setAsr] = useState<AsrSchool>("standard");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);

  // The offset the reader's own clock is on, summer time included.
  const timezone = useMemo(() => -new Date().getTimezoneOffset() / 60, []);
  const date = useMemo(() => today(), []);

  const ready = lat !== "" && lng !== "";

  const result = useMemo(
    () =>
      ready
        ? calculatePrayerTimes({
            lat: num(lat),
            lng: num(lng),
            timezone,
            date,
            method,
            asr,
          })
        : null,
    [ready, lat, lng, timezone, date, method, asr],
  );

  const qibla = ready ? qiblaDirection(num(lat), num(lng)) : null;

  const locate = () => {
    setAsked(true);
    setLocationError(null);
    if (!("geolocation" in navigator)) {
      setLocationError(
        "This browser has no location service. Type your coordinates below instead — any map will give them to you.",
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLng(pos.coords.longitude.toFixed(4));
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setLocationError(
          err.code === err.PERMISSION_DENIED
            ? "Location was declined, which is a reasonable thing to decline. Type your coordinates below — right-click your place on any map and they are there."
            : "Your location could not be read. Type the coordinates below instead.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  };

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="Where you are"
          sub="Your coordinates stay in this tab. They are not sent to us or to anyone else, and the calculation runs on your own device."
        />

        <button
          type="button"
          onClick={locate}
          disabled={locating}
          className="press mt-5 w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {locating ? "Asking your browser…" : "Use my location"}
        </button>

        {locationError && (
          <p className="mt-3 rounded-xl border border-line bg-background p-4 text-base leading-relaxed text-muted">
            {locationError}
          </p>
        )}

        <div className="field-row mt-5 grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Latitude"
            hint="Positive north, negative south"
            value={lat}
            onChange={setLat}
            placeholder="23.8103"
          />
          <NumberField
            label="Longitude"
            hint="Positive east, negative west"
            value={lng}
            onChange={setLng}
            placeholder="90.4125"
          />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Times are worked out for {date.day}/{date.month}/{date.year} on your
          device&rsquo;s clock, which reads UTC
          {timezone >= 0 ? "+" : ""}
          {timezone}.
        </p>
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="Which convention"
          sub="Fajr and Isha are defined by how far the sun sits below the horizon, and the authorities differ by up to four and a half degrees — twenty minutes or more at a northern latitude. Pick the one your community follows."
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
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
                  {m.isha === null ? `Isha ${m.ishaMinutes} min after Maghrib` : `Isha ${m.isha}°`}
                </span>
              </button>
            );
          })}
        </div>

        <fieldset className="mt-5 border-t border-line pt-5">
          <legend className="text-base font-semibold">Asr</legend>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Asr begins when a shadow reaches a multiple of an object&rsquo;s
            own length. The Hanafi school uses twice; the others use once,
            which puts Asr an hour or more earlier.
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
      </Card>

      {/* ---------- The answer ---------- */}
      {!ready ? (
        <Notice>
          {asked
            ? "Enter a latitude and longitude above and the times appear here."
            : "Use your location, or type coordinates above, and the times appear here."}
        </Notice>
      ) : (
        result && (
          <>
            <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
              <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
              <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
              <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                {date.day}/{date.month}/{date.year} · {result.method.label}
              </p>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {result.times.map((t) => (
                  <div key={t.key}>
                    <dt className="text-sm text-white/70">
                      {t.label}
                      {t.estimated && (
                        <span className="ml-1 text-[var(--gold)]">·est</span>
                      )}
                    </dt>
                    <dd className="mt-0.5 text-2xl font-bold tabular-nums sm:text-3xl">
                      {formatTime(t.hours)}
                    </dd>
                  </div>
                ))}
              </dl>

              {qibla !== null && (
                <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/20 pt-5">
                  <QiblaDial bearing={qibla} />
                  <div>
                    <p className="text-sm text-white/70">Qibla</p>
                    <p className="mt-0.5 text-2xl font-bold tabular-nums">
                      {qibla.toFixed(1)}°
                    </p>
                    <p className="text-base text-white/85">
                      {compassPoint(qibla)} of true north
                    </p>
                  </div>
                </div>
              )}
            </section>

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
              <strong>A compass on a phone points at magnetic north.</strong>{" "}
              The bearing above is from <em>true</em> north, and the two differ
              by anything from a fraction of a degree to more than twenty,
              depending where you stand. Most phone compass apps can be set to
              show true north — do that before turning to face this bearing.
            </Notice>
          </>
        )
      )}

      <Notice tone="danger">
        <strong>Check these against your local mosque.</strong> The astronomy
        here is standard and the arithmetic is tested, but a mosque timetable
        also carries judgements a formula does not have — the horizon you
        actually see, the altitude, the caution a community applies to Fajr in
        summer. Where the two differ, the mosque is the one people pray by.
      </Notice>
    </div>
  );
}

/** A dial rather than a number alone: 119° means little until you see it. */
function QiblaDial({ bearing }: { bearing: number }) {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="6"
          x2="50"
          y2="14"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <text x="50" y="22" textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity="0.6">
        N
      </text>
      <g transform={`rotate(${bearing} 50 50)`}>
        <line x1="50" y1="50" x2="50" y2="12" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" />
        <polygon points="50,6 45,17 55,17" fill="var(--gold)" />
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}

function StepHeading({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
        {n}
      </span>
      <div>
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
        <p className="mt-1.5 text-base leading-relaxed text-muted">{sub}</p>
      </div>
    </div>
  );
}
