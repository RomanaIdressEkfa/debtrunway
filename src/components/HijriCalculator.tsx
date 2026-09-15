"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  GREGORIAN_MONTHS,
  HIJRI_MONTHS,
  formatGregorian,
  formatHijri,
  gregorianToHijri,
  hijriToGregorian,
  isHijriLeapYear,
  nextHijriOccurrence,
} from "@/lib/hijri";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField } from "./ui";
import { bnFidyaHijri } from "@/lib/bn-faraid";
import type { Locale } from "@/lib/i18n";

/**
 * Today's date is read rather than held in state, so the page shows it on
 * arrival without an effect copying it in after mount. The server snapshot is
 * zero, which renders the waiting line through hydration.
 */
const todayStore = {
  subscribe: () => () => {},
  get: () => {
    const d = new Date();
    // A number rather than a Date, so the snapshot is stable between renders.
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  },
  getServer: () => 0,
};

const num = (v: string) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};

type Direction = "toHijri" | "toGregorian";

export default function HijriCalculator({
  lang = "en",
}: {
  /** Labels only. The rulings and the arithmetic are identical either way. */
  lang?: Locale;
} = {}) {
  const t = lang === "bn" ? bnFidyaHijri : (s: string) => s;
  const stamp = useSyncExternalStore(
    todayStore.subscribe,
    todayStore.get,
    todayStore.getServer,
  );

  const today = useMemo(
    () =>
      stamp === 0
        ? null
        : {
            year: Math.floor(stamp / 10000),
            month: Math.floor((stamp % 10000) / 100),
            day: stamp % 100,
          },
    [stamp],
  );

  const [direction, setDirection] = useState<Direction>("toHijri");
  const [entered, setEntered] = useState<{
    year: string;
    month: number;
    day: string;
  } | null>(null);

  // Until something is typed, the fields follow today.
  const gregorianInput = useMemo(() => {
    if (direction !== "toHijri") return null;
    if (entered) return entered;
    if (!today) return null;
    return { year: String(today.year), month: today.month, day: String(today.day) };
  }, [direction, entered, today]);

  const hijriInput = useMemo(() => {
    if (direction !== "toGregorian") return null;
    if (entered) return entered;
    if (!today) return null;
    const h = gregorianToHijri(today.year, today.month, today.day);
    return { year: String(h.year), month: h.month, day: String(h.day) };
  }, [direction, entered, today]);

  const converted = useMemo(() => {
    if (direction === "toHijri" && gregorianInput) {
      const h = gregorianToHijri(
        num(gregorianInput.year),
        gregorianInput.month,
        num(gregorianInput.day),
      );
      return { label: formatHijri(h), sub: `${h.year} AH`, hijriYear: h.year };
    }
    if (direction === "toGregorian" && hijriInput) {
      const g = hijriToGregorian(
        num(hijriInput.year),
        hijriInput.month,
        num(hijriInput.day),
      );
      return { label: formatGregorian(g), sub: `${g.year} CE`, hijriYear: num(hijriInput.year) };
    }
    return null;
  }, [direction, gregorianInput, hijriInput]);

  // The dates people actually come looking for.
  const upcoming = useMemo(() => {
    if (!today) return [];
    return [
      { name: "Ramadan begins", month: 9, day: 1 },
      { name: "Eid al-Fitr", month: 10, day: 1 },
      { name: "Day of Arafah", month: 12, day: 9 },
      { name: "Eid al-Adha", month: 12, day: 10 },
      { name: "Islamic New Year", month: 1, day: 1 },
      { name: "Ashura", month: 1, day: 10 },
    ]
      .map((e) => ({ ...e, ...nextHijriOccurrence(today, e.month, e.day) }))
      .sort((a, b) => a.daysAway - b.daysAway);
  }, [today]);

  const swap = () => {
    setDirection((d) => (d === "toHijri" ? "toGregorian" : "toHijri"));
    setEntered(null);
  };

  const active = direction === "toHijri" ? gregorianInput : hijriInput;
  const months = direction === "toHijri" ? GREGORIAN_MONTHS : HIJRI_MONTHS;

  if (!today || !active || !converted) {
    return (
      <div className="answer-panel relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <p className="text-lg text-white/85">{t("Reading today's date…")}</p>
      </div>
    );
  }

  return (
    <div className="stagger space-y-4">
      {/* ---------- Today ---------- */}
      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/30 sm:h-52 sm:w-52" />
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          Today
        </p>
        <p className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {formatHijri(gregorianToHijri(today.year, today.month, today.day))}
        </p>
        <p className="mt-1.5 text-lg text-white/85">
          {formatGregorian(today)}
          {" · "}
          {isHijriLeapYear(
            gregorianToHijri(today.year, today.month, today.day).year,
          )
            ? "a 355-day year"
            : "a 354-day year"}
        </p>
      </section>

      {/* ---------- Convert ---------- */}
      <Card className="no-print">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <StepHeading
            n={1}
            title={direction === "toHijri" ? t("Gregorian to Hijri") : t("Hijri to Gregorian")}
            sub={t("Type any date and the other calendar follows. The fields start on today.")}
          />
          <button
            type="button"
            onClick={swap}
            className="press shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
          >
            Swap direction
          </button>
        </div>

        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <NumberField
            label={t("Day")}
            hint={t("1 to 30")}
            value={active.day}
            onChange={(v) => setEntered({ ...active, day: v })}
            whole
          />
          <label className="block min-w-0">
            <span className="block text-base font-medium">Month</span>
            <span className="mt-1 block text-sm leading-snug text-muted">
              {direction === "toHijri" ? "Gregorian" : "Hijri"}
            </span>
            <span className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-line bg-surface transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
              <select
                value={active.month}
                onChange={(e) =>
                  setEntered({ ...active, month: Number(e.target.value) })
                }
                aria-label={t("Month")}
                className="w-full min-w-0 cursor-pointer bg-transparent px-3 py-3 text-[1.0625rem] outline-none"
              >
                {months.map((m, i) => (
                  <option key={t(m)} value={i + 1}>
                    {t(m)}
                  </option>
                ))}
              </select>
            </span>
          </label>
          <NumberField
            label={t("Year")}
            hint={direction === "toHijri" ? "CE" : "AH"}
            value={active.year}
            onChange={(v) => setEntered({ ...active, year: v })}
            whole
          />
        </div>

        <div className="mt-5 rounded-xl bg-brand-soft p-5">
          <p className="text-sm text-muted">
            {direction === "toHijri" ? t("In the Hijri calendar") : t("In the Gregorian calendar")}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-brand sm:text-3xl">
            {converted.label}
          </p>
        </div>
      </Card>

      {/* ---------- What is coming ---------- */}
      <Card>
        <h2 className="rule-gold display text-2xl">{t("What is coming")}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          By the arithmetic. Every one of these is announced by sighting in
          practice, so a day either way is normal and the announcement wins.
        </p>
        <ul className="mt-5 divide-y divide-line">
          {upcoming.map((e) => (
            <li
              key={e.name}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5"
            >
              <span className="text-lg font-medium">{t(e.name)}</span>
              <span className="flex flex-wrap items-baseline gap-x-3">
                <span className="tabular-nums text-muted">
                  {formatGregorian(e.gregorian)}
                </span>
                <span className="rounded-full bg-background px-2.5 py-0.5 text-sm font-medium tabular-nums">
                  {e.daysAway === 0
                    ? "today"
                    : e.daysAway === 1
                      ? "tomorrow"
                      : `in ${e.daysAway} days`}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="rule-gold display text-2xl">{t("Your zakat anniversary")}</h2>
        <p className="mt-4 text-base leading-relaxed">
          Zakat falls due once your wealth has stood above the nisab for a full
          lunar year, and the date it first crossed is your anniversary
          thereafter. Because the lunar year is about eleven days shorter, that
          date walks backwards through the Gregorian calendar — which is why
          fixing it to a Gregorian date slowly loses you a year.
        </p>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Convert the day it crossed above, note the Hijri date, and use that
          every year.
        </p>
        <Link
          href={lang === "bn" ? "/bn/zakat-calculator" : "/zakat-calculator"}
          className="press mt-4 inline-block rounded-xl bg-brand px-4 py-2.5 text-base font-semibold text-white transition hover:opacity-90"
        >
          Work out your zakat →
        </Link>
      </Card>

      <Notice tone="danger">
        <strong>{t("This is arithmetic, not a sighting.")}</strong> A Hijri month
        begins when the new crescent is seen, and that depends on where you
        are, on the weather, and on which authority your country follows. The
        tabular calendar used here is exact and always available, but it can
        differ from an announced date by a day — and around Ramadan and the two
        Eids it often does. For anything that turns on a single day, follow
        your local announcement.
      </Notice>
    </div>
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
