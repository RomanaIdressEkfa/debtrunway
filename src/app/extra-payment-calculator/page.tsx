import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import ExtraPaymentCalculator from "@/components/ExtraPaymentCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/extra-payment-calculator")!;

export const metadata: Metadata = {
  title: "Extra Payment Calculator — What $50 More a Month Does",
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How much does an extra payment really save?",
    a: "More than most people expect, because every extra dollar goes entirely to the balance and then reduces the interest charged in every month that follows. Tap the amounts above to see the exact saving on your own balance.",
  },
  {
    q: "Is it better to pay extra weekly or monthly?",
    a: "Paying earlier is slightly better, since interest is charged on a lower balance for longer. The difference is small compared with the size of the extra payment itself, so pick whichever schedule you will actually keep.",
  },
  {
    q: "Will my lender apply the extra to the principal?",
    a: "On credit cards, anything above the minimum goes to the balance, and by law it goes to the highest-rate portion first. On loans, check that extra payments reduce the principal rather than being held as a prepayment of next month's instalment — a quick call settles it.",
  },
  {
    q: "Should I pay extra or invest the money?",
    a: "Paying off a debt is a guaranteed, tax-free return equal to its interest rate. Against a 20% card, no investment reliably competes. Against a 3% loan the argument is much closer.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          <em className="accent-text not-italic">Extra payment</em> calculator
        </>
      }
      intro="Tap an amount and watch your payoff date move. See what $25, $100 or $500 more a month is actually worth."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            Why small amounts do so much
          </h2>
          <p className="mt-3 leading-relaxed">
            Your normal payment is split: part covers the interest charged this
            month, and only what is left reduces what you owe. On a high-rate
            card, interest can take most of it.
          </p>
          <p className="mt-3 leading-relaxed">
            An extra payment is different. Interest has already been covered, so
            every cent of it comes straight off the balance — and a smaller
            balance is charged less interest next month, and every month after
            that. One extra payment keeps saving you money for the entire
            remaining life of the debt.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The first dollars matter most
          </h2>
          <p className="mt-3 leading-relaxed">
            Look at the table above and compare the jump from nothing to $25
            with the jump from $200 to $250. The same $25 buys far more at the
            start. If a large extra payment is out of reach, that is not a
            reason to skip a small one — the small one is doing most of the
            available work.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Where the money usually comes from
          </h2>
          <p className="mt-3 leading-relaxed">
            Not from earning more, in most cases. It comes from a subscription
            nobody watches, a renewed insurance policy that was never shopped
            around, or a tax refund that arrives once a year. Set the extra
            payment up as an automatic transfer on payday and the decision is
            made once instead of twelve times a year.
          </p>
        </>
      }
    >
      <ExtraPaymentCalculator />
    </CalculatorPage>
  );
}
