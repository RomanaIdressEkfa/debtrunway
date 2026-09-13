import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import FaraidCalculator from "@/components/FaraidCalculator";
import { bySlug } from "@/lib/calculators";
import { alternatesFor } from "@/lib/i18n";

const meta = bySlug("/islamic-inheritance-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: alternatesFor(meta.slug),
};

const faqs = [
  {
    q: "What is faraid?",
    a: "Faraid is the Islamic law of inheritance. Unlike a will, which lets a person choose who receives what, faraid fixes most of the shares in advance: the Qur'an names them in Surah an-Nisa 4:11, 4:12 and 4:176, and the Sunnah and the consensus of the scholars settle the rest. A Muslim may direct up to a third of the estate by bequest, and the remaining two thirds at least must follow these fixed shares.",
  },
  {
    q: "What has to be paid before the heirs receive anything?",
    a: "Three things, in order. First the cost of washing, shrouding and burial. Then every outstanding debt, in full — a debt is a claim against the estate, not against the heirs, and it is settled before anyone inherits. Then any valid bequest, up to a maximum of one third of what remains. Whatever survives all three is what the fixed shares divide.",
  },
  {
    q: "Why does a son receive twice a daughter's share?",
    a: "The ratio is stated in 4:11. It sits inside a wider structure of duties rather than standing alone: under the same law a man must maintain his wife, his children and often his parents and sisters out of his own wealth, while a woman's property, including her inheritance and her mahr, remains entirely hers and she is under no obligation to spend it on anyone. The share and the duty are set together. Note also that a daughter is not always given half of a son's portion in every case — where no son survives, daughters take a fixed half or two thirds outright.",
  },
  {
    q: "What does it mean when an heir is blocked?",
    a: "Blocking, or hajb, is the rule that a nearer relative can exclude a more distant one. A son excludes the deceased's brothers and sisters entirely. A mother excludes the grandmothers. A father excludes the grandfather and his own mother. Being blocked is not a judgement on anyone — it is how the law prevents an estate from fragmenting across a whole extended family while nearer dependants go without.",
  },
  {
    q: "What are awl and radd?",
    a: "They are the two corrections applied when the fixed shares do not come to exactly one. Under awl the named fractions add up to more than the whole estate — a husband, two daughters and both parents ask for five quarters between them — so every share is reduced in the same proportion and nobody is singled out to bear the shortfall. Under radd the shares fall short and no residuary heir survives to take the rest, so the surplus returns to the sharers in proportion to what each already holds. A surviving spouse takes no part in that return, on the majority view.",
  },
  {
    q: "Can I rely on this calculator to divide a real estate?",
    a: "No. Use it to understand the shares and to check your expectations, then take the result to a qualified scholar or an Islamic legal authority before anything is distributed. A real estate turns on facts a form cannot capture: a disputed or missing heir, an unborn child, an heir who died in the same event, property held jointly, a debt that is contested, or a question on which the schools of law differ.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Islamic <em className="accent-text not-italic">inheritance</em>{" "}
          calculator
        </>
      }
      intro="Enter what was left and who survived. You will see each heir's exact fraction, the amount it comes to, and the rule in the Qur'an or the Sunnah that produces it."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            How the shares are worked out
          </h2>
          <p className="mt-3 leading-relaxed">
            Islamic inheritance runs in a fixed order, and the order is the
            whole of it. What the deceased owned is gathered, the funeral is
            paid for, the debts are settled in full, and any bequest is honoured
            up to a third — the{" "}
            <Link
              href="/islamic-will-calculator"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              Islamic will calculator
            </Link>{" "}
            works through what that third may and may not be used for. Only then
            is there an estate to divide.
          </p>
          <p className="mt-3 leading-relaxed">
            What remains goes first to the heirs who hold a{" "}
            <strong>fixed share</strong> — the ashab al-furud. A husband takes a
            half, or a quarter if his wife left children. A wife takes a
            quarter, or an eighth if there are children, and co-wives divide
            that one portion between them. A mother takes a third, falling to a
            sixth if her child left children of their own or if two or more
            siblings survive. These fractions are named in the Qur&rsquo;an and are
            not open to negotiation.
          </p>
          <p className="mt-3 leading-relaxed">
            Whatever the fixed shares leave passes to the{" "}
            <strong>residuary heirs</strong>, the asaba — the sons first, then
            the son&rsquo;s sons, then the father, then the brothers. It is here that
            the two-to-one ratio between a son and a daughter applies, and it is
            here that most estates are actually settled, because the fixed
            shares rarely consume everything.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Blocking: why a named relative sometimes receives nothing
          </h2>
          <p className="mt-3 leading-relaxed">
            The hardest part of faraid for most people is hajb, the rule that a
            nearer heir shuts out a more distant one. A surviving son excludes
            the deceased&rsquo;s brothers and sisters completely, however close
            they were. A mother excludes both grandmothers. A father excludes
            the grandfather, and also excludes his own mother. Two daughters
            take the entire two thirds set aside for daughters, which leaves a
            son&rsquo;s daughters with nothing unless a son&rsquo;s son survives
            to bring them back in beside him.
          </p>
          <p className="mt-3 leading-relaxed">
            The calculator lists everyone it has excluded and names the relative
            who excluded them, because an unexplained zero in a family
            settlement causes more harm than the arithmetic ever does.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            When the fractions do not add up
          </h2>
          <p className="mt-3 leading-relaxed">
            Fixed shares are not guaranteed to total one. A husband, two
            daughters, a father and a mother between them claim a quarter, two
            thirds and two sixths — five quarters of an estate that only has
            four. The classical answer is <strong>awl</strong>: raise the
            denominator so every share shrinks by the same proportion. Twelve
            becomes fifteen, and each heir receives a little less than the
            fraction named, with the ratios between them untouched.
          </p>
          <p className="mt-3 leading-relaxed">
            The opposite case is <strong>radd</strong>. A single daughter takes
            a half; if nobody else survives, the other half has nowhere to go,
            since there is no residuary heir waiting. The surplus returns to the
            sharers in proportion, so she takes the whole estate. A surviving
            spouse is excluded from that return on the majority view, which is
            why a wife with one daughter keeps exactly her eighth while the
            daughter takes the remaining seven eighths.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The question everyone asks first
          </h2>
          <p className="mt-3 leading-relaxed">
            Why a daughter takes half of what a son takes. It is worth knowing
            before you read a result, because the rule is narrower than it is
            usually stated: it governs sons and daughters inheriting together,
            and across the rest of the scheme a woman frequently takes the same
            as the man in her position or more. A mother and a father each take
            a sixth. Uterine siblings share equally by the plain text.
          </p>
          <p className="mt-3 leading-relaxed">
            The reasoning where it does apply, and the two doors the scheme
            deliberately leaves open for a parent who wants to provide
            differently, are set out at length in{" "}
            <Link
              href="/answers/why-does-a-daughter-inherit-half"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              why a daughter inherits half
            </Link>
            . If the family you are working out includes an adopted or a
            step-child, the shares will not reach them — which is what{" "}
            <Link
              href="/answers/do-adopted-children-inherit"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              the bequest exists for
            </Link>
            .
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            A calculator, not a ruling
          </h2>
          <p className="mt-3 leading-relaxed">
            This page applies the majority Sunni position and is checked against
            the worked examples in the standard texts, including the classical
            awl cases of twelve to fifteen, six to eight and twenty-four to
            twenty-seven, and the two Umariyyatan rulings on a spouse with both
            parents. That makes it a reliable way to learn the system and to
            sense-check what you have been told.
          </p>
          <p className="mt-3 leading-relaxed">
            It does not make it a ruling. Estates carry facts no form can hold —
            a missing heir, an unborn child, a contested debt, property held in
            common, relatives who died in the same accident, or a question on
            which the schools of law genuinely differ. Take the result to a
            scholar. The arithmetic is the easy part; the facts are not.
          </p>
        </>
      }
    >
      <FaraidCalculator />
    </CalculatorPage>
  );
}
