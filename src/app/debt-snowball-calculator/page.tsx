import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import PayoffCalculator from "@/components/PayoffCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/debt-snowball-calculator")!;

export const metadata: Metadata = {
  title: "Debt Snowball Calculator — Smallest Balance First",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How does the debt snowball work?",
    a: "List your debts from smallest balance to largest, ignoring interest rates. Pay the minimum on all of them, and put every spare dollar on the smallest. When it clears, add its payment to what you were already paying and move to the next smallest. Your monthly total never changes, but the amount hitting each remaining debt keeps growing.",
  },
  {
    q: "Why ignore the interest rate?",
    a: "Because the snowball is built around finishing, not optimising. Clearing a whole debt in two or three months is proof the plan works, and that proof is what keeps people paying in month eleven. The avalanche method is cheaper on paper, but only if you stay with it.",
  },
  {
    q: "How much does the snowball cost compared to the avalanche?",
    a: "Usually a few hundred dollars over the life of the plan, though it depends on your balances. The comparison table above shows the exact gap for your numbers, so you can decide whether the motivation is worth the difference.",
  },
  {
    q: "What if two debts have the same balance?",
    a: "This calculator breaks the tie by putting the higher interest rate first, which costs you slightly less without changing the order in any meaningful way.",
  },
  {
    q: "Should I stop paying minimums on my other debts?",
    a: "No. Every other debt keeps getting its minimum every month. Missing a minimum triggers late fees and penalty rates that will cost far more than the snowball saves.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Debt <em className="accent-text not-italic">snowball</em> calculator
        </>
      }
      intro="Smallest balance first. See how quickly the first debt disappears, and how much faster each one falls after that."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            Why the snowball works when better plans fail
          </h2>
          <p className="mt-3 leading-relaxed">
            On paper the snowball is the wrong answer. Paying the smallest
            balance first ignores interest rates, and ignoring interest rates
            costs money. Every spreadsheet says to do something else.
          </p>
          <p className="mt-3 leading-relaxed">
            The spreadsheets are missing the part that actually decides the
            outcome. Debt payoff is a plan you have to repeat every month for
            years while nothing visibly changes. The snowball is designed to
            make something visibly change as early as possible: a debt is gone,
            a statement stops arriving, and the payment you were making on it
            joins the fight.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            How the snowball builds
          </h2>
          <p className="mt-3 leading-relaxed">
            Say you owe $600 on a store card, $4,000 on a credit card, and
            $9,000 on a car, with minimums of $30, $110 and $250. You find $200
            a month. The store card gets $230 and is gone in three months.
          </p>
          <p className="mt-3 leading-relaxed">
            Now the credit card gets $110 plus the $30 freed from the store card
            plus your $200 — $340 a month instead of $110. When it clears, the
            car gets $590. Your outgoing payment never rose above $590, but the
            money attacking each debt more than doubled twice along the way.
          </p>
          <p className="mt-3 leading-relaxed">
            The calculator above shows this happening month by month with your
            own numbers, including the exact date each debt disappears.
          </p>
        </>
      }
    >
      <PayoffCalculator lockedStrategy="snowball" />
    </CalculatorPage>
  );
}
