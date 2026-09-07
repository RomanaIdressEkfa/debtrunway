"use client";

import { CURRENCIES, symbolFor } from "@/lib/metals";

/**
 * Currency choice, which on this site changes the prices rather than the
 * arithmetic. Zakat is a fortieth and nisab is a weight of metal, so the
 * answer holds in any currency — what the picker actually does is refill the
 * metal price with the build-day rate for that country.
 */
export default function CurrencyPicker({
  value,
  onChange,
  note,
}: {
  value: string;
  onChange: (code: string) => void;
  note?: string;
}) {
  return (
    <div>
      <label className="block text-base font-medium" htmlFor="currency">
        Currency
      </label>
      {note && (
        <p className="mt-1 text-sm leading-snug text-muted">{note}</p>
      )}
      <div className="mt-2 flex items-center rounded-xl border border-line bg-surface px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <select
          id="currency"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 cursor-pointer appearance-none bg-transparent py-3 text-base outline-none"
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code} {symbolFor(code) !== code ? `(${symbolFor(code)})` : ""}
            </option>
          ))}
        </select>
        <span aria-hidden className="shrink-0 text-muted">
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
      </div>
    </div>
  );
}
