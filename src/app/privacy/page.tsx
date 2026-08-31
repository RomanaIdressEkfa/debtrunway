import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What DebtRunway does and does not collect. Calculations run entirely in your browser.",
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Privacy</h1>

      <h2 className="mt-8 text-xl font-bold">What we collect about your debts</h2>
      <p className="mt-3 leading-relaxed">
        Nothing reaches us. The calculator runs entirely in your browser, and
        your balances, rates and payments are never transmitted to a server or
        visible to anyone but you.
      </p>
      <p className="mt-3 leading-relaxed">
        So that you do not have to type everything again next month, your plan
        is saved in your browser&rsquo;s own storage, on your device. It never
        leaves that device, it is not shared between browsers or phones, and the
        <strong> Start over</strong> button on the calculator erases it. Clearing
        your browsing data removes it too.
      </p>
      <p className="mt-3 leading-relaxed">
        If you share a plan using the share button, the figures travel inside
        the link itself — so treat that link as private, and be aware that
        anyone you send it to can see those numbers.
      </p>

      <h2 className="mt-8 text-xl font-bold">Analytics and advertising</h2>
      {/* TODO: keep this section honest — update it the day you add AdSense
          or any analytics script, not later. */}
      <p className="mt-3 leading-relaxed">
        This site may use third-party advertising and analytics services. These
        can set cookies and collect standard technical information such as your
        approximate location, browser, and the pages you visit, in order to show
        relevant ads and measure traffic. They have no access to the figures you
        enter into the calculator.
      </p>

      <h2 className="mt-8 text-xl font-bold">Your choices</h2>
      <p className="mt-3 leading-relaxed">
        You can block cookies in your browser settings, and the calculator will
        still work exactly as it does now.
      </p>

      <h2 className="mt-8 text-xl font-bold">Contact</h2>
      <p className="mt-3 leading-relaxed">
        Questions about this policy:{" "}
        <a className="text-brand underline" href="mailto:hello@debtrunway.com">
          hello@debtrunway.com
        </a>
      </p>
    </div>
  );
}
