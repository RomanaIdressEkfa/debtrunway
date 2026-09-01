import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Disclaimer",
  description:
    "What DebtRunway is and is not: a free planning calculator, not financial advice. The limits of the figures it produces, stated plainly.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <ContentPage
      heading="Terms and disclaimer"
      intro="The short version: this is a free calculator for planning. It is not financial advice, and the figures are estimates."
    >
      {/* The single most important paragraph on the page, so it is not left to
          compete with the rest of the text. */}
      <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-accent">
          This is not financial advice
        </h2>
        <p className="mt-2 leading-relaxed">
          DebtRunway is an educational tool. It does not know your income, your
          job security, your savings, your credit file, or anything else about
          your circumstances, and it cannot weigh them. Nothing on this site is
          a recommendation to take, avoid, refinance, consolidate, or pay off
          any particular debt.
        </p>
        <p className="mt-3 leading-relaxed">
          For decisions that matter, speak to a qualified financial adviser, a
          licensed credit counsellor, or your lender.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        The figures are estimates
      </h2>
      <p className="mt-3 leading-relaxed">
        The arithmetic here is deliberate and tested, but it is a model. Each
        month a balance is charged one twelfth of its annual rate, then the
        payment is applied. Your lender may not work that way.
      </p>
      <p className="mt-3 leading-relaxed">Real statements differ because of:</p>
      <ul className="mt-3 space-y-2.5 leading-relaxed">
        {[
          "Average daily balance. Most card issuers charge interest on the average balance across the billing cycle, not the balance on one day.",
          "Fees. Late fees, annual fees, over-limit fees, cash advance fees and foreign transaction charges are not modelled.",
          "Rate changes. Variable rates move. A promotional 0% period ends. A missed payment can trigger a penalty rate, sometimes near 30%.",
          "New spending. The calculator assumes you stop adding to the balance. Most people do not.",
          "Payment timing. Paying on the due date and paying two weeks early produce different interest.",
        ].map((point) => (
          <li key={point} className="flex gap-3">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed">
        Treat the results as a realistic plan, not a prediction. Your own
        statement is always the authority.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        No warranty, and the decision is yours
      </h2>
      <p className="mt-3 leading-relaxed">
        This site is provided as is. Considerable care has gone into the
        calculations — they are covered by an automated test suite that checks
        every schedule adds up — but no guarantee is made that the site is free
        of errors, always available, or suitable for your situation.
      </p>
      <p className="mt-3 leading-relaxed">
        To the fullest extent the law allows, DebtRunway and its owner accept no
        liability for any loss arising from your use of this site or reliance on
        its figures. Any financial decision you make is your own.
      </p>
      <p className="mt-3 leading-relaxed">
        If you believe a calculation is wrong, please{" "}
        <Link href="/contact" className="font-medium text-brand underline">
          tell us
        </Link>
        . Corrections are welcome and taken seriously.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        We do not sell anything
      </h2>
      <p className="mt-3 leading-relaxed">
        DebtRunway is not a lender, broker, debt settlement company, or credit
        counselling service. We do not arrange loans, receive commission on any
        product, and have no interest in which choice you make. The site is
        supported by advertising.
      </p>
      <p className="mt-3 leading-relaxed">
        Advertisements and any external links are not endorsements. We do not
        control what advertisers offer, and we are not responsible for the
        content, terms, or conduct of any site you reach from here.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        Using the site
      </h2>
      <p className="mt-3 leading-relaxed">
        You are welcome to use these calculators for your own planning, and to
        share links to them. Please do not copy the site&rsquo;s content or code
        to republish elsewhere, and do not attempt to disrupt the service for
        other people.
      </p>
      <p className="mt-3 leading-relaxed">
        The calculators, wording, and design are the work of the site&rsquo;s
        owner and remain their property.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        Your figures stay with you
      </h2>
      <p className="mt-3 leading-relaxed">
        Every calculation runs in your browser, and what you type is never sent
        to a server. Your plan is saved on your own device so it is waiting next
        time. The{" "}
        <Link href="/privacy" className="font-medium text-brand underline">
          privacy page
        </Link>{" "}
        explains this in full.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">Changes</h2>
      <p className="mt-3 leading-relaxed">
        These terms may be updated as the site changes. The version published
        here is the one that applies.
      </p>

      <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
        Questions about any of this?{" "}
        <Link href="/contact" className="font-medium text-brand underline">
          Get in touch
        </Link>
        .
      </p>
    </ContentPage>
  );
}
