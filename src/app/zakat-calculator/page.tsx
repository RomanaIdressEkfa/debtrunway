import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import ZakatCalculator from "@/components/ZakatCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/zakat-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "What is the nisab?",
    a: "Nisab is the threshold below which no zakat is due. It is set as a weight of precious metal rather than a sum of money: 87.48 grams of gold, or 612.36 grams of silver. Because it is a weight, its value in your currency moves with the market, which is why this page asks you for today's price per gram rather than storing a figure that would be wrong within a week.",
  },
  {
    q: "Should I use the gold nisab or the silver one?",
    a: "The silver threshold is much lower, so more people owe zakat and more reaches the poor. Most contemporary scholars recommend it for exactly that reason. Others hold that gold better represents what the original threshold was worth in the Prophet's time. Both positions are held by serious scholars; if you are unsure, the silver standard is the more cautious choice because it errs towards giving.",
  },
  {
    q: "What is the hawl?",
    a: "The hawl is the lunar year your wealth must sit above the nisab before zakat falls due. The date it first crossed the threshold becomes your zakat anniversary, and you calculate on that same date every year after. Dipping below the nisab briefly during the year does not reset it on the majority view, though a drop below the threshold on the anniversary itself means nothing is owed that year.",
  },
  {
    q: "Which of my possessions are exempt?",
    a: "Zakat falls on wealth that grows, not on what you use. Your home, your car, your clothes, your furniture and the tools of your trade are all exempt however valuable they are. What counts is cash, money in the bank, gold and silver, investments you can access, stock held for resale, and money lent out that you expect back.",
  },
  {
    q: "Do I pay zakat on gold jewellery I wear?",
    a: "The schools differ genuinely here. The Hanafi position is that zakat is due on gold and silver jewellery regardless of use. The Maliki, Shafi'i and Hanbali positions generally exempt jewellery in regular, lawful use for a woman. This calculator counts whatever weight you enter, so enter what your own position requires and ask a scholar if you are unsure which applies to you.",
  },
  {
    q: "My gold is weighed in ভরি (bhori), not grams. What do I enter?",
    a: "Enter it in ভরি. The weight fields carry a unit picker with grams, ভরি or tola, আনা and the troy ounce, and switching it converts what you have already typed rather than reinterpreting the digits. One ভরি is 11.664 grams, which is why the nisab figures are what they are: 87.48 grams is exactly 7.5 ভরি of gold, and 612.36 grams is exactly 52.5 ভরি of silver. Those are the numbers South Asia has recorded for centuries, and the gram figures are simply the same thresholds converted.",
  },
  {
    q: "How do I enter cash, a bank balance, gold and silver all together?",
    a: "Each has its own field, and they are added for you. Cash in hand and your bank balance go in as money, in whichever currency you picked at the top. Gold and silver go in by weight rather than by value, so you do not have to price them yourself — enter the grams or ভরি and the calculator applies the price you set in step one. Add investments, business stock and money owed to you in their own fields, then deduct what you owe now, and the total is what the 2.5% is taken from.",
  },
  {
    q: "Which debts can I deduct?",
    a: "Debts that are due now — this month's bills, rent, an instalment falling due. You do not deduct the entire outstanding balance of a long mortgage or a multi-year loan, because that would wipe out the zakat of almost everyone who owns a home while their wealth sits untouched. The common position is to deduct only what is payable in the immediate term.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          <em className="accent-text not-italic">Zakat</em> calculator
        </>
      }
      intro="Enter today's gold or silver price to set your nisab, add up what you hold, and see the 2.5% due — with every figure that went into it shown."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            How zakat is worked out
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat is not a donation and it is not charity. It is the third
            pillar, a fixed and calculable debt owed by the wealth itself, and
            the Qur&rsquo;an names its recipients directly in 9:60. What a
            calculator has to establish is only this: does your wealth reach the
            threshold, and has it stayed there for a year.
          </p>
          <p className="mt-3 leading-relaxed">
            The threshold, the <strong>nisab</strong>, is a weight rather than a
            price — 87.48 grams of gold or 612.36 grams of silver. That is why
            no honest calculator can hardcode a number. Enter the price of a
            gram today in whatever currency you count in, and the threshold
            follows from it.
          </p>
          <p className="mt-3 leading-relaxed">
            Against that threshold you set everything you hold that grows: cash,
            bank balances,{" "}
            <Link href="/zakat-on-gold-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">gold and silver by weight</Link>,{" "}
            <Link href="/zakat-on-investments-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">shares and accessible pensions</Link>,{" "}
            <Link href="/zakat-on-business-calculator" className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand">stock held for resale</Link>, and
            money lent out that you expect to be repaid. What you use is left out entirely — your home, your
            car, your furniture, the tools you work with. Subtract the debts
            falling due now, and if what remains reaches the nisab, a fortieth
            of it is owed.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The year, which no form can check
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat becomes due only after your wealth has stood above the nisab
            for a full lunar year, the <strong>hawl</strong>. The day it first
            crossed the line is your zakat anniversary, and every year after you
            calculate on that same date. This is the one condition no
            calculator can verify, which is why this page asks you rather than
            assuming.
          </p>
          <p className="mt-3 leading-relaxed">
            A lunar year is about eleven days shorter than a solar one, so a
            zakat date fixed to a Gregorian calendar will drift out of place. If
            you find it easier to calculate in Ramadan every year, that is a
            common and sound practice — the date simply has to be consistent.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Where the scholars differ
          </h2>
          <p className="mt-3 leading-relaxed">
            Three questions come up in almost every real calculation, and on
            each of them serious scholars hold different positions. Whether
            gold jewellery in regular use is zakatable — the Hanafis say yes,
            the other three schools generally say no. Whether a pension you
            cannot yet draw counts as wealth you hold. Whether a loan you may
            never recover should be counted at all.
          </p>
          <p className="mt-3 leading-relaxed">
            This page will not pretend those questions are settled. It counts
            what you enter, shows you every line that went into the total, and
            leaves the judgement where it belongs. If one of those three applies
            to you, ask someone qualified before you give.
          </p>
        </>
      }
    >
      <ZakatCalculator />
    </CalculatorPage>
  );
}
