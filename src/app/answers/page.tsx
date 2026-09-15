import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";
import { ANSWERS, topicLabels } from "@/lib/answers";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Answers — Islamic Money, Family and Worship",
  description:
    "Long answers to the questions Muslims actually search — bank interest, credit cards, insurance, halal shares, inheritance shares and missed prayers.",
  alternates: alternatesFor("/answers"),
};

const topics = ["money", "worship", "family"] as const;

export default function Page() {
  return (
    <ContentPage
      heading="Answers"
      intro="The questions people put into a search box rather than into a calculator. Each one sets out the positions, says where scholars part, and points at the tool if there is one."
      wide
    >
      {/* Counted from the data rather than written out, because the sentence
          said six for as long as there were six and would have gone on saying
          it. */}
      <p className="max-w-3xl leading-relaxed">
        There are {ANSWERS.length} of these and they are long. That is
        deliberate: a page that gestures at an answer wastes the
        reader&rsquo;s time and, on a site full of them, buries the pages that
        do not. More are added when there is something worth saying at this
        length.
      </p>

      {topics.map((topic) => {
        const inTopic = ANSWERS.filter((a) => a.topic === topic);
        if (inTopic.length === 0) return null;
        return (
          <section key={topic} className="mt-10">
            <h2 className="rule-gold display text-2xl">
              {topicLabels[topic]}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {inTopic.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/answers/${a.slug}`}
                    className="card-shadow group block rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
                  >
                    <span className="block text-lg font-bold tracking-tight">
                      {a.question}
                    </span>
                    <span className="mt-1.5 block leading-relaxed text-muted">
                      {a.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <div className="mt-12 rounded-2xl border border-danger/25 bg-danger/5 p-5">
        <p className="leading-relaxed">
          <strong>None of these is a fatwa.</strong> They set out what scholars
          hold and where they differ, so that the question you put to one is a
          specific question. Your own case turns on facts a page cannot see.
        </p>
      </div>
    </ContentPage>
  );
}
