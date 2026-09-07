"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { calculators, groupLabels, groups } from "@/lib/calculators";

/**
 * A <details> element for the accessibility and keyboard behaviour the browser
 * already provides, with the three dismissals it does not: clicking away,
 * pressing Escape, and following a link.
 */
export default function SiteNav() {
  const ref = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => {
    setOpen(false);
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

  // Navigating to a calculator should leave the menu behind.
  useEffect(close, [pathname]);

  return (
    <details
      ref={ref}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group relative"
    >
      {/* The word costs about 75px, which a 320px header cannot spare. It is
          replaced by a list icon there and returns from `sm` up. */}
      <summary
        className="press flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-line p-2 text-sm font-medium text-muted hover:bg-background hover:text-brand sm:border-0 sm:px-3 sm:py-1.5"
        aria-label="Calculators"
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
        <span className="hidden sm:inline">Calculators</span>
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
              {groupLabels[group]}
            </p>
            <ul>
              {calculators
                .filter((c) => c.group === group)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={c.slug}
                      onClick={close}
                      aria-current={pathname === c.slug ? "page" : undefined}
                      className={`block rounded-md px-2 py-2 text-sm transition-colors hover:bg-background hover:text-brand ${
                        pathname === c.slug ? "font-semibold text-brand" : ""
                      }`}
                    >
                      {c.nav}
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
