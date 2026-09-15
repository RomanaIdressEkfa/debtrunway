import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import Link from "next/link";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Terms and Disclaimer",
  description:
    "What DebtRunway is and is not: a free planning calculator, not financial advice. The limits of the figures it produces, stated plainly.",
  alternates: alternatesFor("/terms"),
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
          DebtRunway is an educational tool. It applies published rules to the
          facts you type, and it knows nothing else about you. It cannot see a
          disputed or missing heir, an unborn child, property held jointly, a
          debt nobody agrees on, or the school of law your family follows.
          Nothing on this site is a ruling, and nothing here should be used to
          settle an estate or discharge an obligation on its own.
        </p>
        <p className="mt-3 leading-relaxed">
          For anything that matters, speak to a qualified scholar or mufti, and
          where property or the law of your country is involved, to a lawyer as
          well.
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        The figures are estimates
      </h2>
      <p className="mt-3 leading-relaxed">
        The arithmetic here is deliberate and tested, but it is a model. The
        real answer can differ, for reasons the calculator cannot see:
      </p>
      <ul className="mt-3 space-y-2.5 leading-relaxed">
        {[
          "Metal prices. Nisab is a weight of gold or silver, so the threshold moves with the market. The prices here are international rates, not the counter price at your local jeweller.",
          "Scholarly difference. On worn jewellery, on pensions, on long-term debts, scholars genuinely differ. Where they do, the page gives both positions — it does not choose for you.",
          "The lunar year. Zakat falls due when wealth has stayed above nisab for a full lunar year. The calculator shows where you stand today; it does not know when your year turns.",
          "Local rates and costs. Fitrah, qurbani and Hajj costs differ by place. Use a real quote from where you are, not an average.",
          "Incomplete facts. Leave out an heir or a debt and the answer changes, and nothing here can tell that you did.",
        ].map((point) => (
          <li key={point} className="flex gap-3">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed">
        Treat the results as a realistic plan rather than a ruling.
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        No warranty, and the decision is yours
      </h2>
      <p className="mt-3 leading-relaxed">
        This site is provided as is. Considerable care has gone into the
        calculations — they are covered by an automated test suite that checks
        every share adds up to one — but no guarantee is made that the site is free
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
        to a server. The{" "}
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
