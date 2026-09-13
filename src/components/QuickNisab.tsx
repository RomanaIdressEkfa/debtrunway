"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RATE, SILVER_NISAB_GRAMS, GOLD_NISAB_GRAMS } from "@/lib/zakat";
import { plain } from "@/lib/format";
import { pricesIn } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { WEIGHT_UNITS, restate, toGrams, unitById } from "@/lib/weight";

/**
 * The homepage tool: one question, three fields, an answer before you scroll.
 *
 * A hub of links tells a first-time visitor nothing about whether the site
 * works. This answers the question most people actually arrive with — am I
 * liable this year — and hands them to the full calculator for the breakdown.
 *
 * It is deliberately not the zakat calculator over again. That page counts
 * seven kinds of asset, deducts debts, and asks about the lunar year; this one
 * asks for a single total and says yes or no. Two pages that did the same
 * thing would compete with each other in search and win less than one.
 */

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function QuickNisab() {
  const seed = pricesIn("USD");
  const [wealth, setWealth] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [metal, setMetal] = useState<"silver" | "gold">("silver");
  const [price, setPrice] = useState(
    seed.available ? seed.silver.toFixed(3) : "",
  );

  /**
   * Gold and silver by weight, because that is how people hold them.
   *
   * Asking only for a money total meant a reader with jewellery had to price
   * it themselves before they could use this at all — and in Bangladesh,
   * Pakistan and India they do not know it as a money figure in the first
   * place. They know it as so many bhori. Asking for the weight and doing the
   * valuation here removes the one step that stopped the box being usable.
   */
  const [goldWeight, setGoldWeight] = useState("");
  const [silverWeight, setSilverWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("tola");

  const grams = metal === "silver" ? SILVER_NISAB_GRAMS : GOLD_NISAB_GRAMS;

  // Switching the unit restates what is typed rather than reinterpreting the
  // digits — 40g of gold becomes 3.429355 bhori, not 40 bhori.
  const changeWeightUnit = (next: string) => {
    setGoldWeight((v) => restate(v, weightUnit, next));
    setSilverWeight((v) => restate(v, weightUnit, next));
    setWeightUnit(next);
  };

  // Switching either the metal or the currency refills the price, since the
  // number in the field belongs to the pair and not to one of them.
  const refill = (nextMetal: "silver" | "gold", nextCurrency: string) => {
    setMetal(nextMetal);
    setCurrency(nextCurrency);
    const p = pricesIn(nextCurrency);
    if (p.available) {
      setPrice(
        nextMetal === "silver" ? p.silver.toFixed(3) : p.gold.toFixed(2),
      );
    }
  };

  const { nisab, due, zakat, gap, ready, metalValue, net } = useMemo(() => {
    const unit = num(price);
    const live = pricesIn(currency);

    // The typed price field belongs to whichever metal the nisab is measured
    // against. The *other* metal still has to be valued, and the only honest
    // source for it is the build-time rate — so it is used, and the panel
    // says which figure came from where rather than blending them silently.
    const goldPerGram = metal === "gold" ? unit : live.available ? live.gold : 0;
    const silverPerGram =
      metal === "silver" ? unit : live.available ? live.silver : 0;

    const metalValue =
      toGrams(num(goldWeight), weightUnit) * goldPerGram +
      toGrams(num(silverWeight), weightUnit) * silverPerGram;

    const net = num(wealth) + metalValue;
    const nisab = grams * unit;
    const ready = unit > 0 && net > 0;
    return {
      nisab,
      ready,
      net,
      metalValue,
      due: ready && net >= nisab,
      zakat: net * RATE,
      gap: nisab - net,
    };
  }, [wealth, price, grams, goldWeight, silverWeight, weightUnit, metal, currency]);

  return (
    <div className="card-shadow rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="text-xl font-bold tracking-tight">
        Do you owe zakat this year?
      </h2>
      <p className="mt-1.5 text-base leading-relaxed text-muted">
        Two numbers will tell you. Nisab is a weight of metal, so it moves with
        the market — look up today&rsquo;s price and the threshold follows.
      </p>

      {/* field-row, which every calculator page already uses.
          Without it the two fields are independent columns, so the one with
          the shorter hint floats its input a line higher than the other —
          which is exactly what happened the moment this hint grew to two
          lines. The subgrid pins the label, the hint and the box to shared
          rows, so the boxes stay level however long either hint runs. */}
      <div className="field-row mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="block text-base font-medium">
            What you hold, in total
          </span>
          {/* Gold is deliberately NOT named here any more.
              It used to say "and gold at its sale value", which was right
              when this was the only field. With weight fields below it, a
              reader who followed both instructions would enter their
              jewellery twice and be told they owe double. Money here, metal
              there, and neither hint mentions the other's job. */}
          <span className="mt-1 block text-sm leading-snug text-muted">
            নগদ, ব্যাংক, বিনিয়োগ — সোনা-রুপা নিচে
            <span className="mt-0.5 block">
              Cash, bank and investments only — less what you owe now
            </span>
          </span>
          <span className="mt-2 flex items-center rounded-xl border border-line px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <input
              value={wealth}
              onChange={(e) => setWealth(e.target.value)}
              placeholder="0"
              inputMode="decimal"
              aria-label="Total wealth"
              className="w-full min-w-0 bg-transparent py-3 text-xl font-bold tabular-nums outline-none"
            />
          </span>
        </label>

        <label className="block min-w-0">
          <span className="block text-base font-medium">
            {metal === "silver" ? "Silver" : "Gold"} price per gram
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">
            In the same currency as above
          </span>
          <span className="mt-2 flex items-center rounded-xl border border-line px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              inputMode="decimal"
              aria-label={`${metal} price per gram`}
              className="w-full min-w-0 bg-transparent py-3 text-xl font-bold tabular-nums outline-none"
            />
          </span>
        </label>
      </div>

      {/* Metal by weight. Bhori is the default unit rather than the gram,
          because someone who needs this box to do the valuation for them is
          almost certainly the reader who thinks in bhori — a reader who
          already knows the gram figure could have priced it themselves. */}
      <div className="field-row mt-4 grid gap-4 sm:grid-cols-2">
        <WeightField
          label="সোনা · Gold you own"
          hint={`কত ${weightUnit === "tola" ? "ভরি" : ""} সোনা আছে — খালি থাকলে ধরা হবে না`}
          value={goldWeight}
          onChange={setGoldWeight}
          unit={unitById(weightUnit).short}
        />
        <WeightField
          label="রুপা · Silver you own"
          hint="রুপার ওজন — না থাকলে খালি রাখুন"
          value={silverWeight}
          onChange={setSilverWeight}
          unit={unitById(weightUnit).short}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">ওজনের একক</span>
        {WEIGHT_UNITS.filter((u) => u.id !== "anna").map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => changeWeightUnit(u.id)}
            aria-pressed={weightUnit === u.id}
            className={`press rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              weightUnit === u.id
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-muted hover:border-brand hover:text-brand"
            }`}
          >
            {u.label}
          </button>
        ))}
        {metalValue > 0 && (
          <span className="text-sm text-muted">
            metal is worth{" "}
            <strong className="text-foreground tabular-nums">
              {plain(metalValue)}
            </strong>
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">Measure against</span>
        {(["silver", "gold"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => refill(m, currency)}
            aria-pressed={metal === m}
            className={`press rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition ${
              metal === m
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-muted hover:border-brand hover:text-brand"
            }`}
          >
            {m}
          </button>
        ))}
        <span className="text-sm text-muted">({grams}g)</span>
        <span className="ml-auto">
          <CurrencyPicker
            value={currency}
            onChange={(c) => refill(metal, c)}
            compact
          />
        </span>
      </div>

      {/* The answer replaces a placeholder rather than appearing below it, so
          the card does not jump the moment someone finishes typing. */}
      <div
        aria-live="polite"
        className={`mt-5 rounded-xl border p-4 ${
          !ready
            ? "border-dashed border-line"
            : due
              ? "border-brand/30 bg-brand-soft"
              : "border-line bg-background"
        }`}
      >
        {!ready ? (
          <p className="text-base text-muted">
            Fill both fields and the answer appears here.
          </p>
        ) : due ? (
          <>
            <p className="text-base font-semibold text-brand">
              Yes — your {plain(net)} is above the nisab of {plain(nisab)}.
            </p>
            <p className="mt-1.5 text-base text-muted">
              At 2.5% that is roughly{" "}
              <strong className="text-foreground">{plain(zakat)}</strong>, if it
              has been above the threshold for a full lunar year.
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold">
              No — your {plain(net)} is {plain(gap)} below the nisab of{" "}
              {plain(nisab)}.
            </p>
            <p className="mt-1.5 text-base text-muted">
              No zakat is due on this wealth. Sadaqah remains open to you at any
              amount.
            </p>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link
          href="/zakat-calculator"
          className="press rounded-xl bg-brand px-4 py-2.5 text-base font-semibold text-white transition hover:opacity-90"
        >
          Full zakat calculator →
        </Link>
        <Link
          href="/islamic-inheritance-calculator"
          className="press rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
        >
          Inheritance calculator
        </Link>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        {seed.available
          ? `Prices are the market rate on ${seed.fetchedAt}, filled in for you — change them if your local rate differs. `
          : ""}
        A rough check, not a ruling. The full calculator separates the assets
        that count from the ones that do not, takes gold and silver by weight
        in grams or bhori rather than asking you to value them, deducts the debts
        you owe now, and asks about the lunar year — all of which can change
        the answer.
      </p>
    </div>
  );
}

function WeightField({
  label,
  hint,
  value,
  onChange,
  unit,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-base font-medium">{label}</span>
      <span className="mt-1 block text-sm leading-snug text-muted">{hint}</span>
      <span className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-line transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          aria-label={label}
          className="w-full min-w-0 bg-transparent px-3 py-3 text-xl font-bold tabular-nums outline-none"
        />
        <span className="flex shrink-0 items-center border-l border-line bg-background px-3 text-sm font-medium text-muted">
          {unit}
        </span>
      </span>
    </label>
  );
}
