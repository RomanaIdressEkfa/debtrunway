import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import WillCalculator from "@/components/WillCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/islamic-will-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "How much of my estate can I leave by will?",
    a: "Up to one third of what remains after your funeral costs and your debts have been paid. The limit comes from the hadith of Sa'd ibn Abi Waqqas, who asked whether he could will away two thirds and then a half, and was told a third — with the Prophet adding that a third is a lot, and that leaving your heirs provided for is better than leaving them to beg. The other two thirds pass by faraid and are not yours to direct.",
  },
  {
    q: "Can I leave something to my son or my wife in the will?",
    a: "Not on your own authority. The hadith is explicit: Allah has given each entitled person their due, so there is no bequest for an heir. An heir already holds a fixed share, and a bequest on top of it would let a testator quietly rewrite shares that were deliberately taken out of their hands. Such a bequest is not simply ignored — it takes effect if the other heirs agree to it after your death, and not otherwise.",
  },
  {
    q: "Do I have to use the whole third?",
    a: "No, and there is a case for not doing so. The third is a ceiling rather than a target, and the same hadith that permits it calls a third a lot. Leaving it with your heirs is the default the law prefers. It is most often used for a charity, a mosque, a relative who inherits nothing under faraid, or a non-Muslim family member who would otherwise receive nothing at all.",
  },
  {
    q: "What counts as a debt rather than a bequest?",
    a: "Anything you owe. Ordinary debts to people, but also unpaid zakat from previous years, an unpaid mahr, and expiation owed for missed obligations. These are paid in full before any bequest and before any heir inherits, and they are not capped at a third — a debt is an obligation on the estate, not a gift from it.",
  },
  {
    q: "Will a shariah will be recognised where I live?",
    a: "Only if it also satisfies the formalities of your own jurisdiction. In England and Wales, in most US states, and across most of Europe, a document that follows the shariah perfectly but is not signed and witnessed the way local law requires is simply ignored by the probate court, and the estate is then distributed under the default statutory rules instead. The usual answer is a single will, drafted by a solicitor or estate attorney, that expresses Islamic distribution in a form the local court will enforce.",
  },
  {
    q: "What happens to the rest of the estate?",
    a: "It passes by faraid — the fixed shares of Islamic inheritance. Which relatives take and how much depends entirely on who survives you: a surviving son changes almost every other share, and a nearer heir excludes a more distant one. The inheritance calculator on this site works that out for a given set of survivors.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Islamic <em className="accent-text not-italic">will</em> calculator
        </>
      }
      intro="See exactly how much of your estate you may direct by will, what each bequest is worth once the rules are applied, and what has to pass by fixed shares instead."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            Two rules do almost all the work
          </h2>
          <p className="mt-3 leading-relaxed">
            A Muslim&rsquo;s will is a narrower instrument than the one most
            legal systems imagine. It cannot decide who gets what across the
            whole estate, because most of that is already decided. What it can
            do is direct a bounded portion — and the boundary is set by two
            rules that between them settle nearly every question people arrive
            with.
          </p>
          <p className="mt-3 leading-relaxed">
            The first is <strong>the third</strong>. Sa&rsquo;d ibn Abi Waqqas,
            gravely ill, asked the Prophet whether he could give away two thirds
            of his wealth. No. A half? No. A third — &ldquo;and a third is a
            lot.&rdquo; The reason given was that leaving your heirs provided
            for is better than leaving them dependent on other people. That is
            the ceiling, measured on what survives your funeral costs and your
            debts, and it is a ceiling rather than a target.
          </p>
          <p className="mt-3 leading-relaxed">
            The second is <strong>no bequest to an heir</strong>. Allah has
            already given each entitled person their due, so a bequest cannot be
            used to top up a son, a wife or a parent. A bequest of that kind is
            not ignored outright: it takes effect if the other heirs agree to it
            after death. Without their agreement it fails, however small it is.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Debts are not bequests
          </h2>
          <p className="mt-3 leading-relaxed">
            The order is fixed: burial, then debts in full, then the bequest up
            to a third, then the heirs. What people most often miss is how wide
            the second step is. It covers ordinary debts, but also{" "}
            <strong>unpaid zakat</strong> from earlier years, an{" "}
            <strong>unpaid mahr</strong>, and expiation owed for obligations
            missed. These are debts owed by the estate, not gifts from it, and
            they are not limited to a third.
          </p>
          <p className="mt-3 leading-relaxed">
            An estate whose debts exceed its value therefore has nothing to
            will and nothing to inherit. The calculator says so plainly rather
            than producing a third of a negative number.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            What the third is actually for
          </h2>
          <p className="mt-3 leading-relaxed">
            Because it cannot go to an heir, the third exists for everyone
            faraid leaves out. A mosque or a school. A charity. An adopted
            child, who does not inherit as a natural child does. A non-Muslim
            parent or spouse, who would otherwise take nothing. A relative in
            need who is too distant to be an heir. A debt of gratitude with no
            legal name.
          </p>
          <p className="mt-3 leading-relaxed">
            It is also where a continuing charity — a sadaqah jariyah — is
            usually placed, since it is the one part of the estate a person
            still chooses.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            A plan is not a will
          </h2>
          <p className="mt-3 leading-relaxed">
            This page works out the shape. It does not produce a document a
            court will act on, and the gap between the two is where most Muslim
            estates in the West go wrong. In England and Wales, in most US
            states and across most of Europe, a will that satisfies the shariah
            but not the local formalities of signing and witnessing is simply
            disregarded, and the estate is distributed under default statutory
            rules that bear no relation to faraid at all.
          </p>
          <p className="mt-3 leading-relaxed">
            The usual answer is one properly executed will, drawn by a solicitor
            or estate attorney, that expresses Islamic distribution in a form
            the local court will enforce. Plan the shape here; have it drafted
            there; have it checked by someone qualified in both.
          </p>
        </>
      }
    >
      <WillCalculator />
    </CalculatorPage>
  );
}
