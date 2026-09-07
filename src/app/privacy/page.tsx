import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What DebtRunway does and does not collect. Calculations run entirely in your browser.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <ContentPage
      heading="Privacy"
      intro="Your figures never reach us. Here is exactly what is stored, where, and how to erase it."
    >

      <h2 className="mt-8 text-xl font-bold">What we collect about you</h2>
      <p className="mt-3 leading-relaxed">
        Nothing reaches us. Every calculation runs in your browser, and what you
        enter — the value of an estate, who in your family has died, what you
        hold in gold or in the bank — is never transmitted to a server or
        visible to anyone but you.
      </p>
      <p className="mt-3 leading-relaxed">
        The inheritance calculator goes further and keeps nothing at all, not
        even in your own browser. Who has died in a family is not a thing to
        leave sitting on a shared computer, so those entries are gone the moment
        you close the tab.
      </p>
      <p className="mt-3 leading-relaxed">
        The only thing kept between visits is the colour theme you chose, which
        is a single word in your browser&rsquo;s own storage on your own device.
        Clearing your browsing data removes it. No figure you type into any
        calculator on this site is stored anywhere, on your device or off it.
      </p>

      <h2 className="mt-8 text-xl font-bold">Analytics and advertising</h2>
      {/* This section states what is true today and not what might be true
          later. Update it the day anything is added, not after. */}
      <p className="mt-3 leading-relaxed">
        There is no advertising on this site and no advertising network is
        loaded. There are no tracking scripts, no cookies set by us, and no
        third party is given anything you enter.
      </p>
      <p className="mt-3 leading-relaxed">
        Our hosting provider records ordinary server logs — the pages requested
        and roughly where in the world the request came from — as any web host
        does, and we see those only as aggregate counts. They contain nothing
        you typed, because nothing you type is ever sent.
      </p>
      <p className="mt-3 leading-relaxed">
        If that ever changes, this page changes on the same day, and it will say
        plainly what was added rather than that something &ldquo;may&rdquo; be
        in use.
      </p>

      <h2 className="mt-8 text-xl font-bold">Your choices</h2>
      <p className="mt-3 leading-relaxed">
        You can block cookies and storage in your browser settings and every
        calculator here will work exactly as it does now — the only thing you
        lose is the theme being remembered. There is nothing to opt out of,
        because there is nothing collecting.
      </p>

      <h2 className="mt-8 text-xl font-bold">Contact</h2>
      <p className="mt-3 leading-relaxed">
        Questions about this policy:{" "}
        <a className="text-brand underline" href="mailto:hello@debtrunway.com">
          hello@debtrunway.com
        </a>
      </p>
    </ContentPage>
  );
}
