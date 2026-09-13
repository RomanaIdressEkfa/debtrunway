"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateInvestmentZakat,
  DEFAULT_PORTION,
  RATE,
  type LockedView,
  type LongTermMethod,
} from "@/lib/investment-zakat";
import { plain } from "@/lib/format";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField as Money } from "./ui";
import { bnRest } from "@/lib/bn-faraid";
import type { Locale } from "@/lib/i18n";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function InvestmentZakatCalculator({
  lang = "en",
}: {
  /** Labels only. Every engine behind this page is language-neutral. */
  lang?: Locale;
} = {}) {
  const t = lang === "bn" ? bnRest : (s: string) => s;
  const [trading, setTrading] = useState("");
  const [longTerm, setLongTerm] = useState("");
  const [method, setMethod] = useState<LongTermMethod>("portion");
  const [portion, setPortion] = useState(String(DEFAULT_PORTION));
  const [crypto, setCrypto] = useState("");
  const [accessible, setAccessible] = useState("");
  const [deductions, setDeductions] = useState("");
  const [locked, setLocked] = useState("");
  const [lockedView, setLockedView] = useState<LockedView>("defer");
  const [vested, setVested] = useState("100");

  const result = useMemo(
    () =>
      calculateInvestmentZakat({
        trading: num(trading),
        longTerm: num(longTerm),
        longTermMethod: method,
        portionPct: num(portion),
        crypto: num(crypto),
        accessible: num(accessible),
        deductions: num(deductions),
        locked: num(locked),
        lockedView,
        vestedPct: num(vested),
      }),
    [
      trading, longTerm, method, portion, crypto,
      accessible, deductions, locked, lockedView, vested,
    ],
  );

  const empty = result.lines.length === 0 && result.excluded.length === 0;

  return (
    <div className="stagger space-y-4">
      {/* ---------- Shares ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title={t("Shares and funds")}
          sub="Why you hold them decides how they are valued. Bought to sell on, they are stock in trade. Bought to hold, the reasoning looks through the share to what the company itself owns."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Money
            label={t("Held for trading")}
            hint={t("Bought to sell on — shares, funds, anything you actively trade")}
            value={trading}
            onChange={setTrading}
          />
          <Money
            label={t("Held for the long term")}
            hint={t("Bought for dividends or growth, not to flip")}
            value={longTerm}
            onChange={setLongTerm}
          />
        </div>

        {num(longTerm) > 0 && (
          <fieldset className="mt-5 rounded-xl border border-line p-4">
            <legend className="px-1 text-base font-semibold">
              How to value the long-term holdings
            </legend>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              This is the single biggest choice on the page — the two positions
              can differ by more than threefold. Both are held by serious
              contemporary scholars.
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  [
                    "portion",
                    "A share of the company's assets",
                    "You owe zakat on your slice of its cash and stock, not its factories",
                  ],
                  [
                    "market",
                    "Full market value",
                    "Simpler, and the more cautious of the two",
                  ],
                ] as const
              ).map(([value, label, why]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMethod(value)}
                  aria-pressed={method === value}
                  className={`press rounded-xl border px-4 py-3 text-left transition ${
                    method === value
                      ? "border-brand bg-brand-soft"
                      : "border-line hover:border-brand"
                  }`}
                >
                  <span
                    className={`block text-base font-semibold ${method === value ? "text-brand" : ""}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted">
                    {why}
                  </span>
                </button>
              ))}
            </div>

            {method === "portion" && (
              <label className="mt-4 block">
                <span className="block text-base font-medium">
                  Zakatable proportion
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted">
                  Read it off the balance sheet if you can. Where you cannot,
                  councils accept roughly a quarter to three tenths of market
                  value as a working estimate.
                </span>
                <span className="mt-2 flex items-center rounded-xl border border-line bg-surface px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                  <input
                    value={portion}
                    onChange={(e) => setPortion(e.target.value)}
                    inputMode="decimal"
                    aria-label={t("Zakatable proportion")}
                    className="w-full min-w-0 bg-transparent py-3 text-base tabular-nums outline-none"
                  />
                  <span className="shrink-0 text-sm text-muted">%</span>
                </span>
              </label>
            )}
          </fieldset>
        )}

        <div className="mt-5">
          <Money
            label={t("Digital assets")}
            hint={t("Bitcoin and the rest — nearly all contemporary councils treat these as wealth held")}
            value={crypto}
            onChange={setCrypto}
          />
        </div>
      </Card>

      {/* ---------- Pensions ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title={t("Pensions and retirement accounts")}
          sub="The question here is not how much is in it but whether you can reach it. Wealth you cannot take possession of is treated differently from wealth you can."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Money
            label={t("You can draw on it today")}
            hint={t("A SIPP you control, an IRA past the age, a vested pot you may withdraw")}
            value={accessible}
            onChange={setAccessible}
          />
          <Money
            label={t("Tax and penalty on withdrawal")}
            hint={t("What a withdrawal would actually cost you. Leave at zero to assess the gross.")}
            value={deductions}
            onChange={setDeductions}
          />
        </div>

        <div className="mt-5">
          <Money
            label={t("Locked until retirement")}
            hint={t("A workplace pension, a 401(k) you cannot draw yet, a defined benefit scheme")}
            value={locked}
            onChange={setLocked}
          />
        </div>

        {num(locked) > 0 && (
          <fieldset className="mt-5 rounded-xl border border-line p-4">
            <legend className="px-1 text-base font-semibold">
              What to do about the locked pot
            </legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {(
                [
                  [
                    "defer",
                    "Leave it out for now",
                    "Zakat begins when access does — the majority contemporary view",
                  ],
                  [
                    "vested",
                    "Pay on what has vested",
                    "The more cautious position, paid yearly as it accrues",
                  ],
                ] as const
              ).map(([value, label, why]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLockedView(value)}
                  aria-pressed={lockedView === value}
                  className={`press rounded-xl border px-4 py-3 text-left transition ${
                    lockedView === value
                      ? "border-brand bg-brand-soft"
                      : "border-line hover:border-brand"
                  }`}
                >
                  <span
                    className={`block text-base font-semibold ${lockedView === value ? "text-brand" : ""}`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted">
                    {why}
                  </span>
                </button>
              ))}
            </div>

            {lockedView === "vested" && (
              <label className="mt-4 block">
                <span className="block text-base font-medium">
                  How much has vested
                </span>
                <span className="mt-1 block text-sm leading-snug text-muted">
                  The part that would still be yours if you left the job
                  tomorrow.
                </span>
                <span className="mt-2 flex items-center rounded-xl border border-line bg-surface px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
                  <input
                    value={vested}
                    onChange={(e) => setVested(e.target.value)}
                    inputMode="decimal"
                    aria-label={t("Vested percentage")}
                    className="w-full min-w-0 bg-transparent py-3 text-base tabular-nums outline-none"
                  />
                  <span className="shrink-0 text-sm text-muted">%</span>
                </span>
              </label>
            )}
          </fieldset>
        )}
      </Card>

      {/* ---------- The answer ---------- */}
      {empty ? (
        <Notice>
          Enter what you hold above and the zakatable total appears here.
        </Notice>
      ) : (
        <>
          <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
            <div
              className="band-grid islamic-grid absolute inset-0 opacity-90"
              aria-hidden
            />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              Zakat on these holdings
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {plain(result.zakat)}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              {(RATE * 100).toFixed(1)}% of a zakatable base of{" "}
              {plain(result.base)}
            </p>

            {Math.abs(result.alternativeZakat - result.zakat) > 0.5 && (
              <p className="mt-5 border-t border-white/20 pt-4 text-base text-white/85">
                {result.alternativeLabel} would give{" "}
                <strong className="font-semibold text-[var(--gold)]">
                  {plain(result.alternativeZakat)}
                </strong>
                . Both positions are held; the difference is the choice you made
                above, not an error.
              </p>
            )}
          </section>

          <Card>
            <h2 className="rule-gold display text-2xl">What was counted</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-base">
                <tbody>
                  {result.lines.map((l) => (
                    <tr key={l.label} className="border-b border-line">
                      <td className="py-3 pr-4">
                        <span className="font-medium">{l.label}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {l.basis}
                        </span>
                      </td>
                      <td className="py-3 text-right tabular-nums">
                        {l.amount !== l.entered && (
                          <span className="block text-sm text-muted line-through">
                            {plain(l.entered)}
                          </span>
                        )}
                        <span className="font-semibold">{plain(l.amount)}</span>
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td className="py-3 pr-4">Zakatable base</td>
                    <td className="py-3 text-right tabular-nums">
                      {plain(result.base)}
                    </td>
                  </tr>
                  <tr className="border-t border-line font-bold text-brand">
                    <td className="py-3 pr-4">
                      Zakat at {(RATE * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {plain(result.zakat)}
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

          <Card>
            <h2 className="rule-gold display text-2xl">This is one part only</h2>
            <p className="mt-4 text-base leading-relaxed">
              Zakat is owed on your wealth as a whole, and the nisab is measured
              against all of it together — cash, gold, business stock and these
              investments. A portfolio below the threshold on its own may still
              be zakatable once your savings are added to it.
            </p>
            <Link
              href="/zakat-calculator"
              className="press mt-4 inline-block rounded-xl bg-brand px-4 py-2.5 text-base font-semibold text-white transition hover:opacity-90"
            >
              Add the rest of your wealth →
            </Link>
          </Card>
        </>
      )}

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> Every question on
        this page is one where qualified scholars hold different positions, and
        the calculator applies whichever you chose rather than telling you which
        is right. If your holdings are substantial, take the working to someone
        qualified — the gap between the two positions on shares alone can be
        several times the amount.
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

