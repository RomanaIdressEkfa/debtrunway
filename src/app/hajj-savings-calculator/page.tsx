import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import HajjCalculator from "@/components/HajjCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/hajj-savings-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Do I pay zakat on money saved for Hajj?",
    a: "Yes, and this is the thing most Hajj savings calculators quietly get wrong. Money set aside for a future purpose is still wealth you own and control, so once the pot is above the nisab and a lunar year has passed over it, zakat is due on the whole balance — and again the year after, for as long as it sits there. Intending to spend it on Hajj does not exempt it. Only wealth you cannot access, or that falls below the threshold, escapes.",
  },
  {
    q: "How much does Hajj cost?",
    a: "It varies enormously — by country of departure, by season, by whether the package is shifted or non-shifted, and by the operator. A figure quoted for one country tells you almost nothing about another. Use a quote from an operator you would actually travel with rather than any global average, including the one this page might seem to suggest by having a number in the box.",
  },
  {
    q: "Should I take a loan to perform Hajj?",
    a: "The obligation of Hajj falls on someone with the means — istita'ah — and borrowing to create those means is not what the condition describes. Where the loan carries interest the objection is far stronger, since riba is prohibited outright. The mainstream position is to save until you can go without borrowing, which is exactly what this page is for. If you are being pressed on this, ask a scholar rather than an agent.",
  },
  {
    q: "Why does the calculator assume no growth at all?",
    a: "Because a plan should not depend on a return it might not get. Interest is out of the question, and an investment return is not a thing to build a date around — markets fall as well as rise, and a Hajj that was going to happen in year five does not want to depend on that. Everything here is contributions, less the zakat the pot owes. If your savings do grow, you arrive early, which is the direction a plan should err in.",
  },
  {
    q: "Why does the zakat date move?",
    a: "Zakat is reckoned by the lunar year, which runs about 354 days against a solar year's 365. So the anniversary drifts roughly eleven days earlier through the Gregorian calendar each year, and over a long savings plan that adds up to an extra zakat year you would not have counted. This calculator carries days rather than months for that reason.",
  },
  {
    q: "Does turning off the zakat option mean I do not owe it?",
    a: "No. The switch only decides whether the zakat comes out of this pot or out of something else. If you intend to pay it from your ordinary income, turn it off and the pot grows untouched — but the zakat is still owed on it every year it stands above the nisab.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Hajj <em className="accent-text not-italic">savings</em> calculator
        </>
      }
      intro="Work out when you can go, or what it takes each month to go by a date — with the zakat your savings will owe along the way taken out, which most plans forget."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            The part every other calculator leaves out
          </h2>
          <p className="mt-3 leading-relaxed">
            Divide the cost by what you can save each month and you have a
            date. That answer is wrong for most people who reach for it, and
            wrong in the same direction, for a reason that is rarely mentioned:{" "}
            <strong>money saved for Hajj is still your wealth</strong>.
          </p>
          <p className="mt-3 leading-relaxed">
            Once the pot stands above the nisab and a lunar year has passed
            over it,{" "}
            <Link href="/zakat-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">zakat</Link> falls due on the whole balance. Not on the growth —
            on the balance. And again the next year, and the year after, for as
            long as it sits there. Intending to spend it on a pilgrimage does
            not exempt it; intention is not one of the conditions.
          </p>
          <p className="mt-3 leading-relaxed">
            On a pot climbing towards the cost of a journey that is not a
            rounding error. Five years of a fortieth, on a balance averaging
            half the target, is most of a month&rsquo;s contribution given
            away each year — and a plan built on plain division arrives short
            of the target on the date it promised.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Nothing here is assumed to grow
          </h2>
          <p className="mt-3 leading-relaxed">
            There is no interest in this calculation, which hardly needs
            saying. But there is no investment return either, and that is a
            deliberate choice rather than an oversight.
          </p>
          <p className="mt-3 leading-relaxed">
            A plan should not depend on a return it might not get. Markets fall
            as well as rise, and a Hajj set for year five does not want to rest
            on which way they went. What this page models is contributions,
            less the zakat the pot owes. If your savings do grow, you arrive
            early — which is the direction a plan ought to err in.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The lunar year drifts
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat is reckoned by the lunar year: about 354 days against the
            solar 365. The anniversary therefore moves some eleven days earlier
            through the Gregorian calendar each year, and over a long plan that
            drift is worth an extra zakat year that a month-counting
            calculation would miss entirely. This one carries days rather than
            months so the extra year appears where it actually falls.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Saving, rather than borrowing
          </h2>
          <p className="mt-3 leading-relaxed">
            Hajj is obliged on those with the means, and the condition is about
            having them rather than manufacturing them. Borrowing to go — and
            certainly borrowing at interest — is not what istita&rsquo;ah
            describes, and the mainstream position is to save until the journey
            and the maintenance of those left behind can both be met without a
            loan.
          </p>
          <p className="mt-3 leading-relaxed">
            That is the whole purpose of a page like this: to put a date on
            patience, so it is a plan rather than a hope.
          </p>
        </>
      }
    >
      <HajjCalculator />
    </CalculatorPage>
  );
}
