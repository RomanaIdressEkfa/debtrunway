"use client";

import { useEffect, useState } from "react";

interface Props {
  /** Query string describing the current inputs, from shareState. */
  query: string;
  /** What the recipient will see, used as the share sheet title. */
  headline: string;
}

/**
 * Copies a link that reopens the calculator with these exact numbers.
 *
 * This is the share loop: the person who worked out their debt-free date has a
 * reason to send it to someone — a partner, a friend in the same position —
 * and that person lands on a filled-in calculator, not an empty form.
 */
export default function ShareButton({ query, headline }: Props) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2200);
    return () => clearTimeout(timer);
  }, [copied]);

  const buildUrl = () => {
    const { origin, pathname } = window.location;
    return query ? `${origin}${pathname}?${query}` : `${origin}${pathname}`;
  };

  const handleClick = async () => {
    const url = buildUrl();

    // Phones get the native share sheet; everything else copies the link.
    if (canShare) {
      try {
        await navigator.share({ title: "DebtRunway", text: headline, url });
        return;
      } catch {
        // Dismissed, or the browser refused — fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context, or permissions): show the URL so
      // the link is still recoverable by hand.
      window.prompt("Copy your link:", url);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="no-print inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path
              d="M3 8.5 6.5 12 13 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Link copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path
              d="M6.5 9.5a2.5 2.5 0 0 0 3.6.1l2.4-2.4a2.5 2.5 0 0 0-3.5-3.5l-.9.9M9.5 6.5a2.5 2.5 0 0 0-3.6-.1L3.5 8.8a2.5 2.5 0 0 0 3.5 3.5l.9-.9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {canShare ? "Share my plan" : "Copy my plan link"}
        </>
      )}
    </button>
  );
}
