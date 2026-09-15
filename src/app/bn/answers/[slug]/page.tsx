import type { Metadata } from "next";
import Link from "next/link";
import AnswerBody from "@/components/AnswerBody";
import ContentPage from "@/components/ContentPage";
import { ANSWERS, bySlugAnswer } from "@/lib/answers";
import { BN_ANSWER_UI, BN_TOPIC_LABELS, bnAnswer } from "@/lib/bn-answers";
import { alternatesFor } from "@/lib/i18n";

const SITE = "https://debtrunway.com";

/** Named once, used on both the Question and the Answer. */
const AUTHOR = {
  "@type": "Person",
  name: "Romana Idress Ekfa",
  url: `${SITE}/about`,
} as const;

export function generateStaticParams() {
  // Only the answers that have Bengali text. A page that renders English
  // under a Bengali URL would be worse than no page: Google would index it as
  // Bengali, and a reader would arrive at an article they cannot read.
  return ANSWERS.filter((a) => bnAnswer(a.slug)).map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bn = bnAnswer(slug);
  if (!bn) return {};
  return {
    title: { absolute: `${bn.title} | DebtRunway` },
    description: bn.summary,
    alternates: alternatesFor(`/answers/${slug}`, "bn"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const answer = bySlugAnswer(slug)!;
  const bn = bnAnswer(slug)!;

  const siblings = ANSWERS.filter(
    (a) => a.topic === answer.topic && a.slug !== slug && bnAnswer(a.slug),
  ).slice(0, 3);

  return (
    <ContentPage heading={bn.question} intro={bn.short}>
      {/* The same QAPage the English version carries, with the Bengali text
          and the Bengali URL. inLanguage is set explicitly: without it Google
          has only the page's lang attribute to go on, and a structured-data
          block quoting Bengali under an unmarked locale is exactly the kind
          of mismatch that costs the enhancement rather than the listing.

          published is read from the English answer, because it is a fact
          about when the answer was written and does not change with the
          language it is read in. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "QAPage",
            inLanguage: "bn",
            mainEntity: {
              "@type": "Question",
              name: bn.question,
              text: bn.question,
              answerCount: 1,
              dateCreated: answer.published,
              author: AUTHOR,
              acceptedAnswer: {
                "@type": "Answer",
                url: `${SITE}/bn/answers/${slug}/`,
                dateCreated: answer.published,
                author: AUTHOR,
                text: [
                  bn.short,
                  ...bn.body.map((b) =>
                    b.kind === "ul" ? (b.items ?? []).join(" ") : (b.text ?? ""),
                  ),
                ].join(" "),
              },
            },
          }),
        }}
      />

      <AnswerBody blocks={bn.body} />

      {bn.related && bn.related.length > 0 && (
        <div className="mt-12 rounded-2xl border border-line bg-surface p-5">
          <h2 className="rule-gold display text-xl">
            {BN_ANSWER_UI.workItOut}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {bn.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
                >
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-danger/25 bg-danger/5 p-5">
        <p className="leading-relaxed">
          <strong>{BN_ANSWER_UI.notFatwaLead}</strong>
          {BN_ANSWER_UI.notFatwaBody}
        </p>
      </div>

      {siblings.length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <h2 className="rule-gold display text-xl">
            {BN_ANSWER_UI.moreOn(BN_TOPIC_LABELS[answer.topic])}
          </h2>
          <ul className="mt-4 space-y-3">
            {siblings.map((s) => {
              const sb = bnAnswer(s.slug)!;
              return (
                <li key={s.slug}>
                  <Link href={`/bn/answers/${s.slug}`} className="group block">
                    <span className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition group-hover:decoration-brand">
                      {sb.question}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">
                      {sb.summary}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/bn/answers"
            className="press mt-6 inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
          >
            {BN_ANSWER_UI.allAnswers}
          </Link>
        </div>
      )}
    </ContentPage>
  );
}
