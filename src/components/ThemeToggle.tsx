"use client";

import { useCallback, useSyncExternalStore } from "react";

const SunIcon = (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
    <circle cx="8" cy="8" r="3.1" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1" />
    </g>
  </svg>
);

const MoonIcon = (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
    <path
      d="M13.2 9.9A5.6 5.6 0 0 1 6.1 2.8a5.6 5.6 0 1 0 7.1 7.1Z"
      fill="currentColor"
    />
  </svg>
);

const OPTIONS = [
  { value: "light" as const, label: "Light", icon: SunIcon },
  { value: "dark" as const, label: "Dark", icon: MoonIcon },
];

type Theme = (typeof OPTIONS)[number]["value"];

/**
 * Light or dark, with light as the starting point for every new visitor.
 *
 * The site is designed in the light palette, so that is what someone meets on
 * a first visit regardless of their operating system. Dark is a choice the
 * reader makes here, and it is remembered.
 */
/**
 * The theme lives on the document, not in React.
 *
 * The inline script in the layout has already stamped data-theme on <html>
 * before the first paint, so by the time this component runs the answer is
 * sitting in the DOM. Reading it with useSyncExternalStore rather than
 * copying it into state after mount is what the hook exists for: React uses
 * the server snapshot while hydrating and swaps to the live one immediately
 * after, so there is no mismatch and no "mounted" flag to gate the markup on.
 *
 * The previous version set state twice inside an effect to achieve the same
 * thing, which works but causes the cascading render the effect rules warn
 * about — and needed a flag whose only job was to paper over the gap.
 */
const listeners = new Set<() => void>();

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  // Another tab changing the theme should move this one too.
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(notify);
    window.removeEventListener("storage", notify);
  };
};

const readTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

/** What the server rendered, and what hydration matches against. */
const serverTheme = (): Theme => "light";

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);

  const choose = useCallback((next: Theme) => {
    if (next === "dark")
      document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");

    try {
      if (next === "dark") localStorage.setItem("theme", "dark");
      else localStorage.removeItem("theme");
    } catch {
      // Private mode or a full quota: the choice still applies to this view.
    }

    listeners.forEach((notify) => notify());
  }, []);

  const other: Theme = theme === "dark" ? "light" : "dark";

  return (
    <>
      {/* Phones: one button that flips between the two. */}
      <button
        type="button"
        onClick={() => choose(other)}
        aria-label={`Switch to ${other} theme`}
        title={`Switch to ${other} theme`}
        className="press rounded-lg border border-line p-2 text-muted hover:border-brand hover:text-brand sm:hidden"
      >
        {theme === "dark" ? MoonIcon : SunIcon}
      </button>

      {/* Wider screens: both states visible, the active one marked. */}
      <div
        className="hidden items-center gap-0.5 rounded-lg border border-line p-0.5 sm:flex"
        role="radiogroup"
        aria-label="Colour theme"
      >
        {OPTIONS.map((option) => {
          const active = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={option.label}
              title={option.label}
              onClick={() => choose(option.value)}
              className={`press rounded-md p-1.5 ${
                active ? "bg-brand-soft text-brand" : "text-muted hover:text-brand"
              }`}
            >
              {option.icon}
            </button>
          );
        })}
      </div>
    </>
  );
}
