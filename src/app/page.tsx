import Link from "next/link";
import { BandCurve, CornerMotif } from "@/components/Ornament";
import QuickNisab from "@/components/QuickNisab";
import { calculators, groupLabels, groups } from "@/lib/calculators";

/**
 * The hub, not a tool.
 *
 * Every calculator here answers a question someone arrives with already
 * formed — how does this estate divide, what do I owe this year — so the
 * homepage's job is to route, not to sell. It carries the ground the tools
 * stand on instead: what the site is for, and what it refuses to do.
 */
export default function Home() {
  return (
    <>
      <div className="band-emerald relative isolate overflow-hidden">
        <div className="band-grid islamic-grid" aria-hidden />
        <div className="hero-wash" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/45 sm:h-56 sm:w-56" />
        <BandCurve />
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
          <header className="animate-rise grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
            <h1 className="display text-4xl text-balance sm:text-5xl lg:text-6xl">
              Money questions with{" "}
              <em className="accent-text not-italic">settled answers</em>
            </h1>
            <p className="slab-prose text-base leading-relaxed text-muted sm:text-lg lg:pb-1.5">
              Free calculators for the parts of Islamic finance that have a
              fixed, checkable answer — how an estate divides, what zakat is
              due. Every figure comes with the rule behind it.
            </p>
          </header>
        </div>
      </div>

      <div className="slab-prose mx-auto max-w-6xl px-4 pt-7 pb-10 sm:px-6 sm:pt-9 sm:pb-14">
        <div className="mb-12">
          <QuickNisab />
        </div>

        {groups.map((group) => {
          const inGroup = calculators.filter((c) => c.group === group);
          if (inGroup.length === 0) return null;
          return (
            <section key={group} className="mb-10 last:mb-0">
              <h2 className="rule-gold display text-2xl">{groupLabels[group]}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {inGroup.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={c.slug}
                      className="card-shadow block h-full rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
                    >
                      <span className="text-lg font-bold tracking-tight">
                        {c.nav}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                        {c.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        {/* The answers are content rather than tools, so they sit after the
            calculators and before the prose that explains the site. */}
        <section className="mt-12">
          <h2 className="rule-gold display text-2xl">Answers</h2>
          <Link
            href="/answers"
            className="card-shadow mt-4 block rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
          >
            <span className="text-lg font-bold tracking-tight">
              The questions people actually search
            </span>
            <span className="mt-1.5 block text-sm leading-relaxed text-muted">
              Bank interest, credit cards, insurance, share screening, working
              for a bank, mortgages, why a daughter inherits half, whether an
              adopted child inherits at all, and years of missed prayers — set
              out at length, with where the scholars part.
            </span>
          </Link>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
          <article>
            <h2 className="text-2xl font-bold tracking-tight">
              Why these calculators exist
            </h2>
            <p className="mt-3 leading-relaxed">
              Most Islamic finance questions need a scholar. A few need
              arithmetic — and those few are done badly almost everywhere.
              Inheritance shares get rounded until they no longer add to one.
              Zakat calculators hardcode a nisab that was accurate the month
              they were written. Neither shows you the rule it applied, so
              neither can be checked.
            </p>
            <p className="mt-3 leading-relaxed">
              These pages take the opposite approach. Shares are kept as exact
              fractions, so two thirds plus a sixth plus a sixth is one and not
              0.9999. The nisab is derived from a price you supply today. Every
              result names the rule it came from, every excluded heir names the
              relative who excluded them, and the working is on the page rather
              than hidden behind it.
            </p>

            <h2 className="mt-10 text-2xl font-bold tracking-tight">
              What these calculators will not do
            </h2>
            <p className="mt-3 leading-relaxed">
              They will not give you a ruling. A calculator applies rules to the
              facts you type; it cannot see a disputed heir, an unborn child, a
              pension you cannot yet draw, or the question your own school
              answers differently. Every result here says so plainly rather than
              in small print, because an inheritance divided wrongly is not a
              mistake you get to take back.
            </p>
            <p className="mt-3 leading-relaxed">
              They also will not take your data. Everything runs in your
              browser. Nothing you enter is sent anywhere, stored on a server,
              or logged — and the inheritance calculator does not even keep your
              entries in the browser, because who has died in a family is not a
              thing to leave sitting on a shared computer.
            </p>
          </article>

          <aside>
            <h2 className="rule-gold display text-2xl">In short</h2>
            <dl className="mt-4 space-y-3">
              {[
                [
                  "Free, and no account",
                  "Nothing to sign up for, nothing to unsubscribe from.",
                ],
                [
                  "Nothing leaves your browser",
                  "Every calculation runs on your own device.",
                ],
                [
                  "The rule, not just the number",
                  "Each figure names the ruling it comes from, so you can check it.",
                ],
                [
                  "Any currency",
                  "Shares are fractions and nisab is a weight, so both work in taka, rupees, pounds or riyals.",
                ],
                [
                  "Not a fatwa",
                  "Take any result that matters to someone qualified before acting on it.",
                ],
              ].map(([term, def]) => (
                <div
                  key={term}
                  className="rounded-xl border border-line bg-surface p-4"
                >
                  <dt className="font-semibold">{term}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>
      </div>
    </>
  );
}
