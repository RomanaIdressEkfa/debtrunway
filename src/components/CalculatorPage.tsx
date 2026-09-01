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

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Centred, and narrower than the tool below it. A headline set across
            a wide container loses the reader between lines; centred and held
            to a measure, it reads as a statement. Spacing stays tight — the
            tool is what the visitor came for, and it should be in view. */}
        <header className="animate-rise mx-auto mb-8 max-w-3xl text-center sm:mb-10">
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          <p className="mx-auto mt-3.5 max-w-xl text-base leading-relaxed text-balance text-muted sm:text-lg">
            {intro}
          </p>
        </header>

        {children}

        {/* Prose keeps a reading measure of roughly 80 characters — a line the
            full width of the page is genuinely harder to read, which is why
            newspapers set text in columns. The cards below run the full width
            so the section still lines up with the tool and the footer. */}
        <article className="mx-auto mt-16 max-w-3xl">{content}</article>

        <section className="mt-12">
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
