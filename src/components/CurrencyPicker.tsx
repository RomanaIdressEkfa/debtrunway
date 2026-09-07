"use client";

import { useEffect, useRef, useState } from "react";
import { CURRENCIES, symbolFor } from "@/lib/metals";

/**
 * Currency choice, which on this site changes the prices rather than the
 * arithmetic. Zakat is a fortieth and nisab is a weight of metal, so the
 * answer holds in any currency — what the picker does is refill the metal
 * price with the build-day rate for that country.
 *
 * It is a listbox rather than a native <select> because seventeen options in
 * a native select is a popup roughly the height of the viewport, and a
 * browser will open it upwards over the site header when the field sits low
 * on the page. A listbox can be capped and scrolled, so the menu stays inside
 * the card it belongs to whatever is above or below it.
 *
 * The cost of leaving the native control is everything it gave for free, so
 * the keyboard and screen-reader behaviour is rebuilt here: roles, arrow
 * keys, Home and End, Enter and Escape, click-away, and focus returning to
 * the button on close.
 */
export default function CurrencyPicker({
  value,
  onChange,
  label = "Currency",
  hint,
  compact = false,
}: {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  /** A line under the label. Fields beside this one carry one, and without it
   *  the picker is a line shorter — which, in a row aligned at the bottom,
   *  drops its label below theirs. */
  hint?: string;
  /** Drops the visible label and shrinks the control, for sitting inside a
   *  row of other controls rather than standing as a field of its own. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, CURRENCIES.indexOf(value)),
  );
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  // Close on a click anywhere else — the behaviour every dropdown has, and
  // that nobody notices until it is missing.
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  // Keep the highlighted row in view when the arrows walk past the edge of
  // the scroll box.
  useEffect(() => {
    if (!open || !list.current) return;
    const el = list.current.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const choose = (code: string) => {
    onChange(code);
    setOpen(false);
    button.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActive(Math.max(0, CURRENCIES.indexOf(value)));
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        button.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => Math.min(CURRENCIES.length - 1, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(CURRENCIES.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(CURRENCIES[active]);
        break;
    }
  };

  const shown = (code: string) =>
    symbolFor(code) !== code ? `${code} (${symbolFor(code)})` : code;

  const trigger = [
    "flex w-full items-center justify-between gap-2 border border-line bg-surface text-left outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15",
    compact
      ? "rounded-lg px-2.5 py-1.5 text-sm font-medium"
      : "rounded-xl px-3 py-3 text-base",
  ].join(" ");

  const menu = [
    "card-shadow absolute top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-line bg-surface py-1",
    compact ? "right-0 min-w-[9rem]" : "right-0 left-0",
  ].join(" ");

  return (
    <div className="min-w-0" data-menu-open={open ? "true" : undefined}>
      {!compact && (
        <>
          <span className="block text-base font-medium" id="currency-label">
            {label}
          </span>
          {hint && (
            <span className="mt-1 block text-sm leading-snug text-muted">
              {hint}
            </span>
          )}
        </>
      )}
      <div
        ref={box}
        className={compact ? "relative" : "relative mt-2"}
        onKeyDown={onKey}
      >
        <button
          ref={button}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={compact ? label : undefined}
          aria-labelledby={compact ? undefined : "currency-label"}
          onClick={() => {
            setActive(Math.max(0, CURRENCIES.indexOf(value)));
            setOpen((o) => !o);
          }}
          className={trigger}
        >
          <span className="truncate">{shown(value)}</span>
          <span
            aria-hidden
            className={
              open
                ? "shrink-0 rotate-180 text-muted transition-transform"
                : "shrink-0 text-muted transition-transform"
            }
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3">
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
        </button>

        {open && (
          <ul ref={list} role="listbox" aria-label={label} tabIndex={-1} className={menu}>
            {CURRENCIES.map((code, i) => {
              const selected = code === value;
              const row = [
                "cursor-pointer px-3 py-2 transition-colors",
                compact ? "text-sm" : "text-base",
                i === active ? "bg-brand-soft" : "",
                selected ? "font-semibold text-brand" : "",
              ].join(" ");
              return (
                <li
                  key={code}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(code)}
                  className={row}
                >
                  {shown(code)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
