import type { Metadata } from "next";
import { Amiri, Geist_Mono, Inter } from "next/font/google";
import Link from "next/link";
import Logo from "@/components/Logo";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
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

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
      className={`${inter.variable} ${geistMono.variable} ${amiri.variable} h-full antialiased`}
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
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
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
      </body>
    </html>
  );
}
