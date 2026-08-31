import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import SingleDebtCalculator from "@/components/SingleDebtCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/loan-payoff-calculator")!;

export const metadata: Metadata = {
  title: "Loan Payoff Calculator — Payoff Date and Total Interest",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How do I work out when my loan will be paid off?",
    a: "Enter the balance remaining, the interest rate, and your monthly payment. The calculator applies interest and then your payment each month until the balance reaches zero, and gives you the exact month.",
  },
  {
    q: "Does paying extra on a loan actually shorten it?",
    a: "Yes, provided the extra goes to the principal. Each extra dollar removes future interest as well, so the effect compounds. The table above shows the exact months and dollars saved at several extra amounts.",
  },
  {
    q: "What is a prepayment penalty?",
    a: "A fee some lenders charge for paying off a loan early, most often on mortgages and older personal loans. Check your agreement before making large extra payments — where one exists it is usually limited to the first few years.",
  },
  {
    q: "Why is my early payment mostly interest?",
    a: "Interest is charged on what you still owe, and early on that is nearly the whole loan. As the balance falls the interest portion shrinks and more of the same payment goes to principal. The schedule above shows this split for every month.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Loan <em className="accent-text not-italic">payoff</em> calculator
        </>
      }
      intro="Any fixed loan — car, personal, home improvement. See the payoff date, the total interest, and what extra payments would change."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            What the schedule shows you
          </h2>
          <p className="mt-3 leading-relaxed">
            Every loan payment splits in two. Part covers the interest charged
            since the last payment; the rest reduces what you owe. Early on the
            split is unflattering — on a five-year car loan the first payments
            can be a third interest — and it improves steadily as the balance
            falls.
          </p>
          <p className="mt-3 leading-relaxed">
            The month-by-month table above shows that split for your loan, so
            you can see exactly where your money is going rather than watching a
            balance move slowly for reasons that are never explained.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Making extra payments count
          </h2>
          <p className="mt-3 leading-relaxed">
            Two things are worth confirming with your lender before you start.
            First, that extra money is applied to the principal immediately
            rather than held against next month&rsquo;s instalment — the second
            gives you a payment holiday, not a shorter loan. Second, that there
            is no prepayment penalty.
          </p>
          <p className="mt-3 leading-relaxed">
            Both are usually a single phone call, and both decide whether the
            savings in the table above are real for you.
          </p>
        </>
      }
    >
      <SingleDebtCalculator
        labels={{
          balance: "Loan balance",
          apr: "Interest rate (APR)",
          payment: "Monthly payment",
        }}
        defaults={{ balance: "18500", apr: "7.2", payment: "410" }}
        extraSteps={[50, 100, 200, 400]}
        chartLabel="Your loan balance"
      />
    </CalculatorPage>
  );
}
