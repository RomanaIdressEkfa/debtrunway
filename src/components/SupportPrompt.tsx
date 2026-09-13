"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The quiet ask, two and a half minutes in.
 *
 * The timing is the whole design. Google demotes pages that cover their
 * content with an interstitial the moment a visitor arrives from search —
 * that rule is aimed at the popup that blocks what you came to read before
 * you have read any of it. This one waits until someone has been here long
 * enough to have actually used something, which is both outside that rule
 * and the only moment the question makes sense: asking whether a site helped
 * you before it has had a chance to is asking nothing.
 *
 * It is also a card in the corner rather than a sheet over the page. Nothing
 * is ever covered, nothing has to be dismissed before the site can be used,
 * and a reader who ignores it entirely loses nothing.
 */

const DELAY_MS = 150_000; // two and a half minutes
const KEY = "support-prompt-dismissed";
const QUIET_DAYS = 30;

/** Not on the page that already is the ask, and not on the legal pages. */
const SILENT_ON = ["/support", "/privacy", "/terms"];

function dismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const until = Number(raw);
    if (!Number.isFinite(until)) return false;
    return Date.now() < until;
  } catch {
    // Private windows and blocked storage throw. Treat it as not dismissed —
    // showing the card once to someone who cannot be remembered is a smaller
    // failure than never showing it at all.
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(KEY, String(Date.now() + QUIET_DAYS * 86_400_000));
  } catch {
    /* nothing to do; it will ask again next visit */
  }
}

export default function SupportPrompt() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  const silent = SILENT_ON.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (silent || dismissedRecently()) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [silent]);

  const close = useCallback(() => {
    remember();
    setOpen(false);
  }, []);

  // Escape closes it, the same as the button. A card nobody can dismiss with
  // the keyboard is a card that traps someone not using a mouse.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <aside
      aria-label="A note about supporting the site"
      className="support-prompt no-print fixed right-4 bottom-4 left-4 z-50 sm:left-auto sm:max-w-sm"
    >
      <div className="card-shadow relative overflow-hidden rounded-2xl border border-line bg-surface p-5">
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close, and do not ask again for a month"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-foreground"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className="pr-8 text-lg font-bold tracking-tight">
          Has this been useful to you?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Everything here is free and stays free. No advertising, and nothing
          you type ever leaves your browser. If it helped, a small sadaqah
          keeps it going — whatever you feel like, and nothing at all is also
          a fine answer.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/support"
            onClick={close}
            className="press rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Support the site
          </Link>
          <button
            type="button"
            onClick={close}
            className="press rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
