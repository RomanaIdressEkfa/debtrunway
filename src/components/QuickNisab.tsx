"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RATE, SILVER_NISAB_GRAMS, GOLD_NISAB_GRAMS } from "@/lib/zakat";
import { plain } from "@/lib/format";
import { pricesIn } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";

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

  const grams = metal === "silver" ? SILVER_NISAB_GRAMS : GOLD_NISAB_GRAMS;

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

  const { nisab, due, zakat, gap, ready } = useMemo(() => {
    const unit = num(price);
    const net = num(wealth);
    const nisab = grams * unit;
    const ready = unit > 0 && net > 0;
    return {
      nisab,
      ready,
      due: ready && net >= nisab,
      zakat: net * RATE,
      gap: nisab - net,
    };
  }, [wealth, price, grams]);

  return (
    <div className="card-shadow rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="text-xl font-bold tracking-tight">
        Do you owe zakat this year?
      </h2>
      <p className="mt-1.5 text-base leading-relaxed text-muted">
        Two numbers will tell you. Nisab is a weight of metal, so it moves with
        the market — look up today&rsquo;s price and the threshold follows.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block min-w-0">
          <span className="block text-base font-medium">
            What you hold, in total
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">
            Cash, bank, gold, investments — minus what you owe now
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
              Yes — your wealth is above the nisab of {plain(nisab)}.
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
              No — you are {plain(gap)} below the nisab of {plain(nisab)}.
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
        that count from the ones that do not, deducts the debts you owe now,
        and asks about the lunar year — all of which can change the answer.
      </p>
    </div>
  );
}
