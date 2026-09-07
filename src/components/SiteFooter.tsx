import Link from "next/link";
import { calculators, groupLabels } from "@/lib/calculators";
import Logo from "./Logo";

const groups = ["plan", "cards", "loans", "islamic"] as const;

const siteLinks = [
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
  return (
    <footer className="no-print relative isolate overflow-hidden border-t border-line bg-surface">
      <div className="band-grid footer-grid islamic-grid" aria-hidden />
      <div className="footer-wash" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          {/* Identity */}
          <div>
            <Logo size={28} />
            <p className="mt-4 max-w-xs leading-relaxed text-muted">
              Free calculators that show you the real cost of debt — and the
              exact month it ends.
            </p>
          </div>

          {/* Everything on the site, grouped the way the nav groups it. */}
          <nav
            aria-label="Footer"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {groups.map((group) => (
              <div key={group}>
                <h2 className="text-sm font-bold">{groupLabels[group]}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {calculators
                    .filter((c) => c.group === group)
                    .map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={c.slug}
                          className="text-muted transition-colors hover:text-brand"
                        >
                          {c.nav}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className="text-sm font-bold">Site</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {siteLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-muted transition-colors hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        {/* The two things a visitor should leave knowing. */}
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
