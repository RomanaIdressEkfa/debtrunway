import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About — Who Builds These Calculators",
  description:
    "DebtRunway is built by Romana Idress Ekfa. How the inheritance and zakat calculations work, and why the tools are free.",
  alternates: alternatesFor("/about"),
};

export default function About() {
  return (
    <ContentPage
      heading="About DebtRunway"
      intro="Built by one developer, because the Islamic finance calculators already out there hand you a number and never show the rule behind it."
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            mainEntity: {
              "@type": "Person",
              name: "Romana Idress Ekfa",
              jobTitle: ["Software engineer", "Full-stack web developer"],
              url: "https://debtrunway.com/about",
              // sameAs is how you tell Google that the author of this site and
              // the person behind that profile are the same human. On a money
              // topic, that corroboration is worth more than any wording.
              sameAs: ["https://www.linkedin.com/in/romanaidressekfa/"],
            },
            publisher: {
              "@type": "Organization",
              name: "DebtRunway",
              url: "https://debtrunway.com",
            },
          }),
        }}
      />


      <p className="mt-5 leading-relaxed">
        DebtRunway is built and maintained by{" "}
        <a
          href="https://www.linkedin.com/in/romanaidressekfa/"
          target="_blank"
          rel="noopener noreferrer author"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
        >
          Romana Idress Ekfa
        </a>
        , an independent full-stack web developer and software engineer. It
        exists because the Islamic finance calculators already out there hand
        you a number and stop. A share of an estate means very little until you
        can see which ruling produced it, and who it excluded.
      </p>

      <h2 className="mt-8 text-xl font-bold">How the numbers work</h2>
      <p className="mt-3 leading-relaxed">
        The inheritance calculator applies the majority Sunni rules: the fixed
        shares named in Surah an-Nisa, the residuary heirs who take what is
        left, the blocking that removes an heir when a nearer one stands in the
        way, and the awl and radd corrections for when the fractions do not
        total one. Shares are held as exact fractions rather than decimals, so
        a sixth plus a sixth plus two thirds is one and not 0.9999.
      </p>
      <p className="mt-3 leading-relaxed">
        It is checked against worked examples with settled answers in the
        classical texts — the awl cases of twelve to fifteen, six to eight and
        twenty-four to twenty-seven, both Umariyyatan rulings, and every
        blocking rule. Those checks run as a script in the repository, not as a
        claim on a page.
      </p>
      <p className="mt-3 leading-relaxed">
        The zakat calculator derives the nisab from a metal price you supply,
        rather than storing a figure that would be wrong within a week, and
        applies the rate of a fortieth to what remains after debts due now.
      </p>

      <h2 className="mt-8 text-xl font-bold">Why it is free</h2>
      <p className="mt-3 leading-relaxed">
        The site is supported by advertising. It does not sell your data — there
        is no data to sell, because every calculation happens in your browser
        and nothing you type ever leaves your device.
      </p>

      <h2 className="mt-8 text-xl font-bold">Not a fatwa</h2>
      <p className="mt-3 leading-relaxed">
        These calculators apply rules to the facts you type. They are not a
        fatwa and not financial advice, and they cannot see a disputed heir, an
        unborn child, a pension you cannot yet draw, or a question your own
        school of law answers differently. Take anything that matters to a
        qualified scholar before acting on it.
      </p>

      <h2 className="mt-8 text-xl font-bold">Contact</h2>
      <p className="mt-3 leading-relaxed">
        Questions or corrections:{" "}
        <a className="text-brand underline" href="mailto:hello@debtrunway.com">
          hello@debtrunway.com
        </a>
      </p>
    </ContentPage>
  );
}
