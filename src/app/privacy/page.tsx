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
          later. Update it the day anything is added, not after — which is what
          happened when the Cloudflare beacon went in. */}
      <p className="mt-3 leading-relaxed">
        There is no advertising on this site and no advertising network is
        loaded. No third party is given anything you enter into a calculator.
      </p>
      <p className="mt-3 leading-relaxed">
        There is one analytics script, and this page would rather name it than
        describe it vaguely. It is{" "}
        <strong>Cloudflare Web Analytics</strong>, and on each page view it
        records the address of the page, the site you arrived from, your
        country, your browser and your screen size. That is the whole list.
      </p>
      <p className="mt-3 leading-relaxed">
        It was chosen over the usual alternative for specific reasons. It sets
        no cookie. It does not follow you to any other website, and it cannot,
        because it builds no identifier that persists between sites or between
        visits. It does not fingerprint your device. There is consequently
        nothing for you to consent to and no banner interrupting a page about
        your family&rsquo;s inheritance.
      </p>
      <p className="mt-3 leading-relaxed">
        What it does <em>not</em> see is everything that matters here. The
        script has no access to the fields on any calculator. The value of your
        estate, who in your family has died, what you hold in gold or in the
        bank — none of it is sent anywhere, by this script or by anything else.
        The calculation still runs entirely in your browser.
      </p>
      <p className="mt-3 leading-relaxed">
        Our hosting provider also records ordinary server logs — the pages
        requested and roughly where in the world the request came from — as any
        web host does, and we see those only as aggregate counts.
      </p>
      <p className="mt-3 leading-relaxed">
        If anything further is added, this page changes on the same day, and it
        will say plainly what was added rather than that something
        &ldquo;may&rdquo; be in use. That is how this paragraph came to name
        Cloudflare.
      </p>

      <h2 className="mt-8 text-xl font-bold">Your choices</h2>
      <p className="mt-3 leading-relaxed">
        You can block cookies and storage in your browser settings and every
        calculator here will work exactly as it does now — the only thing you
        lose is the theme being remembered.
      </p>
      <p className="mt-3 leading-relaxed">
        If you would rather not be counted at all, any content blocker or a
        browser with tracker blocking switched on will stop the analytics
        script, and nothing on the site breaks when it does. Every calculator
        works identically with it blocked, because none of them depend on it.
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
