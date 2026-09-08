import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import ENumberChecker from "@/components/ENumberChecker";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/halal-e-numbers-checker")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Is E471 halal?",
    a: "The number cannot tell you. E471 is mono- and diglycerides of fatty acids, and those fatty acids are taken from whatever fat the manufacturer bought — usually palm or soya oil, sometimes beef tallow. The E number is identical in both cases, so a list that answers yes or no for E471 is guessing. In Europe most E471 is plant-derived, but most is not all, and the only way to know for a particular product is to ask the manufacturer, who is obliged to tell you.",
  },
  {
    q: "Which E numbers are definitely from pork?",
    a: "None, by number alone. No E number means pork; several can be derived from pig fat among other sources, which is a different claim. The widely forwarded list naming E100 to E900 as pig derivatives is a hoax that has circulated since the 1980s — it was traced to a fabricated notice attributed to a French hospital, and it condemns numbers that are pure minerals. The additives worth actually checking are the emulsifiers, the gelling agents and the enzymes.",
  },
  {
    q: "Is E120 halal?",
    a: "E120 is cochineal, made from the crushed bodies of a scale insect. This is a genuine scholarly disagreement rather than an unclear source: the Hanafi position generally holds insects impermissible to consume, while the Maliki position and several contemporary councils permit cochineal on the grounds that insects without flowing blood are not covered by the prohibition. It is not a case where more information about the product changes the answer — you follow the position you follow.",
  },
  {
    q: "Is E621, monosodium glutamate, haram?",
    a: "MSG appears on almost every forwarded haram list and it does not belong there. Commercial MSG is made by bacterial fermentation of molasses or starch, in the same way as vinegar or yoghurt, and the substance itself is a salt of an ordinary amino acid. There is no animal step. The concerns raised about MSG in the West are about headaches rather than about lawfulness, and even those have not held up well in trials.",
  },
  {
    q: "Does an alcohol-based additive make a food haram?",
    a: "It depends on which position you follow and on what the alcohol is doing. Ethanol used as a carrier for a flavouring is present in traces and largely evaporates in processing, and a wide body of contemporary scholarship treats that as permissible on the grounds that it neither intoxicates nor remains. The stricter position avoids it altogether. What is agreed is that a drink which intoxicates in quantity is forbidden in any quantity; the disagreement is about a residue in a solid food.",
  },
  {
    q: "How do I actually find out what is in a product?",
    a: "Ask the manufacturer, in writing. In Britain, the European Union and North America they are obliged to answer questions about ingredient sources, and most large firms have a standard reply naming the origin of every additive. The second route is certification: a recognised halal certifier has already asked, and their mark on the packet is worth more than any list. This page exists to tell you which numbers are worth a letter and which are settled without one.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Halal <em className="accent-text not-italic">E numbers</em> checker
        </>
      }
      intro="What an E number can and cannot tell you about whether a food is lawful — including the many on the forwarded lists that are simply minerals."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            Why the forwarded list cannot be right
          </h2>
          <p className="mt-3 leading-relaxed">
            A list of &ldquo;haram E numbers&rdquo; has been passing between
            phones for thirty years. It is wrong, and it is wrong in both
            directions at once, which is the part that does the damage.
          </p>
          <p className="mt-3 leading-relaxed">
            It condemns additives that are minerals dug out of the ground or
            made by fermenting sugar &mdash; citric acid, monosodium glutamate,
            most of the colours. And it clears additives that genuinely can be
            animal-derived, because whoever compiled it was working from rumour
            rather than from chemistry.
          </p>
          <p className="mt-3 leading-relaxed">
            The reason no such list can work is structural. An E number names a{" "}
            <em>substance</em>, not a <em>source</em>. E471 is mono- and
            diglycerides of fatty acids; the fatty acids can come from palm oil
            or from beef tallow, and the number on the packet is the same
            either way.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            What this page does instead
          </h2>
          <p className="mt-3 leading-relaxed">
            It sorts additives by what can honestly be known from the number
            alone. Some are settled: calcium carbonate is a rock, and no amount
            of information about the factory will change that. Some depend
            entirely on the source, and for those the honest answer is that the
            number tells you nothing and the manufacturer tells you everything.
          </p>
          <p className="mt-3 leading-relaxed">
            A few are animal-derived by definition, where the question becomes
            the slaughter rather than the ingredient. Two categories are
            matters of genuine scholarly disagreement rather than missing
            information: insect-derived colours, and additives carried in
            ethanol.
          </p>
          <p className="mt-3 leading-relaxed">
            A tool that returned a confident halal or haram for E471 would be
            more satisfying to use and less true. Where the answer is
            &ldquo;ask&rdquo;, this page says ask.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The letter that settles it
          </h2>
          <p className="mt-3 leading-relaxed">
            Manufacturers in Britain, the European Union and North America are
            obliged to answer questions about where an ingredient came from,
            and the large ones have a standard reply prepared. One email names
            the source of every additive in the product, and it does not expire
            until the recipe changes.
          </p>
          <p className="mt-3 leading-relaxed">
            The other route is a recognised certifier, who has already asked
            the same question and put a mark on the packet. Between the two,
            almost nothing needs to stay uncertain.
          </p>
          <p className="mt-3 leading-relaxed">
            The same instinct applies to money. If you are checking labels, it
            is worth checking what your{" "}
            <Link
              href="/answers/how-to-know-if-a-share-is-halal"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              investments are actually in
            </Link>{" "}
            and whether the{" "}
            <Link
              href="/answers/is-conventional-insurance-haram"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              policies you hold
            </Link>{" "}
            stand up to the same scrutiny.
          </p>
        </>
      }
    >
      <ENumberChecker />
    </CalculatorPage>
  );
}
