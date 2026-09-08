"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CARATS,
  RATE,
  SILVER_GRADES,
  calculateGoldZakat,
  purityOf,
  type Item,
  type Metal,
  type School,
} from "@/lib/gold-zakat";
import { plain } from "@/lib/format";
import { priceNote, pricesIn, symbolFor } from "@/lib/metals";
import CurrencyPicker from "./CurrencyPicker";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField as Field, WeightUnitPicker } from "./ui";
import { formatWeight, restate, toGrams, unitById } from "@/lib/weight";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

interface Row {
  id: string;
  label: string;
  metal: Metal;
  grams: string;
  /** Carat for gold, millesimal key for silver. */
  purity: string;
  worn: boolean;
}

let nextId = 3;

export default function GoldZakatCalculator() {
  const seed = pricesIn("USD");
  const [currency, setCurrency] = useState("USD");
  const [goldPrice, setGoldPrice] = useState(
    seed.available ? seed.gold.toFixed(2) : "",
  );
  const [silverPrice, setSilverPrice] = useState(
    seed.available ? seed.silver.toFixed(3) : "",
  );
  const [school, setSchool] = useState<School>("hanafi");
  const [standard, setStandard] = useState<Metal>("silver");
  const [weightUnit, setWeightUnit] = useState("g");
  const [otherWealth, setOtherWealth] = useState("");
  const [rows, setRows] = useState<Row[]>([
    { id: "g1", label: "Bangles", metal: "gold", grams: "40", purity: "22", worn: true },
    { id: "g2", label: "Coins", metal: "gold", grams: "20", purity: "24", worn: false },
  ]);

  const changeCurrency = (code: string) => {
    setCurrency(code);
    const next = pricesIn(code);
    if (next.available) {
      setGoldPrice(next.gold.toFixed(2));
      setSilverPrice(next.silver.toFixed(3));
    }
  };

  const items: Item[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        label: r.label.trim() || "Unnamed",
        metal: r.metal,
        // Rows are typed in whichever unit the box was weighed in; the engine
        // and the prices both work in grams.
        grams: toGrams(num(r.grams), weightUnit),
        purity:
          r.metal === "gold"
            ? purityOf(num(r.purity) || 24)
            : (SILVER_GRADES.find((g) => g.key === r.purity)?.purity ?? 0.925),
        use: r.worn ? "worn" : "stored",
      })),
    [rows, weightUnit],
  );

  const result = useMemo(
    () =>
      calculateGoldZakat({
        items,
        school,
        goldPricePerGram: num(goldPrice),
        silverPricePerGram: num(silverPrice),
        standard,
        otherWealth: num(otherWealth),
      }),
    [items, school, goldPrice, silverPrice, standard, otherWealth],
  );

  const update = (id: string, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // Changing the unit restates every row rather than reinterpreting the digits
  // in it, so 40g of bangles becomes 3.429355 bhori and not 40 bhori.
  const changeWeightUnit = (next: string) => {
    setRows((rs) =>
      rs.map((r) => ({ ...r, grams: restate(r.grams, weightUnit, next) })),
    );
    setWeightUnit(next);
  };

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="Today's price"
          sub="Filled in from the market, in the currency you pick. Change either figure if your local rate differs."
        />
        {/* items-end keeps the three controls on one baseline. Without it a
            longer label on any one of them pushes its input below the other
            two, which is what the note under the currency used to do. */}
        <div className="field-row mt-5 grid gap-4 sm:grid-cols-3">
          <CurrencyPicker
            value={currency}
            onChange={changeCurrency}
            hint="Prices are shown in it"
          />
          <Field
            label="Gold, per gram"
            prefix={symbolFor(currency)}
            hint="Pure, 24 carat"
            value={goldPrice}
            onChange={setGoldPrice}
          />
          <Field
            label="Silver, per gram"
            prefix={symbolFor(currency)}
            hint="Fine silver"
            value={silverPrice}
            onChange={setSilverPrice}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {priceNote(pricesIn(currency))}
        </p>
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="What is in the box"
          sub="Weigh each piece as it is, alloy and all — the carat takes the alloy back out. Zakat is owed on the gold, not on the copper it is mixed with."
        />

        <div className="mt-5">
          <WeightUnitPicker value={weightUnit} onChange={changeWeightUnit} />
        </div>

        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="relative rounded-xl border border-line p-3.5">
              <div className="grid gap-3 pr-9 sm:grid-cols-[1.3fr_0.8fr_0.9fr] sm:pr-0">
                <label className="block min-w-0">
                  <span className="block text-sm font-medium text-muted">Piece</span>
                  <input
                    value={row.label}
                    onChange={(e) => update(row.id, { label: e.target.value })}
                    placeholder="Bangles, ring, coins"
                    aria-label="What the piece is"
                    className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base outline-none transition focus:border-brand"
                  />
                </label>

                <label className="block min-w-0">
                  <span className="block text-sm font-medium text-muted">Weight</span>
                  <span className="mt-1.5 flex items-center rounded-lg border border-line bg-surface px-3 transition focus-within:border-brand">
                    <input
                      value={row.grams}
                      onChange={(e) => update(row.id, { grams: e.target.value })}
                      placeholder="0"
                      inputMode="decimal"
                      aria-label={`Weight in ${unitById(weightUnit).label}`}
                      className="w-full min-w-0 bg-transparent py-2.5 text-base tabular-nums outline-none"
                    />
                    <span className="shrink-0 text-sm text-muted">
                      {unitById(weightUnit).short}
                    </span>
                  </span>
                </label>

                <label className="block min-w-0">
                  <span className="block text-sm font-medium text-muted">
                    {row.metal === "gold" ? "Carat" : "Fineness"}
                  </span>
                  <select
                    value={row.purity}
                    onChange={(e) => update(row.id, { purity: e.target.value })}
                    aria-label="Purity"
                    className="mt-1.5 w-full cursor-pointer rounded-lg border border-line bg-surface px-3 py-2.5 text-base outline-none transition focus:border-brand"
                  >
                    {row.metal === "gold"
                      ? CARATS.map((c) => (
                          <option key={c} value={String(c)}>
                            {c}k — {(purityOf(c) * 100).toFixed(1)}% pure
                          </option>
                        ))
                      : SILVER_GRADES.map((g) => (
                          <option key={g.key} value={g.key}>
                            {g.label}
                          </option>
                        ))}
                  </select>
                </label>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5">
                  {(["gold", "silver"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        update(row.id, {
                          metal: m,
                          purity: m === "gold" ? "22" : "925",
                        })
                      }
                      aria-pressed={row.metal === m}
                      className={`press rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition ${
                        row.metal === m
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-line text-muted hover:border-brand"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </span>

                <label className="flex cursor-pointer items-center gap-2 text-base">
                  <input
                    type="checkbox"
                    checked={row.worn}
                    onChange={(e) => update(row.id, { worn: e.target.checked })}
                    className="h-4.5 w-4.5 accent-[var(--brand)]"
                  />
                  Worn regularly, not stored
                </label>
              </div>

              <button
                type="button"
                onClick={() =>
                  setRows((rs) =>
                    rs.length > 1 ? rs.filter((r) => r.id !== row.id) : rs,
                  )
                }
                disabled={rows.length === 1}
                aria-label={`Remove ${row.label || "this piece"}`}
                className="press absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-25"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setRows((rs) => [
              ...rs,
              { id: `g${nextId++}`, label: "", metal: "gold", grams: "", purity: "22", worn: false },
            ])
          }
          className="press mt-3 w-full rounded-xl border border-dashed border-line py-3 text-base font-medium text-muted transition hover:border-brand hover:text-brand"
        >
          + Add another piece
        </button>
      </Card>

      {/* ---------- Step 3 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={3}
          title="Which position on worn jewellery"
          sub="This is the one question that changes the answer most, and the schools genuinely differ on it. Neither position is the calculator's to pick."
        />
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {(
            [
              ["hanafi", "All of it is zakatable", "Hanafi — use makes no difference to gold and silver"],
              ["majority", "Worn jewellery is exempt", "Maliki, Shafi'i, Hanbali — lawful jewellery in normal use"],
            ] as const
          ).map(([value, label, who]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSchool(value)}
              aria-pressed={school === value}
              className={`press rounded-xl border px-4 py-3 text-left transition ${
                school === value ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
              }`}
            >
              <span className={`block text-base font-semibold ${school === value ? "text-brand" : ""}`}>
                {label}
              </span>
              <span className="mt-0.5 block text-sm leading-snug text-muted">{who}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <Field
            label="Your other zakatable wealth"
            prefix={symbolFor(currency)}
            hint="Cash, bank, investments — the nisab is measured on everything together"
            value={otherWealth}
            onChange={setOtherWealth}
          />
          <fieldset>
            <legend className="text-base font-medium">Measure nisab against</legend>
            <div className="mt-2 flex gap-2">
              {(["silver", "gold"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setStandard(m)}
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
        </div>
      </Card>

      {/* ---------- The answer ---------- */}
      {result.needsPrice ? (
        <Notice>Enter a metal price above and the answer appears here.</Notice>
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
              {result.due ? `Zakat due at ${(RATE * 100).toFixed(1)}%` : "Below the nisab"}
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {plain(result.due ? result.zakat : 0)}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              {result.due
                ? `on ${plain(result.total)} of zakatable wealth`
                : `${plain(result.shortfall)} short of the ${standard} nisab`}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-4">
              {[
                ["Pure gold", `${result.countedGoldGrams.toFixed(2)} g`],
                ["Pure silver", `${result.countedSilverGrams.toFixed(2)} g`],
                ["Metal value", plain(result.metalValue)],
                [`Nisab (${standard})`, plain(result.nisab)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>

            {result.exemptValue > 0.5 && (
              <p className="mt-5 border-t border-white/20 pt-4 text-base text-white/85">
                {plain(result.exemptValue)} of worn jewellery was left out. On
                the Hanafi position the zakat would be{" "}
                <strong className="font-semibold text-[var(--gold)]">
                  {plain(result.alternativeZakat)}
                </strong>
                .
              </p>
            )}
          </section>

          <Card>
            <h2 className="rule-gold display text-2xl">Piece by piece</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-base">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Piece</th>
                    <th className="py-2 pr-4 text-right font-semibold">Weighed</th>
                    <th className="py-2 pr-4 text-right font-semibold">Pure metal</th>
                    <th className="py-2 text-right font-semibold">Counted</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4">
                        <span className="font-medium">{r.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {r.reason}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums text-muted">
                        {formatWeight(r.grams, weightUnit)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {r.pureGrams.toFixed(2)} g
                      </td>
                      <td className={`py-3 text-right tabular-nums ${r.counted ? "font-semibold text-brand" : "text-muted"}`}>
                        {r.counted ? plain(r.value) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <h2 className="rule-gold display text-2xl">This is one part only</h2>
            <p className="mt-4 text-base leading-relaxed">
              The nisab is measured against everything you hold. If you entered
              your other wealth above it is already included; if not, add it
              there or use the full calculator, which walks through every kind
              of zakatable asset and the lunar year as well.
            </p>
            <Link
              href="/zakat-calculator"
              className="press mt-4 inline-block rounded-xl bg-brand px-4 py-2.5 text-base font-semibold text-white transition hover:opacity-90"
            >
              Full zakat calculator →
            </Link>
          </Card>
        </>
      )}

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> The position on worn
        jewellery is a genuine difference between the schools, not a setting
        with a right answer, and scholars also differ on jewellery held beyond
        normal use, on gemstones set into a piece, and on what counts as
        excessive. Weigh the metal, take the working to someone qualified.
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

