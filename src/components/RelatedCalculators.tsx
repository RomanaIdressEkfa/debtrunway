import Link from "next/link";
import { others } from "@/lib/calculators";

export default function RelatedCalculators({ slug }: { slug: string }) {
  const links = others(slug, 100).filter((c) => c.slug !== "/");

  return (
    <section className="no-print mt-16">
      <h2 className="text-xl font-bold tracking-tight">Other calculators</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.slug}
              className="block h-full rounded-lg border border-line bg-surface p-4 transition hover:border-brand"
            >
              <span className="font-semibold">{c.nav}</span>
              <span className="mt-1 block text-sm text-muted">
                {c.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
