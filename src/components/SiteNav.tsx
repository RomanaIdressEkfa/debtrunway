"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calculators, groupLabels, groups } from "@/lib/calculators";
import { BN_GROUPS, BN_UI_MAP, bnFor } from "@/lib/bn";
import { BN_PAGES } from "@/lib/bn-pages";
import { localeOf } from "@/lib/i18n";

/**
 * A <details> element for the accessibility and keyboard behaviour the browser
 * already provides, with the three dismissals it does not: clicking away,
 * pressing Escape, and following a link.
 */
export default function SiteNav() {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // The chrome follows the page it is sitting on. A Bengali page with an
  // English menu is only half translated, and the half a reader meets first.
  const bn = localeOf(pathname ?? "/") === "bn";
  const label = (s: string) => (bn ? (BN_UI_MAP[s] ?? s) : s);

  // The menu remembers which page it was opened on rather than simply that it
  // is open. Navigating changes the pathname, so `open` becomes false during
  // the next render on its own — no effect watching the route, and so no
  // setState inside one. The three dismissals below are events, which is
  // where dismissals belong.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt !== null && openedAt === pathname;

  const close = () => {
    setOpenedAt(null);
    // <details> keeps its own open attribute, and React only removes it on the
    // next commit; taking it off here stops a frame of the menu still showing.
    ref.current?.removeAttribute("open");
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <details
      ref={ref}
      open={open}
      onToggle={(event) =>
        setOpenedAt(event.currentTarget.open ? pathname : null)
      }
      className="group relative"
    >
      {/* The word costs about 75px, which a 320px header cannot spare. It is
          replaced by a list icon there and returns from `sm` up. */}
      <summary
        className="press flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-line p-2 text-sm font-medium text-muted hover:bg-background hover:text-brand sm:border-0 sm:px-3 sm:py-1.5"
        aria-label={label("Calculators")}
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 sm:hidden"
        >
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
          </g>
        </svg>
        <span className="hidden sm:inline">{label("Calculators")}</span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="hidden h-3 w-3 transition-transform group-open:rotate-180 sm:block"
        >
          <path
            d="M2 4.5 6 8.5 10 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      {/* Sized to the longest label rather than a fixed width, so there is no
          dead space to the right of short items. */}
      <div className="animate-rise absolute right-0 z-40 mt-2 max-h-[70vh] w-max max-w-[90vw] min-w-[12rem] overflow-y-auto rounded-xl border border-line bg-surface p-3 shadow-xl">
        {groups.map((group) => (
          <div key={group} className="mb-4 last:mb-0">
            <p className="mb-1.5 text-xs font-semibold tracking-wider text-muted uppercase">
              {bn ? BN_GROUPS[group] : groupLabels[group]}
            </p>
            <ul>
              {calculators
                .filter((c) => c.group === group)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={bn && BN_PAGES.includes(c.slug) ? `/bn${c.slug}` : c.slug}
                      onClick={close}
                      aria-current={pathname === c.slug ? "page" : undefined}
                      className={`block rounded-md px-2 py-2 text-sm transition-colors hover:bg-background hover:text-brand ${
                        pathname === c.slug ? "font-semibold text-brand" : ""
                      }`}
                    >
                      {bn ? (bnFor(c.slug)?.nav ?? c.nav) : c.nav}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}
