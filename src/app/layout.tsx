import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Logo from "@/components/Logo";
import SiteNav from "@/components/SiteNav";
import ThemeToggle from "@/components/ThemeToggle";
import { calculators } from "@/lib/calculators";
import "./globals.css";

/**
 * DM Sans across the whole site. It carries more warmth than a neutral grotesk
 * at headline weight, and its figures stay even enough that a table of
 * payments still lines up column by column.
 */
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://debtrunway.com"),
  title: {
    default: "Debt Payoff Calculator — See Your Debt-Free Date | DebtRunway",
    template: "%s | DebtRunway",
  },
  description:
    "Free debt payoff calculator. Compare the snowball and avalanche methods, see your exact debt-free date, and get a month-by-month payment schedule you can print.",
  keywords: [
    "debt payoff calculator",
    "debt snowball calculator",
    "debt avalanche calculator",
    "credit card payoff calculator",
    "debt free date",
  ],
  // A named, identifiable author counts on money topics — Google looks for it.
  authors: [{ name: "Romana Idress Ekfa", url: "https://debtrunway.com/about" }],
  creator: "Romana Idress Ekfa",
  publisher: "Romana Idress Ekfa",
  openGraph: {
    type: "website",
    siteName: "DebtRunway",
    title: "Debt Payoff Calculator — See Your Debt-Free Date",
    description:
      "Compare the snowball and avalanche methods and get a month-by-month schedule to your debt-free date.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debt Payoff Calculator — See Your Debt-Free Date",
    description:
      "Compare the snowball and avalanche methods and get a month-by-month schedule to your debt-free date.",
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
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
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
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
            <Link
              href="/"
              aria-label="DebtRunway home"
              className="transition-opacity hover:opacity-70"
            >
              <Logo size={24} />
            </Link>
            <div className="flex items-center gap-2">
              <SiteNav />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="no-print mt-24 border-t border-line bg-surface">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <Logo size={22} className="mb-8" />

            <nav aria-label="All calculators">
              <h2 className="text-xs font-semibold tracking-wider text-muted uppercase">
                Calculators
              </h2>
              <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {calculators.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={c.slug}
                      className="text-muted transition-colors hover:text-brand"
                    >
                      {c.nav}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-10 border-t border-line pt-6 text-sm text-muted">
              <p>
                Every figure is worked out in your own browser, and your plan is
                saved on this device so it is waiting for you next month.
                Nothing you type is ever sent to a server.
              </p>
              <p className="mt-3">
                These results are estimates for planning, not financial advice.
                Your lender&rsquo;s exact interest calculation may differ
                slightly.
              </p>
              <p className="mt-5 flex flex-wrap gap-4">
                <Link href="/about" className="transition-colors hover:text-brand">
                  About
                </Link>
                <Link href="/privacy" className="transition-colors hover:text-brand">
                  Privacy
                </Link>
                <span>&copy; {new Date().getFullYear()} DebtRunway</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
