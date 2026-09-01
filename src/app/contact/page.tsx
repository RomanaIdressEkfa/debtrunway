import type { Metadata } from "next";
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact</h1>
      <p className="mt-4 text-lg text-muted">
        DebtRunway is run by one person. Messages reach a real inbox and get a
        real reply.
      </p>

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
          Written by <strong className="text-foreground">Romana Idress Ekfa</strong>,
          an independent web developer. Expect a reply within a few days — this
          is not a company with a support desk, and honesty about that seems
          better than promising an hour.
        </p>
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
        If you need real help with debt, a licensed credit counsellor in your
        country is the right place to start. Many offer free consultations.
      </p>

      <div className="mt-12 rounded-2xl border border-brand/25 bg-brand-soft px-5 py-4">
        <p className="leading-relaxed text-brand">
          <strong>Nothing you type into the calculators is ever sent to us.</strong>{" "}
          It stays in your browser. If you want us to look at your numbers, you
          will have to include them in your email yourself.
        </p>
      </div>
    </div>
  );
}
