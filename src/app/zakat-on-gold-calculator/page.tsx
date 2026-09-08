import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import GoldZakatCalculator from "@/components/GoldZakatCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/zakat-on-gold-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Do I pay zakat on gold jewellery that I wear?",
    a: "The schools differ, and this is one of the best-known differences in the whole of zakat. The Hanafi position is that gold and silver are zakatable whatever they are used for, since they are wealth by their nature. The Maliki, Shafi'i and Hanbali positions exempt jewellery a woman wears lawfully and in normal quantity, on the reasoning that it is something in use rather than wealth being stored. Both positions are held by the great scholars of each school. This calculator applies whichever you choose and shows what the other would have produced.",
  },
  {
    q: "How does carat affect the zakat?",
    a: "Zakat is owed on the gold, not on the metals it is alloyed with. Carat is a measure in twenty-fourths: 24 carat is pure, 22 carat is 22/24 or 91.67% gold, 18 carat is 75%. So a 40-gram bangle at 22 carat holds 36.67 grams of gold, and it is that figure which is valued and weighed against the nisab. Weigh each piece as it is and let the carat take the alloy back out.",
  },
  {
    q: "What is the nisab for gold and silver?",
    a: "87.48 grams of gold, or 612.36 grams of silver. Because silver is far cheaper by weight, the silver threshold is much lower in money, which brings more people into zakat and more wealth to the poor — the reason most contemporary scholars recommend measuring against silver. Whichever you use, the threshold is measured against your wealth as a whole and not against the jewellery on its own.",
  },
  {
    q: "Can I weigh in bhori or tola instead of grams?",
    a: "Yes — the unit picker above the pieces takes grams, bhori or tola, anna and the troy ounce, and every piece is then entered in whichever you chose. Switching converts what you have already typed, so a set of bangles entered as 40 grams becomes 3.429355 bhori rather than turning into 40 bhori. One bhori is 11.664 grams and sixteen anna, so a jeweller's '3 bhori 8 anna' is 3.5 in the field. The nisab in these units is 7.5 bhori of gold or 52.5 bhori of silver, which is where 87.48 and 612.36 grams come from.",
  },
  {
    q: "Do gemstones count?",
    a: "Not on the common position. Diamonds and other stones set into a piece are not zakatable in themselves unless they are held as stock for trade, so what is weighed is the metal. In practice that means having a piece weighed without its stones where they are a significant part of it, or asking the jeweller for the metal weight. Scholars differ on some of the detail here, which is worth asking about if the stones are valuable.",
  },
  {
    q: "What about gold coins and bars?",
    a: "Zakatable on every view, with no exemption, because nobody wears a bullion bar. Investment gold, coins, bars and gold held in an account are wealth stored, which is precisely what zakat falls on. The same goes for jewellery bought as an investment rather than to wear — the exemption in three of the schools is about use, so a piece kept in a safe does not qualify for it.",
  },
  {
    q: "Should I use the price of new gold or what I would get for it?",
    a: "The common position is the resale value of the metal — what you would actually get for it today, rather than the retail price of a new piece, which includes the jeweller's making charge and margin. This calculator asks for the price of a gram of pure metal, which is the market rate, and applies your carat to it. If you sell into a market that pays below the spot rate, use the figure your own dealer would pay.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Zakat on <em className="accent-text not-italic">gold</em> and silver
        </>
      }
      intro="Enter each piece with its weight and carat. The calculator takes out the alloy, applies the position you follow on worn jewellery, and shows what the other position would give."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            Carat is the first thing most calculators get wrong
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat is owed on gold, not on the copper and silver that gold is
            mixed with to make it hard enough to wear. Carat measures that in
            twenty-fourths: 24 carat is pure, 22 carat is 91.67% gold, 21 carat
            is 87.5%, 18 carat is three quarters.
          </p>
          <p className="mt-3 leading-relaxed">
            A jewellery box of 22-carat bangles and 18-carat rings is therefore
            not one weight. A 40-gram bangle at 22 carat holds{" "}
            <strong>36.67 grams</strong> of gold; the same 40 grams at 18 carat
            holds <strong>30</strong>. Enter each piece as it sits on the scale
            and the carat takes the alloy back out — which is why this page asks
            piece by piece rather than for a single total.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The question the schools answer differently
          </h2>
          <p className="mt-3 leading-relaxed">
            Whether a woman owes zakat on the jewellery she actually wears is one
            of the oldest live differences in the subject, and in many
            households it decides most of the answer.
          </p>
          <p className="mt-3 leading-relaxed">
            The <strong>Hanafi</strong> position is that gold and silver are
            wealth by their nature, so what they are used for does not change
            their standing: all of it is zakatable. The{" "}
            <strong>Maliki, Shafi&rsquo;i and Hanbali</strong> positions exempt
            jewellery worn lawfully and in normal quantity, treating it as
            something in use rather than wealth being stored — much as a house
            is not zakatable however valuable it is.
          </p>
          <p className="mt-3 leading-relaxed">
            The exemption is about use, and only about use. Coins, bars,
            investment gold and jewellery kept in a safe are zakatable on every
            view, with no exception. This page marks each piece accordingly and
            tells you what the other position would have produced, because a
            reader deciding between two schools deserves both numbers rather
            than one presented as the answer.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The threshold is measured on everything
          </h2>
          <p className="mt-3 leading-relaxed">
            The nisab — 87.48 grams of gold or 612.36 grams of silver — is not
            measured against the jewellery on its own. It is measured against
            everything zakatable that you hold: the metal, your cash, your bank
            balances, your <Link href="/zakat-on-investments-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">investments</Link>, your <Link href="/zakat-on-business-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">business stock</Link>. A jewellery box
            below the threshold on its own can still be zakatable once your
            savings sit beside it.
          </p>
          <p className="mt-3 leading-relaxed">
            That is why there is a field above for your other wealth, and why
            this page ends by pointing at the full zakat calculator rather than
            claiming to be one. It also does not ask about the lunar year, which
            the full calculator does — zakat falls due once your wealth has
            stood above the nisab for a complete hawl.
          </p>
        </>
      }
    >
      <GoldZakatCalculator />
    </CalculatorPage>
  );
}
