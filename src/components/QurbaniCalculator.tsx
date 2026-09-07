"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ANIMALS, planQurbani, type Animal, type Ruling } from "@/lib/qurbani";
import { SILVER_NISAB_GRAMS, GOLD_NISAB_GRAMS } from "@/lib/zakat";
import { plain } from "@/lib/format";
import { pricesIn, priceNote, symbolFor } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField } from "./ui";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function QurbaniCalculator() {
  const seed = pricesIn("USD");
  const [currency, setCurrency] = useState("USD");
  const [metalPrice, setMetalPrice] = useState(
    seed.available ? seed.silver.toFixed(3) : "",
  );
  const [standard, setStandard] = useState<"silver" | "gold">("silver");
  const [people, setPeople] = useState("4");
  const [animal, setAnimal] = useState<Animal>("cow");
  const [animalPrice, setAnimalPrice] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [buyingShares, setBuyingShares] = useState(true);
  const [ruling, setRuling] = useState<Ruling>("hanafi");
  const [wealth, setWealth] = useState("");

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

  const result = useMemo(
    () =>
      planQurbani({
        people: num(people),
        animal,
        animalPrice: num(animalPrice),
        sharePrice: num(sharePrice),
        buyingShares,
        ruling,
        wealth: num(wealth),
        nisab,
      }),
    [people, animal, animalPrice, sharePrice, buyingShares, ruling, wealth, nisab],
  );

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="Who and what"
          sub="A sheep or a goat stands for one person and cannot be divided. A cow, a buffalo or a camel carries seven — and seven is a ceiling, not a target."
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-5">
          {ANIMALS.map((a) => {
            const active = animal === a.key;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => {
                  setAnimal(a.key);
                  if (a.shares === 1) setBuyingShares(false);
                }}
                aria-pressed={active}
                className={`press rounded-xl border px-3 py-3 text-left transition ${
                  active ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
                }`}
              >
                <span className={`block text-base font-semibold ${active ? "text-brand" : ""}`}>
                  {a.label}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {a.shares === 1 ? "1 person" : `${a.shares} shares`}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          Minimum age for a {result.spec.label.toLowerCase()}:{" "}
          <strong className="text-foreground">{result.spec.age}</strong>. The
          animal must also be free of the defects that disqualify it — blind in
          an eye, visibly lame, plainly ill, or emaciated.
        </p>

        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <NumberField
            label="People to cover"
            hint="Everyone the household is sacrificing for"
            value={people}
            onChange={setPeople}
            whole
          />
          <CurrencyPicker
            value={currency}
            onChange={changeCurrency}
            hint="Prices are in it"
          />
          {result.divisible && buyingShares ? (
            <NumberField
              label="Price of one share"
              hint="What a share in the animal costs"
              value={sharePrice}
              onChange={setSharePrice}
              prefix={symbolFor(currency)}
            />
          ) : (
            <NumberField
              label={`Price of one ${result.spec.label.toLowerCase()}`}
              hint="The whole animal"
              value={animalPrice}
              onChange={setAnimalPrice}
              prefix={symbolFor(currency)}
            />
          )}
        </div>

        {result.divisible && (
          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-base">
            <input
              type="checkbox"
              checked={buyingShares}
              onChange={(e) => setBuyingShares(e.target.checked)}
              className="mt-1 h-4.5 w-4.5 accent-[var(--brand)]"
            />
            <span>
              Buying shares rather than the whole animal
              <span className="mt-0.5 block text-sm leading-snug text-muted">
                Most people in the West buy shares through a mosque or a
                charity. Untick this if you are buying the animal outright.
              </span>
            </span>
          </label>
        )}
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="Is it obligatory on you?"
          sub="This is the one point where the schools genuinely part, and it changes whether missing it is a sin or a missed good deed."
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {(
            [
              ["hanafi", "Wajib above the nisab", "Hanafi — obligatory on anyone holding the threshold during Eid"],
              ["majority", "A confirmed sunnah", "Maliki, Shafi'i, Hanbali — strongly urged, not obligatory"],
            ] as const
          ).map(([value, label, who]) => (
            <button
              key={value}
              type="button"
              onClick={() => setRuling(value)}
              aria-pressed={ruling === value}
              className={`press rounded-xl border px-4 py-3 text-left transition ${
                ruling === value ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
              }`}
            >
              <span className={`block text-base font-semibold ${ruling === value ? "text-brand" : ""}`}>
                {label}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-muted">{who}</span>
            </button>
          ))}
        </div>

        {ruling === "hanafi" && (
          <>
            <div className="field-row mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
              <NumberField
                label="Wealth you hold over Eid"
                hint="Cash, gold, savings — no lunar year needed here"
                value={wealth}
                onChange={setWealth}
                prefix={symbolFor(currency)}
              />
              <NumberField
                label={`${standard === "silver" ? "Silver" : "Gold"} per gram`}
                hint="Sets the nisab"
                value={metalPrice}
                onChange={setMetalPrice}
                prefix={symbolFor(currency)}
              />
            </div>
            <div className="mt-4 flex gap-2">
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
                  {m} nisab
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {priceNote(pricesIn(currency))} Nisab works out at{" "}
              <strong className="text-foreground">
                {nisab > 0 ? plain(nisab) : "—"}
              </strong>
              .
            </p>
          </>
        )}
      </Card>

      {/* ---------- The answer ---------- */}
      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          What you need
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
          {result.shares > 0
            ? `${result.shares} ${result.shares === 1 ? "share" : "shares"}`
            : `${result.animals} ${result.spec.label.toLowerCase()}${result.animals === 1 ? "" : "s"}`}
        </p>
        <p className="mt-1.5 text-lg text-white/85">
          {result.needsPrice
            ? "Enter a price above to see the cost."
            : `${plain(result.cost)} in total, ${plain(result.costPerPerson)} a person`}
        </p>

        <p className="mt-5 border-t border-white/20 pt-4 text-base text-white/85">
          {result.rulingNote}
        </p>
      </section>

      {result.notes.length > 0 && (
        <Card>
          <h2 className="rule-gold display text-2xl">Worth knowing</h2>
          <div className="mt-4 space-y-3">
            {result.notes.map((n) => (
              <p key={n} className="text-base leading-relaxed text-muted">
                {n}
              </p>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="rule-gold display text-2xl">Dividing the meat</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {result.thirds.map((t) => (
            <div key={t.label} className="rounded-xl border border-line p-4">
              <p className="text-base font-semibold">{t.label}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.note}</p>
            </div>
          ))}
        </div>
      </Card>

      <Notice>
        <strong>The timing is fixed.</strong> The sacrifice is valid from after
        the Eid prayer on the tenth of Dhul Hijjah until sunset on the
        thirteenth. Slaughtered before the prayer it is ordinary meat, not a
        qurbani, and the obligation is not discharged.
      </Notice>

      <Card>
        <h2 className="rule-gold display text-2xl">If you hold the nisab</h2>
        <p className="mt-4 text-base leading-relaxed">
          The threshold that makes qurbani wajib on the Hanafi view is the same
          one zakat uses — so if you are above it over Eid, it is worth
          checking whether zakat is due as well. The difference is the lunar
          year: qurbani needs none, zakat does.
        </p>
        <Link
          href="/zakat-calculator"
          className="press mt-4 inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
        >
          Work out your zakat →
        </Link>
      </Card>

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> Whether a
        particular animal qualifies, whether a share arrangement through a
        charity is sound, and whether the threshold is met in your case are all
        questions of fact and of school. Ask locally — and where you are buying
        through a charity, ask them when and where the sacrifice is performed.
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
