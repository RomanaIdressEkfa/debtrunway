import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import DtiCalculator from "@/components/DtiCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/debt-to-income-calculator")!;

export const metadata: Metadata = {
  title: "Debt-to-Income Ratio Calculator — What Lenders See",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "What is a debt-to-income ratio?",
    a: "The share of your gross monthly income that goes to debt payments. Add up every monthly debt payment, divide by your monthly income before tax, and multiply by 100. Lenders use it to judge whether you can take on more.",
  },
  {
    q: "What is a good debt-to-income ratio?",
    a: "Below 36% is comfortable. Up to 43% is generally still acceptable and is the usual ceiling for a qualified mortgage. Above 43% many lenders decline or price the risk into your rate.",
  },
  {
    q: "Which payments count?",
    a: "Rent or mortgage, car payments, minimum credit card payments, student loans, personal loans, and court-ordered payments such as child support. Groceries, utilities, phone bills, insurance and subscriptions are not counted — they are living costs, not debts.",
  },
  {
    q: "Gross or net income?",
    a: "Gross — your income before tax and deductions. It is what lenders use, so using take-home pay would give you a ratio that does not match theirs.",
  },
  {
    q: "How do I lower my ratio quickly?",
    a: "Clearing a whole debt removes its entire monthly payment from the calculation, so paying off one small balance moves the ratio faster than paying a little toward several. Raising income works too, but takes longer.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          <em className="accent-text not-italic">Debt-to-income</em> ratio calculator
        </>
      }
      intro="The number a lender checks before approving a mortgage or loan. Work out yours and see which band you land in."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            Why lenders care about this number
          </h2>
          <p className="mt-3 leading-relaxed">
            A credit score says how reliably you have repaid in the past. Your
            debt-to-income ratio says whether you can afford to repay in the
            future. A lender will look at both, and a strong score will not
            rescue an application where too much of the income is already
            committed.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The two ratios
          </h2>
          <p className="mt-3 leading-relaxed">
            Mortgage lenders usually look at two figures. The{" "}
            <strong>front-end ratio</strong> is housing costs alone as a share
            of income, and the traditional guide is 28% or less. The{" "}
            <strong>back-end ratio</strong> is all debt payments including
            housing, and that is the number most people mean by DTI. The
            calculator above gives you both.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Moving the number
          </h2>
          <p className="mt-3 leading-relaxed">
            The ratio counts monthly <em>payments</em>, not balances, and that
            changes the best strategy. Clearing one small debt entirely removes
            its whole payment from the calculation. Paying a little toward
            several large debts barely moves it at all, even if you pay the same
            total amount.
          </p>
          <p className="mt-3 leading-relaxed">
            So if you are preparing to apply for a mortgage, the smallest
            balances are the ones to clear first — which is exactly what the
            debt snowball does. One more thing: do not open new credit in the
            months before applying. A new car loan can undo a year of careful
            paying down.
          </p>
        </>
      }
    >
      <DtiCalculator />
    </CalculatorPage>
  );
}
