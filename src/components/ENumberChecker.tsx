"use client";

import { useMemo, useState } from "react";
import {
  ADDITIVES,
  VERDICTS,
  countByVerdict,
  findAdditives,
  type Verdict,
} from "@/lib/e-numbers";
import {
  BN_VERDICTS,
  ENUMBER_COPY,
  bnAdditive,
  findAdditivesBn,
} from "@/lib/bn-enumbers";
import type { Locale } from "@/lib/i18n";
import { CornerMotif } from "./Ornament";
import { Card, Notice } from "./ui";

const TONE: Record<string, string> = {
  good: "border-brand/30 bg-brand-soft text-brand",
  warn: "border-accent/40 bg-accent/10 text-accent",
  bad: "border-danger/30 bg-danger/10 text-danger",
  info: "border-line bg-background text-muted",
};

const DOT: Record<string, string> = {
  good: "bg-brand",
  warn: "bg-accent",
  bad: "bg-danger",
  info: "bg-muted",
};

export default function ENumberChecker({
  lang = "en",
}: {
  /**
   * Labels only. The additive list, the verdicts and the matching all live in
   * e-numbers.ts and are identical in both languages — a reader who searches
   * E471 on either page is looking at the same row of the same table.
   */
  lang?: Locale;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Verdict | "all">("all");

  const bn = lang === "bn";
  const c = ENUMBER_COPY[bn ? "bn" : "en"];

  const counts = useMemo(() => countByVerdict(), []);

  const results = useMemo(() => {
    const found = bn ? findAdditivesBn(query) : findAdditives(query);
    return filter === "all" ? found : found.filter((a) => a.verdict === filter);
  }, [bn, query, filter]);

  /** The verdict's words. Its tone, and so its colour, stays with the engine. */
  const verdict = (v: Verdict) => ({
    label: bn ? BN_VERDICTS[v].label : VERDICTS[v].label,
    tone: VERDICTS[v].tone,
  });

  return (
    <div className="stagger space-y-4">
      {/* ---------- The point of the page ---------- */}
      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/30 sm:h-52 sm:w-52" />
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          {c.eyebrow}
        </p>
        <p className="mt-3 text-2xl leading-snug font-bold tracking-tight sm:text-3xl">
          {c.headline}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-white/85">{c.hero}</p>
      </section>

      {/* ---------- Search ---------- */}
      <Card className="no-print">
        <label className="block">
          <span className="block text-base font-medium">{c.searchLabel}</span>
          <span className="mt-1 block text-sm leading-snug text-muted">
            {c.searchHint}
          </span>
          <span className="mt-2 flex items-stretch overflow-hidden rounded-xl border border-line bg-surface transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
            <span className="flex shrink-0 items-center border-r border-line bg-background px-3 text-muted">
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E471"
              aria-label={c.searchAria}
              className="w-full min-w-0 bg-transparent px-3 py-3 text-[1.0625rem] outline-none placeholder:text-muted/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={c.clearAria}
                className="shrink-0 border-l border-line px-3 text-muted transition hover:text-brand"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </span>
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`press rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              filter === "all"
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-muted hover:border-brand hover:text-brand"
            }`}
          >
            {c.all} {ADDITIVES.length}
          </button>
          {(Object.keys(VERDICTS) as Verdict[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setFilter(filter === v ? "all" : v)}
              aria-pressed={filter === v}
              className={`press rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                filter === v
                  ? TONE[VERDICTS[v].tone]
                  : "border-line text-muted hover:border-brand hover:text-brand"
              }`}
            >
              {verdict(v).label} {counts[v]}
            </button>
          ))}
        </div>
      </Card>

      {/* ---------- Results ---------- */}
      {results.length === 0 ? (
        <Notice>{c.empty(query)}</Notice>
      ) : (
        <div className="space-y-3">
          {results.map((a) => {
            const v = verdict(a.verdict);
            const words = bn ? bnAdditive(a) : a;
            return (
              <Card key={a.code}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold tracking-tight">
                      {a.code}
                    </h3>
                    <p className="mt-0.5 text-lg">{words.name}</p>
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${TONE[v.tone]}`}
                  >
                    <span aria-hidden className={`h-2 w-2 rounded-full ${DOT[v.tone]}`} />
                    {v.label}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted">{words.role}</p>
                <p className="mt-3 text-base leading-relaxed">{words.note}</p>
              </Card>
            );
          })}
        </div>
      )}

      <Notice tone="danger">
        <strong>{c.cannotLead}</strong>
        {c.cannotBody}
      </Notice>
    </div>
  );
}
