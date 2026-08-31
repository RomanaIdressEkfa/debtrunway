import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import SingleDebtCalculator from "@/components/SingleDebtCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/student-loan-payoff-calculator")!;

export const metadata: Metadata = {
  title: "Student Loan Payoff Calculator — Date and Lifetime Interest",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How long will my student loan take to pay off?",
    a: "Enter your balance, rate and monthly payment above for the exact month. The standard federal repayment plan runs ten years, but any extra payment shortens that, and the table shows by how much.",
  },
  {
    q: "Should I pay extra on student loans or other debt first?",
    a: "Compare the rates. Student loan rates are usually well below credit card rates, so cards normally come first. Once the cards are gone, the student loan is the next target.",
  },
  {
    q: "How do I make sure extra payments reduce the balance?",
    a: "Tell your servicer in writing to apply extra amounts to the principal, and not to advance your due date. Without that instruction many servicers treat the money as paying next month early, which does not shorten the loan.",
  },
  {
    q: "Should I pay extra if I am pursuing loan forgiveness?",
    a: "Generally no. If you are working toward Public Service Loan Forgiveness or a forgiveness provision under an income-driven plan, extra payments reduce a balance that may be written off anyway. This calculator models straightforward repayment, not forgiveness — check your plan's rules before paying ahead.",
  },
  {
    q: "Does this handle multiple loans?",
    a: "This page models one balance at a time. If you hold several loans at different rates, use the main debt payoff calculator, which orders them and rolls each cleared payment onto the next.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Student loan <em className="accent-text not-italic">payoff</em> calculator
        </>
      }
      intro="See your payoff date, what the loan costs in total interest, and how much sooner extra payments would finish it."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            The cost of the standard ten years
          </h2>
          <p className="mt-3 leading-relaxed">
            Student loans are usually written over ten years or longer, and a
            long term is expensive even at a modest rate. A $30,000 balance at
            6% repaid over ten years costs around $10,000 in interest — a third
            of the amount borrowed, paid for the privilege of spreading it out.
          </p>
          <p className="mt-3 leading-relaxed">
            Extra payments work particularly well here for the same reason:
            there are many remaining months for each extra dollar to save
            interest in.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Before you pay ahead
          </h2>
          <p className="mt-3 leading-relaxed">
            Student loans carry protections that other debts do not — income-driven
            repayment, deferment, and in some cases forgiveness. Paying a loan
            off early gives those up along with the balance.
          </p>
          <p className="mt-3 leading-relaxed">
            If you are working toward forgiveness, extra payments are usually
            the wrong move: you would be reducing a balance that may never need
            to be repaid. If you are on a standard plan with no forgiveness in
            sight, paying ahead is straightforwardly good, and the table above
            shows what it is worth.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Getting the extra applied correctly
          </h2>
          <p className="mt-3 leading-relaxed">
            This is the step people miss. Send your servicer written
            instructions to apply any overpayment to the principal of your
            highest-rate loan, and not to advance the due date. Otherwise the
            extra money often sits as a prepaid instalment, which feels like
            progress and achieves almost none.
          </p>
        </>
      }
    >
      <SingleDebtCalculator
        labels={{
          balance: "Student loan balance",
          apr: "Interest rate (APR)",
          payment: "Monthly payment",
        }}
        defaults={{ balance: "30000", apr: "6.0", payment: "333" }}
        extraSteps={[50, 100, 200, 400]}
        chartLabel="Your loan balance"
      />
    </CalculatorPage>
  );
}
