"use client";

import { useMemo, useState } from "react";
import {
  distribute,
  emptyHeirs,
  fracLabel,
  type Heirs,
} from "@/lib/faraid";
import { plain } from "@/lib/format";
import { CornerMotif } from "./Ornament";
import PrintButton from "./PrintButton";
import { Card, Notice, NumberField as Money } from "./ui";

/**
 * Nothing here is saved.
 *
 * The debt calculator keeps your plan in localStorage because you come back to
 * it monthly. This one asks who in your family has died and who survived them,
 * and that is not a thing to leave sitting in a browser on a shared computer.
 * The figures live in React state and go when the tab does.
 */

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/** Heir groups, in the order the texts introduce them. */
const GROUPS: {
  title: string;
  hint: string;
  rows: {
    key: keyof Heirs;
    label: string;
    hint?: string;
    kind: "toggle" | "count";
    max?: number;
  }[];
}[] = [
  {
    title: "Spouse and parents",
    hint: "The heirs who are almost never excluded.",
    rows: [
      { key: "husband", label: "Husband", kind: "toggle" },
      {
        key: "wives",
        label: "Wives",
        hint: "They divide a single share between them",
        kind: "count",
        max: 4,
      },
      { key: "father", label: "Father", kind: "toggle" },
      { key: "mother", label: "Mother", kind: "toggle" },
    ],
  },
  {
    title: "Children",
    hint: "A son changes almost every other share on this page.",
    rows: [
      { key: "sons", label: "Sons", kind: "count" },
      { key: "daughters", label: "Daughters", kind: "count" },
    ],
  },
  {
    title: "Son's children",
    hint: "They inherit only through a son who died before the deceased.",
    rows: [
      { key: "grandsons", label: "Son's sons", kind: "count" },
      { key: "granddaughters", label: "Son's daughters", kind: "count" },
    ],
  },
  {
    title: "Grandparents",
    hint: "A father blocks his own mother; a mother blocks both grandmothers.",
    rows: [
      {
        key: "paternalGrandfather",
        label: "Paternal grandfather",
        hint: "Father's father",
        kind: "toggle",
      },
      {
        key: "paternalGrandmother",
        label: "Paternal grandmother",
        hint: "Father's mother",
        kind: "toggle",
      },
      {
        key: "maternalGrandmother",
        label: "Maternal grandmother",
        hint: "Mother's mother",
        kind: "toggle",
      },
    ],
  },
  {
    title: "Siblings",
    hint: "All of them are excluded by a son, a son's son, or the father.",
    rows: [
      { key: "fullBrothers", label: "Full brothers", kind: "count" },
      { key: "fullSisters", label: "Full sisters", kind: "count" },
      {
        key: "paternalBrothers",
        label: "Half-brothers (father's side)",
        kind: "count",
      },
      {
        key: "paternalSisters",
        label: "Half-sisters (father's side)",
        kind: "count",
      },
      {
        key: "maternalSiblings",
        label: "Half-siblings (mother's side)",
        hint: "Brothers and sisters together — they take equally",
        kind: "count",
      },
    ],
  },
];

export default function FaraidCalculator() {
  const [total, setTotal] = useState("100000");
  const [funeral, setFuneral] = useState("");
  const [debts, setDebts] = useState("");
  const [bequest, setBequest] = useState("");
  const [heirs, setHeirs] = useState<Heirs>(() => ({
    ...emptyHeirs(),
    wives: 1,
    sons: 2,
    daughters: 1,
    mother: true,
  }));

  const result = useMemo(
    () =>
      distribute(
        {
          total: num(total),
          funeral: num(funeral),
          debts: num(debts),
          bequest: num(bequest),
        },
        heirs,
      ),
    [total, funeral, debts, bequest, heirs],
  );

  const set = <K extends keyof Heirs>(key: K, value: Heirs[K]) =>
    setHeirs((h) => ({ ...h, [key]: value }));

  const reset = () =>
    setHeirs({ ...emptyHeirs(), husband: false, wives: 0 });

  const chosen = Object.entries(heirs).filter(([, v]) =>
    typeof v === "boolean" ? v : v > 0,
  ).length;

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1: the estate ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="What was left behind"
          sub="Enter the amounts in any currency you like. The shares are fractions, so the answer works out the same in taka, rupees, pounds or riyals."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Money
            label="Total estate"
            hint="Everything owned at death, before anything is taken out"
            value={total}
            onChange={setTotal}
            placeholder="100000"
            large
          />
          <Money
            label="Funeral costs"
            hint="Paid before anything else"
            value={funeral}
            onChange={setFuneral}
            placeholder="0"
          />
          <Money
            label="Outstanding debts"
            hint="Settled in full before any heir inherits"
            value={debts}
            onChange={setDebts}
            placeholder="0"
          />
          <Money
            label="Bequest (wasiyyah)"
            hint="Capped at one third, and only to someone who is not an heir"
            value={bequest}
            onChange={setBequest}
            placeholder="0"
          />
        </div>

        {!result.insolvent && (
          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-background px-4 py-3">
            <span className="text-sm text-muted">
              Left to divide between the heirs
            </span>
            <span className="text-lg font-bold tabular-nums">
              {plain(result.distributable)}
            </span>
          </div>
        )}
      </Card>

      {/* ---------- Step 2: who survived ---------- */}
      <Card className="no-print">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <StepHeading
            n={2}
            title="Who survived"
            sub="Only relatives who were alive when the deceased died, and who inherit under Islamic law."
          />
          {chosen > 0 && (
            <button
              type="button"
              onClick={reset}
              className="press shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted hover:border-danger hover:text-danger"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="mt-5 space-y-5">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <h3 className="text-base font-bold">{group.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {group.hint}
              </p>
              <div className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line">
                {group.rows.map((row) =>
                  row.kind === "toggle" ? (
                    <Toggle
                      key={row.key}
                      label={row.label}
                      hint={row.hint}
                      on={heirs[row.key] as boolean}
                      onChange={(v) => set(row.key, v as Heirs[typeof row.key])}
                    />
                  ) : (
                    <Counter
                      key={row.key}
                      label={row.label}
                      hint={row.hint}
                      value={heirs[row.key] as number}
                      max={row.max}
                      onChange={(v) => set(row.key, v as Heirs[typeof row.key])}
                    />
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </Card>

      {/* ---------- The answer ---------- */}
      {result.insolvent ? (
        <Notice tone="danger">{result.notes[0]}</Notice>
      ) : result.empty ? (
        <Notice>
          Add at least one surviving heir above to see how the estate divides.
        </Notice>
      ) : (
        <>
          <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
            <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              The estate divides as follows
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
              {plain(result.distributable)}
            </p>
            <p className="mt-1.5 text-white/85">
              between {result.awards.length}{" "}
              {result.awards.length === 1 ? "heir" : "groups of heirs"}
              {(result.awl || result.radd) && (
                <>
                  {" "}
                  — adjusted by{" "}
                  <strong className="font-semibold">
                    {result.awl ? "awl" : "radd"}
                  </strong>
                </>
              )}
            </p>

            <div className="mt-6 space-y-2.5 border-t border-white/20 pt-5">
              {result.awards.map((a) => (
                <div
                  key={a.key}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5"
                >
                  <span className="font-medium">
                    {a.label}
                    {a.count > 1 && (
                      <span className="text-white/60"> ×{a.count}</span>
                    )}
                  </span>
                  <span className="flex items-baseline gap-3 tabular-nums">
                    <span className="text-white/70">
                      {fracLabel(a.share)}
                    </span>
                    <span className="font-bold">{plain(a.amount)}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* The reasoning, which is the part worth reading. A number without
              the rule behind it cannot be checked by anyone. */}
          <Card>
            <h2 className="text-lg font-bold tracking-tight">
              Why each share is what it is
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-base">
                <thead>
                  <tr className="border-b border-line text-left">
                    <th className="py-2 pr-4 font-semibold">Heir</th>
                    <th className="py-2 pr-4 text-right font-semibold">Share</th>
                    <th className="py-2 pr-4 text-right font-semibold">
                      Amount
                    </th>
                    <th className="py-2 text-right font-semibold">Each</th>
                  </tr>
                </thead>
                <tbody>
                  {result.awards.map((a) => (
                    <tr key={a.key} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4">
                        <span className="font-medium">{a.label}</span>
                        {a.count > 1 && (
                          <span className="text-muted"> ×{a.count}</span>
                        )}
                        <span className="mt-1 block text-sm leading-relaxed text-muted">
                          {a.reason}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold tabular-nums text-brand">
                        {fracLabel(a.share)}
                      </td>
                      <td className="py-3 pr-4 text-right tabular-nums">
                        {plain(a.amount)}
                      </td>
                      <td className="py-3 text-right tabular-nums text-muted">
                        {a.count > 1 ? plain(a.eachAmount) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {result.notes.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-line pt-4">
                {result.notes.map((note) => (
                  <p key={note} className="text-base leading-relaxed text-muted">
                    {note}
                  </p>
                ))}
              </div>
            )}
          </Card>

          {result.blocked.length > 0 && (
            <Card>
              <h2 className="text-lg font-bold tracking-tight">
                Who does not inherit here
              </h2>
              <p className="mt-1.5 text-base text-muted">
                A nearer heir stands in the way. This is hajb, and it is a rule
                of the law rather than a slight against anyone.
              </p>
              <ul className="mt-4 space-y-2 text-base">
                {result.blocked.map((b) => (
                  <li
                    key={b.label + b.by}
                    className="flex flex-wrap items-baseline gap-x-2 rounded-lg bg-background px-3 py-2.5"
                  >
                    <span className="font-medium">{b.label}</span>
                    <span className="text-muted">excluded by {b.by}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}

      {!result.empty && !result.insolvent && (
        <PrintButton
          label="Save this division as a PDF"
          hint="Opens your browser’s print dialogue. Choose “Save as PDF” as the destination. Nothing is uploaded to make the file."
        />
      )}

      {/* Standing on every result, not tucked behind a disclosure. */}
      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> It applies the
        majority Sunni rules to the people you entered. A real estate can turn
        on facts it cannot see — a missing or disputed heir, an unborn child,
        jointly owned property, an heir who died in the same event, or a point
        on which the schools differ. Take this result to a qualified scholar
        before anything is divided.
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


function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <span className="min-w-0">
        <span className="block text-base font-medium">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm leading-snug text-muted">
            {hint}
          </span>
        )}
      </span>
      {children}
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Row label={label} hint={hint}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={() => onChange(!on)}
        className={`press relative h-8 w-14 shrink-0 rounded-full border transition ${
          on ? "border-brand bg-brand" : "border-line bg-background"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-surface shadow-sm transition-all ${
            on ? "left-[1.7rem]" : "left-0.5"
          }`}
        />
      </button>
    </Row>
  );
}

function Counter({
  label,
  hint,
  value,
  max = 20,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  const step = (by: number) =>
    onChange(Math.min(max, Math.max(0, value + by)));

  return (
    <Row label={label} hint={hint}>
      <span className="flex shrink-0 items-center gap-1">
        <StepButton
          sign="−"
          label={`One fewer ${label}`}
          disabled={value === 0}
          onClick={() => step(-1)}
        />
        <span
          aria-live="polite"
          className={`w-8 text-center text-lg font-bold tabular-nums ${
            value === 0 ? "text-muted/40" : ""
          }`}
        >
          {value}
        </span>
        <StepButton
          sign="+"
          label={`One more ${label}`}
          disabled={value >= max}
          onClick={() => step(1)}
        />
      </span>
    </Row>
  );
}

function StepButton({
  sign,
  label,
  disabled,
  onClick,
}: {
  sign: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="press flex h-9 w-9 items-center justify-center rounded-lg border border-line text-lg leading-none text-muted transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-muted"
    >
      {sign}
    </button>
  );
}
