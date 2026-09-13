"use client";

import { useMemo, useState } from "react";
import {
  BKASH,
  DONATIONS,
  EXPENSES,
  GOAL,
  USD_TO_BDT,
  balance,
  goalProgress,
  taka,
  totalReceived,
  totalSpent,
} from "@/lib/support";
import { CornerMotif } from "./Ornament";
import { Card, Notice } from "./ui";

/**
 * The bKash instructions are in Bengali and the rest of the page is not.
 *
 * That is not an oversight. bKash exists in one country, so every person who
 * will ever follow these steps reads Bengali, and putting the steps in
 * English would be writing them for nobody. The explanation above stays in
 * English because the site's readers are mostly not in Bangladesh and they
 * are the ones deciding whether any of this is worth supporting.
 */
const STEPS = [
  "bKash অ্যাপ খুলুন → Send Money",
  `নম্বর দিন: ${BKASH}`,
  "যত টাকা ইচ্ছা পাঠান — কোনো নির্দিষ্ট অঙ্ক নেই",
  "পাঠানোর পর Transaction ID টা কপি করে নিচের ফর্মে দিন",
];

type Sort = "date" | "amount";

export default function SupportPanel() {
  const [sort, setSort] = useState<Sort>("date");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", amount: "", txn: "", note: "" });

  const received = totalReceived();
  const spent = totalSpent();
  const left = balance();
  const progress = goalProgress();

  const rows = useMemo(() => {
    const list = [...DONATIONS];
    list.sort((a, b) =>
      sort === "amount"
        ? b.amount - a.amount
        : b.date.localeCompare(a.date),
    );
    return list;
  }, [sort]);

  const copyNumber = () => {
    navigator.clipboard
      .writeText(BKASH)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  };

  // The form opens the reader's own mail client rather than posting anywhere.
  // Nothing is stored, nothing is transmitted to us by the page itself, and
  // the site keeps its promise that what you type stays in your browser.
  const mailto = useMemo(() => {
    const body = [
      `Transaction ID: ${form.txn || "(paste it here)"}`,
      `Amount: ${form.amount || "(taka)"}`,
      `Name to list: ${form.name.trim() || "Anonymous"}`,
      form.note.trim() ? `Note: ${form.note.trim()}` : "",
      "",
      "— sent from the support page on debtrunway.com",
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:hello@debtrunway.com?subject=${encodeURIComponent(
      "Donation — " + (form.txn || "bKash"),
    )}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const ready = form.txn.trim().length > 0;

  return (
    <div className="stagger space-y-4">
      {/* ---------- Where it stands ---------- */}
      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/30 sm:h-52 sm:w-52" />

        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          Received so far
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
          {taka(received)}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs tracking-wide text-white/70 uppercase">Spent</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{taka(spent)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-white/70 uppercase">Unspent</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">{taka(left)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-wide text-white/70 uppercase">Donors</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">
              {DONATIONS.length}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-white/20 pt-5">
          <p className="text-sm text-white/85">
            Going towards: <strong>{GOAL.title}</strong>
          </p>
          <div
            className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/20"
            role="img"
            aria-label={`${Math.round(progress)} per cent of ${taka(GOAL.target)}`}
          >
            <div
              className="h-full rounded-full bg-white transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm tabular-nums text-white/70">
            {taka(received)} of {taka(GOAL.target)}
          </p>
        </div>
      </section>

      {/* ---------- Why ---------- */}
      <Card>
        <h2 className="rule-gold display text-2xl">What it actually costs</h2>
        <p className="mt-4 text-base leading-relaxed">
          Almost nothing, and this page would rather say so than imply a server
          bill it does not have. The site is static. Hosting is free, the
          analytics are free, the code is public, and the gold and silver
          prices come from a free tier. The only thing anyone pays for is the
          domain — about {taka(1450)} a year.
        </p>
        <p className="mt-3 text-base leading-relaxed">
          What it costs is time, and one thing time cannot buy.
        </p>
        <div className="mt-5 rounded-xl bg-brand-soft p-5">
          <h3 className="font-bold tracking-tight text-brand">{GOAL.title}</h3>
          <p className="mt-2 text-base leading-relaxed">{GOAL.why}</p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Nothing here is behind a payment and nothing will be. Every
          calculator stays free whether this page ever receives anything or
          not. If it is more useful to you unpaid, that is entirely fine — use
          it and make du&rsquo;a instead.
        </p>
      </Card>

      {/* ---------- How ---------- */}
      <Card>
        <h2 className="rule-gold display text-2xl">If you would like to give</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Through bKash, which is why the steps below are in Bengali — it is
          only available in Bangladesh.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-background p-4">
          <span className="text-sm font-medium text-muted">bKash</span>
          <span className="font-mono text-2xl font-bold tracking-wide tabular-nums">
            {BKASH}
          </span>
          <button
            type="button"
            onClick={copyNumber}
            className="press ml-auto rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {copied ? "কপি হয়েছে ✓" : "কপি করুন"}
          </button>
        </div>

        <ol className="mt-5 space-y-2.5">
          {STEPS.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                {i + 1}
              </span>
              <span className="text-base leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* ---------- Tell us ---------- */}
      <Card className="no-print">
        <h2 className="rule-gold display text-2xl">Then tell us, so it can be recorded</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Every entry in the ledger below is checked against the account before
          it is written down, which is the only reason the ledger is worth
          anything. bKash gives a website no way to confirm a transaction, so a
          form that published straight to the list could be filled in by
          anybody. This one opens your own email instead.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            id="txn"
            label="Transaction ID"
            hint="bKash-এর মেসেজে পাবেন"
            value={form.txn}
            onChange={(v) => setForm({ ...form, txn: v })}
            placeholder="8N7A1B2C3D"
          />
          <Field
            id="amount"
            label="Amount"
            hint="টাকায়"
            value={form.amount}
            onChange={(v) => setForm({ ...form, amount: v })}
            placeholder="500"
          />
          <Field
            id="name"
            label="Name for the list"
            hint="খালি রাখলে Anonymous লেখা হবে"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Anonymous"
          />
          <Field
            id="note"
            label="A note, if you want"
            hint="ইচ্ছা হলে কিছু লিখুন"
            value={form.note}
            onChange={(v) => setForm({ ...form, note: v })}
            placeholder="—"
          />
        </div>

        <a
          href={ready ? mailto : undefined}
          aria-disabled={!ready}
          className={`press mt-5 inline-block rounded-xl px-5 py-3 text-base font-semibold transition ${
            ready
              ? "bg-brand text-white hover:opacity-90"
              : "pointer-events-none border border-line bg-background text-muted opacity-60"
          }`}
        >
          Send the details →
        </a>
        {!ready && (
          <p className="mt-2 text-sm text-muted">
            Transaction ID দিলে বোতামটা কাজ করবে।
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-muted">
          Nothing you type here is sent to a server. The button opens your own
          mail app with the details filled in, and you send it yourself — the
          same promise every calculator on this site makes.
        </p>
      </Card>

      {/* ---------- The ledger ---------- */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="rule-gold display text-2xl">Everyone who has given</h2>
          {DONATIONS.length > 1 && (
            <div className="flex gap-2">
              {(
                [
                  ["date", "Newest"],
                  ["amount", "Largest"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  aria-pressed={sort === key}
                  className={`press rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                    sort === key
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-line text-muted hover:border-brand hover:text-brand"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {rows.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-line p-6 text-center text-base text-muted">
            Nothing yet. This page went up today, and it starts empty rather
            than with figures invented to look established.
          </p>
        ) : (
          <ul className="mt-5 divide-y divide-line">
            {rows.map((d, i) => (
              <li
                key={`${d.date}-${i}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3.5"
              >
                <span className="min-w-0">
                  <span className="text-lg font-medium">
                    {d.name?.trim() || "Anonymous"}
                  </span>
                  {d.note && (
                    <span className="mt-0.5 block text-sm leading-snug text-muted">
                      {d.note}
                    </span>
                  )}
                </span>
                <span className="flex items-baseline gap-3">
                  <span className="text-sm tabular-nums text-muted">{d.date}</span>
                  <span className="text-lg font-semibold tabular-nums text-brand">
                    {taka(d.amount)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* ---------- Where it went ---------- */}
      <Card>
        <h2 className="rule-gold display text-2xl">Where the money went</h2>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Every taka spent, with what it was for. Dollar costs are converted at{" "}
          <strong className="text-foreground tabular-nums">
            ৳{USD_TO_BDT} to $1
          </strong>{" "}
          so you can check the arithmetic rather than take it on trust.
        </p>
        <ul className="mt-5 divide-y divide-line">
          {EXPENSES.map((e) => (
            <li key={e.date + e.item} className="py-3.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-lg font-medium">{e.item}</span>
                <span className="flex items-baseline gap-3">
                  <span className="text-sm tabular-nums text-muted">{e.date}</span>
                  <span className="text-lg font-semibold tabular-nums">
                    −{taka(e.amount)}
                  </span>
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{e.why}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Notice>
        <strong>This is sadaqah, not a fee.</strong> Nothing on this site is
        behind a payment, nothing will be, and no calculator behaves any
        differently for someone who has given. Giving quietly is better than
        giving publicly — the list exists so the spending can be checked, not
        so anyone can be seen. Leave the name blank and it will say Anonymous.
      </Notice>
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label htmlFor={id} className="block min-w-0">
      <span className="block text-base font-medium">{label}</span>
      <span className="mt-1 block text-sm leading-snug text-muted">{hint}</span>
      <span className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-line bg-surface transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 bg-transparent px-3 py-3 text-[1.0625rem] outline-none placeholder:text-muted/40"
        />
      </span>
    </label>
  );
}
