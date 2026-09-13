"use client";

import Link from "next/link";
import { BandCurve, CornerMotif } from "./Ornament";
import { calculators } from "@/lib/calculators";
import Logo from "./Logo";
import { BN_UI_MAP, bnFor } from "@/lib/bn";
import { BN_PAGES } from "@/lib/bn-pages";
import { localeOf } from "@/lib/i18n";
import { usePathname } from "next/navigation";

const siteLinks = [
  { href: "/answers", label: "Answers" },
  { href: "/support", label: "Support" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms & disclaimer" },
];

/**
 * A footer with actual hierarchy.
 *
 * The previous one set eleven links and two paragraphs in the same muted grey,
 * so nothing led the eye and the whole block read as filler. Here the column
 * headings carry weight, the links sit at full text colour, and the two
 * standing promises — nothing leaves your browser, this is not advice — are
 * given a row of their own instead of being buried in small print.
 *
 * It sits flush against the content above it, the way the hero band sits flush
 * under the nav. A top margin here would show as a bare stripe of page
 * background between the last card and the band — which is what a fixed 96px
 * one did, at every width, on phones worst of all. The border and the band's
 * own padding are what separate it; that is the whole job of a band.
 */
export default function SiteFooter() {
  const bn = localeOf(usePathname() ?? "/") === "bn";
  const label = (s: string) => (bn ? (BN_UI_MAP[s] ?? s) : s);
  return (
    <footer className="band-emerald no-print relative isolate overflow-hidden">
      <div className="band-grid footer-grid islamic-grid" aria-hidden />
      <div className="footer-wash" aria-hidden />
      <CornerMotif className="top-0 left-0 h-40 w-40 -scale-x-100 text-white/35 sm:h-52 sm:w-52" />
      <BandCurve flip />
      <div className="shell px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          {/* Identity */}
          <div>
            <Logo size={28} />
            <p className="mt-4 max-w-xs leading-relaxed text-muted">
              Free calculators for the parts of Islamic finance that have a
              fixed, checkable answer — each with the ruling behind it.
            </p>
          </div>

          {/* One heading, not six.
              Grouping the calculators here mirrored the nav, and every group
              added since — worship, finance, every day — added a column, until
              six of them wrapped onto a second row and the footer was taller
              than most of the pages above it. A footer is a place to find a
              link, not to re-teach the taxonomy: the reader has already met
              the groups on the homepage and in the nav.

              So the calculators flow through CSS columns under a single
              heading. The count can double again without the footer growing a
              row, which is the property that was missing. */}
          <nav
            aria-label="Footer"
            className="grid gap-8 sm:grid-cols-[2fr_1fr]"
          >
            <div>
              <h2 className="text-base font-bold text-[var(--gold)]">
                Calculators
              </h2>
              <ul className="mt-3 gap-x-8 text-base sm:columns-2 lg:columns-3">
                {calculators.map((c) => (
                  <li key={c.slug} className="mb-2.5 break-inside-avoid">
                    <Link
                      href={bn && BN_PAGES.includes(c.slug) ? `/bn${c.slug}` : c.slug}
                      className="text-muted transition-colors hover:text-brand"
                    >
                      {bn ? (bnFor(c.slug)?.nav ?? c.nav) : c.nav}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-[var(--gold)]">Site</h2>
              <ul className="mt-3 space-y-2.5 text-base">
                {siteLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted transition-colors hover:text-brand"
                    >
                      {label(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* The two things a visitor should leave knowing. */}
        {/* Surah al-Baqarah 2:201. It closes the page rather than opening it:
            a reader who came for a number gets the number first, and this is
            here when they are done. lang and dir are set so a screen reader
            switches voice and the shaping runs the right way. */}
        <div className="mt-12 border-t border-line pt-10 text-center">
          <p lang="ar" dir="rtl" className="arabic text-[var(--gold)]">
            رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
          </p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">
            &ldquo;Our Lord, grant us good in this world and good in the
            Hereafter, and protect us from the punishment of the Fire.&rdquo;
          </p>
          <p className="mt-2 text-sm text-white/80">
            Surah al-Baqarah 2:201
          </p>
        </div>

        <div className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-foreground">
              Nothing you type leaves your browser.
            </strong>{" "}
            Every figure is worked out on your own device, and your plan is
            saved there so it is waiting for you next month.
          </p>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-foreground">
              These results are estimates, not financial advice.
            </strong>{" "}
            Your lender&rsquo;s exact interest calculation may differ — see the{" "}
            <Link href="/terms" className="underline hover:text-brand">
              terms and disclaimer
            </Link>
            .
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6 text-sm text-muted">
          <p>
            &copy; {new Date().getFullYear()} DebtRunway · Built by{" "}
            <Link href="/about" className="font-medium hover:text-brand">
              Romana Idress Ekfa
            </Link>
          </p>
          <a
            href="mailto:hello@debtrunway.com"
            className="font-medium transition-colors hover:text-brand"
          >
            hello@debtrunway.com
          </a>
        </div>
      </div>
    </footer>
  );
}
