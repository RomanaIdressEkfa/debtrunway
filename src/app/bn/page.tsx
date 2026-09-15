import type { Metadata } from "next";
import Link from "next/link";
import { BandCurve, CornerMotif } from "@/components/Ornament";
import QuickNisab from "@/components/QuickNisab";
import { BN_GROUPS, BN_HOME, BN_UI, bnFor } from "@/lib/bn";
import { BN_PAGES } from "@/lib/bn-pages";
import { calculators, groups } from "@/lib/calculators";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    absolute: "ইসলামিক ক্যালকুলেটর — যাকাত ও ফারায়েজ | DebtRunway",
  },
  description:
    "বিনামূল্যে ইসলামিক ক্যালকুলেটর। কুরআনের নির্ধারিত অংশ অনুযায়ী সম্পত্তি ভাগ করুন, আর আজকের নিসাব থেকে যাকাতের হিসাব বের করুন।",
  // Both versions declared on both pages. hreflang has to be reciprocal or
  // Google ignores the pair and may treat one as duplicate content.
  alternates: alternatesFor("/", "bn"),
};

/**
 * The Bengali homepage.
 *
 * It renders the same QuickNisab as the English one rather than a Bengali
 * copy of it. That box already carries its Bengali labels, and two copies of
 * an engine is how the two versions end up disagreeing about someone's zakat
 * six months from now — the worst possible bug on a page like this.
 */
export default function Page() {
  return (
    <>
      <div className="band-emerald relative isolate overflow-hidden">
        <div className="band-grid islamic-grid" aria-hidden />
        <div className="hero-wash" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/45 sm:h-56 sm:w-56" />
        <BandCurve />
        <div className="shell px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
          <header className="animate-rise grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
            <h1 className="display text-4xl text-balance sm:text-5xl lg:text-6xl">
              {BN_HOME.titleA}{" "}
              <em className="accent-text not-italic">{BN_HOME.titleB}</em>
            </h1>
            <p className="text-base leading-relaxed text-muted sm:text-lg lg:pb-1.5">
              {BN_HOME.intro}
            </p>
          </header>
        </div>
      </div>

      <div className="shell px-4 pt-7 pb-10 sm:px-6 sm:pt-9 sm:pb-14">
        <div className="mb-12">
          <QuickNisab lang="bn" />
        </div>

        {groups.map((group) => {
          const inGroup = calculators.filter((c) => c.group === group);
          if (inGroup.length === 0) return null;
          return (
            <section key={group} className="mb-10 last:mb-0">
              <h2 className="rule-gold display text-2xl">{BN_GROUPS[group]}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {inGroup.map((c) => {
                  const bn = bnFor(c.slug);
                  return (
                    <li key={c.slug}>
                      {/* Linking to the English page for now. A link to a
                          Bengali page that does not exist yet is a 404, and a
                          card that reads in Bengali and opens in English is
                          still more use than one that opens nothing. */}
                      <Link
                        href={BN_PAGES.includes(c.slug) ? `/bn${c.slug}` : c.slug}
                        className="card-shadow block h-full rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
                      >
                        <span className="text-lg font-bold tracking-tight">
                          {bn?.nav ?? c.nav}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                          {bn?.description ?? c.description}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <section className="mt-12">
          <h2 className="rule-gold display text-2xl">
            {BN_HOME.answersHeading}
          </h2>
          <Link
            href="/answers"
            className="card-shadow mt-4 block rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
          >
            <span className="text-lg font-bold tracking-tight">
              {BN_HOME.answersTitle}
            </span>
            <span className="mt-1.5 block text-sm leading-relaxed text-muted">
              {BN_HOME.answersBody}
            </span>
          </Link>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
          <article>
            <h2 className="text-2xl font-bold tracking-tight">
              {BN_HOME.whyHeading}
            </h2>
            <p className="mt-3 leading-relaxed">{BN_HOME.whyA}</p>
            <p className="mt-3 leading-relaxed">{BN_HOME.whyB}</p>
            <Link
              href="/support"
              className="press mt-5 inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
            >
              {BN_UI.support} →
            </Link>
          </article>
        </section>
      </div>
    </>
  );
}
