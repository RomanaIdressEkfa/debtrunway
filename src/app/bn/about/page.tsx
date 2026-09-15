import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "পরিচিতি — কে বানিয়েছে এই ক্যালকুলেটরগুলো | DebtRunway" },
  description:
    "DebtRunway বানিয়েছেন রোমানা ইদ্রিস একফা। উত্তরাধিকার ও যাকাতের হিসাব কীভাবে কাজ করে, আর যন্ত্রগুলো কেন বিনামূল্যে।",
  alternates: alternatesFor("/about", "bn"),
};

export default function About() {
  return (
    <ContentPage
      heading="DebtRunway সম্পর্কে"
      intro="একজন ডেভেলপারের বানানো — কারণ ইসলামিক অর্থনীতির যে ক্যালকুলেটরগুলো আগে থেকেই আছে, সেগুলো একটা সংখ্যা ধরিয়ে দেয়, পেছনের নিয়মটা কখনো দেখায় না।"
    >
      {/* The AboutPage schema is deliberately not repeated here. Two pages
          claiming to be the AboutPage for the same person is a conflicting
          signal, and the English page already carries it with the sameAs that
          ties the author to a real profile. This page is the Bengali reading
          of it, not a second claim about who she is. */}
      <p className="mt-5 leading-relaxed">
        DebtRunway বানিয়েছেন ও চালান{" "}
        <a
          href="https://www.linkedin.com/in/romanaidressekfa/"
          target="_blank"
          rel="noopener noreferrer author"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 transition hover:decoration-brand"
        >
          রোমানা ইদ্রিস একফা
        </a>
        , একজন স্বাধীন ফুল-স্ট্যাক ওয়েব ডেভেলপার ও সফটওয়্যার ইঞ্জিনিয়ার।
        সাইটটার জন্ম এই কারণে যে, ইসলামিক অর্থনীতির যে ক্যালকুলেটরগুলো আগে
        থেকেই আছে সেগুলো একটা সংখ্যা ধরিয়ে দিয়েই থেমে যায়। সম্পত্তির একটা ভাগ
        দেখে খুব কম কিছুই বোঝা যায়, যতক্ষণ না দেখা যায় কোন নিয়ম থেকে সেটা এলো
        — আর কাকে বাদ দিয়ে এলো।
      </p>

      <h2 className="mt-8 text-xl font-bold">হিসাবগুলো কীভাবে কাজ করে</h2>
      <p className="mt-3 leading-relaxed">
        উত্তরাধিকার ক্যালকুলেটর সংখ্যাগরিষ্ঠ সুন্নি নিয়ম প্রয়োগ করে: সূরা
        নিসায় নির্ধারিত অংশগুলো, অবশিষ্টাংশ যাঁরা নেন সেই আসাবা, নিকট আত্মীয়
        থাকলে দূরের আত্মীয় বাদ পড়ার নিয়ম (হাজব), আর ভগ্নাংশগুলো এক না হলে আওল
        ও রদ-এর সংশোধন। ভাগগুলো দশমিক নয়, নিখুঁত ভগ্নাংশ হিসেবে রাখা হয় — তাই
        এক-ষষ্ঠাংশ যোগ এক-ষষ্ঠাংশ যোগ দুই-তৃতীয়াংশ হয় ঠিক এক, ০.৯৯৯৯ নয়।
      </p>
      <p className="mt-3 leading-relaxed">
        ক্লাসিক্যাল কিতাবে যেসব উদাহরণের উত্তর নির্ধারিত, তার সাথে মিলিয়ে
        যাচাই করা হয়েছে — বারো থেকে পনেরো, ছয় থেকে আট আর চব্বিশ থেকে সাতাশের
        আওলের ক্ষেত্রগুলো, উমারিয়্যাতানের দুটো রায়, আর প্রতিটা হাজবের নিয়ম।
        এই যাচাইগুলো পাতায় লেখা দাবি নয় — রিপোজিটরিতে স্ক্রিপ্ট হিসেবে চলে।
      </p>
      <p className="mt-3 leading-relaxed">
        যাকাত ক্যালকুলেটর নিসাব বের করে আপনার দেওয়া ধাতুর দাম থেকে — কোনো
        বসানো সংখ্যা থেকে নয়, যেটা এক সপ্তাহের মধ্যেই ভুল হয়ে যেত — আর এখন
        পরিশোধযোগ্য দেনা বাদ দেওয়ার পর যা থাকে তার চল্লিশ ভাগের এক ভাগ ধরে।
      </p>

      <h2 className="mt-8 text-xl font-bold">এটা বিনামূল্যে কেন</h2>
      <p className="mt-3 leading-relaxed">
        সাইটটা বিজ্ঞাপনে চলবে। আপনার তথ্য বিক্রি করা হয় না — বিক্রি করার মতো
        কোনো তথ্যই নেই, কারণ প্রতিটা হিসাব আপনার ব্রাউজারেই হয় আর আপনি যা
        লেখেন তা কখনো আপনার ডিভাইস ছেড়ে যায় না।
      </p>

      <h2 className="mt-8 text-xl font-bold">এটি ফতোয়া নয়</h2>
      <p className="mt-3 leading-relaxed">
        এই ক্যালকুলেটরগুলো আপনার দেওয়া তথ্যের ওপর নিয়ম প্রয়োগ করে। এগুলো
        ফতোয়া নয়, আর্থিক পরামর্শও নয় — আর এগুলো দেখতে পায় না বিতর্কিত কোনো
        ওয়ারিশ, গর্ভের সন্তান, যে পেনশন এখনো তোলা যায় না, বা এমন কোনো প্রশ্ন
        যার উত্তর আপনার মাযহাব অন্যভাবে দেয়। গুরুত্বপূর্ণ কিছুতে কাজ করার আগে
        যোগ্য আলেমের কাছে নিয়ে যান।
      </p>

      <h2 className="mt-8 text-xl font-bold">যোগাযোগ</h2>
      <p className="mt-3 leading-relaxed">
        প্রশ্ন বা সংশোধনের জন্য:{" "}
        <a className="text-brand underline" href="mailto:hello@debtrunway.com">
          hello@debtrunway.com
        </a>
      </p>
    </ContentPage>
  );
}
