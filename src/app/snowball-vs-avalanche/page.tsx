import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import PayoffCalculator from "@/components/PayoffCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/snowball-vs-avalanche")!;

export const metadata: Metadata = {
  title: "Snowball vs. Avalanche Calculator — Compare Both Methods",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "What is the difference between the snowball and the avalanche?",
    a: "Only the order. Both pay the minimum on every debt and put all spare money against one target, rolling each cleared payment onto the next. The snowball targets the smallest balance first; the avalanche targets the highest interest rate first.",
  },
  {
    q: "Which one is better?",
    a: "The avalanche always costs less in interest. The snowball almost always clears your first debt sooner. Which is better depends on whether your obstacle is arithmetic or motivation — and for most people it is motivation.",
  },
  {
    q: "How big is the difference, really?",
    a: "Run your own numbers above. For typical household debts the gap is a few hundred dollars over several years. It grows when one debt has a much higher rate than the rest, and shrinks to almost nothing when your rates are similar.",
  },
  {
    q: "Can I switch methods halfway through?",
    a: "Yes. Nothing is locked in — these are just orders of payment, not products you sign up for. Many people clear one small balance for the momentum and then switch to avalanche order.",
  },
  {
    q: "Does either method involve borrowing or fees?",
    a: "No. Both use only the money you already have. Neither requires a new loan, a balance transfer, or a company to manage anything for you.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Snowball <em className="accent-text not-italic">vs.</em> avalanche
        </>
      }
      intro="Same debts, same money, two different orders. Run both on your own numbers and see what the choice actually costs."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            The argument in one paragraph
          </h2>
          <p className="mt-3 leading-relaxed">
            The avalanche is cheaper. That part is not in dispute — paying off
            the highest interest rate first is provably the least expensive
            order for any fixed monthly budget. The argument is about whether
            being cheapest on paper is the same as working in practice, given
            that the plan has to survive several years of ordinary life.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            What each one is good at
          </h2>
          <p className="mt-3 leading-relaxed">
            <strong>The snowball is good at being finished.</strong> It gives
            you a completed debt early, often within a few months, and each
            completion makes the next one faster. If you have tried and
            abandoned a payoff plan before, this is the one built for you.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>The avalanche is good at being cheap.</strong> If your
            highest-rate debt is also fairly small, it gives you an early win
            too and there is no reason not to use it. If you are the kind of
            person who has stuck with long projects before, take the money.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            How to decide with the table above
          </h2>
          <p className="mt-3 leading-relaxed">
            Enter your real debts, then look at two numbers. First, the
            difference in total interest — that is the price of choosing the
            snowball. Second, the month each method clears your first debt,
            shown in the payoff order list.
          </p>
          <p className="mt-3 leading-relaxed">
            If the interest gap is small and the avalanche&rsquo;s first win is
            far away, take the snowball without guilt. If the gap is large, or
            both methods clear something quickly, take the avalanche. There is
            no wrong answer here that is worse than not starting.
          </p>
        </>
      }
    >
      <PayoffCalculator />
    </CalculatorPage>
  );
}
