"use client";

import { useMemo, useState } from "react";
import {
  BKASH,
  DONATIONS,
  EXPENSES,
  GOAL,
  USD_TO_BDT,
  balance,

  taka,
  totalReceived,
  totalSpent,
} from "@/lib/support";

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
  const [sent, setSent] = useState(false);

  const received = totalReceived();
  const spent = totalSpent();
  const left = balance();


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

  /**
   * The details as one block of text, ready to send by whatever the reader
   * actually uses.
   *
   * The first version put a mailto: link on the button. It opened Outlook,
   * which in Bangladesh is nobody's messaging app, and the page itself did
   * not visibly change — so pressing it felt like nothing had happened. That
   * was the wrong mechanism, not the wrong wording.
   */
  const details = useMemo(
    () =>
      [
        "DebtRunway — donation",
        `Transaction ID: ${form.txn.trim()}`,
        `Amount: ${form.amount.trim() || "—"} tk`,
        `Name: ${form.name.trim() || "Anonymous"}`,
        form.note.trim() ? `Note: ${form.note.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [form],
  );

  const whatsapp = `https://wa.me/88${BKASH}?text=${encodeURIComponent(details)}`;

  const copyDetails = () => {
    navigator.clipboard
      .writeText(details)
      .then(() => {
        setSent(true);
        setTimeout(() => setSent(false), 6000);
      })
      .catch(() => {});
  };

  const ready = form.txn.trim().length > 0;

  return (
    <div className="stagger space-y-4">
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

            <p
              className="mt-5 text-center text-sm"
              style={{ color: "var(--bkash-muted)" }}
            >
              এই নম্বরে সেন্ড মানি করুন
            </p>
            <p
              className="mt-1 text-center text-3xl font-bold tracking-wide tabular-nums sm:text-4xl"
              style={{ color: "var(--bkash-ink)" }}
            >
              {BKASH}
            </p>

            <button
              type="button"
              onClick={copyNumber}
              className="press mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white transition hover:opacity-90"
              style={{ background: "var(--bkash)" }}
            >
              {copied ? "কপি হয়েছে ✓" : "বিকাশ নম্বর কপি করুন"}
            </button>

            <div
              className="mt-5 border-t pt-4"
              style={{ borderColor: "var(--bkash-line)" }}
            >
              <p
                className="text-center text-xs font-semibold tracking-wide"
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
                    <span
                      className="mt-2 block text-xs leading-snug font-semibold"
                      style={{ color: "var(--bkash-ink)" }}
                    >
                      {s.title}
                    </span>
                    <span
                      className="mt-0.5 block text-xs leading-snug"
                      style={{ color: "var(--bkash-muted)" }}
                    >
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

          {/* WhatsApp first, because that is what people here actually have
              open. The copy button is the fallback that works with no app at
              all, and either way the page says plainly that it worked — the
              old mailto changed nothing on screen, so pressing it felt like
              pressing a dead button. */}
          <a
            href={ready ? whatsapp : undefined}
            target="_blank"
            rel="noopener"
            aria-disabled={!ready}
            onClick={() => ready && setSent(true)}
            className={`press mt-5 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-center text-base font-semibold transition ${
              ready
                ? "bg-brand text-white hover:opacity-90"
                : "pointer-events-none border border-line bg-background text-muted opacity-60"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4 0-.1-.2-.2-.4-.3z" />
              <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-2.9.9.9-2.8-.2-.3A8.2 8.2 0 1112 20.2z" />
            </svg>
            WhatsApp-এ পাঠান
          </a>

          <button
            type="button"
            onClick={copyDetails}
            disabled={!ready}
            className="press mt-2.5 w-full rounded-xl border border-line px-5 py-3 text-center text-base font-medium transition hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-60"
          >
            {sent ? "কপি হয়েছে ✓" : "তথ্যগুলো কপি করুন"}
          </button>

          {!ready && (
            <p className="mt-2 text-center text-sm text-muted">
              ট্রানজেকশন আইডি দিলে বোতাম দুটো কাজ করবে।
            </p>
          )}

          {sent && ready && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-brand/30 bg-brand-soft p-4"
            >
              <p className="font-semibold text-brand">
                ✓ পাঠানো হয়েছে · Sent
              </p>
              <p className="mt-1.5 text-sm leading-relaxed">
                আপনার তথ্য আমাদের কাছে এসেছে। বিকাশের হিসাবের সাথে মিলিয়ে দেখে
                নিচের তালিকায় যোগ করা হবে — সাধারণত এক-দুই দিনের মধ্যে।
                <span className="mt-1 block text-muted">
                  Checked against the account, then added to the list below.
                </span>
              </p>
            </div>
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

      {/* Why the entry does not appear the moment it is sent.
          This was the first thing asked about the page, which means it was
          the first thing the page failed to say. Someone who submits and sees
          nothing change assumes it is broken — so the explanation sits where
          the button is, not three sections further down. */}
      <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5">
        <h3 className="display text-lg">পাঠানোর পর কী হয়</h3>
        <ol className="mt-3 space-y-2.5">
          {[
            [
              "আপনার তথ্য আমাদের কাছে আসে",
              "The details reach us — not the public list",
            ],
            [
              "বিকাশের হিসাবের সাথে মিলিয়ে দেখা হয়",
              "We check it against the bKash account",
            ],
            [
              "তারপর নিচের তালিকায় নাম ওঠে",
              "Only then does it appear in the list below",
            ],
          ].map(([bn, en], i) => (
            <li key={en} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                {i + 1}
              </span>
              <span className="text-base leading-snug">
                {bn}
                <span className="mt-0.5 block text-sm text-muted">{en}</span>
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          <strong className="text-foreground">
            সাথে সাথে যোগ হয় না — আর এটাই ইচ্ছাকৃত।
          </strong>{" "}
          বিকাশ কোনো ওয়েবসাইটকে লেনদেন যাচাই করার সুযোগ দেয় না। সরাসরি তালিকায়
          বসে গেলে যে কেউ মনগড়া আইডি আর বড় অঙ্ক লিখে এক টাকাও না পাঠিয়ে সবার
          উপরে উঠে যেত — আর তখন পুরো তালিকাটাই মিথ্যা হয়ে যেত।
          <span className="mt-1.5 block">
            Nothing appears instantly, and that is the point. bKash gives a
            website no way to confirm a transaction, so a list that published
            on submit could be filled in by anyone.
          </span>
        </p>
      </div>

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

      {/* ---------- Where it stands ----------
          Four plain figures on a row, not a hero panel with a progress bar.
          The bar was the loudest thing on a page whose first job is to take a
          transaction ID, and a bar sitting at zero advertises that nobody has
          given rather than inviting anyone to. Numbers state the same facts
          without performing them. */}
      <Card>
        <h2 className="rule-gold display text-2xl">হিসাব · The figures</h2>
        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
          {[
            ["এসেছে", "Received", taka(received)],
            ["খরচ হয়েছে", "Spent", taka(spent)],
            ["বাকি আছে", "Unspent", taka(left)],
            ["দাতা", "Donors", String(DONATIONS.length)],
          ].map(([bn, en, value]) => (
            <div key={en}>
              <dt className="text-sm text-muted">
                {bn}
                <span className="mt-0.5 block text-xs">{en}</span>
              </dt>
              <dd className="mt-1.5 text-2xl font-bold tabular-nums text-brand">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-line pt-5">
          <p className="text-base leading-relaxed">
            <span className="text-muted">যা জমাচ্ছি:</span>{" "}
            <strong>{GOAL.title}</strong>
          </p>
          <p className="mt-1.5 text-sm tabular-nums text-muted">
            লক্ষ্য {taka(GOAL.target)} · এসেছে {taka(received)}
          </p>
        </div>
      </Card>

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
