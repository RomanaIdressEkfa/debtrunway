import type { ReactNode } from "react";
import { CornerMotif } from "./Ornament";
import RelatedCalculators from "./RelatedCalculators";

export interface Faq {
  q: string;
  a: string;
}

interface Props {
  slug: string;
  /** ReactNode so a page can put <em class="accent-text"> around a phrase. */
  heading: ReactNode;
  intro: string;
  /** The calculator itself, rendered directly under the heading. */
  children: ReactNode;
  /** Explanatory prose below the tool — this is what search engines read. */
  content: ReactNode;
  faqs: Faq[];
}

/**
 * Shared shell for every calculator page: tool first, words second.
 * A visitor who only wants the number never has to scroll past an essay,
 * and the page still carries enough text to rank.
 *
 * The header is deliberately bare — a title and one sentence. Badges, feature
 * ticks and a patterned backdrop were all borrowed from SaaS landing pages,
 * and none of them earned their space above a tool someone opened to get a
 * number out of.
 */
export default function CalculatorPage({
  slug,
  heading,
  intro,
  children,
  content,
  faqs,
}: Props) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* A hero band with its own ground. The title carries the left, the
          explanation the right, so neither has to run the full width and the
          two are read as one line of thought rather than a stacked block. */}
      <div className="band-emerald relative isolate overflow-hidden">
        <div className="band-grid islamic-grid" aria-hidden />
        <div className="hero-wash" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/45 sm:h-56 sm:w-56" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <header className="animate-rise grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
            <h1 className="display text-4xl text-balance sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            <p className="text-base leading-relaxed text-muted sm:text-lg lg:pb-1.5">
              {intro}
            </p>
          </header>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-7 pb-10 sm:px-6 sm:pt-9 sm:pb-14">
        {children}

        {/* Prose and questions side by side, the way a magazine sets a column
            against a sidebar. Text stays at a readable measure without leaving
            an empty gutter beside it, and the questions are seen rather than
            buried below the fold. They stack on narrow screens. */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
          <article>{content}</article>

          <aside>
            <h2 className="rule-gold display text-2xl">Common questions</h2>
            <dl className="mt-4 space-y-3">
              {faqs.map((f) => (
                <div
                  key={f.q}
                  className="rounded-xl border border-line bg-surface p-4"
                >
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <RelatedCalculators slug={slug} />
      </div>
    </>
  );
}
