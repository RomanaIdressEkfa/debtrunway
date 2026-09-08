"use client";

import { useMemo, useState } from "react";
import {
  calculateZakat,
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  RATE,
  type Standard,
} from "@/lib/zakat";
import { plain } from "@/lib/format";
import { priceNote, pricesIn, symbolFor } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { CornerMotif } from "./Ornament";
import PrintButton from "./PrintButton";
import { Card, Notice, NumberField as Money, WeightUnitPicker } from "./ui";
import { formatWeight, restate, toGrams, unitById } from "@/lib/weight";

/**
 * Prices are asked for rather than fetched.
 *
 * A live metals feed would mean a request from every visitor's browser to a
 * third party, on a site whose whole promise is that nothing leaves the page.
 * It would also break the moment the free tier ran out. Asking costs the
 * giver one lookup and keeps the calculation honest about where its numbers
 * came from.
 */

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const ASSETS = [
  {
    key: "cash",
    label: "Cash in hand",
    hint: "Notes and coins at home or on you",
  },
  {
    key: "bank",
    label: "Bank accounts",
    hint: "Current, savings and any money you can withdraw",
  },
  {
    key: "investments",
    label: "Shares, funds and pensions",
    hint: "What you could access today, at today's value",
  },
  {
    key: "businessStock",
    label: "Business stock",
    hint: "Goods held for resale, at what they would sell for",
  },
  {
    key: "receivables",
    label: "Money owed to you",
    hint: "Loans you expect to get back",
  },
] as const;

type AssetKey = (typeof ASSETS)[number]["key"];

export default function ZakatCalculator() {
  const [standard, setStandard] = useState<Standard>("silver");
  // Seeded from the price baked in at build time, so the page arrives with a
  // working nisab instead of an empty field and a homework assignment. It is
  // read from JSON in the bundle, not fetched, so the server and the client
  // render the same thing and hydration stays quiet.
  const seed = pricesIn("USD");
  const [currency, setCurrency] = useState("USD");
  const [goldPrice, setGoldPrice] = useState(
    seed.available ? seed.gold.toFixed(2) : "",
  );
  const [silverPrice, setSilverPrice] = useState(
    seed.available ? seed.silver.toFixed(3) : "",
  );

  // Changing the currency refills the prices. It overwrites whatever was
  // typed, which is the point: a gold price in pounds is wrong the moment the
  // reader switches to rupees, and leaving it there would be worse than
  // replacing it.
  const changeCurrency = (code: string) => {
    setCurrency(code);
    const next = pricesIn(code);
    if (next.available) {
      setGoldPrice(next.gold.toFixed(2));
      setSilverPrice(next.silver.toFixed(3));
    }
  };
  const [weightUnit, setWeightUnit] = useState("g");
  const [goldWeight, setGoldWeight] = useState("");
  const [silverWeight, setSilverWeight] = useState("");
  const [debts, setDebts] = useState("");
  const [amounts, setAmounts] = useState<Record<AssetKey, string>>({
    cash: "",
    bank: "",
    investments: "",
    businessStock: "",
    receivables: "",
  });
  const [heldAYear, setHeldAYear] = useState(true);

  const result = useMemo(
    () =>
      calculateZakat({
        goldPrice: num(goldPrice),
        silverPrice: num(silverPrice),
        standard,
        cash: num(amounts.cash),
        bank: num(amounts.bank),
        // The engine works in grams throughout; the unit is a matter of how
        // the weight was entered, not of what it is.
        goldGrams: toGrams(num(goldWeight), weightUnit),
        silverGrams: toGrams(num(silverWeight), weightUnit),
        investments: num(amounts.investments),
        businessStock: num(amounts.businessStock),
        receivables: num(amounts.receivables),
        debts: num(debts),
      }),
    [
      goldPrice,
      silverPrice,
      standard,
      amounts,
      goldWeight,
      silverWeight,
      weightUnit,
      debts,
    ],
  );

  const set = (key: AssetKey, value: string) =>
    setAmounts((a) => ({ ...a, [key]: value }));

  // Switching the unit restates what is in the fields rather than
  // reinterpreting the digits, so 40g of gold becomes 3.429355 bhori — not 40 bhori,
  // which would be twelve times the metal and would not look wrong on screen.
  const changeWeightUnit = (next: string) => {
    setGoldWeight((v) => restate(v, weightUnit, next));
    setSilverWeight((v) => restate(v, weightUnit, next));
    setWeightUnit(next);
  };

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1: the threshold ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="Set the nisab"
          sub="Nisab is a weight of gold or silver, not a fixed sum, so it moves with the market. Look up today's price per gram in your own currency and enter it here."
        />

        {/* One row of three rather than two rows and an empty spacer: the
            spacer only existed to push the prices onto their own line, and it
            made the subgrid straddle two bands of rows for no gain. */}
        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <CurrencyPicker
            value={currency}
            onChange={changeCurrency}
            hint="Prices are shown in it"
          />
          <Money
            label="Gold price per gram"
            prefix={symbolFor(currency)}
            hint="For gold you hold, or the gold nisab"
            value={goldPrice}
            onChange={setGoldPrice}
          />
          <Money
            label="Silver price per gram"
            prefix={symbolFor(currency)}
            hint="For silver you hold, or the silver nisab"
            value={silverPrice}
            onChange={setSilverPrice}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {priceNote(pricesIn(currency))}
        </p>

        <fieldset className="mt-5">
          <legend className="text-base font-semibold">Measure against</legend>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            The silver threshold is far lower, so it brings more people into
            zakat and more wealth to the poor. Most contemporary scholars
            recommend it for that reason. Some hold that gold better reflects
            what the original threshold was worth.
          </p>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {(
              [
                ["silver", "Silver", SILVER_NISAB_GRAMS, silverPrice],
                ["gold", "Gold", GOLD_NISAB_GRAMS, goldPrice],
              ] as const
            ).map(([value, label, grams, price]) => {
              const active = standard === value;
              const amount = grams * num(price);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStandard(value)}
                  aria-pressed={active}
                  className={`press rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-brand bg-brand-soft"
                      : "border-line hover:border-brand"
                  }`}
                >
                  <span
                    className={`block font-semibold ${active ? "text-brand" : ""}`}
                  >
                    {label} standard
                  </span>
                  {/* Also in bhori, because the gram figures look like odd
                      decimals until you know they are 7.5 and 52.5 tola —
                      which is the form South Asia has recorded for centuries
                      and the reason 87.48 is not a rounding artefact. */}
                  <span className="mt-1 block text-sm text-muted">
                    {grams}g — {formatWeight(grams, "tola")} of{" "}
                    {label.toLowerCase()}
                  </span>
                  <span className="mt-1.5 block text-base font-semibold tabular-nums">
                    {amount > 0 ? plain(amount) : "— enter a price"}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </Card>

      {/* ---------- Step 2: wealth ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="What you hold"
          sub="Everything you have owned for a full lunar year. Your home, your car, your furniture and the tools of your trade are not counted — zakat falls on wealth that grows, not on what you use."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ASSETS.map((a) => (
            <Money
              key={a.key}
              label={a.label}
              hint={a.hint}
              prefix={symbolFor(currency)}
              value={amounts[a.key]}
              onChange={(v) => set(a.key, v)}
            />
          ))}
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <WeightUnitPicker value={weightUnit} onChange={changeWeightUnit} />
          <div className="field-row mt-4 grid gap-4 sm:grid-cols-2">
            <Money
              label="Gold you own"
              hint="Jewellery, coins, bars — the whole weight, not the pure part"
              value={goldWeight}
              onChange={setGoldWeight}
              suffix={unitById(weightUnit).short}
            />
            <Money
              label="Silver you own"
              hint="Jewellery, coins, cutlery, bars"
              value={silverWeight}
              onChange={setSilverWeight}
              suffix={unitById(weightUnit).short}
            />
          </div>
          {weightUnit !== "g" && (
            <p className="mt-2.5 text-sm leading-snug text-muted">
              {goldWeight || silverWeight ? (
                <>
                  That is{" "}
                  <strong className="text-foreground tabular-nums">
                    {toGrams(
                      num(goldWeight) + num(silverWeight),
                      weightUnit,
                    ).toFixed(2)}
                    g
                  </strong>{" "}
                  of metal in total, which is what the prices above are quoted
                  against.
                </>
              ) : (
                <>
                  Enter the weight as your jeweller wrote it. Mixed carats are
                  fine here — for a piece-by-piece breakdown that takes the
                  alloy out, use the gold and silver calculator.
                </>
              )}
            </p>
          )}
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <Money
            label="Debts due now"
            prefix={symbolFor(currency)}
            hint="Bills and repayments you owe today — not the whole balance of a long-term loan"
            value={debts}
            onChange={setDebts}
          />
        </div>
      </Card>

      {/* ---------- Step 3: the year ---------- */}
      <Card className="no-print">
        <StepHeading
          n={3}
          title="Has a lunar year passed?"
          sub="Zakat falls due once your wealth has sat above the nisab for one full lunar year — the hawl. This is the one condition a form cannot check for you."
        />
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[
            [true, "Yes, a full year has passed"],
            [false, "No, or I am not sure"],
          ].map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setHeldAYear(value as boolean)}
              aria-pressed={heldAYear === value}
              className={`press rounded-xl border px-4 py-3.5 text-left text-base font-medium transition ${
                heldAYear === value
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-line text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {/* ---------- The answer ---------- */}
      {result.needsPrice ? (
        <Notice>
          Enter the {result.standard} price per gram above and the nisab will
          appear, along with what you owe.
        </Notice>
      ) : (
        <>
          <section
            className={`answer-panel shimmer relative isolate overflow-hidden rounded-2xl p-5 text-white sm:p-7 ${
              result.due ? "bg-brand-panel" : "bg-danger-panel"
            }`}
          >
            <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              {result.due ? "Zakat due at 2.5%" : "Below the nisab"}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {result.due ? plain(result.zakat) : plain(0)}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              {result.due
                ? heldAYear
                  ? "payable now, on the wealth below"
                  : "payable once a full lunar year has passed"
                : `your wealth is ${plain(result.shortfall)} short of the threshold`}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
              {[
                ["Zakatable wealth", plain(result.totalAssets)],
                ["Less debts", plain(result.totalDebts)],
                ["Net", plain(result.net)],
                [
                  `Nisab (${result.standard})`,
                  plain(result.nisab),
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {result.due && !heldAYear && (
            <Notice>
              Your wealth is above the nisab, but zakat only falls due once it
              has stayed there for a full lunar year. Note the date it first
              crossed the threshold — that date becomes your zakat anniversary
              for every year after.
            </Notice>
          )}

          {result.assets.length > 0 && (
            <Card>
              <h2 className="text-lg font-bold tracking-tight">
                What was counted
              </h2>
              <table className="mt-4 w-full border-collapse text-base">
                <tbody>
                  {result.assets.map((line) => (
                    <tr key={line.label} className="border-b border-line">
                      <td className="py-2.5 pr-4">
                        {line.label}
                        {line.hint && (
                          <span className="mt-1 block text-sm text-muted">
                            {line.hint}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-right tabular-nums">
                        {plain(line.amount)}
                      </td>
                    </tr>
                  ))}
                  {result.totalDebts > 0 && (
                    <tr className="border-b border-line">
                      <td className="py-2.5 pr-4 text-muted">Debts due now</td>
                      <td className="py-2.5 text-right tabular-nums text-muted">
                        −{plain(result.totalDebts)}
                      </td>
                    </tr>
                  )}
                  <tr className="font-semibold">
                    <td className="py-3 pr-4">Net zakatable wealth</td>
                    <td className="py-3 text-right tabular-nums">
                      {plain(result.net)}
                    </td>
                  </tr>
                  {result.due && (
                    <tr className="border-t border-line font-bold text-brand">
                      <td className="py-3 pr-4">
                        Zakat at {(RATE * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 text-right tabular-nums">
                        {plain(result.zakat)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      {!result.needsPrice && (
        <PrintButton
          label="Save this calculation as a PDF"
          hint="Opens your browser’s print dialogue. Choose “Save as PDF” as the destination. Nothing is uploaded to make the file."
        />
      )}

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> It covers zakat on
        money, gold, silver, stock and investments. Zakat on crops, livestock
        and mined wealth follows different rates and thresholds entirely, and
        scholars differ on pensions you cannot yet draw, debts you may never
        recover, and jewellery in regular use. Ask someone qualified about your
        own situation.
      </Notice>
    </div>
  );
}

/* ---------- small pieces ---------- */

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

