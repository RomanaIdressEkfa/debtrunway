import type { ReactNode } from "react";
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

      <div className="mx-auto max-w-5xl px-3 py-10 sm:px-4 sm:py-16">
        <header className="animate-rise mb-9 max-w-3xl sm:mb-12">
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
            {heading}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">
            {intro}
          </p>
        </header>

        {children}

        {/* Prose keeps a reading measure of roughly 80 characters — a line the
            full width of the page is genuinely harder to read, which is why
            newspapers set text in columns. The cards below run the full width
            so the section still lines up with the tool and the footer. */}
        <article className="mt-20 max-w-3xl">{content}</article>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Common questions
          </h2>
          <dl className="mt-5 grid items-start gap-4 lg:grid-cols-2">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-xl border border-line bg-surface p-4 sm:p-5"
              >
                <dt className="font-semibold">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <RelatedCalculators slug={slug} />
      </div>
    </>
  );
}
