import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import ConsolidationCalculator from "@/components/ConsolidationCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/debt-consolidation-calculator")!;

export const metadata: Metadata = {
  title: "Debt Consolidation Calculator — Is It Actually Worth It?",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Does debt consolidation save money?",
    a: "Sometimes. It saves money when the new rate is meaningfully lower than what you are paying now and the fee is small. It costs money when a longer term stretches the debt out, or when the origination fee eats the rate advantage. The comparison above tests both against your actual numbers.",
  },
  {
    q: "Why compare against paying the same amount without a loan?",
    a: "Because it is the fair test, and it is the one most consolidation calculators leave out. A loan is usually shown against minimum payments, which makes almost any loan look good. The real question is whether the loan beats putting that same monthly payment against the debts you already have.",
  },
  {
    q: "What is an origination fee?",
    a: "A charge for issuing the loan, commonly 1% to 8% of the amount borrowed. It is normally added to the loan rather than paid up front, so you borrow more than you owe and pay interest on the fee as well.",
  },
  {
    q: "Will consolidating hurt my credit score?",
    a: "Usually a small dip at first from the hard inquiry and the new account, then an improvement as your card utilisation drops. Keep the paid-off cards open — closing them cuts your available credit and can push utilisation back up.",
  },
  {
    q: "What is the biggest risk?",
    a: "Using the cards again. Consolidation clears them to zero, which feels like progress and creates room to spend. If the balances come back you owe the loan and the cards together, which is the single most common way consolidation makes things worse.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Debt <em className="accent-text not-italic">consolidation</em> calculator
        </>
      }
      intro="Compare a consolidation loan against what you owe now — including the comparison lenders would rather you skip."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            The comparison that actually matters
          </h2>
          <p className="mt-3 leading-relaxed">
            Nearly every consolidation calculator online is run by someone who
            sells consolidation loans. They compare the loan against making
            minimum payments forever, and against that, almost any loan looks
            like a rescue.
          </p>
          <p className="mt-3 leading-relaxed">
            The honest comparison is different: if you can afford the
            loan&rsquo;s monthly payment, you could pay that same amount against
            the debts you already have. This calculator runs that scenario
            beside the loan. Sometimes the loan still wins, and then it is a
            genuinely good deal. Often it does not.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Where the savings leak away
          </h2>
          <p className="mt-3 leading-relaxed">
            <strong>The term.</strong> Moving 23% debt to an 11% loan sounds
            like halving your interest. Stretch the repayment from three years
            to five and much of that gain disappears, because you are paying the
            lower rate for far longer.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>The fee.</strong> A 5% origination fee on $15,000 is $750,
            added to the loan and charged interest for its whole life.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>The advertised rate.</strong> The rate in the advertisement
            goes to applicants with excellent credit. The rate you are offered
            after applying may be several points higher — use that one here, not
            the headline.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            When consolidation is genuinely the right move
          </h2>
          <p className="mt-3 leading-relaxed">
            When the rate drop is large and real, when the term is no longer
            than the time you would have taken anyway, and when a single fixed
            payment with an end date is what finally makes the plan
            manageable. That last reason is worth something real, even if the
            arithmetic is close — just be honest with yourself that you are
            buying simplicity rather than savings.
          </p>
        </>
      }
    >
      <ConsolidationCalculator />
    </CalculatorPage>
  );
}
