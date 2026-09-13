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

// Thirty seconds while this is being tested. Put it back to 150_000 —
// two and a half minutes — before anyone but us is looking at the site:
// half a minute is fast enough to feel like the page interrupting you,
// which is the thing this design was built to avoid.
const DELAY_MS = 30_000;
const KEY = "support-prompt-dismissed";

/** Not on the page that already is the ask, and not on the legal pages. */
const SILENT_ON = ["/support", "/privacy", "/terms"];

/**
 * Dismissal lasts the visit, and sessionStorage is what a visit means.
 *
 * Closing it silences the card for the rest of the time the tab is open,
 * however many pages are read after that — being asked once per visit is a
 * request, being asked on every page is nagging. It comes back next time
 * because the browser clears sessionStorage when the session ends, which is
 * precisely the definition wanted here and saves inventing one.
 *
 * localStorage would have been wrong in the other direction: a single close
 * silencing the card for good means a reader who dismissed it while busy on
 * their first visit is never asked again, however many times they come back
 * and use the calculators.
 */
function dismissed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    // Private windows and blocked storage throw. Treat it as not dismissed —
    // showing the card once to someone who cannot be remembered is a smaller
    // failure than never showing it at all.
    return false;
  }
}

function remember() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* nothing to do; it will ask again on the next page */
  }
}

export default function SupportPrompt() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  const silent = SILENT_ON.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    // ?prompt on any URL shows it at once and ignores a dismissal.
    //
    // Testing this without an override is miserable: the card is on a timer,
    // and a single "Not now" silences it for the rest of the browser session,
    // so anyone checking their own work sees nothing and cannot tell a
    // working card from a broken one. Reloading does not help — sessionStorage
    // survives a reload. The override is a query parameter rather than a
    // build flag so it works on the live site too.
    const forced =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("prompt");
    if (!forced && (silent || dismissed())) return;
    // Zero for the override rather than a synchronous setState, which would
    // cascade a render out of the effect body.
    const t = setTimeout(() => setOpen(true), forced ? 0 : DELAY_MS);
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
          aria-label="Close — বন্ধ করুন"
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

        {/* Both languages, Bengali first.
            Not a translation stacked on a translation — each line is short
            enough that a reader skips the one they do not need without the
            card turning into a wall. Bengali leads because the money goes
            through bKash, so whoever acts on this is reading Bengali; the
            English is there because most of the site's readers are not. */}
        <p className="pr-8 text-lg leading-snug font-bold tracking-tight">
          এই সাইটটা কি আপনার কাজে লেগেছে?
        </p>
        <p className="pr-8 text-lg leading-snug font-bold tracking-tight text-muted">
          Has this been useful to you?
        </p>

        <p className="mt-3 text-sm leading-relaxed">
          সবকিছু ফ্রি, আর ফ্রিই থাকবে। কোনো বিজ্ঞাপন নেই, আপনি যা লেখেন তা
          কোথাও যায় না। উপকারে এলে ছোট একটা সদকা করতে পারেন — না দিলেও কোনো
          সমস্যা নেই।
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Free, and staying free. No adverts, and nothing you type leaves your
          browser. A small sadaqah keeps it going — and nothing at all is a
          fine answer too.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/support"
            onClick={close}
            className="press rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            সদকা করুন · Support
          </Link>
          <button
            type="button"
            onClick={close}
            className="press rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-muted transition hover:border-brand hover:text-brand"
          >
            এখন নয় · Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
