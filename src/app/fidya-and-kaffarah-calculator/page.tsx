import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import FidyaCalculator from "@/components/FidyaCalculator";
import { bySlug } from "@/lib/calculators";
import { alternatesFor } from "@/lib/i18n";

const meta = bySlug("/fidya-and-kaffarah-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: alternatesFor(meta.slug),
};

const faqs = [
  {
    q: "What is the difference between qada, fidya and kaffarah?",
    a: "Qada is making the fast up — a day missed for illness, travel, menstruation or pregnancy is repaid by fasting another day, and no money is owed. Fidya is feeding a poor person for each day, and it is owed only by someone who cannot fast and will not be able to: chronic illness with no prospect of recovery, or old age. Kaffarah is expiation for deliberately breaking a fast of Ramadan without an excuse, and it is far heavier — sixty consecutive days of fasting, or feeding sixty poor people for someone genuinely unable to fast them. Most missed days are qada and nothing else.",
  },
  {
    q: "How much is fidya for one day?",
    a: "Feeding one poor person, which the classical texts put at half a sa' of wheat — roughly 1.75 kg — or a full sa' of another staple, or two meals. Mosques and charities publish a money figure each year for their own area, and where yours does, that figure is better than any general one because it prices the food your community actually eats.",
  },
  {
    q: "Can I pay fidya instead of making up my fasts?",
    a: "No. Fidya is a substitute for a fast that cannot be kept, not a way of buying out of one that can. If you are able to fast the days later — even much later, and even a few at a time — the days are owed as fasts. Paying money in place of a fast you could still keep discharges nothing.",
  },
  {
    q: "I did not make up last year's fasts before this Ramadan. What now?",
    a: "The fast is still owed on every view; the disagreement is only about whether feeding is owed on top of it. The Maliki, Shafi'i and Hanbali positions add a fidya for each delayed day. The Hanafi position adds nothing, holding that the make-up alone discharges it. Either way the days themselves still have to be fasted, and the calculator keeps them in the fasts column rather than letting a payment appear to replace them.",
  },
  {
    q: "When is kaffarah actually owed?",
    a: "For deliberately breaking a fast of Ramadan without a valid excuse — eating or drinking on purpose while fasting. It is not owed for forgetting, for a fast broken by genuine illness, for vomiting involuntarily, or for not starting a fast that one was excused from. Whether a particular case counts as deliberate in the sense the rule means is a question to put to a scholar rather than to a form.",
  },
  {
    q: "Do the sixty days of kaffarah have to be consecutive?",
    a: "Yes, and breaking the run without an excuse starts it again from the first day. This is why it is usually begun outside Ramadan and away from the days on which fasting is forbidden, so that sixty clear days are actually available. Feeding sixty people is the alternative for someone genuinely unable to keep the run — it is the second option, not an equal choice.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          <em className="accent-text not-italic">Fidya</em> and kaffarah
        </>
      }
      intro="Work out what is owed for fasts of Ramadan not kept — which days are repaid by fasting, which by feeding, and which carry both."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            Three obligations, constantly mistaken for one another
          </h2>
          <p className="mt-3 leading-relaxed">
            Almost every wrong answer here comes from putting a day in the wrong
            box. The three are not degrees of the same thing; they are different
            duties triggered by different facts, and two of them are not
            payments at all.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Qada</strong> is the ordinary case and covers most missed
            days. A fast missed for illness that passed, for travel, for
            menstruation or for pregnancy is repaid by fasting another day. No
            money is owed, and paying some would discharge nothing.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Fidya</strong> is feeding one poor person for each day, and
            it belongs to a narrow case: someone who cannot fast and will not be
            able to. Chronic illness with no prospect of recovery, or old age.
            It substitutes for a fast that is out of reach — not for one that is
            merely inconvenient or postponed.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Kaffarah</strong> is expiation for deliberately breaking a
            fast of Ramadan without an excuse: sixty consecutive days of
            fasting, or feeding sixty poor people where that run is genuinely
            impossible. It is heavy on purpose. And it does not replace the
            make-up — the day broken is still owed as a fast on top of it, which
            this calculator keeps in a separate column so a payment never
            appears to have bought a fast off.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            What one day&rsquo;s feeding comes to
          </h2>
          <p className="mt-3 leading-relaxed">
            The classical measure is half a sa&rsquo; of wheat, about 1.75
            kilograms, or a full sa&rsquo; of another staple, or two meals. As
            with{" "}
            <Link href="/zakat-al-fitr-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">zakat al-Fitr</Link>, the
            sa&rsquo; is a volume rather than a weight,
            so the kilogram figure is a conversion and authorities publish
            slightly different ones.
          </p>
          <p className="mt-3 leading-relaxed">
            Most mosques and charities announce a money figure for their own
            area each Ramadan. Where yours does, use it: they are pricing the
            food their community eats, in the market it is bought in, which no
            general figure can do.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The fast carried past a Ramadan
          </h2>
          <p className="mt-3 leading-relaxed">
            A make-up left until the following Ramadan has come and gone is the
            one point on this page where the schools genuinely part. The
            Maliki, Shafi&rsquo;i and Hanbali positions add a fidya for each
            delayed day. The Hanafi position adds nothing.
          </p>
          <p className="mt-3 leading-relaxed">
            What both agree on is that <em>the fast is still owed</em>. The
            disagreement is about a payment on top of it, never about a payment
            instead of it, and the calculator reflects that: choosing the Hanafi
            view removes money from the answer and leaves every fast exactly
            where it was.
          </p>
        </>
      }
    >
      <FidyaCalculator />
    </CalculatorPage>
  );
}
