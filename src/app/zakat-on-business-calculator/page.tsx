import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import BusinessZakatCalculator from "@/components/BusinessZakatCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/zakat-on-business-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Do I pay zakat on my shop, my machinery and my van?",
    a: "No, at any value. Zakat falls on wealth that turns over, not on the means of turning it — the same principle that exempts your home and a craftsman's tools. Premises, machinery, vehicles, computers, fixtures and fittings are all outside it, however much they are worth. What is zakatable is the stock they help you sell, the cash the trade generates, and the invoices owed to you.",
  },
  {
    q: "How do I value my stock — at cost or at selling price?",
    a: "At what it would sell for today, on your zakat date, in the market you actually sell into. Not what you paid for it, and not the retail price you hope for once it has moved. Stock that has fallen in value is valued at the lower figure, and stock nobody will pay full price for is worth what it will fetch. Zakat is on wealth as it stands, not as the books record it.",
  },
  {
    q: "What about raw materials and half-finished goods?",
    a: "Both are zakatable. They were bought to become goods for sale, so they turn over exactly as finished stock does — the fact that the turning is incomplete on your zakat date does not take them outside it. Value work in progress as it stands, which for most small businesses is materials plus whatever has been added to them.",
  },
  {
    q: "Are unpaid invoices zakatable?",
    a: "An invoice you expect to be paid is wealth you hold, so yes. An invoice you may never collect is where scholars differ, and the difference is about timing rather than whether it is owed. The common position leaves a doubtful debt out until the money arrives, and pays zakat for the year it arrives in. The cautious position counts it now. This calculator asks which you follow rather than choosing for you.",
  },
  {
    q: "Can I deduct my business loan?",
    a: "Only what falls due now — this month's instalment, this quarter's supplier bills, the wages you are about to pay. Deducting the whole outstanding balance of a long loan would leave a business with full shelves owing nothing at all, which is why the common position limits it to the immediate term. Where a loan was taken to buy stock rather than premises, ask about it: the reasoning is less settled there.",
  },
  {
    q: "We are three partners. Who pays?",
    a: "Each of you, separately, on your own share. Zakat is an obligation on a person and not on a company, so a partnership does not owe zakat — the partners do. Work out the net zakatable wealth of the business, take your percentage of it, add your own savings and gold to that, and measure the total against the nisab. Your partner does the same with theirs, and the answers will differ if your personal wealth does.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Zakat on a <em className="accent-text not-italic">business</em>
        </>
      }
      intro="Stock at every stage, the cash, the invoices — and everything the business trades with rather than trades in, recorded and then set aside with the reason."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            One line decides almost everything
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat falls on wealth that <strong>turns over</strong>, not on the
            means of turning it. Stock bought to sell is zakatable. The shelves
            it sits on are not. The van that delivers it is not. The premises
            are not, however much the lease is worth.
          </p>
          <p className="mt-3 leading-relaxed">
            This is the same rule that leaves a family home outside zakat
            however valuable, and a carpenter&rsquo;s tools outside it however
            good. A thing you use to produce wealth is not itself the wealth.
            Almost every question a shopkeeper has about zakat is answered by
            deciding which side of that line something falls on.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Stock is valued at what it would sell for
          </h2>
          <p className="mt-3 leading-relaxed">
            Not at cost, and not at the price you hope to get once the season
            turns. What the goods would fetch on your zakat date, in the market
            you actually sell into. Stock that has lost value is valued at the
            lower figure; stock nobody wants at full price is worth what it
            will fetch.
          </p>
          <p className="mt-3 leading-relaxed">
            Raw materials and work in progress count too, for the same reason
            finished stock does: they were bought to be sold, and being
            part-way through that on one particular day does not move them out
            of it.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Debts, in both directions
          </h2>
          <p className="mt-3 leading-relaxed">
            An invoice you expect to collect is wealth you hold, and it counts.
            An invoice you may never collect is where the positions part — the
            common one leaves it out until the money arrives and pays for that
            year, the cautious one counts it now. Both are held; the page asks
            which you follow.
          </p>
          <p className="mt-3 leading-relaxed">
            On the other side, only liabilities falling due now come off.
            Deducting the whole balance of a long loan would leave a business
            with full shelves owing nothing, which is not what anyone means by
            the rule.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            A company does not owe zakat
          </h2>
          <p className="mt-3 leading-relaxed">
            People do. A partnership or a limited company is not a person with
            an obligation of worship, so what each owner does is take their
            share of the business&rsquo;s net zakatable wealth, add their own
            savings and gold to it, and measure that total against the nisab.
          </p>
          <p className="mt-3 leading-relaxed">
            Two partners with equal shares can therefore owe different amounts,
            and one can owe nothing while the other owes plenty — because the
            threshold is met by the person, not by the shop.
          </p>
        </>
      }
    >
      <BusinessZakatCalculator />
    </CalculatorPage>
  );
}
