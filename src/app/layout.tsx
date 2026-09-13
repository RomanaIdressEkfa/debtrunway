import type { Metadata } from "next";
import { Amiri, Cinzel_Decorative, Inter, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import Logo from "@/components/Logo";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import SupportPrompt from "@/components/SupportPrompt";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

/**
 * Inter, the closest freely licensed match to the typeface Webflow uses.
 *
 * Its heavy weights hold together at display sizes without the letterforms
 * softening, and its tabular figures keep a column of payments aligned — both
 * of which this site leans on.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Cinzel Decorative, for the page titles.
 *
 * It is a Roman inscriptional face — the lettering cut into Trajan's column,
 * by way of a digital revival — so it sets as capitals whichever case you
 * type. That makes it excellent for four words and unreadable for forty,
 * which is why it is on titles and short section heads and nothing else.
 *
 * It replaces Geist Mono in the bundle rather than joining it. That face was
 * declared as a Tailwind token and then never used by a single component, so
 * every visitor was downloading a monospace they would never see. The page
 * weight is unchanged.
 */
/**
 * Roboto Slab, on trial for the homepage paragraphs only.
 *
 * A slab serif reads slower and heavier than Inter, which may be right for a
 * page that is mostly explanation and wrong for one that is mostly form. It
 * is scoped to the homepage so the difference can be judged side by side
 * against every other page before it goes anywhere near them.
 *
 * Only the regular weight is loaded; bold inside a paragraph falls back to
 * synthesised weight rather than pulling a second file for a trial.
 */
const slab = Roboto_Slab({
  variable: "--font-slab",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

/**
 * Amiri, for the Arabic.
 *
 * It is a revival of the Naskh cut used by the Bulaq press, which is what
 * Qur'anic text is normally set in and what an Arabic reader expects to see.
 * A system fallback would land on whatever the device happens to have, and on
 * Windows that is usually a face designed for interface chrome rather than
 * scripture. Only the weight actually used is loaded.
 */
const amiri = Amiri({
  variable: "--font-amiri",
  // The Latin cut as well as the Arabic. Amiri's Latin was drawn to sit
  // beside its Arabic, so setting the headings in it puts the du'a and the
  // page titles in one voice instead of two typefaces that merely coexist.
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://debtrunway.com"),
  title: {
    default: "Islamic Finance Calculators — Inheritance and Zakat | DebtRunway",
    template: "%s | DebtRunway",
  },
  description:
    "Free Islamic finance calculators. Divide an estate by the Qur'anic shares of faraid, and work out the zakat you owe from today's nisab.",
  keywords: [
    "islamic inheritance calculator",
    "faraid calculator",
    "zakat calculator",
    "nisab calculator",
    "mirath calculator",
  ],
  // A named, identifiable author counts on money topics — Google looks for it.
  authors: [{ name: "Romana Idress Ekfa", url: "https://debtrunway.com/about" }],
  creator: "Romana Idress Ekfa",
  publisher: "Romana Idress Ekfa",
  openGraph: {
    type: "website",
    siteName: "DebtRunway",
    title: "Islamic Finance Calculators — Inheritance and Zakat",
    description:
      "Divide an estate by the Qur’anic shares of faraid, and work out the zakat you owe from today’s nisab.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Finance Calculators — Inheritance and Zakat",
    description:
      "Divide an estate by the Qur’anic shares of faraid, and work out the zakat you owe from today’s nisab.",
  },
  robots: { index: true, follow: true },
  // Search Console ownership. Google requires this to stay in place after
  // verification, not just during it.
  verification: {
    google: "D95HQ1iGzGtb2ZwgYvytmI-EClU1xbqjNJYQkbju18w",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${amiri.variable} ${slab.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Light is the default, so only a saved dark choice needs applying —
            and it has to happen before the first paint, or a reader who chose
            dark would see a flash of light on every page load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      {/* Extensions such as Grammarly stamp attributes onto <body> before React
          hydrates. Suppressing here silences that false mismatch only. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <header className="no-print sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-md">
          <div className="shell flex items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
            <Link
              href="/"
              aria-label="DebtRunway home"
              className="transition-opacity hover:opacity-70"
            >
              <Logo size={28} />
            </Link>
            <div className="flex items-center gap-2">
              <SiteNav />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <SiteFooter />

        {/* All pages, two and a half minutes in. See the component for why
            the delay is the point rather than an afterthought. */}
        <SupportPrompt />

        {/*
         * Cloudflare Web Analytics.
         *
         * Chosen over Google Analytics deliberately. It sets no cookie, builds
         * no cross-site profile and does not fingerprint the device, so there
         * is nothing to ask consent for under the GDPR or the ePrivacy rules,
         * and no banner has to appear on a page about someone's inheritance.
         *
         * The token is public by design — it ships in the HTML of every page
         * and identifies the site to Cloudflare, not the account. It is not a
         * credential and there is nothing to protect by hiding it.
         *
         * What this does send, on every page view: the URL, the referrer, the
         * country, the browser and screen size. That is a real change from
         * sending nothing, so /privacy says so in the same commit that added
         * this. Whatever a reader types into a calculator is still never
         * transmitted — the beacon has no access to it.
         *
         * afterInteractive keeps it out of the critical path, so a slow beacon
         * cannot delay the page a visitor came for.
         */}
        <Script
          strategy="afterInteractive"
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "b29dfc2a3b4b4729bcbc6efbb5b7b063"}'
        />
      </body>
    </html>
  );
}
