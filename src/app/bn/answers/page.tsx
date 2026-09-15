import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";
import { ANSWERS } from "@/lib/answers";
import { BN_ANSWER_UI, BN_TOPIC_LABELS, bnAnswer } from "@/lib/bn-answers";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    absolute: "প্রশ্নোত্তর — ইসলামে টাকা, পরিবার ও ইবাদত | DebtRunway",
  },
  description:
    "মুসলিমরা যেসব প্রশ্ন সত্যিই খোঁজেন তার বিস্তারিত উত্তর — ব্যাংকের সুদ, ক্রেডিট কার্ড, বীমা, হালাল শেয়ার, উত্তরাধিকারের ভাগ আর কাজা নামাজ।",
  alternates: alternatesFor("/answers", "bn"),
};

const topics = ["money", "worship", "family"] as const;

/**
 * The Bengali answers index.
 *
 * It reads the topic and slug from ANSWERS rather than keeping a second list,
 * so an answer added in English appears here the day it is written — in
 * English until someone translates it, which is visible and fixable, rather
 * than missing entirely, which is not.
 */
export default function Page() {
  return (
    <ContentPage
      heading={BN_ANSWER_UI.indexHeading}
      intro={BN_ANSWER_UI.indexIntro}
      wide
    >
      <p className="max-w-3xl leading-relaxed">
        {BN_ANSWER_UI.indexLede(ANSWERS.length)}
      </p>

      {topics.map((topic) => {
        const inTopic = ANSWERS.filter((a) => a.topic === topic);
        if (inTopic.length === 0) return null;
        return (
          <section key={topic} className="mt-10">
            <h2 className="rule-gold display text-2xl">
              {BN_TOPIC_LABELS[topic]}
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {inTopic.map((a) => {
                const bn = bnAnswer(a.slug);
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/bn/answers/${a.slug}`}
                      className="card-shadow group block rounded-2xl border border-line bg-surface p-5 transition hover:border-brand"
                    >
                      <span className="block text-lg font-bold tracking-tight">
                        {bn?.question ?? a.question}
                      </span>
                      <span className="mt-1.5 block leading-relaxed text-muted">
                        {bn?.summary ?? a.summary}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <div className="mt-12 rounded-2xl border border-danger/25 bg-danger/5 p-5">
        <p className="leading-relaxed">
          <strong>{BN_ANSWER_UI.noneFatwaLead}</strong>
          {BN_ANSWER_UI.noneFatwaBody}
        </p>
      </div>
    </ContentPage>
  );
}
