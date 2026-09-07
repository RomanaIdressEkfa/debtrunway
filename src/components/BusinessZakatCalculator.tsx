"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  RATE,
  calculateBusinessZakat,
  type DoubtfulView,
} from "@/lib/business-zakat";
import { SILVER_NISAB_GRAMS, GOLD_NISAB_GRAMS } from "@/lib/zakat";
import { plain } from "@/lib/format";
import { pricesIn, priceNote } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { CornerMotif } from "./Ornament";
import PrintButton from "./PrintButton";
import { Card, Notice } from "./ui";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const ASSETS = [
  {
    key: "finishedStock",
    label: "Finished stock",
    hint: "At what it would sell for, not what it cost",
  },
  {
    key: "rawMaterials",
    label: "Raw materials",
    hint: "Bought to become goods for sale",
  },
  {
    key: "workInProgress",
    label: "Work in progress",
    hint: "Part-finished, valued as it stands",
  },
  {
    key: "cash",
    label: "Cash in the business",
    hint: "Till, safe and business accounts",
  },
  {
    key: "goodReceivables",
    label: "Invoices you expect to collect",
    hint: "A debt you will be paid is wealth you hold",
  },
  {
    key: "doubtfulReceivables",
    label: "Invoices you may never collect",
    hint: "Bad debts, disputed bills, customers who have gone",
  },
] as const;

type AssetKey = (typeof ASSETS)[number]["key"];

export default function BusinessZakatCalculator() {
  const seed = pricesIn("USD");
  const [currency, setCurrency] = useState("USD");
  const [metalPrice, setMetalPrice] = useState(
    seed.available ? seed.silver.toFixed(3) : "",
  );
  const [standard, setStandard] = useState<"silver" | "gold">("silver");
  const [amounts, setAmounts] = useState<Record<AssetKey, string>>({
    finishedStock: "",
    rawMaterials: "",
    workInProgress: "",
    cash: "",
    goodReceivables: "",
    doubtfulReceivables: "",
  });
  const [payables, setPayables] = useState("");
  const [fixedAssets, setFixedAssets] = useState("");
  const [ownership, setOwnership] = useState("100");
  const [personal, setPersonal] = useState("");
  const [doubtfulView, setDoubtfulView] = useState<DoubtfulView>("exclude");

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
      calculateBusinessZakat({
        finishedStock: num(amounts.finishedStock),
        rawMaterials: num(amounts.rawMaterials),
        workInProgress: num(amounts.workInProgress),
        cash: num(amounts.cash),
        goodReceivables: num(amounts.goodReceivables),
        doubtfulReceivables: num(amounts.doubtfulReceivables),
        doubtfulView,
        payables: num(payables),
        fixedAssets: num(fixedAssets),
        ownershipPct: num(ownership),
        nisab,
        personalWealth: num(personal),
      }),
    [amounts, doubtfulView, payables, fixedAssets, ownership, nisab, personal],
  );

  const set = (key: AssetKey, value: string) =>
    setAmounts((a) => ({ ...a, [key]: value }));

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="What the business holds"
          sub="Stock at every stage, the money in it, and the money owed to it. Value stock at what it would sell for today — zakat is on what the goods are worth, not on what you paid."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ASSETS.map((a) => (
            <Money
              key={a.key}
              label={a.label}
              hint={a.hint}
              value={amounts[a.key]}
              onChange={(v) => set(a.key, v)}
            />
          ))}
        </div>

        {num(amounts.doubtfulReceivables) > 0 && (
          <fieldset className="mt-5 rounded-xl border border-line p-4">
            <legend className="px-1 text-base font-semibold">
              The doubtful invoices
            </legend>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Scholars differ, and the difference is about timing rather than
              whether it is owed at all.
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  [
                    "exclude",
                    "Pay when it arrives",
                    "The common position — a debt you may not recover is not wealth in hand",
                  ],
                  [
                    "include",
                    "Pay on it now",
                    "The cautious position — count it with the rest",
                  ],
                ] as const
              ).map(([value, label, why]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDoubtfulView(value)}
                  aria-pressed={doubtfulView === value}
                  className={`press rounded-xl border px-4 py-3 text-left transition ${
                    doubtfulView === value
                      ? "border-brand bg-brand-soft"
                      : "border-line hover:border-brand"
                  }`}
                >
                  <span
                    className={`block text-base font-semibold ${doubtfulView === value ? "text-brand" : ""}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted">
                    {why}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        )}
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="What it owes, and what it works with"
          sub="Premises, machinery and vehicles are not zakatable at any value. Enter them anyway — the working should show what was set aside and why, rather than leaving you to wonder whether they were counted."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Money
            label="Payables due now"
            hint="Suppliers, wages and bills falling due — not a long-term loan in full"
            value={payables}
            onChange={setPayables}
          />
          <Money
            label="Premises, machinery, vehicles"
            hint="Recorded, then excluded — these are the means of trading"
            value={fixedAssets}
            onChange={setFixedAssets}
          />
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <Money
            label="Your share of the business"
            hint="Zakat is an obligation on a person, so each partner works out their own"
            value={ownership}
            onChange={setOwnership}
            unit="%"
          />
        </div>
      </Card>

      {/* ---------- Step 3 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={3}
          title="The threshold"
          sub="Nisab is measured against everything you own, business and personal together. A shop below the threshold on its own can still be zakatable once your savings sit beside it."
        />
        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <CurrencyPicker
            value={currency}
            onChange={changeCurrency}
            hint="Amounts are in it"
          />
          <Money
            label={`${standard === "silver" ? "Silver" : "Gold"} per gram`}
            hint="Sets the nisab"
            value={metalPrice}
            onChange={setMetalPrice}
          />
          <Money
            label="Your personal wealth"
            hint="Savings, gold, investments outside the business"
            value={personal}
            onChange={setPersonal}
          />
        </div>

        <fieldset className="mt-5">
          <legend className="text-base font-medium">Measure against</legend>
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

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {priceNote(pricesIn(currency))} Nisab works out at{" "}
          <strong className="text-foreground">
            {nisab > 0 ? plain(nisab) : "—"}
          </strong>{" "}
          ({grams}g of {standard}).
        </p>
      </Card>

      {/* ---------- The answer ---------- */}
      {result.needsNisab ? (
        <Notice>Enter a metal price above and the answer appears here.</Notice>
      ) : result.grossAssets === 0 ? (
        <Notice>
          Enter what the business holds above and the zakat appears here.
        </Notice>
      ) : (
        <>
          <section
            className={`answer-panel shimmer relative isolate overflow-hidden rounded-2xl p-5 text-white sm:p-7 ${
              result.due ? "bg-brand-panel" : "bg-danger-panel"
            }`}
          >
            <div
              className="band-grid islamic-grid absolute inset-0 opacity-90"
              aria-hidden
            />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              {result.due
                ? `Zakat due at ${(RATE * 100).toFixed(1)}%`
                : "Below the nisab"}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {plain(result.due ? result.zakat : 0)}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              {result.due
                ? `on ${plain(result.total)} of zakatable wealth`
                : `${plain(result.shortfall)} short of the threshold`}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-4">
              {[
                ["Zakatable assets", plain(result.grossAssets)],
                ["Less payables", plain(result.payables)],
                ["Your share", plain(result.ownerShare)],
                ["With personal wealth", plain(result.total)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Card>
            <h2 className="rule-gold display text-2xl">What was counted</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[460px] border-collapse text-base">
                <tbody>
                  {result.lines.map((l) => (
                    <tr key={l.label} className="border-b border-line">
                      <td className="py-3 pr-4">
                        <span className="font-medium">{l.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {l.note}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums">
                        {plain(l.amount)}
                      </td>
                    </tr>
                  ))}
                  {result.payables > 0 && (
                    <tr className="border-b border-line">
                      <td className="py-3 pr-4 text-muted">Payables due now</td>
                      <td className="py-3 text-right tabular-nums text-muted">
                        −{plain(result.payables)}
                      </td>
                    </tr>
                  )}
                  <tr className="font-bold">
                    <td className="py-3 pr-4">Net zakatable wealth</td>
                    <td className="py-3 text-right tabular-nums">
                      {plain(result.netBusiness)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {result.excluded.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-line pt-4">
                {result.excluded.map((e) => (
                  <div key={e.label} className="rounded-xl bg-background p-4">
                    <p className="text-base font-medium">
                      {e.label} — {plain(e.amount)} left out
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {e.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {result.notes.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-line pt-4">
                {result.notes.map((n) => (
                  <p key={n} className="text-base leading-relaxed text-muted">
                    {n}
                  </p>
                ))}
              </div>
            )}
          </Card>

          <PrintButton
            label="Save this calculation as a PDF"
            hint="For your records, or for whoever checks the books. Nothing is uploaded to make the file."
          />

          <Card>
            <h2 className="rule-gold display text-2xl">If you also hold gold</h2>
            <p className="mt-4 text-base leading-relaxed">
              Jewellery and bullion follow their own rules on purity and on
              whether worn pieces count at all, which the gold calculator works
              through properly rather than as a single figure.
            </p>
            <Link
              href="/zakat-on-gold-calculator"
              className="press mt-4 inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
            >
              Zakat on gold and silver →
            </Link>
          </Card>
        </>
      )}

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> How to value
        part-finished goods, when a debt becomes bad, and which liabilities may
        be deducted are all questions on which qualified scholars differ, and
        a business of any size will meet at least one of them. Take the working
        to someone qualified.
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

function Money({
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
  unit?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-base font-medium">{label}</span>
      <span className="mt-1 block text-sm leading-snug text-muted">{hint}</span>
      <span className="mt-2 flex items-center rounded-xl border border-line bg-surface px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          aria-label={label}
          className="w-full min-w-0 bg-transparent py-3 text-base tabular-nums outline-none"
        />
        {unit && <span className="shrink-0 text-sm text-muted">{unit}</span>}
      </span>
    </label>
  );
}
