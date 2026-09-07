"use client";

import { useMemo, useState } from "react";
import {
  compareStructures,
  planHomeFinance,
  type Structure,
} from "@/lib/home-finance";
import { plain } from "@/lib/format";
import { symbolFor } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { CornerMotif } from "./Ornament";
import PrintButton from "./PrintButton";
import { Card, Notice, NumberField } from "./ui";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const STRUCTURES: { key: Structure; label: string; blurb: string }[] = [
  {
    key: "musharakah",
    label: "Diminishing musharakah",
    blurb: "You own it together and buy their share back. The payment falls each month.",
  },
  {
    key: "murabaha",
    label: "Murabaha",
    blurb: "They buy it and sell it to you at a fixed mark-up. The total cannot change.",
  },
  {
    key: "ijara",
    label: "Ijara",
    blurb: "They buy it and lease it to you. The rent is reviewed periodically.",
  },
];

export default function HomeFinanceCalculator() {

  const [currency, setCurrency] = useState("USD");
  const [price, setPrice] = useState("300000");
  const [deposit, setDeposit] = useState("60000");
  const [years, setYears] = useState("25");
  const [rate, setRate] = useState("5.5");
  const [structure, setStructure] = useState<Structure>("musharakah");
  const [showSchedule, setShowSchedule] = useState(false);

  const input = {
    price: num(price),
    deposit: num(deposit),
    years: num(years),
    rate: num(rate),
  };

  const result = useMemo(
    () => planHomeFinance({ ...input, structure }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [price, deposit, years, rate, structure],
  );

  const all = useMemo(
    () => compareStructures(input),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [price, deposit, years, rate],
  );

  const sym = symbolFor(currency);
  // A year of payments is enough to show the shape without printing 300 rows.
  const shown = showSchedule ? result.schedule : result.schedule.slice(0, 12);

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="The property and the terms"
          sub="The rate is the financier's return — a profit rate or a rental yield, depending on the structure. Use the figure the provider quotes you rather than a mortgage rate."
        />
        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <CurrencyPicker
            value={currency}
            onChange={setCurrency}
            hint="Amounts are in it"
          />
          <NumberField
            label="Property price"
            hint="What the house costs"
            value={price}
            onChange={setPrice}
            prefix={sym}
            large
          />
          <NumberField
            label="Your deposit"
            hint="What you put in at the start"
            value={deposit}
            onChange={setDeposit}
            prefix={sym}
          />
        </div>
        <div className="field-row mt-4 grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Term"
            hint="How long the agreement runs"
            value={years}
            onChange={setYears}
            suffix="years"
          />
          <NumberField
            label="Profit or rental rate"
            hint="Yearly, as the provider quotes it"
            value={rate}
            onChange={setRate}
            suffix="%"
          />
        </div>
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="Which structure"
          sub="These are genuinely different contracts, not three names for the same thing. The one you are offered depends on the provider and the country."
        />
        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {STRUCTURES.map((s) => {
            const active = structure === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setStructure(s.key)}
                aria-pressed={active}
                className={`press rounded-xl border px-4 py-3 text-left transition ${
                  active ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
                }`}
              >
                <span className={`block text-base font-semibold ${active ? "text-brand" : ""}`}>
                  {s.label}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">
                  {s.blurb}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* ---------- The answer ---------- */}
      {result.invalid ? (
        <Notice>{result.invalid}</Notice>
      ) : (
        <>
          <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
            <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              {result.firstPayment === result.lastPayment
                ? "Monthly payment"
                : "First payment, falling to the last"}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {plain(result.firstPayment)}
              {result.firstPayment !== result.lastPayment && (
                <span className="text-white/70"> → {plain(result.lastPayment)}</span>
              )}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              over {result.months} months
              {result.fixed && " — fixed at the outset and unable to change"}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
              {[
                ["Financed", plain(result.financed)],
                ["Total paid", plain(result.totalPaid)],
                ["Cost of the finance", plain(result.totalProfit)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* All three on the same figures. The point of the page. */}
          <Card>
            <h2 className="rule-gold display text-2xl">The three, side by side</h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              On the same price, deposit, term and rate. They differ because
              the contracts differ, not because one is a better deal hidden
              inside the other.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-base">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Structure</th>
                    <th className="py-2 pr-4 text-right font-semibold">First payment</th>
                    <th className="py-2 pr-4 text-right font-semibold">Last</th>
                    <th className="py-2 text-right font-semibold">Total cost</th>
                  </tr>
                </thead>
                <tbody>
                  {STRUCTURES.map((s) => {
                    const r = all[s.key];
                    const active = structure === s.key;
                    return (
                      <tr
                        key={s.key}
                        className={`border-b border-line last:border-0 ${active ? "font-semibold text-brand" : ""}`}
                      >
                        <td className="py-3 pr-4">{s.label}</td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {plain(r.firstPayment)}
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums">
                          {plain(r.lastPayment)}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {plain(r.totalProfit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Diminishing musharakah costs less in total on the same rate,
              because you are paying a return on a share that shrinks every
              month rather than on the whole sum for the whole term. That is
              arithmetic rather than generosity, and a provider will price the
              rate accordingly.
            </p>
          </Card>

          {result.notes.length > 0 && (
            <Card>
              <h2 className="rule-gold display text-2xl">
                About {STRUCTURES.find((s) => s.key === structure)?.label}
              </h2>
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
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="rule-gold display text-2xl">The payments</h2>
              <button
                type="button"
                onClick={() => setShowSchedule((v) => !v)}
                className="press no-print rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
              >
                {showSchedule
                  ? "Show the first year only"
                  : `Show all ${result.months}`}
              </button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-base">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Month</th>
                    <th className="py-2 pr-4 text-right font-semibold">Payment</th>
                    <th className="py-2 pr-4 text-right font-semibold">Buys ownership</th>
                    <th className="py-2 pr-4 text-right font-semibold">Their return</th>
                    <th className="py-2 text-right font-semibold">Yours</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => (
                    <tr key={row.month} className="border-b border-line last:border-0">
                      <td className="py-2.5 pr-4 tabular-nums text-muted">{row.month}</td>
                      <td className="py-2.5 pr-4 text-right font-medium tabular-nums">
                        {plain(row.total)}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums text-brand">
                        {plain(row.acquisition)}
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">
                        {plain(row.profit)}
                      </td>
                      <td className="py-2.5 text-right tabular-nums text-muted">
                        {row.ownedPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <PrintButton
            label="Save this comparison as a PDF"
            hint="To take to a provider, or to a scholar. Nothing is uploaded to make the file."
          />
        </>
      )}

      <Notice tone="danger">
        <strong>Whether these structures are lawful is a live disagreement,
        and this page takes no side in it.</strong> Serious scholars hold that
        they are genuine contracts of sale and partnership; other serious
        scholars hold that some implementations reproduce a loan in substance
        while changing its form. What is offered to you locally may satisfy
        one view and not the other. This page shows what each costs so that the
        question you put to a scholar is a specific one — bring the actual
        contract, not the brochure.
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
