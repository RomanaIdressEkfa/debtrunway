import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "DebtRunway is built by Romana Idress Ekfa. How the payoff calculations work, and why the tool is free.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            mainEntity: {
              "@type": "Person",
              name: "Romana Idress Ekfa",
              jobTitle: "Web developer",
              url: "https://debtrunway.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "DebtRunway",
              url: "https://debtrunway.com",
            },
          }),
        }}
      />

      <h1 className="text-4xl font-bold tracking-tight">About DebtRunway</h1>

      <p className="mt-5 leading-relaxed">
        DebtRunway is built and maintained by{" "}
        <strong>Romana Idress Ekfa</strong>, an independent web developer. It
        exists because most debt calculators hand you a single number and stop.
        A payoff date is far more useful when you can see the whole schedule
        behind it.
      </p>

      <h2 className="mt-8 text-xl font-bold">How the numbers work</h2>
      <p className="mt-3 leading-relaxed">
        Each month, every balance is charged one twelfth of its annual rate.
        Your minimum payments are applied first, and whatever is left over goes
        to the target debt — the smallest balance under the snowball method, or
        the highest rate under the avalanche. When a debt clears, its payment
        rolls onto the next one, so your total monthly outlay stays the same
        while the payoff accelerates.
      </p>
      <p className="mt-3 leading-relaxed">
        Lenders often use the average daily balance instead of a flat monthly
        charge, so your statement may differ by a small amount. The overall
        shape of the plan will not.
      </p>

      <h2 className="mt-8 text-xl font-bold">Why it is free</h2>
      <p className="mt-3 leading-relaxed">
        The site is supported by advertising. It does not sell your data — there
        is no data to sell, because every calculation happens in your browser
        and nothing you type ever leaves your device.
      </p>

      <h2 className="mt-8 text-xl font-bold">Not financial advice</h2>
      <p className="mt-3 leading-relaxed">
        These results are estimates to help you plan. They are not financial
        advice, and they cannot account for fees, penalty rates, promotional
        periods, or changes to your circumstances. For decisions with real
        consequences, talk to a qualified adviser.
      </p>

      <h2 className="mt-8 text-xl font-bold">Contact</h2>
      <p className="mt-3 leading-relaxed">
        Questions or corrections:{" "}
        <a className="text-brand underline" href="mailto:hello@debtrunway.com">
          hello@debtrunway.com
        </a>
      </p>
    </div>
  );
}
