"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_NAMES, localeOf, toLocale } from "@/lib/i18n";

/**
 * Two links, not a button.
 *
 * The other version of a page is a different address, so the control that
 * reaches it should be an anchor: it can be opened in a new tab, it can be
 * copied, a crawler can follow it, and it works with JavaScript switched off.
 * A button calling router.push would look identical and do none of that.
 *
 * It shows the page you are *not* on as a link and the current one as plain
 * text, rather than highlighting a "selected" state on two live controls —
 * one of the two is not somewhere you can go, and making it look clickable is
 * the fastest way to make a reader think the toggle is broken.
 */
export default function LanguageToggle() {
  const pathname = usePathname() ?? "/";
  const current = localeOf(pathname);
  const other = current === "en" ? "bn" : "en";

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-line p-0.5 text-sm"
      role="group"
      aria-label="Language / ভাষা"
    >
      <span
        aria-current="true"
        className="rounded-md bg-brand-soft px-2.5 py-1 font-semibold text-brand"
      >
        {LOCALE_NAMES[current]}
      </span>
      <Link
        href={toLocale(pathname, other)}
        hrefLang={other}
        className="rounded-md px-2.5 py-1 font-medium text-muted transition hover:text-brand"
      >
        {LOCALE_NAMES[other]}
      </Link>
    </div>
  );
}
