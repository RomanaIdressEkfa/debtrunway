import type { Metadata } from "next";
import Link from "next/link";
import CalculatorPage from "@/components/CalculatorPage";
import PrayerTimesCalculator from "@/components/PrayerTimesCalculator";
import { bySlug } from "@/lib/calculators";

const meta = bySlug("/prayer-times-calculator")!;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: meta.slug },
};

const faqs = [
  {
    q: "Why do prayer time websites disagree with each other?",
    a: "Because Fajr and Isha are not defined by a clock but by how far the sun sits below the horizon, and the authorities set that angle differently. The Muslim World League uses 18 degrees for Fajr, ISNA uses 15, the Egyptian authority 19.5. Four and a half degrees of difference is twenty minutes or more at a British latitude and can be over half an hour in summer. None of them is wrong; they are different judgements about when dawn begins, and you should follow the one your community follows.",
  },
  {
    q: "Why is Asr an hour later on some sites?",
    a: "Asr begins when an object's shadow reaches a multiple of its own length, and the Hanafi school uses twice that length where the Maliki, Shafi'i and Hanbali schools use once. The difference is typically between forty-five minutes and an hour and a half, growing in winter. It is a difference between schools rather than a difference between calculators, so pick the one you follow rather than the one that looks earlier.",
  },
  {
    q: "Is my location sent anywhere?",
    a: "No. If you use the location button, your browser asks your permission and hands the coordinates to the page — they are not transmitted to us or to anyone else, and the entire calculation runs on your own device. You can equally type coordinates in by hand and never touch the permission at all. Most prayer time sites send your position to a server; this one has no server to send it to.",
  },
  {
    q: "Why does my phone compass point somewhere different from the Qibla figure?",
    a: "Because a phone compass points at magnetic north and this figure is measured from true north. The two differ by anything from a fraction of a degree to more than twenty, depending where on Earth you are standing — the difference is called magnetic declination. Most compass apps have a setting to show true north instead; turn it on before using the bearing. Metal, buildings and phone cases also pull a compass around, so a bearing is a guide rather than a survey.",
  },
  {
    q: "What happens at high latitudes in summer?",
    a: "Above roughly 48 degrees the sun sometimes never falls far enough below the horizon for the Fajr or Isha angle to occur at all, and above the Arctic Circle it may not set. There is no observation to calculate from, so no formula can give you a true answer. This page divides the night in proportion to the angle where it can, uses the timings of the nearest ordinary latitude where it cannot, and labels both as estimates. Which approach to follow is a scholarly ruling rather than a calculation, so ask locally.",
  },
  {
    q: "Should I use these times or my mosque's?",
    a: "Your mosque's. The astronomy here is standard and the arithmetic is tested against known values, but a mosque timetable carries judgements a formula has not got — the horizon actually visible from your town, the altitude, the caution a community applies to Fajr in high summer, and the convention its scholars have settled on. Use this to understand why the numbers are what they are, and to have a timetable when you are travelling.",
  },
];

export default function Page() {
  return (
    <CalculatorPage
      slug={meta.slug}
      heading={
        <>
          Prayer times and the{" "}
          <em className="accent-text not-italic">Qibla</em>
        </>
      }
      intro="Today's times for your own location and the convention you follow, worked out on your device — your coordinates are never sent anywhere."
      faqs={faqs}
      content={
        <>
          <h2 className="mt-0 text-2xl font-bold tracking-tight">
            Why two sites give you two different Fajrs
          </h2>
          <p className="mt-3 leading-relaxed">
            Dhuhr, Asr and Maghrib are tied to things anyone can see: the sun
            crossing the meridian, a shadow reaching a length, the sun going
            down. Fajr and Isha are not. They are tied to the beginning and end
            of twilight, and twilight has no edge — it fades.
          </p>
          <p className="mt-3 leading-relaxed">
            So the authorities fixed a number instead: how many degrees below
            the horizon the sun must be. The Muslim World League says{" "}
            <strong>18°</strong> for Fajr, ISNA says <strong>15°</strong>, the
            Egyptian authority says <strong>19.5°</strong>. That spread is
            twenty minutes at a British latitude in spring and can exceed half
            an hour at midsummer.
          </p>
          <p className="mt-3 leading-relaxed">
            None of them is a mistake. They are different judgements about when
            dawn has begun, made by serious people, and a calculator that
            picked one silently would be picking a side while pretending to be
            neutral. This page asks.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Asr, and why it moves by an hour
          </h2>
          <p className="mt-3 leading-relaxed">
            Asr begins when a thing&rsquo;s shadow reaches a multiple of its
            own length, and the schools differ on the multiple: the Hanafi
            school uses two, the Maliki, Shafi&rsquo;i and Hanbali schools use
            one. Between them lies anything from forty-five minutes to an hour
            and a half, widening through the winter.
          </p>
          <p className="mt-3 leading-relaxed">
            That is a difference between schools, not between websites. If two
            timetables disagree by about an hour on Asr alone, this is almost
            always why.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Your location does not leave your device
          </h2>
          <p className="mt-3 leading-relaxed">
            Most prayer time sites send your coordinates to a server, which
            computes the times and sends them back. This one has no server to
            send them to. The permission prompt is your browser&rsquo;s, the
            coordinates stay in the tab, and the astronomy runs on your own
            device — the same promise every other page here makes, kept on the
            one page where it would have been easiest to break.
          </p>
          <p className="mt-3 leading-relaxed">
            You can also type the coordinates by hand and never touch the
            permission. Right-clicking your street on almost any map will give
            them to you.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            The Qibla is not the direction on a flat map
          </h2>
          <p className="mt-3 leading-relaxed">
            On a sphere the shortest path between two points is a great circle,
            and a flat map bends it. From London the Qibla is about{" "}
            <strong>119°</strong> — south-east — which surprises people who
            expect to face a point they can put a finger on in an atlas. From
            New York it is roughly <strong>58°</strong>, which is north of
            east: you face towards the pole, not across the Atlantic.
          </p>
          <p className="mt-3 leading-relaxed">
            And the bearing here is from <em>true</em> north, while a phone
            compass reads <em>magnetic</em> north. The gap between them runs
            from a fraction of a degree to more than twenty depending where you
            stand. Set your compass app to true north before you turn.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            If there are years behind you
          </h2>
          <p className="mt-3 leading-relaxed">
            A timetable is of no use to someone whose real question is what to
            do about the prayers already missed, and that question stops a
            great many people from starting at all — the arithmetic of a decade
            looks unpayable, so nothing gets prayed today either.
          </p>
          <p className="mt-3 leading-relaxed">
            The four schools require them to be made up; a minority position
            holds that a deliberately abandoned prayer cannot be made up and
            asks for repentance and more voluntary prayer instead. Both
            positions,{" "}
            <Link
              href="/answers/do-i-have-to-make-up-missed-prayers"
              className="font-medium text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
            >
              and the practical way to begin
            </Link>
            , are set out at length. There is no reading of the disagreement on
            which starting today is the wrong move.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Follow your mosque
          </h2>
          <p className="mt-3 leading-relaxed">
            The astronomy on this page is the standard algorithm and its
            arithmetic is checked against known values, including the Qibla
            bearings of five cities on four continents. That still does not
            make it the timetable to pray by.
          </p>
          <p className="mt-3 leading-relaxed">
            A mosque&rsquo;s timetable carries what a formula cannot: the
            horizon actually visible from your town, its altitude, the caution
            a community applies to Fajr in high summer, and the convention its
            scholars have settled on after argument. Where the two differ, the
            mosque is the one people pray by — and should be.
          </p>
        </>
      }
    >
      <PrayerTimesCalculator />
    </CalculatorPage>
  );
}
