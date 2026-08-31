import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import PayoffCalculator from "@/components/PayoffCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/debt-avalanche-calculator")!;

export const metadata: Metadata = {
  title: "Debt Avalanche Calculator — Highest Interest First",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How does the debt avalanche work?",
    a: "Order your debts by interest rate, highest first, and ignore the balances. Pay the minimum on everything, then put every spare dollar against the highest-rate debt. When it clears, its payment rolls onto the next-highest rate. Your monthly total stays the same throughout.",
  },
  {
    q: "Is the avalanche always cheaper?",
    a: "In total interest, yes — it is mathematically the cheapest possible order for a fixed monthly budget. It also usually finishes on the same date or sooner. The only thing it cannot do is give you an early win, which is why some people abandon it.",
  },
  {
    q: "How much does it actually save?",
    a: "For most households a few hundred dollars, occasionally a few thousand when one debt carries a much higher rate than the rest. The comparison above shows the exact figure for your balances rather than a rule of thumb.",
  },
  {
    q: "What if my highest-rate debt is also my largest?",
    a: "Then the avalanche will feel slow, because months will pass before anything clears. That is the case where the snowball is worth considering even though it costs more — a plan you keep beats a plan you quit.",
  },
  {
    q: "Does a promotional 0% rate change the order?",
    a: "Yes, and be careful with it. A 0% balance sits at the bottom of the avalanche order until the promotion ends, at which point the rate jumps and it may leap to the top. Note the expiry date and re-run this calculator when it approaches.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Debt <em className="accent-text not-italic">avalanche</em> calculator
        </>
      }
      intro="Highest interest rate first — the cheapest route out of debt. See exactly what the discipline is worth in dollars."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            Why the highest rate goes first
          </h2>
          <p className="mt-3 leading-relaxed">
            Interest is rent you pay on money you have already spent. A dollar
            sitting on a 26% store card costs you roughly twice as much per
            month as the same dollar on a 13% personal loan. So the cheapest
            possible plan is the one that removes the most expensive dollars
            first, no matter how large or small the balance holding them is.
          </p>
          <p className="mt-3 leading-relaxed">
            That is the entire avalanche method. Everything else — the minimums,
            the rollover — works exactly as it does in the snowball.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            What it costs you
          </h2>
          <p className="mt-3 leading-relaxed">
            The avalanche asks for patience. If your highest-rate debt is also a
            large one, you may pay for a year before anything is crossed off the
            list. Nothing visibly changes in that time, and that is precisely
            when people give up and go back to minimum payments.
          </p>
          <p className="mt-3 leading-relaxed">
            Before committing, look at the comparison table above and check when
            the avalanche clears your first debt. If that date is many months
            out and the saving over the snowball is small, take the snowball.
            The cheapest plan is only cheapest if you finish it.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            A middle route
          </h2>
          <p className="mt-3 leading-relaxed">
            Some people clear one very small balance first for the momentum,
            then switch to strict avalanche order for everything after. It costs
            a little more than pure avalanche and buys you the early win. Run
            both versions above and you will see the price of that choice
            exactly.
          </p>
        </>
      }
    >
      <PayoffCalculator lockedStrategy="avalanche" />
    </CalculatorPage>
  );
}
