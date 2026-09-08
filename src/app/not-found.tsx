import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";
import { calculators } from "@/lib/calculators";

/**
 * There was no not-found page, so Next served its default — which inherited
 * the layout's metadata and shipped the homepage's title and description on a
 * URL that says nothing was found. Two problems came out of that.
 *
 * The first is that /_not-found/ is a real, crawlable, 200-status URL in a
 * static export. It was a second copy of the homepage's metadata sitting at
 * an address nobody would want indexed, so it carries noindex now.
 *
 * The second is that a person who lands here from a stale link was being
 * shown nothing useful. A dead end on a site of fourteen tools should offer
 * the tools.
 */
export const metadata: Metadata = {
  title: { absolute: "Page not found | DebtRunway" },
  description:
    "That page does not exist. Every calculator and answer on DebtRunway is listed here.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ContentPage
      heading="That page is not here"
      intro="The address may have changed, or the link that brought you here may have been wrong. Nothing is lost — everything on the site is listed below."
    >
      <p className="leading-relaxed">
        If you followed a link from somewhere else and expected a page,{" "}
        <Link
          href="/contact"
          className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
        >
          tell us where it was
        </Link>{" "}
        and it will be looked at. A broken link on this site is a defect like
        any other.
      </p>

      <h2 className="rule-gold display mt-10 text-2xl">Every calculator</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.slug}
              className="card-shadow block rounded-xl border border-line bg-surface p-4 transition hover:border-brand"
            >
              <span className="block font-semibold tracking-tight">
                {c.nav}
              </span>
              <span className="mt-1 block text-sm leading-snug text-muted">
                {c.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 leading-relaxed">
        The written answers — bank interest, credit cards, insurance, halal
        shares, inheritance shares, missed prayers — are all listed on the{" "}
        <Link
          href="/answers"
          className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
        >
          answers page
        </Link>
        .
      </p>
    </ContentPage>
  );
}
