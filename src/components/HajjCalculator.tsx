"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { monthlyForTarget, planHajj } from "@/lib/hajj";
import { SILVER_NISAB_GRAMS, GOLD_NISAB_GRAMS } from "@/lib/zakat";
import { plain } from "@/lib/format";
import { priceNote, pricesIn, symbolFor } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField as Money } from "./ui";
import { bnRest } from "@/lib/bn-faraid";
import type { Locale } from "@/lib/i18n";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

type Mode = "byAmount" | "byDate";

export default function HajjCalculator({
  lang = "en",
}: {
  /** Labels only. Every engine behind this page is language-neutral. */
  lang?: Locale;
} = {}) {
  const t = lang === "bn" ? bnRest : (s: string) => s;
  const seed = pricesIn("USD");
  const [currency, setCurrency] = useState("USD");
  const [metalPrice, setMetalPrice] = useState(
    seed.available ? seed.silver.toFixed(3) : "",
  );
  const [standard, setStandard] = useState<"silver" | "gold">("silver");
  const [target, setTarget] = useState("8000");
  const [saved, setSaved] = useState("");
  const [monthly, setMonthly] = useState("200");
  const [years, setYears] = useState("5");
  const [other, setOther] = useState("");
  const [applyZakat, setApplyZakat] = useState(true);
  const [mode, setMode] = useState<Mode>("byAmount");

  const grams = standard === "silver" ? SILVER_NISAB_GRAMS : GOLD_NISAB_GRAMS;
  const nisab = grams * num(metalPrice);

  const changeCurrency = (code: string) => {
    setCurrency(code);
    const next = pricesIn(code);
    if (next.available) {
      setMetalPrice(
        standard === "silver" ? next.silver.toFixed(3) : next.gold.toFixed(2),
      );
    }
  };

  const changeStandard = (m: "silver" | "gold") => {
    setStandard(m);
    const p = pricesIn(currency);
    if (p.available) {
      setMetalPrice(m === "silver" ? p.silver.toFixed(3) : p.gold.toFixed(2));
    }
  };

  const base = {
    target: num(target),
    saved: num(saved),
    nisab,
    otherWealth: num(other),
    applyZakat,
  };

  const result = useMemo(
    () => planHajj({ ...base, monthly: num(monthly) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target, saved, monthly, nisab, other, applyZakat],
  );

  const needed = useMemo(
    () =>
      mode === "byDate"
        ? monthlyForTarget(base, Math.max(1, Math.round(num(years) * 12)))
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, target, saved, years, nisab, other, applyZakat],
  );

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title={t("The journey and what you have")}
          sub="Package costs vary enormously by country and by season. Use a quote from an operator you would actually travel with rather than a global average."
        />
        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <CurrencyPicker
            value={currency}
            onChange={changeCurrency}
            hint={t("Amounts are in it")}
          />
          <Money
            label={t("What Hajj will cost")}
            prefix={symbolFor(currency)}
            hint={t("A real quote, not an average")}
            value={target}
            onChange={setTarget}
            large
          />
          <Money
            label={t("Saved so far")}
            prefix={symbolFor(currency)}
            hint={t("What is already put by")}
            value={saved}
            onChange={setSaved}
          />
        </div>
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title={t("How you want to plan it")}
          sub={t("Either fix what you can put aside and find the date, or fix the date and find what it takes.")}
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {(
            [
              ["byAmount", "I can save this much", "Tell me when I get there"],
              ["byDate", "I want to go by then", "Tell me what it takes a month"],
            ] as const
          ).map(([value, label, why]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              className={`press rounded-xl border px-4 py-3 text-left transition ${
                mode === value ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
              }`}
            >
              <span className={`block text-base font-semibold ${mode === value ? "text-brand" : ""}`}>
                {label}
              </span>
              <span className="mt-0.5 block text-sm text-muted">{why}</span>
            </button>
          ))}
        </div>

        <div className="mt-5">
          {mode === "byAmount" ? (
            <Money
              label={t("Set aside each month")}
            prefix={symbolFor(currency)}
              hint={t("Nothing is assumed to grow — no interest, and no investment return either")}
              value={monthly}
              onChange={setMonthly}
              large
            />
          ) : (
            <Money
              label={t("Years from now")}
              hint={t("Hajj falls about eleven days earlier each solar year")}
              value={years}
              onChange={setYears}
              large
            />
          )}
        </div>
      </Card>

      {/* ---------- Step 3 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={3}
          title={t("Zakat on the savings")}
          sub="Money set aside for Hajj is still your wealth. Above the nisab, and once a lunar year has passed over it, zakat is due on the whole balance — every year it sits there."
        />

        <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-base">
          <input
            type="checkbox"
            checked={applyZakat}
            onChange={(e) => setApplyZakat(e.target.checked)}
            className="mt-1 h-4.5 w-4.5 accent-[var(--brand)]"
          />
          <span>
            Take the zakat out of the pot each year
            <span className="mt-0.5 block text-sm leading-snug text-muted">
              Leave this on unless you intend to pay the zakat from elsewhere.
              Turning it off does not make the zakat go away.
            </span>
          </span>
        </label>

        <div className="mt-5 grid items-end gap-4 border-t border-line pt-5 sm:grid-cols-3">
          <Money
            label={`${standard === "silver" ? "Silver" : "Gold"} price per gram`}
            hint={t("Sets the nisab")}
            value={metalPrice}
            onChange={setMetalPrice}
          />
          <fieldset>
            <legend className="text-base font-medium">Nisab against</legend>
            <div className="mt-2 flex gap-2">
              {(["silver", "gold"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => changeStandard(m)}
                  aria-pressed={standard === m}
                  className={`press flex-1 rounded-xl border px-3 py-2.5 text-base font-medium capitalize transition ${
                    standard === m
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line text-muted hover:border-brand"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </fieldset>
          <Money
            label={t("Other wealth you hold")}
            prefix={symbolFor(currency)}
            hint={t("The threshold is measured on everything together")}
            value={other}
            onChange={setOther}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {priceNote(pricesIn(currency))} Nisab works out at{" "}
          <strong className="text-foreground">{nisab > 0 ? plain(nisab) : "—"}</strong>{" "}
          ({grams}g of {standard}).
        </p>
      </Card>

      {/* ---------- The answer ---------- */}
      {mode === "byDate" ? (
        <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
          <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
          <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
          <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            To go in {num(years) || 0} {num(years) === 1 ? "year" : "years"}
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
            {needed === null ? "—" : plain(needed)}
            <span className="ml-2 text-lg font-medium text-white/80">a month</span>
          </p>
          <p className="mt-1.5 text-lg text-white/85">
            {needed === null
              ? "Enter a cost and a number of years above."
              : applyZakat
                ? "including the zakat the pot will owe on the way"
                : "with the zakat paid from elsewhere"}
          </p>
        </section>
      ) : result.alreadyThere ? (
        <Notice>
          You already have what the journey costs. What remains is the
          paperwork and the intention.
        </Notice>
      ) : result.neverReaches ? (
        <Notice tone="danger">
          At {plain(num(monthly))} a month the pot never reaches{" "}
          {plain(num(target))}
          {applyZakat && nisab > 0 ? (
            <>
              {" "}
              — the yearly zakat takes out more than the contributions add
              above the threshold. A larger monthly amount, or paying the zakat
              from elsewhere, closes the gap.
            </>
          ) : (
            <> within sixty years. Try a larger monthly amount.</>
          )}
        </Notice>
      ) : (
        <>
          <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
            <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              You reach it in
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {result.years > 0 && (
                <>
                  {result.years}
                  <span className="mx-1.5 text-lg font-medium text-white/80">
                    {result.years === 1 ? "year" : "years"}
                  </span>
                </>
              )}
              {result.remainingMonths > 0 && (
                <>
                  {result.remainingMonths}
                  <span className="ml-1.5 text-lg font-medium text-white/80">
                    {result.remainingMonths === 1 ? "month" : "months"}
                  </span>
                </>
              )}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              {result.months} monthly payments of {plain(num(monthly))}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
              {[
                ["You put in", plain(result.contributed)],
                ["Zakat paid on the way", plain(result.zakatPaid)],
                ["Zakat years", String(result.zakatYears)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {result.zakatPaid > 0 && result.naiveMonths !== null && (
            <Card>
              <h2 className="rule-gold display text-2xl">
                What plain division would have told you
              </h2>
              <p className="mt-4 text-base leading-relaxed">
                Dividing the target by the monthly amount gives{" "}
                <strong>{result.naiveMonths} months</strong>. The real answer is{" "}
                <strong>{result.months}</strong>, because{" "}
                {plain(result.zakatPaid)} of zakat came out of the pot over{" "}
                {result.zakatYears}{" "}
                {result.zakatYears === 1 ? "year" : "years"} while it sat above
                the nisab.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                That zakat is owed whether or not a calculator mentions it. The
                only choice is whether it comes out of this pot or out of
                something else — and a plan that ignores it arrives short.
              </p>
              <Link
                href="/zakat-calculator"
                className="press mt-4 inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
              >
                Work out your zakat properly →
              </Link>
            </Card>
          )}
        </>
      )}

      <Notice tone="danger">
        <strong>This is a plan, not a quote.</strong> Package prices move with
        the season, the currency and the operator, and the obligation itself
        depends on being able to afford the journey and the maintenance of
        those you leave behind, without borrowing. Nothing here is assumed to
        grow: no interest, and no investment return either, because a return is
        not something a plan should count on.
      </Notice>
    </div>
  );
}

/* ---------- small pieces ---------- */

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

