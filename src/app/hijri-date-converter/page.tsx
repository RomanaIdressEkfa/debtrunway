import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import HijriCalculator from "@/components/HijriCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/hijri-date-converter")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Why does the date here differ from my mosque's by a day?",
    a: "Because the Hijri calendar is not, in principle, a calculated calendar. A month begins when the new crescent is sighted, and whether it is seen depends on where you are standing, on the weather, and on which authority your country follows. This page uses the tabular arithmetic scheme, which is exact and always available but has no way to know what was actually seen. A day either way is normal, and where a date matters — Ramadan, the two Eids, Arafah — the announcement wins.",
  },
  {
    q: "Why is the Hijri year not simply 622 years behind?",
    a: "Because it is shorter. A Hijri year is twelve lunar months, about 354 days, against the Gregorian 365. It therefore gains on the solar calendar by roughly eleven days a year, and about every 33 solar years the two gain a whole year on each other. That is why Ramadan moves earlier through the seasons and why the gap between the two year numbers keeps closing.",
  },
  {
    q: "How do I work out my zakat anniversary?",
    a: "Take the day your wealth first rose above the nisab, convert it here, and note the Hijri date. That date is your anniversary every year afterwards. Fixing it to a Gregorian date instead is the common mistake: since the lunar year is eleven days shorter, a Gregorian anniversary quietly skips a zakat year roughly every third decade, and the shortfall is owed rather than forgiven.",
  },
  {
    q: "What is a leap year in the Hijri calendar?",
    a: "In the tabular scheme, eleven years in every thirty are given a 355th day, added to Dhu al-Hijjah. It keeps the arithmetic calendar in step with the actual lunar cycle, whose month averages a little over 29.5 days. This is a property of the calculated calendar rather than of the sighted one, where the length of each month is simply whatever was observed.",
  },
  {
    q: "When does Ramadan start this year?",
    a: "The dates listed on this page are what the arithmetic gives, and they are usually right to within a day. They are not an announcement. Ramadan begins when the crescent of Ramadan is sighted, which different countries determine differently — some by local sighting, some by following Mecca, some by calculation. Use the figure here to plan and your local mosque to fast.",
  },
  {
    q: "Which months are the sacred months?",
    a: "Four: Dhu al-Qa'dah, Dhu al-Hijjah and Muharram, which fall consecutively, and Rajab, which stands alone. They are named in the Qur'an at 9:36, where fighting in them is forbidden and wrongdoing in them is described as weightier. Muharram contains Ashura on its tenth day; Dhu al-Hijjah contains the Hajj and Eid al-Adha.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          <em className="accent-text not-italic">Hijri</em> date converter
        </>
      }
      intro="Today's Hijri date, either calendar converted to the other, and when Ramadan and the two Eids fall — by the arithmetic, which is not the same as by sighting."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            The honest caveat comes first
          </h2>
          <p className="mt-3 leading-relaxed">
            The Hijri calendar is not a calculated calendar. A month begins when
            the new crescent is <em>seen</em>, and whether it is seen depends on
            where you are standing, on the weather, and on which authority your
            country follows. Two Muslims a thousand miles apart can begin
            Ramadan on different days and both be right.
          </p>
          <p className="mt-3 leading-relaxed">
            What this page uses is the tabular scheme — an arithmetic calendar
            in which eleven years in thirty carry an extra day and months
            alternate between thirty and twenty-nine. It is exact, it is always
            available, and it has no way of knowing what anyone actually saw.
            Expect a day either way, and follow your local announcement for
            anything that turns on a single date.
          </p>
          <p className="mt-3 leading-relaxed">
            For everything that does not — how old a lunar year is, when your
            zakat falls due, roughly when Ramadan is coming — the arithmetic is
            the right tool and a sighting is not available in advance anyway.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Why the year numbers keep closing
          </h2>
          <p className="mt-3 leading-relaxed">
            A Hijri year is twelve lunar months, about 354 days, against the
            Gregorian 365. It gains eleven days a year on the solar calendar,
            which is why Ramadan walks backwards through the seasons and
            arrives in midsummer once every three decades or so.
          </p>
          <p className="mt-3 leading-relaxed">
            It is also why the two year numbers are not separated by a fixed
            622. Every 33 solar years the calendars gain a whole year on one
            another, so the gap narrows continuously — a detail that surprises
            people who try to convert by subtraction.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The mistake this page exists to prevent
          </h2>
          <p className="mt-3 leading-relaxed">
            Zakat falls due once your wealth has stood above the nisab for a
            full lunar year, and the day it first crossed becomes your
            anniversary. A great many people write that date down in the
            Gregorian calendar — 1 April, say — and calculate on it every year
            after.
          </p>
          <p className="mt-3 leading-relaxed">
            That loses a year. The lunar year is eleven days shorter, so a
            Gregorian anniversary drifts a whole zakat year late roughly every
            third decade, and the missed year is owed rather than forgiven.
            Convert the day it crossed, keep the <em>Hijri</em> date, and the
            problem does not arise.
          </p>
          <p className="mt-3 leading-relaxed">
            The{" "}
            <Link
              href="/zakat-calculator"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              zakat calculator
            </Link>{" "}
            asks about the year for exactly this reason, and the{" "}
            <Link
              href="/hajj-savings-calculator"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              Hajj savings plan
            </Link>{" "}
            counts days rather than months so that the extra zakat year appears
            where it actually falls.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The four sacred months
          </h2>
          <p className="mt-3 leading-relaxed">
            Dhu al-Qa&rsquo;dah, Dhu al-Hijjah and Muharram fall together, and
            Rajab stands alone in the middle of the year. They are named at 9:36,
            where fighting in them is forbidden and wrongdoing in them is
            described as weightier than elsewhere.
          </p>
          <p className="mt-3 leading-relaxed">
            Dhu al-Hijjah holds the Hajj, the Day of Arafah and Eid al-Adha;
            Muharram holds Ashura on its tenth day. Ramadan, though not among
            the four, is the month of the fast, and Shawwal opens with Eid
            al-Fitr.
          </p>
        </>
      }
    >
      <HijriCalculator />
    </CalculatorPage>
  );
}
