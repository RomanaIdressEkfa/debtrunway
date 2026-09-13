"use client";

import { useMemo, useState } from "react";
import { calculateFitr, STAPLES, type Measure } from "@/lib/fitr";
import { plain } from "@/lib/format";
import { CornerMotif } from "./Ornament";
import { Card, Notice } from "./ui";
import { bnFitrQurbani } from "@/lib/bn-faraid";
import type { Locale } from "@/lib/i18n";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function FitrCalculator({
  lang = "en",
}: {
  /** Labels only. The ruling and the arithmetic are identical either way. */
  lang?: Locale;
} = {}) {
  const t = lang === "bn" ? bnFitrQurbani : (s: string) => s;
  const [people, setPeople] = useState(4);
  const [staple, setStaple] = useState("rice");
  const [measure, setMeasure] = useState<Measure>("full");
  const [price, setPrice] = useState("");

  const result = useMemo(
    () =>
      calculateFitr({
        people,
        staple,
        measure,
        pricePerKg: num(price),
      }),
    [people, staple, measure, price],
  );

  return (
    <div className="stagger space-y-4">
      <Card className="no-print">
        <StepHeading
          n={1}
          title={t("Who you are paying for")}
          sub="The head of a household pays for everyone under their roof and in their care — spouse, children, an infant born before the Eid prayer, and any dependent relative."
        />

        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3.5">
          <span className="text-base font-medium">{t("People in the household")}</span>
          <span className="flex shrink-0 items-center gap-1">
            <Step
              sign="−"
              label={t("One fewer person")}
              disabled={people <= 1}
              onClick={() => setPeople((n) => Math.max(1, n - 1))}
            />
            <span className="w-8 text-center text-lg font-bold tabular-nums">
              {people}
            </span>
            <Step
              sign="+"
              label={t("One more person")}
              disabled={people >= 30}
              onClick={() => setPeople((n) => Math.min(30, n + 1))}
            />
          </span>
        </div>
      </Card>

      <Card className="no-print">
        <StepHeading
          n={2}
          title={t("Which staple, and at what price")}
          sub="A sa' is a measure of volume, not weight, so a sa' of rice and a sa' of dates do not weigh the same. Pick the staple your community pays in and enter its local price."
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {STAPLES.map((s) => {
            const active = staple === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStaple(s.key)}
                aria-pressed={active}
                className={`press rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-brand bg-brand-soft"
                    : "border-line hover:border-brand"
                }`}
              >
                <span
                  className={`block text-base font-semibold ${active ? "text-brand" : ""}`}
                >
                  {t(s.label)}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {s.kgPerSaa} kg per sa&rsquo;
                </span>
              </button>
            );
          })}
        </div>

        {staple === "wheat" && (
          <fieldset className="mt-5">
            <legend className="text-base font-semibold">{t("How much wheat")}</legend>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              The Hanafi school permits half a sa&rsquo; of wheat in place of a
              full one, wheat having been the more valuable staple. The other
              schools hold to a full sa&rsquo;. This changes the amount owed, so
              it is your choice and not a default.
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  ["full", "A full sa'", "Maliki, Shafi'i, Hanbali"],
                  ["halfWheat", t("Half a sa'"), t("Hanafi, for wheat")],
                ] as const
              ).map(([value, label, who]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMeasure(value)}
                  aria-pressed={measure === value}
                  className={`press rounded-xl border px-4 py-3 text-left transition ${
                    measure === value
                      ? "border-brand bg-brand-soft"
                      : "border-line hover:border-brand"
                  }`}
                >
                  <span
                    className={`block text-base font-semibold ${measure === value ? "text-brand" : ""}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{who}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <label className="mt-5 block">
          <span className="block text-base font-medium">
            Price of one kilogram
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">
            In your own currency. Many people pay the food itself, in which case
            you only need the weight below.
          </span>
          <span className="mt-2 flex items-center rounded-xl border border-line px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              inputMode="decimal"
              aria-label={t("Price per kilogram")}
              className="w-full min-w-0 bg-transparent py-3 text-lg font-semibold tabular-nums outline-none"
            />
            <span className="shrink-0 text-sm text-muted">per kg</span>
          </span>
        </label>
      </Card>

      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          Zakat al-Fitr for {result.people}{" "}
          {result.people === 1 ? "person" : "people"}
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
          {result.totalKg.toFixed(1)} kg
        </p>
        <p className="mt-1.5 text-lg text-white/85">
          of {result.staple.label.toLowerCase()} —{" "}
          {result.kgPerPerson.toFixed(1)} kg each
        </p>

        {!result.needsPrice && (
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5">
            <div>
              <dt className="text-xs text-white/60">{t("Per person")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                {plain(result.perPerson)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-white/60">{t("Total to give")}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums">
                {plain(result.total)}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <Notice>
        <strong>{t("It has to arrive before the Eid prayer.")}</strong> Given after it,
        it counts as ordinary sadaqah and the obligation of zakat al-Fitr is not
        discharged. Paying a day or two early, so the recipient can actually use
        it for Eid, is the point of the timing.
      </Notice>

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> The weight of a
        sa&rsquo; in kilograms is a conversion from a volume measure, and mosques
        and councils publish slightly different figures for the same staple.
        Where your local mosque announces an amount, follow it — they are
        pricing the staple your community actually eats.
      </Notice>
    </div>
  );
}

function StepHeading({
  n,
  title,
  sub,
}: {
  n: number;
  title: string;
  sub: string;
}) {
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

function Step({
  sign,
  label,
  disabled,
  onClick,
}: {
  sign: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="press flex h-9 w-9 items-center justify-center rounded-lg border border-line text-lg leading-none text-muted transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
    >
      {sign}
    </button>
  );
}
