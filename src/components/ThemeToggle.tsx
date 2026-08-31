"use client";

import { useEffect, useState } from "react";

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
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem("theme") === "dark") setTheme("dark");
    } catch {
      // Private mode or blocked storage: light is the right fallback anyway.
    }
  }, []);

  const choose = (next: Theme) => {
    setTheme(next);

    if (next === "dark") document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");

    try {
      if (next === "dark") localStorage.setItem("theme", "dark");
      else localStorage.removeItem("theme");
    } catch {
      // Nothing to do — the choice still applies for this page view.
    }
  };

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
        {mounted && theme === "dark" ? MoonIcon : SunIcon}
      </button>

      {/* Wider screens: both states visible, the active one marked. */}
      <div
        className="hidden items-center gap-0.5 rounded-lg border border-line p-0.5 sm:flex"
        role="radiogroup"
        aria-label="Colour theme"
      >
        {OPTIONS.map((option) => {
          // Before mount the light button is marked, matching the server
          // markup, so hydration stays clean.
          const active = mounted
            ? theme === option.value
            : option.value === "light";
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
