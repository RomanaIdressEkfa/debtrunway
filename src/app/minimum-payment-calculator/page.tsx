import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import MinimumPaymentCalculator from "@/components/MinimumPaymentCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/minimum-payment-calculator")!;

export const metadata: Metadata = {
  title: "Credit Card Minimum Payment Calculator — The Real Cost",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "What happens if I only pay the minimum on my credit card?",
    a: "The balance falls very slowly and the required payment falls with it, so each month you make slightly less progress than the month before. On a typical card it takes decades rather than years, and the interest often exceeds the amount originally borrowed.",
  },
  {
    q: "How is a minimum payment calculated?",
    a: "Most US issuers ask for a percentage of the balance — commonly 1% to 3% — plus interest and fees, or a fixed amount such as $25 or $35, whichever is greater. Because it is a percentage of a falling balance, the payment falls too. That is the mechanism this calculator models.",
  },
  {
    q: "Why does paying the minimum take so long?",
    a: "Two reasons compound. Interest eats a large share of each payment, and the payment itself shrinks. Near the end of the balance the required payment drops to the fixed floor, where progress becomes glacial: on a $1,000 balance at 22%, a $25 minimum leaves roughly $7 going to the debt.",
  },
  {
    q: "What is the single easiest fix?",
    a: "Keep paying today's amount. If your minimum is $110 this month, pay $110 every month from now on instead of letting it fall to $105, then $100, then $95. It costs you nothing you are not already paying, and it typically cuts years off the payoff. The second panel above shows the effect on your own balance.",
  },
  {
    q: "Does paying the minimum hurt my credit score?",
    a: "Paying the minimum on time is not itself a negative mark — it counts as paid on time. The damage comes indirectly, because carrying a high balance keeps your credit utilisation high, and utilisation is a large part of most scoring models.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          The real cost of the <em className="accent-text not-italic">minimum payment</em>
        </>
      }
      intro="See what happens if you only ever pay the minimum — and what changes the moment you stop letting that payment shrink."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            The trap is the shrinking payment
          </h2>
          <p className="mt-3 leading-relaxed">
            Almost everyone understands that minimum payments are slow. What
            most people miss is <em>why</em>, and it is not simply the interest
            rate.
          </p>
          <p className="mt-3 leading-relaxed">
            Your minimum is typically a percentage of what you owe. As the
            balance falls, the required payment falls with it. You are never
            asked to pay more, so your progress decelerates month after month
            for the entire life of the debt. A plan that starts slow gets slower
            — by design.
          </p>
          <p className="mt-3 leading-relaxed">
            Most minimum payment calculators ignore this and assume a flat
            payment, which makes the answer look far better than reality. This
            one recalculates the required payment every month, the way your
            issuer does.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The fix that costs nothing
          </h2>
          <p className="mt-3 leading-relaxed">
            You do not need extra money to escape most of this. You need to stop
            paying less over time.
          </p>
          <p className="mt-3 leading-relaxed">
            Take whatever your minimum is this month and set up a fixed payment
            for that amount. Next month the card will ask for less; pay the
            fixed amount anyway. You are paying exactly what you can afford
            today — you are simply refusing to slow down. For most balances this
            single change cuts the payoff from decades to a handful of years,
            and the second panel above shows the exact figure for your card.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Reading your statement
          </h2>
          <p className="mt-3 leading-relaxed">
            US card statements are required to carry a minimum payment warning
            box, which tells you how long the balance would take at the minimum
            and what it would cost. It is worth finding — it is the same
            calculation this page performs, printed by your own issuer.
          </p>
          <p className="mt-3 leading-relaxed">
            To match this calculator to your card, look for the minimum payment
            terms in your cardholder agreement. If it says something like
            &ldquo;2% of the balance or $25, whichever is greater&rdquo;, enter
            those two numbers above.
          </p>
        </>
      }
    >
      <MinimumPaymentCalculator />
    </CalculatorPage>
  );
}
