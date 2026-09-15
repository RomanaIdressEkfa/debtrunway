"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BN_UI, bnFor } from "@/lib/bn";
import { BN_PAGES } from "@/lib/bn-pages";
import { calculators } from "@/lib/calculators";
import { localeOf } from "@/lib/i18n";

/**
 * The dead end, in the language the reader was already in.
 *
 * A 404 is the one page that cannot know its own language at build time: a
 * static export renders it once and the host serves that same file for every
 * address that does not exist, /bn included. So this reads the path in the
 * browser instead — the only place the information exists.
 *
 * Which means the shipped HTML of 404.html is the English one, and that is
 * the right default: it is what a crawler sees, the page carries noindex, and
 * a crawler is not the reader this is for.
 */
export const NOT_FOUND_COPY = {
  en: {
    heading: "That page is not here",
    intro:
      "The address may have changed, or the link that brought you here may have been wrong. Nothing is lost — everything on the site is listed below.",
    reportA: "If you followed a link from somewhere else and expected a page,",
    reportLink: "tell us where it was",
    reportB:
      "and it will be looked at. A broken link on this site is a defect like any other.",
    everyCalculator: "Every calculator",
    answersA:
      "The written answers — bank interest, credit cards, insurance, halal shares, inheritance shares, missed prayers — are all listed on the",
    answersLink: "answers page",
  },
  bn: {
    heading: "এই পাতাটা এখানে নেই",
    intro:
      "ঠিকানাটা বদলে গিয়ে থাকতে পারে, নয়তো যে লিংক আপনাকে এখানে এনেছে সেটাই ভুল ছিল। কিছুই হারায়নি — সাইটের সবকিছু নিচে দেওয়া আছে।",
    reportA: "অন্য কোথাও থেকে লিংকে এসে যদি কোনো পাতা আশা করে থাকেন,",
    reportLink: "কোথায় ছিল জানান",
    reportB:
      "— দেখা হবে। এই সাইটে একটা ভাঙা লিংক আর দশটা ত্রুটির মতোই একটা ত্রুটি।",
    everyCalculator: "সবগুলো ক্যালকুলেটর",
    answersA:
      "লেখা উত্তরগুলো — ব্যাংকের সুদ, ক্রেডিট কার্ড, বীমা, হালাল শেয়ার, উত্তরাধিকারের ভাগ, কাজা নামাজ — সবই আছে",
    answersLink: "প্রশ্নোত্তর পাতায়",
  },
} as const;

/** The headline, which has to move with the body or the page is half English. */
export function NotFoundHeading() {
  const bn = localeOf(usePathname() ?? "/") === "bn";
  return <>{NOT_FOUND_COPY[bn ? "bn" : "en"].heading}</>;
}

export function NotFoundIntro() {
  const bn = localeOf(usePathname() ?? "/") === "bn";
  return <>{NOT_FOUND_COPY[bn ? "bn" : "en"].intro}</>;
}

export default function NotFoundBody() {
  const bn = localeOf(usePathname() ?? "/") === "bn";
  const c = NOT_FOUND_COPY[bn ? "bn" : "en"];
  const to = (href: string) =>
    bn && BN_PAGES.includes(href) ? `/bn${href}` : href;

  return (
    <>
      <p className="leading-relaxed">
        {c.reportA}{" "}
        <Link
          href={to("/contact")}
          className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
        >
          {c.reportLink}
        </Link>{" "}
        {c.reportB}
      </p>

      <h2 className="rule-gold display mt-10 text-2xl">{c.everyCalculator}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {calculators.map((calc) => (
          <li key={calc.slug}>
            <Link
              href={to(calc.slug)}
              className="card-shadow block rounded-xl border border-line bg-surface p-4 transition hover:border-brand"
            >
              <span className="block font-semibold tracking-tight">
                {bn ? (bnFor(calc.slug)?.nav ?? calc.nav) : calc.nav}
              </span>
              <span className="mt-1 block text-sm leading-snug text-muted">
                {bn
                  ? (bnFor(calc.slug)?.description ?? calc.description)
                  : calc.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 leading-relaxed">
        {c.answersA}{" "}
        <Link
          href={to("/answers")}
          className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
        >
          {c.answersLink}
        </Link>
        {bn ? "।" : "."}
      </p>

      <p className="mt-8">
        <Link
          href={bn ? "/bn" : "/"}
          className="press inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
        >
          {bn ? BN_UI.home : "Home"} →
        </Link>
      </p>
    </>
  );
}
