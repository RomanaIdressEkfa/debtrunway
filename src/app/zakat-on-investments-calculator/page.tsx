import type { Metadata } from "next";
import CalculatorPage from "@/components/CalculatorPage";
import InvestmentZakatCalculator from "@/components/InvestmentZakatCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/zakat-on-investments-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Do I pay zakat on the full value of my shares?",
    a: "It depends on why you hold them, and this is where the schools of contemporary opinion divide. Shares bought to sell on are stock in trade and are zakatable at full market value, which nobody disputes. Shares bought to hold for dividends are different: the classical reasoning looks through the share to the company, so you owe zakat on your proportion of what the company holds in zakatable form — its cash, receivables and inventory — and not on its factories, its equipment or its goodwill. The cautious alternative is to pay on full market value regardless. Both positions are held by serious scholars, and on a long-held portfolio they can differ by more than threefold.",
  },
  {
    q: "What percentage of a share's value is zakatable?",
    a: "If you can read the company's balance sheet, work it out: current assets divided by market capitalisation, applied to your holding. Where you cannot — which is most people, most of the time — AAOIFI and several contemporary councils accept a proportion of market value as a working estimate, and the figures usually quoted fall between about a quarter and three tenths. This calculator defaults to the more cautious end and lets you change it.",
  },
  {
    q: "Do I pay zakat on my 401(k) or workplace pension?",
    a: "The question is whether you can take possession of it. A pension you may draw on today — a SIPP you control, an IRA past the qualifying age — is wealth in your hands and is generally zakatable. A pot locked until retirement is not, on the majority contemporary view, because zakat attaches to wealth you own and control, and the obligation begins when access does. A more cautious minority position pays yearly on whatever has vested. Both are offered here.",
  },
  {
    q: "Can I deduct the tax and penalty on an early withdrawal?",
    a: "Many contemporary scholars say yes, assessing what you would actually receive rather than the headline balance, on the ground that the tax and the penalty were never yours to take. Others assess the gross figure. The calculator lets you enter the deductions or leave them at zero, depending on which view you follow.",
  },
  {
    q: "Is zakat due on cryptocurrency?",
    a: "Nearly all contemporary councils that have addressed it treat digital assets as wealth held, zakatable at market value on your zakat date at the usual 2.5%. Where the holding is actively traded rather than held, it is stock in trade and the answer is the same. The genuine disagreement about crypto is whether it is permissible to hold at all, which is a separate question from how zakat applies if you do.",
  },
  {
    q: "Does the nisab apply to my portfolio on its own?",
    a: "No. Zakat is owed on your wealth as a whole, and the nisab is measured against all of it together — cash, bank balances, gold, business stock and these investments. A portfolio worth less than the threshold on its own can still be zakatable once your savings are added to it, and a portfolio above the threshold is zakatable whatever else you hold.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Zakat on <em className="accent-text not-italic">investments</em>
        </>
      }
      intro="Shares, funds, pensions and crypto. Every question here is one where scholars genuinely differ, so the calculator applies the position you choose and shows what the other one would have given."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            Why this is the hardest part of zakat
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat on cash is settled. Zakat on gold is settled. Zakat on a share
            portfolio and a pension is not, because neither existed in the form
            we hold them when the rules were laid down, and the reasoning by
            analogy runs in more than one direction.
          </p>
          <p className="mt-3 leading-relaxed">
            This page does not pretend otherwise. It asks which position you
            follow on each of the three questions that actually move the number,
            applies it, and then tells you what the alternative would have
            produced. A page that quietly picked one and reported a single
            figure would be hiding the most important thing about the answer.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Question one: why you hold the shares
          </h2>
          <p className="mt-3 leading-relaxed">
            Shares bought to sell on are inventory. They are valued at what they
            would fetch today, and 2.5% of that is owed. There is no
            disagreement here — a trader&rsquo;s stock has always been
            zakatable at market value, whether it is cloth or equities.
          </p>
          <p className="mt-3 leading-relaxed">
            Shares bought to hold are the difficulty. One view looks through the
            share: owning 0.001% of a company means owning 0.001% of its cash
            and its warehouse stock, and zakat falls on that rather than on your
            slice of its buildings and its brand. The other view declines to
            look through, and assesses the market value you could sell for
            today. The first is closer to the classical reasoning; the second is
            simpler and errs toward giving more.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Question two: whether you can reach the pension
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat attaches to wealth you own <em>and control</em>. A pension pot
            that an employer&rsquo;s rules will not release for thirty years
            fails the second half of that on the majority contemporary view, so
            no zakat is due on it until access begins — and from that year
            onward it is treated like any other wealth.
          </p>
          <p className="mt-3 leading-relaxed">
            The more cautious position pays each year on whatever has vested,
            reasoning that a vested balance is legally yours even if you cannot
            draw it yet. Both are offered above. If you are close to retirement
            the difference is small; if you are thirty, it is not.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Question three: gross or net
          </h2>
          <p className="mt-3 leading-relaxed">
            Where drawing on an account would cost you tax and an early-access
            penalty, many scholars assess the net — what would actually reach
            your hand — on the ground that the rest was never yours to take.
            Others assess the gross balance. Enter the deductions or leave them
            at zero, depending on which you follow.
          </p>
          <p className="mt-3 leading-relaxed">
            One thing is not a matter of opinion: the nisab is measured against
            your wealth as a whole. A portfolio below the threshold on its own
            may still be zakatable once your savings sit beside it, which is why
            this page ends by pointing at the full calculator rather than
            claiming to be one.
          </p>
        </>
      }
    >
      <InvestmentZakatCalculator />
    </CalculatorPage>
  );
}
