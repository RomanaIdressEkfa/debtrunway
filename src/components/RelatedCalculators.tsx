import Link from "next/link";
import { others } from "@/lib/calculators";
import { BN_UI, bnFor } from "@/lib/bn";
import { BN_PAGES } from "@/lib/bn-pages";

/**
 * The other calculators, in the language of the page offering them.
 *
 * It took the page slug and passed it straight to others(), which meant a
 * Bengali page sent "/bn/zakat-calculator" into a registry that only knows
 * "/zakat-calculator" — so nothing was excluded, the page listed itself, and
 * every card was English text linking to an English page. Stripping the
 * prefix fixes the exclusion; the locale it reveals fixes the rest.
 */
export default function RelatedCalculators({ slug }: { slug: string }) {
  const bn = slug.startsWith("/bn/") || slug === "/bn";
  const english = bn ? slug.slice(3) || "/" : slug;
  const links = others(english, 100).filter((c) => c.slug !== "/");

  return (
    <section className="no-print mt-12">
      <h2 className="text-xl font-bold tracking-tight">
        {bn ? BN_UI.otherCalculators : "Other calculators"}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((c) => (
          <li key={c.slug}>
            <Link
              href={bn && BN_PAGES.includes(c.slug) ? `/bn${c.slug}` : c.slug}
              className="block h-full rounded-lg border border-line bg-surface p-4 transition hover:border-brand"
            >
              <span className="font-semibold">
                {bn ? (bnFor(c.slug)?.nav ?? c.nav) : c.nav}
              </span>
              <span className="mt-1 block text-sm text-muted">
                {bn ? (bnFor(c.slug)?.description ?? c.description) : c.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
