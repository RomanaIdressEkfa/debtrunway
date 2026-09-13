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
  { title: "সেন্ড মানি", sub: "বিকাশ অ্যাপে Send Money বেছে নিন" },
  { title: "নম্বর দিন", sub: "উপরের নম্বরটি লিখুন বা পেস্ট করুন" },
  { title: "টাকা ও পিন", sub: "পরিমাণ দিয়ে পিন দিন" },
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

      {/* ---------- Give: two columns, payment beside the form ----------
          Side by side because the two halves are read together — you copy the
          number from the right, send the money in the app, then come back and
          type what you sent into the left. Stacked, that is a scroll up and
          down on a phone with the app already open. */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* --- 1. Send --- */}
        <Card className="no-print">
          <Step n={1} title="টাকা পাঠান" sub="Send the money" />

          {/* The bKash panel wears bKash's own magenta. Everything else here
              is the site's green; this one borrows the brand so that someone
              scanning for where to send money finds it without reading. */}
          <div
            className="mt-5 rounded-2xl border p-5"
            style={{
              background: "var(--bkash-soft)",
              borderColor: "var(--bkash-line)",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--bkash)" }}
              >
                বিকাশ
              </span>
              <span
                className="rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  color: "var(--bkash)",
                  borderColor: "var(--bkash-line)",
                }}
              >
                ● সেন্ড মানি
              </span>
            </div>

            <p className="mt-5 text-center text-sm text-muted">
              এই নম্বরে সেন্ড মানি করুন
            </p>
            <p
              className="mt-1 text-center text-3xl font-bold tracking-wide tabular-nums sm:text-4xl"
              style={{ color: "var(--bkash)" }}
            >
              {BKASH}
            </p>

            <button
              type="button"
              onClick={copyNumber}
              className="press mt-4 flex w-full items-center justify-center gap-2 rounded-xl border bg-surface px-4 py-3 text-base font-semibold transition hover:opacity-90"
              style={{ borderColor: "var(--bkash-line)", color: "var(--bkash)" }}
            >
              {copied ? "কপি হয়েছে ✓" : "বিকাশ নম্বর কপি করুন"}
            </button>

            <div
              className="mt-5 border-t pt-4"
              style={{ borderColor: "var(--bkash-line)" }}
            >
              <p
                className="text-center text-xs font-semibold"
                style={{ color: "var(--bkash)" }}
              >
                টাকা পাঠানোর ৩টি সহজ ধাপ
              </p>
              <ol className="mt-3 grid grid-cols-3 gap-2">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="text-center">
                    <span
                      className="mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ background: "var(--bkash)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="mt-2 block text-xs leading-snug font-semibold">
                      {s.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">
                      {s.sub}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            যত টাকা ইচ্ছা — কোনো নির্দিষ্ট অঙ্ক নেই।
            <span className="mt-0.5 block">
              Any amount. There is no set figure and no minimum.
            </span>
          </p>
        </Card>

        {/* --- 2. Tell us --- */}
        <Card className="no-print">
          <Step
            n={2}
            title="তারপর জানান"
            sub="Then tell us, so it can be recorded"
          />

          <div className="mt-5 grid gap-4">
            <Field
              id="txn"
              label="ট্রানজেকশন আইডি *"
              hint="বিকাশের মেসেজে পাবেন · from the bKash SMS"
              value={form.txn}
              onChange={(v) => setForm({ ...form, txn: v })}
              placeholder="8N7A1B2C3D"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="amount"
                label="কত টাকা"
                hint="Amount sent"
                value={form.amount}
                onChange={(v) => setForm({ ...form, amount: v })}
                placeholder="500"
              />
              <Field
                id="name"
                label="নাম"
                hint="খালি রাখলে Anonymous"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Anonymous"
              />
            </div>
            <Field
              id="note"
              label="কিছু বলতে চাইলে"
              hint="A note, if you want"
              value={form.note}
              onChange={(v) => setForm({ ...form, note: v })}
              placeholder="—"
            />
          </div>

          <a
            href={ready ? mailto : undefined}
            aria-disabled={!ready}
            className={`press mt-5 block rounded-xl px-5 py-3.5 text-center text-base font-semibold transition ${
              ready
                ? "bg-brand text-white hover:opacity-90"
                : "pointer-events-none border border-line bg-background text-muted opacity-60"
            }`}
          >
            পাঠিয়ে দিন · Send the details →
          </a>
          {!ready && (
            <p className="mt-2 text-center text-sm text-muted">
              ট্রানজেকশন আইডি দিলে বোতামটা কাজ করবে।
            </p>
          )}

          <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted">
            <svg
              viewBox="0 0 16 16"
              className="mt-0.5 h-4 w-4 shrink-0 text-brand"
              aria-hidden
              fill="none"
            >
              <path
                d="M8 1.5l5.5 2.2v3.6c0 3.2-2.2 6-5.5 7.2-3.3-1.2-5.5-4-5.5-7.2V3.7L8 1.5z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M5.8 8l1.6 1.6L10.4 6.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              আপনার লেখা কিছুই কোনো সার্ভারে যায় না — বোতামটা আপনার নিজের মেইল
              অ্যাপ খুলে দেয়, আপনি নিজে পাঠান।
              <span className="mt-0.5 block">
                Nothing here is sent to a server. The button opens your own mail
                app with the details filled in.
              </span>
            </span>
          </p>
        </Card>
      </div>

      <Notice>
        তালিকার প্রতিটা নাম বিকাশের হিসাবের সাথে মিলিয়ে দেখার পরেই ওঠে — আর
        সেটাই তালিকাটার একমাত্র মূল্য। বিকাশ কোনো ওয়েবসাইটকে লেনদেন যাচাই করার
        সুযোগ দেয় না, তাই সরাসরি তালিকায় বসে যাওয়া ফরম যে কেউ ভরে দিতে পারত।
      </Notice>

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

/**
 * A numbered step heading.
 *
 * Bengali first and English under it, because the two audiences for this page
 * are not the same person: whoever sends money is in Bangladesh reading
 * Bengali, and whoever is deciding whether the site deserves supporting is
 * mostly not.
 */
function Step({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-base font-bold text-brand">
        {n}
      </span>
      <div>
        <h2 className="display text-xl leading-tight">{title}</h2>
        <p className="mt-0.5 text-sm text-muted">{sub}</p>
      </div>
    </div>
  );
}
