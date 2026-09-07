import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with DebtRunway — corrections to a calculation, questions about the site, or anything else.",
  alternates: { canonical: "/contact" },
};

const EMAIL = "hello@debtrunway.com";

const reasons = [
  {
    title: "A calculation looks wrong",
    body: "This is the message we most want to receive. Tell us the page, the numbers you entered, and what you expected — every report is checked against the engine's test suite.",
  },
  {
    title: "Something is broken or hard to use",
    body: "A layout that breaks on your phone, a button that does nothing, wording that confuses. Small reports lead to the best fixes.",
  },
  {
    title: "A calculator you wish existed",
    body: "If you came looking for something this site does not do yet, that is worth knowing.",
  },
  {
    title: "Using these tools with others",
    body: "Financial counsellors, teachers and community organisations are welcome to use and link to these calculators. Just ask.",
  },
];

export default function Contact() {
  return (
    <ContentPage
      heading="Contact"
      intro="DebtRunway is run by one person. Messages reach a real inbox and get a real reply."
    >
      {/* No contact form: a form needs a server, and this site deliberately
          has none. A plain address is also easier to trust. */}
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 card-shadow sm:p-8">
        <p className="text-xs font-semibold tracking-widest text-muted uppercase">
          Email
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-2 block text-2xl font-bold break-all text-brand underline decoration-brand/30 underline-offset-4 transition hover:decoration-brand sm:text-3xl"
        >
          {EMAIL}
        </a>
        <p className="mt-4 leading-relaxed text-muted">
          Written by{" "}
          <a
            href="https://www.linkedin.com/in/romanaidressekfa/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline decoration-line underline-offset-2 transition hover:text-brand hover:decoration-brand"
          >
            Romana Idress Ekfa
          </a>
          , an independent full-stack web developer. Expect a reply within a few
          days — this is not a company with a support desk, and honesty about
          that seems better than promising an hour.
        </p>

        <a
          href="https://www.linkedin.com/in/romanaidressekfa/"
          target="_blank"
          rel="noopener noreferrer"
          className="press mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 21V9.5h5.16V21H2.4Zm7.9 0V9.5h4.95v1.57h.07c.69-1.24 2.37-2.05 4.06-2.05 4.34 0 5.14 2.65 5.14 6.1V21h-5.16v-4.98c0-1.19-.02-2.72-1.7-2.72-1.71 0-1.97 1.29-1.97 2.63V21H10.3Z" />
          </svg>
          Connect on LinkedIn
        </a>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        Worth writing about
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="rounded-xl border border-line bg-surface p-4 sm:p-5"
          >
            <dt className="font-semibold">{r.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted">{r.body}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        What we cannot help with
      </h2>
      <p className="mt-3 leading-relaxed">
        We cannot give you financial advice, negotiate with a lender for you, or
        tell you what to do about a specific debt. DebtRunway is not a lender,
        broker, or credit counselling service — the{" "}
        <Link href="/terms" className="font-medium text-brand underline">
          terms and disclaimer
        </Link>{" "}
        set out why.
      </p>
      <p className="mt-3 leading-relaxed">
        If you need a ruling rather than a calculation, your local imam or a
        recognised fatwa service is the right place to start, and where
        property or probate is involved, a lawyer in your country.
      </p>

      <div className="mt-12 rounded-2xl border border-brand/25 bg-brand-soft px-5 py-4">
        <p className="leading-relaxed text-brand">
          <strong>Nothing you type into the calculators is ever sent to us.</strong>{" "}
          It stays in your browser. If you want us to look at your numbers, you
          will have to include them in your email yourself.
        </p>
      </div>
    </ContentPage>
  );
}
