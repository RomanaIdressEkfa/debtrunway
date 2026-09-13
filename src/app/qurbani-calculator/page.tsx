import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import QurbaniCalculator from "@/components/QurbaniCalculator";
import { bySlug } from "@/lib/calculators";
import { alternatesFor } from "@/lib/i18n";

const meta = bySlug("/qurbani-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: alternatesFor(meta.slug),
};

const faqs = [
  {
    q: "How many shares are there in a cow?",
    a: "Seven, and seven is a maximum rather than a target. A cow, a buffalo or a camel can be shared between up to seven people, each of whom intends their own qurbani. A sheep or a goat is one sacrifice for one person and cannot be divided at all — two people cannot share a goat, however small the household. A family of nine therefore needs either two cows, or one cow and two sheep, and not one cow with nine names on it.",
  },
  {
    q: "Is qurbani obligatory or a sunnah?",
    a: "This is the main difference between the schools. The Hanafi position makes it wajib on anyone who holds the nisab during the days of Eid — and unlike zakat there is no lunar year to wait out, so it can fall due in a year when no zakat is owed at all. The Maliki, Shafi'i and Hanbali positions treat it as sunnah mu'akkadah, a confirmed sunnah strongly urged on anyone able to afford it, whose omission is not sinful.",
  },
  {
    q: "Does every member of the family need their own qurbani?",
    a: "On the Hanafi view the obligation falls on each adult who holds the nisab in their own right, so a husband and wife who each hold it each owe one, and children are not liable. On the other views the sacrifice of the head of a household is generally taken to cover the household. Because that difference decides how many shares a family buys, it is worth settling with a local scholar rather than assuming.",
  },
  {
    q: "When exactly can the animal be slaughtered?",
    a: "From after the Eid prayer on the tenth of Dhul Hijjah until sunset on the thirteenth. Slaughtered before the prayer, it is ordinary meat and not a qurbani, and the obligation is not discharged. If you are paying a charity to perform it abroad, ask them which day it happens on — the window is short and time zones make it shorter.",
  },
  {
    q: "How should the meat be divided?",
    a: "The recommended practice is three parts: one for your household, one for relatives, neighbours and friends whether or not they are in need, and one for the poor. This is a recommendation and not a fixed obligation — giving away more is better, and keeping more is permitted. What is not permitted is selling any part of the animal, including the skin, or paying the butcher with meat from it.",
  },
  {
    q: "What makes an animal unsuitable?",
    a: "Age first: a sheep must be a year old, or a well-grown lamb of six months; a goat a full year; a cow or buffalo two years; a camel five. Then defects — an animal blind in an eye, visibly lame, plainly ill, or so thin that it has no marrow does not qualify. A missing horn or a small tear in an ear does not disqualify it. If you are buying a share, this is the seller's responsibility, but it is worth asking.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          <em className="accent-text not-italic">Qurbani</em> calculator
        </>
      }
      intro="How many animals or shares your household needs, what it comes to, and whether it is obligatory on you or a sunnah — which depends on the school you follow."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            The arithmetic is small; the mistakes are not
          </h2>
          <p className="mt-3 leading-relaxed">
            Almost every qurbani error comes from one of two places, and both
            are found out at the abattoir rather than on a form.
          </p>
          <p className="mt-3 leading-relaxed">
            The first is <strong>shares</strong>. A sheep or a goat is one
            sacrifice for one person and cannot be divided — not between a
            couple, not between a parent and child. A cow, a buffalo or a camel
            carries seven, and seven is a ceiling. A household of nine cannot
            be put into one cow, and a family that buys a cow for four has paid
            for three empty places.
          </p>
          <p className="mt-3 leading-relaxed">
            The second is <strong>who is obliged</strong>, which the schools
            answer differently and which is asked for on this page rather than
            decided.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Wajib, or a confirmed sunnah
          </h2>
          <p className="mt-3 leading-relaxed">
            On the <strong>Hanafi</strong> view qurbani is wajib on anyone
            holding the nisab during the days of Eid. That is the same
            threshold{" "}
            <Link href="/zakat-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">zakat</Link> uses — but with a crucial difference: there is no
            lunar year to wait out. Someone whose wealth crossed the line last
            month owes no zakat this year and may still owe a qurbani.
          </p>
          <p className="mt-3 leading-relaxed">
            On the <strong>Maliki, Shafi&rsquo;i and Hanbali</strong> views it
            is sunnah mu&rsquo;akkadah: a confirmed sunnah, strongly urged on
            anyone who can afford it, whose omission is not a sin. Whether
            missing it is a fault or a missed good deed therefore depends on
            which you follow, which is not a detail.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The window is short
          </h2>
          <p className="mt-3 leading-relaxed">
            The sacrifice is valid from <em>after</em> the Eid prayer on the
            tenth of Dhul Hijjah until sunset on the thirteenth. Performed
            before the prayer it is ordinary meat, and the obligation stands
            undischarged.
          </p>
          <p className="mt-3 leading-relaxed">
            This matters most for anyone paying a charity to perform it abroad.
            Ask which day they slaughter on and in which country — the window
            is a few days wide and time zones make it narrower, and a
            well-meaning transfer that arrives late buys meat rather than a
            qurbani.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The meat, and what may not be done with it
          </h2>
          <p className="mt-3 leading-relaxed">
            Three parts is the recommendation: your household, your relatives
            and neighbours whether or not they need it, and the poor. It is a
            recommendation rather than a rule — give more away and it is
            better, keep more and it is permitted, and there is no virtue in a
            family going without on Eid.
          </p>
          <p className="mt-3 leading-relaxed">
            What is not permitted is selling any part of the animal, the skin
            included, or paying the butcher out of it. The butcher is paid in
            money; the animal is given.
          </p>
        </>
      }
    >
      <QurbaniCalculator />
    </CalculatorPage>
  );
}
