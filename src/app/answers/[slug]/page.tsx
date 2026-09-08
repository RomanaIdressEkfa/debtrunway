import type { Metadata } from "next";
import Link from "next/link";
import AnswerBody from "@/components/AnswerBody";
import ContentPage from "@/components/ContentPage";
import { ANSWERS, bySlugAnswer, topicLabels } from "@/lib/answers";

export function generateStaticParams() {
  return ANSWERS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const answer = bySlugAnswer(slug);
  if (!answer) return {};
  return {
    title: answer.title,
    description: answer.summary,
    alternates: { canonical: `/answers/${answer.slug}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const answer = bySlugAnswer(slug)!;

  // Others in the same cluster, which is a more useful set to offer than the
  // whole list — someone reading about credit cards is more likely to want
  // insurance than prayer times.
  const siblings = ANSWERS.filter(
    (a) => a.topic === answer.topic && a.slug !== answer.slug,
  ).slice(0, 3);

  return (
    <ContentPage heading={answer.question} intro={answer.short}>
      {/* One question, one answer, marked up as such. The page carries a
          single QAPage rather than the FAQPage the calculators use, because
          that is what this is: one question with one accepted answer. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "QAPage",
            mainEntity: {
              "@type": "Question",
              name: answer.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: [
                  answer.short,
                  ...answer.body.map((b) =>
                    b.kind === "ul" ? (b.items ?? []).join(" ") : (b.text ?? ""),
                  ),
                ].join(" "),
              },
            },
          }),
        }}
      />

      <AnswerBody blocks={answer.body} />

      {answer.related && answer.related.length > 0 && (
        <div className="mt-12 rounded-2xl border border-line bg-surface p-5">
          <h2 className="rule-gold display text-xl">Work it out</h2>
          <ul className="mt-4 space-y-2.5">
            {answer.related.map((r) => (
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
          <strong>This is not a fatwa.</strong> It sets out the positions
          scholars hold and where they part, so that you know what you are
          asking about. Your own case turns on facts a page cannot see — put it
          to someone qualified.
        </p>
      </div>

      {siblings.length > 0 && (
        <div className="mt-12 border-t border-line pt-8">
          <h2 className="rule-gold display text-xl">
            More on {topicLabels[answer.topic].toLowerCase()}
          </h2>
          <ul className="mt-4 space-y-3">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/answers/${s.slug}`} className="group block">
                  <span className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition group-hover:decoration-brand">
                    {s.question}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {s.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/answers"
            className="press mt-6 inline-block rounded-xl border border-line px-4 py-2.5 text-base font-medium transition hover:border-brand hover:text-brand"
          >
            All answers
          </Link>
        </div>
      )}
    </ContentPage>
  );
}
