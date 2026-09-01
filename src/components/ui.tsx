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
  /** Free text rather than a number — used for debt names. */
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
  /** Values may be an <AnimatedNumber>, so anything renderable is allowed. */
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
