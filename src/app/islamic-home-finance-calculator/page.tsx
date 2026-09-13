import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import HomeFinanceCalculator from "@/components/HomeFinanceCalculator";
import { bySlug } from "@/lib/calculators";
import { alternatesFor } from "@/lib/i18n";

const meta = bySlug("/islamic-home-finance-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: alternatesFor(meta.slug),
};

const faqs = [
  {
    q: "What is the difference between murabaha, ijara and diminishing musharakah?",
    a: "They are three different contracts, not three names for one thing. Under murabaha the financier buys the property and sells it to you at a disclosed mark-up payable in instalments — the total is fixed on day one and cannot rise afterwards. Under ijara they buy it and lease it to you, with the rent reviewed periodically, so the cost is not fixed. Under diminishing musharakah you own it together: you pay rent on their share and buy pieces of it back over time, so as your share grows the rent falls and the monthly payment falls with it.",
  },
  {
    q: "Why does the diminishing musharakah cost less in total?",
    a: "Because you are paying a return on a share that shrinks every month rather than on the whole sum for the whole term. It is arithmetic rather than generosity, and a provider knows it — the rate quoted on a musharakah is priced with that in mind, so comparing two providers on headline rate alone will mislead you. Compare the total cost over the term instead, which is what this page puts side by side.",
  },
  {
    q: "Is this the same as a mortgage with the word interest removed?",
    a: "That is precisely the live disagreement, and this page takes no side in it. Scholars who approve these structures hold that they are genuine contracts of sale or partnership: the financier takes ownership, carries the risks of ownership, and profits from a thing rather than from time on a debt. Scholars who object hold that some implementations reproduce a loan in substance while changing its form — benchmarking the rent to an interest index being the usual objection. Both positions are held by serious people, and what is offered to you locally may satisfy one and not the other.",
  },
  {
    q: "What happens if I pay late?",
    a: "Under a murabaha the debt is a fixed sale price, so it cannot grow — late payment cannot increase what you owe, which is a real and often overlooked difference from an interest-bearing mortgage where arrears compound. Providers generally charge a late fee that must be given to charity rather than kept as profit. Under the other structures the position depends on the contract, and it is a question worth asking before signing rather than after.",
  },
  {
    q: "What should I actually ask a provider?",
    a: "Four things. Who holds the legal title, and who carries the risk if the property is destroyed. Whether the rate is fixed or reviewed, and if reviewed, against what benchmark and how often. What happens on late payment and where any charge goes. And whether the provider has a shariah supervisory board, who sits on it, and whether their fatwa on this specific product is published. A provider who cannot answer the fourth question quickly is telling you something.",
  },
  {
    q: "Should I take one of these at all?",
    a: "That is a question for a scholar and not for a calculator, and the honest answer is that it depends on the contract in front of you rather than on the category it belongs to. What can be said generally is that renting while saving carries no such question at all, and that the obligation to avoid riba does not create an obligation to buy a house. Bring the actual contract to someone qualified — not the brochure, and not a page like this one.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Islamic <em className="accent-text not-italic">home finance</em>{" "}
          calculator
        </>
      }
      intro="What murabaha, ijara and diminishing musharakah each cost on the same figures — and what to ask a provider before you sign any of them."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            What this page does, and what it refuses to do
          </h2>
          <p className="mt-3 leading-relaxed">
            It costs three contracts. It does not tell you whether they are
            lawful, because that is a live disagreement between serious
            scholars and a calculator is not where it gets settled.
          </p>
          <p className="mt-3 leading-relaxed">
            Those who approve these structures hold that they are genuine
            contracts of sale or partnership: the financier takes real
            ownership, carries the risks that come with it, and profits from a
            thing rather than from time on a debt. Those who object hold that
            some implementations reproduce a loan in substance while changing
            its form — most often pointing at rent benchmarked to an interest
            index. Both positions are held by people worth listening to, and
            what is offered in your town may satisfy one and not the other.
          </p>
          <p className="mt-3 leading-relaxed">
            So the page shows the cost, plainly, so that the question you take
            to a scholar is a specific one about a specific contract rather
            than a general one about a category.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Three contracts, not three brand names
          </h2>
          <p className="mt-3 leading-relaxed">
            <strong>Murabaha</strong> is a sale. The financier buys the house
            and sells it to you at a mark-up they disclose, payable in
            instalments. The price is fixed at the outset and cannot rise — not
            if rates move, and not if you fall behind, because a fixed sale
            price is not a balance that accrues. That certainty is its main
            advantage and it is usually paid for in the mark-up.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Ijara</strong> is a lease. They buy the house and lease it
            to you, with part of the payment buying ownership over the term.
            The rent is normally reviewed at intervals, so the total is not
            knowable at the start — which makes the review clause, not the
            headline rate, the thing to read.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Diminishing musharakah</strong> is a partnership, and it is
            what most providers in Britain and America actually offer. You and
            the financier own the property together. You pay rent on their
            share and buy pieces of it back; as your share grows the rent
            falls, and so does the monthly payment. This is the structure whose
            arithmetic differs most visibly from a mortgage — a mortgage keeps
            the payment level and shifts the split inside it, while this one
            genuinely falls month by month.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Why the totals differ, and why that is not a bargain
          </h2>
          <p className="mt-3 leading-relaxed">
            On identical figures, diminishing musharakah comes out cheapest.
            That is because a return charged on a shrinking share costs less
            than the same rate on the whole sum for the whole term. It is
            arithmetic, and a provider prices for it: the rate quoted on a
            musharakah accounts for exactly this.
          </p>
          <p className="mt-3 leading-relaxed">
            Which is why comparing two providers on headline rate alone will
            mislead you. Compare the total over the term, which is what the
            table on this page puts side by side.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Four questions worth asking before you sign
          </h2>
          <p className="mt-3 leading-relaxed">
            Who holds legal title, and who carries the loss if the property
            burns down. Whether the rate is fixed or reviewed, and if reviewed,
            against what and how often. What happens on late payment, and
            whether any charge is kept as profit or given away. And whether the
            provider has a shariah supervisory board, who sits on it, and
            whether its ruling on <em>this product</em> is published.
          </p>
          <p className="mt-3 leading-relaxed">
            A provider who answers the first three easily and hesitates on the
            fourth has told you something. And it is worth remembering that
            avoiding riba creates no obligation to buy a house at all —{" "}
            <Link
              href="/hajj-savings-calculator"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              renting while saving
            </Link>{" "}
            raises none of these questions.
          </p>
        </>
      }
    >
      <HomeFinanceCalculator />
    </CalculatorPage>
  );
}
