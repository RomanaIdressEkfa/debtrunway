"use client";

import { useMemo, useState } from "react";
import {
  ADDITIVES,
  VERDICTS,
  countByVerdict,
  findAdditives,
  type Verdict,
} from "@/lib/e-numbers";
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

export default function ENumberChecker() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Verdict | "all">("all");

  const counts = useMemo(() => countByVerdict(), []);

  const results = useMemo(() => {
    const found = findAdditives(query);
    return filter === "all" ? found : found.filter((a) => a.verdict === filter);
  }, [query, filter]);

  return (
    <div className="stagger space-y-4">
      {/* ---------- The point of the page ---------- */}
      <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-6 text-white sm:p-8">
        <div className="band-grid islamic-grid absolute inset-0 opacity-90" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/30 sm:h-52 sm:w-52" />
        <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
          Before you look anything up
        </p>
        <p className="mt-3 text-2xl leading-snug font-bold tracking-tight sm:text-3xl">
          An E number names a substance, not a source.
        </p>
        <p className="mt-3 text-lg leading-relaxed text-white/85">
          E471 is mono- and diglycerides of fatty acids. Those fatty acids can
          come from palm oil or from beef tallow, and the number is identical
          either way. No list can tell you which is in the packet in your hand
          — and the list that has been forwarded around for thirty years is
          wrong in both directions.
        </p>
      </section>

      {/* ---------- Search ---------- */}
      <Card className="no-print">
        <label className="block">
          <span className="block text-base font-medium">
            Look up a number or an ingredient
          </span>
          <span className="mt-1 block text-sm leading-snug text-muted">
            Type 471, E471, gelatine, lecithin — whatever is on the packet
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
              aria-label="Search E numbers"
              className="w-full min-w-0 bg-transparent px-3 py-3 text-[1.0625rem] outline-none placeholder:text-muted/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear the search"
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
            All {ADDITIVES.length}
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
              {VERDICTS[v].label} {counts[v]}
            </button>
          ))}
        </div>
      </Card>

      {/* ---------- Results ---------- */}
      {results.length === 0 ? (
        <Notice>
          Nothing here matches &ldquo;{query}&rdquo;. This is a list of the
          additives people ask about most, not every E number in existence — if
          yours is missing, the manufacturer is the place to ask, and they are
          obliged to answer.
        </Notice>
      ) : (
        <div className="space-y-3">
          {results.map((a) => {
            const v = VERDICTS[a.verdict];
            return (
              <Card key={a.code}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl font-bold tracking-tight">
                      {a.code}
                    </h3>
                    <p className="mt-0.5 text-lg">{a.name}</p>
                  </div>
                  <span
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${TONE[v.tone]}`}
                  >
                    <span aria-hidden className={`h-2 w-2 rounded-full ${DOT[v.tone]}`} />
                    {v.label}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted">{a.role}</p>
                <p className="mt-3 text-base leading-relaxed">{a.note}</p>
              </Card>
            );
          })}
        </div>
      )}

      <Notice tone="danger">
        <strong>This page cannot certify anything.</strong> It says what can
        honestly be known from a number, which for many of the most-asked ones
        is that the number does not settle it. Where a product matters to you,
        the answers are a recognised certification body or the manufacturer
        themselves — and manufacturers in Britain, the EU and North America are
        obliged to tell you the source of an ingredient if you ask.
      </Notice>
    </div>
  );
}
