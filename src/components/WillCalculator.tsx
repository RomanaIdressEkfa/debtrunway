"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { planWill, type Bequest } from "@/lib/wasiyyah";
import { plain } from "@/lib/format";
import { CornerMotif } from "./Ornament";
import { Card, Notice } from "./ui";

/**
 * Like the inheritance calculator, this keeps nothing. It holds a list of who
 * you intend to leave money to, which is not a thing to leave in a browser on
 * a shared machine.
 */

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

let nextId = 3;

export default function WillCalculator() {
  const [total, setTotal] = useState("100000");
  const [funeral, setFuneral] = useState("");
  const [debts, setDebts] = useState("");
  const [rows, setRows] = useState<
    { id: string; to: string; amount: string; isHeir: boolean }[]
  >([
    { id: "b1", to: "Local mosque", amount: "10000", isHeir: false },
    { id: "b2", to: "Nephew", amount: "5000", isHeir: false },
  ]);

  const result = useMemo(
    () =>
      planWill({
        total: num(total),
        funeral: num(funeral),
        debts: num(debts),
        bequests: rows.map<Bequest>((r) => ({
          id: r.id,
          to: r.to.trim() || "Unnamed",
          amount: num(r.amount),
          isHeir: r.isHeir,
        })),
      }),
    [total, funeral, debts, rows],
  );

  const update = (id: string, patch: Partial<(typeof rows)[number]>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="What the estate is worth"
          sub="Debts come out before anything else — and that includes unpaid zakat, an unpaid mahr, and any expiation owed. Those are obligations, not bequests, and they are not limited to a third."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Money label="Total estate" value={total} onChange={setTotal} large />
          <Money label="Funeral costs" value={funeral} onChange={setFuneral} />
          <Money label="Debts owed" value={debts} onChange={setDebts} />
        </div>

        {!result.insolvent && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Figure label="Net estate, after debts" value={plain(result.net)} />
            <Figure
              label="The most you may will away"
              value={plain(result.maxBequest)}
              hint="One third — a ceiling, not a target"
              strong
            />
          </div>
        )}
      </Card>

      {/* ---------- Step 2 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={2}
          title="Who you want to leave something to"
          sub="Mark anyone who would inherit anyway. A bequest to an heir is a different matter from the third, and the calculator will say so."
        />

        <div className="mt-5 space-y-3">
          {rows.map((row) => (
            <div
              key={row.id}
              className="relative rounded-xl border border-line p-3.5"
            >
              <div className="grid gap-3 pr-9 sm:grid-cols-[1.4fr_1fr] sm:pr-0">
                <label className="block min-w-0">
                  <span className="block text-sm font-medium text-muted">
                    Who
                  </span>
                  <input
                    value={row.to}
                    onChange={(e) => update(row.id, { to: e.target.value })}
                    placeholder="A charity, a friend, a mosque"
                    aria-label="Who the bequest is for"
                    className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base outline-none transition focus:border-brand"
                  />
                </label>
                <label className="block min-w-0">
                  <span className="block text-sm font-medium text-muted">
                    How much
                  </span>
                  <input
                    value={row.amount}
                    onChange={(e) => update(row.id, { amount: e.target.value })}
                    placeholder="0"
                    inputMode="decimal"
                    aria-label="Bequest amount"
                    className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base tabular-nums outline-none transition focus:border-brand"
                  />
                </label>
              </div>

              <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-base">
                <input
                  type="checkbox"
                  checked={row.isHeir}
                  onChange={(e) =>
                    update(row.id, { isHeir: e.target.checked })
                  }
                  className="h-4.5 w-4.5 accent-[var(--brand)]"
                />
                <span>
                  This person already inherits
                  <span className="block text-sm text-muted">
                    A spouse, child, parent or sibling who takes a fixed share
                  </span>
                </span>
              </label>

              <button
                type="button"
                onClick={() =>
                  setRows((rs) =>
                    rs.length > 1 ? rs.filter((r) => r.id !== row.id) : rs,
                  )
                }
                disabled={rows.length === 1}
                aria-label={`Remove bequest to ${row.to || "this person"}`}
                className="press absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-25"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
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
              { id: `b${nextId++}`, to: "", amount: "", isHeir: false },
            ])
          }
          className="press mt-3 w-full rounded-xl border border-dashed border-line py-3 text-base font-medium text-muted transition hover:border-brand hover:text-brand"
        >
          + Add another bequest
        </button>
      </Card>

      {/* ---------- The answer ---------- */}
      {result.insolvent ? (
        <Notice tone="danger">{result.notes[0]}</Notice>
      ) : (
        <>
          <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
            <div
              className="band-grid islamic-grid absolute inset-0 opacity-90"
              aria-hidden
            />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              Takes effect on its own
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {plain(result.totalBinding)}
            </p>
            <p className="mt-1.5 text-lg text-white/85">
              of a possible {plain(result.maxBequest)}
              {result.unusedThird > 0.5 && (
                <> — {plain(result.unusedThird)} of the third unused</>
              )}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
              {[
                ["Net estate", plain(result.net)],
                ["Needs heirs' consent", plain(result.totalNeedingConsent)],
                ["Passes by faraid", plain(result.toHeirs)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-white/60">{label}</dt>
                  <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {result.outcomes.length > 0 && (
            <Card>
              <h2 className="rule-gold display text-2xl">Bequest by bequest</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-base">
                  <thead>
                    <tr className="border-b border-line text-left">
                      <th className="py-2 pr-4 font-semibold">To</th>
                      <th className="py-2 pr-4 text-right font-semibold">
                        Asked
                      </th>
                      <th className="py-2 pr-4 text-right font-semibold">
                        Binding
                      </th>
                      <th className="py-2 text-right font-semibold">
                        Needs consent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.outcomes.map((o) => (
                      <tr key={o.id} className="border-b border-line last:border-0">
                        <td className="py-3 pr-4">
                          <span className="font-medium">{o.to}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted">
                            {o.reason}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right tabular-nums text-muted">
                          {plain(o.amount)}
                        </td>
                        <td className="py-3 pr-4 text-right font-semibold tabular-nums text-brand">
                          {plain(o.binding)}
                        </td>
                        <td className="py-3 text-right tabular-nums">
                          {o.needsConsent > 0.005 ? plain(o.needsConsent) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
          )}

          <Card>
            <h2 className="rule-gold display text-2xl">
              What happens to the rest
            </h2>
            <p className="mt-4 text-base leading-relaxed">
              The remaining {plain(result.toHeirs)} is not yours to direct. It
              passes by faraid, in fixed shares set out in the Qur&rsquo;an —
              which relatives take, and how much, depends entirely on who
              survives you.
            </p>
            <Link
              href="/islamic-inheritance-calculator"
              className="press mt-4 inline-block rounded-xl bg-brand px-4 py-2.5 text-base font-semibold text-white transition hover:opacity-90"
            >
              Work out the shares →
            </Link>
          </Card>
        </>
      )}

      <Notice tone="danger">
        <strong>This is a calculator, not a will.</strong> A wasiyyah that the
        law of your country will actually enforce has to be drafted and
        witnessed the way that country requires — in England and Wales, in most
        US states, and in most of Europe, a document that satisfies the shariah
        but not the local formalities is simply ignored by the probate court.
        Use this to plan the shape, then have a solicitor or estate attorney
        draw it up, and a scholar check it.
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

function Money({
  label,
  value,
  onChange,
  large,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  large?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-base font-medium">{label}</span>
      <span className="mt-2 flex items-center rounded-xl border border-line bg-surface px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          inputMode="decimal"
          aria-label={label}
          className={`w-full min-w-0 bg-transparent py-3 tabular-nums outline-none ${
            large ? "text-xl font-bold" : "text-base"
          }`}
        />
      </span>
    </label>
  );
}

function Figure({
  label,
  value,
  hint,
  strong,
}: {
  label: string;
  value: string;
  hint?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 ${
        strong ? "bg-brand-soft" : "bg-background"
      }`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p
        className={`mt-0.5 text-xl font-bold tabular-nums ${
          strong ? "text-brand" : ""
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
    </div>
  );
}
