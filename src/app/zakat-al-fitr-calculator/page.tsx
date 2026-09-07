import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import FitrCalculator from "@/components/FitrCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/zakat-al-fitr-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How is zakat al-Fitr different from zakat on wealth?",
    a: "They share a name and almost nothing else. Zakat on wealth is 2.5% of what you hold, owed only if you are above the nisab and have been for a lunar year. Zakat al-Fitr is a fixed measure of food, one sa' per person, owed by nearly every Muslim regardless of how much they own, and payable in the few days at the end of Ramadan. A person who owes no zakat on wealth still owes zakat al-Fitr.",
  },
  {
    q: "Who do I pay for?",
    a: "The head of a household pays for everyone in it and in their care: themselves, their spouse, their children, and any dependent relative living with them. A child born before the Eid prayer is included. A person who has enough food for themselves and their family for the day of Eid, with something to spare, is liable.",
  },
  {
    q: "How much is a sa'?",
    a: "A sa' is four mudd, a volume measure rather than a weight, which is why the kilogram figure depends on the food. Rice comes to roughly 2.4 kg, wheat and barley to about 2.2 kg, dates and raisins to about 2 kg. Councils and mosques publish slightly different conversions for the same staple, so a local announcement is worth more than a general figure.",
  },
  {
    q: "Can I give money instead of food?",
    a: "The Hanafi school permits it and treats the money as standing in for the food. The Maliki, Shafi'i and Hanbali positions hold that the food itself should be given, on the basis that the text names food. In practice most mosques and charities in the West collect money and buy the staple, which satisfies both views. Ask locally rather than assuming.",
  },
  {
    q: "When exactly is it due?",
    a: "It must reach the recipient before the Eid prayer. Given after that prayer it becomes ordinary sadaqah and the obligation is not discharged. Paying two or three days early is common and sensible, since the purpose is that a poor family has what it needs on the day of Eid rather than after it.",
  },
  {
    q: "Why does the Hanafi school allow half a sa' of wheat?",
    a: "Because wheat was the more valuable of the staples named, so half of it was held to be equivalent in worth to a full sa' of barley or dates. The concession is specific to wheat and its flour; it does not extend to rice or dates. The other three schools hold to a full sa' of whatever staple is given.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Zakat <em className="accent-text not-italic">al-Fitr</em> calculator
        </>
      }
      intro="Work out what your household owes at the end of Ramadan — in kilograms of the staple you give, and in money if your mosque collects it that way."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            A measure of food, not a percentage
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat al-Fitr is the charity that closes Ramadan, and it works
            nothing like{" "}
            <Link href="/zakat-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">zakat on wealth</Link>. There is no threshold to reach, no
            lunar year to wait out and no percentage to apply. It is one{" "}
            <strong>sa&rsquo;</strong> of staple food per person, owed by the
            head of a household for everyone under their care, and it is owed by
            nearly everyone — a family with no savings at all still gives it, so
            long as they have food for the day of Eid with something over.
          </p>
          <p className="mt-3 leading-relaxed">
            Where fasts were missed altogether rather than merely closed out,
            the{" "}
            <Link href="/fidya-and-kaffarah-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">fidya and kaffarah calculator</Link>{" "}
            deals with what is owed for those, which is a separate matter again.
            The purpose of this one is stated plainly in the hadith: to purify
            the fasting person of idle talk and lapses, and to feed the poor. The second
            half of that is why the timing is strict. It has to arrive before
            the Eid prayer, because the point is that a poor family has what it
            needs <em>on</em> the day rather than after it.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Why the weight depends on the food
          </h2>
          <p className="mt-3 leading-relaxed">
            A sa&rsquo; is four mudd — a measure of volume, the amount a vessel
            holds, not the amount a scale reads. So a sa&rsquo; of rice and a
            sa&rsquo; of dates fill the same vessel and weigh different amounts.
            The kilogram figures on this page are the conversions contemporary
            councils publish for each staple: roughly 2.4 kg of rice, 2.2 kg of
            wheat or barley, 2 kg of dates or raisins.
          </p>
          <p className="mt-3 leading-relaxed">
            Those conversions vary slightly between authorities, and the price
            of a staple varies enormously between countries. Where your local
            mosque announces a figure, that figure is better than this one —
            they are pricing the food your community actually eats.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Food or money
          </h2>
          <p className="mt-3 leading-relaxed">
            The Hanafi school permits paying the value in money, treating it as
            standing in for the food. The Maliki, Shafi&rsquo;i and Hanbali
            positions hold that the food named in the text is what should be
            given. The disagreement is old and both sides are held by serious
            scholars.
          </p>
          <p className="mt-3 leading-relaxed">
            In practice most mosques and charities collect money and buy the
            staple with it, which satisfies both readings at once. This
            calculator gives you the weight either way, and the money equivalent
            when you enter a price.
          </p>
        </>
      }
    >
      <FitrCalculator />
    </CalculatorPage>
  );
}
