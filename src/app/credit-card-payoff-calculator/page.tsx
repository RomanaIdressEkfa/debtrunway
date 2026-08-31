import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import SingleDebtCalculator from "@/components/SingleDebtCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/credit-card-payoff-calculator")!;

export const metadata: Metadata = {
  title: "Credit Card Payoff Calculator — How Long Will It Take?",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How long will it take to pay off my credit card?",
    a: "It depends almost entirely on how much above the minimum you pay. Enter your balance, APR and monthly payment above and the calculator gives you the exact month, plus a table showing how much sooner you would finish with $25, $50, $100 or $250 more each month.",
  },
  {
    q: "Where do I find my APR?",
    a: "It is on your monthly statement, usually near the interest charges, and in your online account under card terms. Cards often have different rates for purchases, cash advances and balance transfers — use the purchase APR unless most of your balance came from somewhere else.",
  },
  {
    q: "Why does my statement show a slightly different interest charge?",
    a: "This calculator charges one twelfth of the annual rate on your balance each month. Most issuers use the average daily balance and a daily periodic rate instead, so the two differ by a small amount month to month. Over the life of the balance the totals stay close.",
  },
  {
    q: "Should I pay off my credit card or save first?",
    a: "A small emergency fund first — a few hundred dollars — so the next unexpected bill does not go straight back on the card. After that, a 22% card is costing you far more than any savings account pays, so the card wins.",
  },
  {
    q: "Will paying it off help my credit score?",
    a: "Usually yes. A large part of most scores is credit utilisation — how much of your available limit you are using. Bringing a balance down lowers utilisation, and keeping the account open afterwards keeps the limit working in your favour.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Credit card <em className="accent-text not-italic">payoff</em> calculator
        </>
      }
      intro="One card, three numbers. Find out exactly when it clears, what the interest costs you, and how much sooner you would finish by paying a little more."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            What the interest is really doing
          </h2>
          <p className="mt-3 leading-relaxed">
            A credit card at 22.9% costs you a little under 2% of the balance
            every month. On a $5,000 balance that is roughly $95 charged before
            a single dollar of what you owe goes down. If your payment is $120,
            only about $25 of it is actually reducing the debt.
          </p>
          <p className="mt-3 leading-relaxed">
            That ratio is why card balances feel stuck. It is also why extra
            payments work so dramatically: every extra dollar goes entirely to
            the balance, none of it to interest, and it reduces the interest
            charged in every month that follows.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The three numbers you need
          </h2>
          <p className="mt-3 leading-relaxed">
            <strong>Balance</strong> — what you currently owe, from your latest
            statement. <strong>APR</strong> — the annual interest rate on that
            balance. <strong>Monthly payment</strong> — what you actually pay
            each month, not what the card asks for as a minimum. If you only
            ever pay the minimum, use the minimum payment calculator instead,
            because that payment shrinks as the balance falls and the maths
            changes completely.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Making the payoff faster
          </h2>
          <p className="mt-3 leading-relaxed">
            The table above shows what different extra amounts do. Most people
            are surprised by how much work the first $25 does compared with the
            step from $200 to $250 — the early dollars have the longest time to
            compound in your favour.
          </p>
          <p className="mt-3 leading-relaxed">
            Two other things worth checking: whether your card offers a lower
            rate for setting up autopay, and whether a 0% balance transfer is
            available to you. A transfer with a 3% fee that buys 18 months at 0%
            is usually cheaper than 18 months at 22%, but only if you clear the
            balance before the promotional rate expires.
          </p>
        </>
      }
    >
      <SingleDebtCalculator
        labels={{
          balance: "Card balance",
          apr: "Interest rate (APR)",
          payment: "Monthly payment",
        }}
        defaults={{ balance: "5000", apr: "22.9", payment: "150" }}
        chartLabel="Your card balance"
      />
    </CalculatorPage>
  );
}
