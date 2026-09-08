import { WEIGHT_UNITS, unitById } from "@/lib/weight";
import type { ReactNode } from "react";

/** The single panel style every calculator section sits in. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`card-shadow rounded-2xl border border-line bg-surface p-4 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  large,
  text,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  prefix?: string;
  suffix?: string;
  large?: boolean;
  /** Free text rather than a number. */
  text?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {hint && <span className="mb-2 block text-sm text-muted">{hint}</span>}
      {/* Compact fields share a row three-across on a phone, so the padding and
          type step down to leave room for a five-figure balance. */}
      <span
        className={`flex items-center rounded-xl border border-line bg-surface transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 ${
          large ? "px-3" : "px-2 sm:px-3"
        }`}
      >
        {prefix && (
          <span className={large ? "text-muted" : "text-sm text-muted"}>
            {prefix}
          </span>
        )}
        <input
          value={value}
          placeholder={placeholder}
          inputMode={text ? "text" : "decimal"}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-w-0 bg-transparent outline-none ${
            large
              ? "px-2 py-3 text-lg font-semibold"
              : "px-1 py-2.5 text-sm sm:px-2 sm:text-base"
          }`}
        />
        {suffix && (
          <span className={large ? "text-muted" : "text-sm text-muted"}>
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

/**
 * The one answer the visitor came for, stated once and large.
 * Everything else on the page is supporting detail behind this.
 */
export function ResultHero({
  eyebrow,
  value,
  sub,
  stats,
  tone = "brand",
  action,
}: {
  eyebrow: string;
  value: string;
  sub: string;
  /** Values may carry their own markup, so anything renderable is allowed. */
  stats: { label: string; value: ReactNode }[];
  tone?: "brand" | "danger";
  /** Optional control in the corner — the share button lives here. */
  action?: ReactNode;
}) {
  return (
    <section
      className={`shimmer card-shadow rounded-2xl p-5 text-white sm:p-7 ${
        tone === "danger" ? "bg-danger-panel" : "bg-brand-panel"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            {eyebrow}
          </p>
          {/* Keyed on the value so a changed answer replays the entrance —
              it is how the reader notices their edit moved the date. */}
          <p
            key={value}
            className="animate-pop mt-2 text-4xl font-bold tracking-tight tabular-nums sm:text-5xl"
          >
            {value}
          </p>
          <p className="mt-1.5 text-lg text-white/85">{sub}</p>
        </div>
        {action}
      </div>

      {stats.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs tracking-wide text-white/70 uppercase">
                {s.label}
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

/**
 * Collapsed by default. Anyone who only wants the headline never scrolls past
 * a wall of tables, and the detail is still one tap away for anyone who does.
 */
export function Disclosure({
  title,
  hint,
  children,
  defaultOpen = false,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group card-shadow rounded-2xl border border-line bg-surface open:pb-4 sm:open:pb-6"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-6">
        <span>
          <span className="block font-semibold">{title}</span>
          {hint && (
            <span className="mt-0.5 block text-sm text-muted">{hint}</span>
          )}
        </span>
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-muted transition group-open:rotate-180 group-hover:border-brand group-hover:text-brand"
        >
          <svg viewBox="0 0 12 12" className="h-3.5 w-3.5">
            <path
              d="M2 4.5 6 8.5 10 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </summary>
      <div className="px-4 sm:px-6">{children}</div>
    </details>
  );
}

export function Notice({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "danger";
}) {
  const styles =
    tone === "danger"
      ? "border-danger/25 bg-danger/5 text-danger"
      : "border-transparent bg-brand-soft text-brand";
  return (
    <p className={`rounded-xl border px-4 py-3.5 text-sm leading-relaxed ${styles}`}>
      {children}
    </p>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-0.5 font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

/** Smaller supporting figure, used inside collapsed sections. */
export function Headline({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-xl bg-background p-4">
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-sm text-muted">{sub}</p>
    </div>
  );
}

/**
 * The number field every calculator uses.
 *
 * There were seven near-identical copies of this before, one per calculator,
 * and they all rendered the same thing: a plain white box with a "0" in it.
 * Nothing told you whether you were entering pounds, grams or a percentage
 * until you read the label above, and nothing distinguished a field holding
 * an estate from one holding a count of days. That sameness is what made the
 * forms look machine-made — a designed form varies where the content varies.
 *
 * So this one carries the unit inside the control, on the side the unit
 * belongs: a currency reads before the figure and a measure reads after it.
 * The two sit in their own compartments, divided by a hairline, which is what
 * stops "৳" reading as part of the number the way a bare prefix does.
 */
export function NumberField({
  label,
  hint,
  value,
  onChange,
  /** Currency symbol or similar, shown before the figure. */
  prefix,
  /** Unit shown after the figure — g, %, /month. */
  suffix,
  placeholder = "0",
  /** For the one figure a page is really about. */
  large,
  /** Whole numbers only, which changes the keypad on a phone. */
  whole,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  large?: boolean;
  whole?: boolean;
}) {
  return (
    <label className="group/field block min-w-0">
      <span className="block text-base font-medium">{label}</span>
      {hint && (
        <span className="mt-1 block text-sm leading-snug text-muted">
          {hint}
        </span>
      )}

      {/* The ring is wide and faint rather than narrow and strong: at four
          pixels and a tenth opacity it reads as the field lifting slightly,
          which is easier to live with on a form of a dozen of them. */}
      <span
        className={`mt-2 flex items-stretch overflow-hidden rounded-xl border border-line bg-surface transition group-hover/field:border-muted/40 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 ${
          large ? "shadow-sm" : ""
        }`}
      >
        {prefix && (
          <span className="flex shrink-0 items-center border-r border-line bg-background px-3 text-sm font-medium text-muted">
            {prefix}
          </span>
        )}
        <input
          value={value}
          placeholder={placeholder}
          inputMode={whole ? "numeric" : "decimal"}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-w-0 bg-transparent px-3 tabular-nums outline-none placeholder:text-muted/40 ${
            large ? "py-3.5 text-2xl font-bold" : "py-3 text-[1.0625rem]"
          }`}
        />
        {suffix && (
          <span className="flex shrink-0 items-center border-l border-line bg-background px-3 text-sm font-medium text-muted">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
}

/**
 * Which weight gold and silver are entered in.
 *
 * It sits above the weight fields rather than inside each one. A person holds
 * their collection in a single unit, and a picker per field would invite a set
 * of bangles in vori beside a coin in grams — which is how a total goes wrong
 * without ever looking wrong.
 */
export function WeightUnitPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const active = unitById(value);
  return (
    <div className="rounded-xl border border-line bg-background p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Weigh in</span>
        {WEIGHT_UNITS.map((u) => (
          <button
            key={u.id}
            type="button"
            onClick={() => onChange(u.id)}
            aria-pressed={value === u.id}
            className={`press rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
              value === u.id
                ? "border-brand bg-brand-soft text-brand"
                : "border-line text-muted hover:border-brand hover:text-brand"
            }`}
          >
            {u.label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-sm leading-snug text-muted">{active.note}</p>
    </div>
  );
}
