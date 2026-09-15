import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "শর্তাবলি ও দাবিত্যাগ | DebtRunway" },
  description:
    "DebtRunway কী আর কী নয়: পরিকল্পনার জন্য বিনামূল্যের ক্যালকুলেটর, আর্থিক পরামর্শ নয়। এর সংখ্যাগুলোর সীমা, স্পষ্ট করে বলা।",
  alternates: alternatesFor("/terms", "bn"),
};

export default function Terms() {
  return (
    <ContentPage
      heading="শর্তাবলি ও দাবিত্যাগ"
      intro="সংক্ষেপে: এটা পরিকল্পনার জন্য একটা বিনামূল্যের ক্যালকুলেটর। এটা আর্থিক পরামর্শ নয়, আর সংখ্যাগুলো আনুমানিক।"
    >
      {/* The most important paragraph on the page, so it is not left to
          compete with the rest of the text. */}
      <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-accent">
          এটা আর্থিক পরামর্শ নয়
        </h2>
        <p className="mt-2 leading-relaxed">
          DebtRunway একটা শিক্ষামূলক যন্ত্র। এটা প্রকাশিত নিয়মগুলো আপনার দেওয়া
          তথ্যের ওপর প্রয়োগ করে, আর আপনার সম্পর্কে এর বাইরে কিছুই জানে না। এটা
          দেখতে পায় না বিতর্কিত বা নিখোঁজ কোনো ওয়ারিশ, গর্ভের সন্তান, যৌথভাবে
          রাখা সম্পত্তি, এমন কোনো দেনা যা নিয়ে কেউ একমত নয়, বা আপনার পরিবার
          কোন মাযহাব মানে। এই সাইটের কোনো কিছুই ফতোয়া নয়, আর এখানকার কোনো কিছুর
          ওপর ভিত্তি করে একাই সম্পত্তি বণ্টন করা বা কোনো ধর্মীয় দায়িত্ব আদায়
          করা উচিত নয়।
        </p>
        <p className="mt-3 leading-relaxed">
          গুরুত্বপূর্ণ যেকোনো বিষয়ে যোগ্য আলেম বা মুফতির সাথে কথা বলুন — আর
          সম্পত্তি বা আপনার দেশের আইন জড়িত থাকলে একজন আইনজীবীর সাথেও।
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        সংখ্যাগুলো আনুমানিক
      </h2>
      <p className="mt-3 leading-relaxed">
        এখানকার অঙ্ক যত্ন করে করা ও যাচাই করা, কিন্তু এটা একটা মডেল। আসল
        উত্তরটা এর থেকে আলাদা হতে পারে, কয়েকটা কারণে:
      </p>
      <ul className="mt-3 space-y-2.5 leading-relaxed">
        {[
          "ধাতুর দাম। নিসাব সোনা বা রুপার ওজনে মাপা, তাই দাম বদলালে সীমাটাও বদলায়। এখানকার দাম আন্তর্জাতিক বাজারদর থেকে নেওয়া, আপনার এলাকার দোকানের দর নয়।",
          "মাযহাবের মতভেদ। পরিহিত গহনা, পেনশন, বা দীর্ঘমেয়াদি দেনার মতো বিষয়ে আলেমরা সত্যিই ভিন্ন মত রাখেন। যেখানে ভিন্নতা আছে সেখানে পাতাটা দুই পক্ষের কথাই বলে, কিন্তু আপনার হয়ে বেছে নেয় না।",
          "চান্দ্রবছর। যাকাত ওয়াজিব হয় সম্পদ এক পূর্ণ চান্দ্রবছর নিসাবের ওপরে থাকলে। ক্যালকুলেটর আজকের অবস্থা দেখায়, আপনার বছর পূর্ণ হলো কি না তা জানে না।",
          "স্থানীয় দর ও খরচ। ফিতরা, কুরবানি বা হজের খরচ এলাকাভেদে আলাদা — আপনার নিজের এলাকার সত্যিকার দর দিন, গড় নয়।",
          "অসম্পূর্ণ তথ্য। কোনো ওয়ারিশের কথা বাদ পড়লে বা কোনো দেনা লেখা না হলে উত্তরটা বদলে যায়, আর ক্যালকুলেটর তা ধরতে পারে না।",
        ].map((point) => (
          <li key={point} className="flex gap-3">
            <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 leading-relaxed">
        ফলাফলকে একটা বাস্তবসম্মত পরিকল্পনা হিসেবে নিন, চূড়ান্ত রায় হিসেবে নয়।
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        কোনো নিশ্চয়তা নেই, সিদ্ধান্ত আপনার
      </h2>
      <p className="mt-3 leading-relaxed">
        সাইটটা যেমন আছে তেমনভাবেই দেওয়া হয়েছে। হিসাবগুলোতে যথেষ্ট যত্ন দেওয়া
        হয়েছে — স্বয়ংক্রিয় টেস্ট সেগুলো যাচাই করে — কিন্তু সাইটটা ভুলমুক্ত,
        সবসময় সচল, বা আপনার পরিস্থিতির জন্য উপযুক্ত, এমন কোনো নিশ্চয়তা দেওয়া
        হচ্ছে না।
      </p>
      <p className="mt-3 leading-relaxed">
        আইন যতটুকু অনুমতি দেয় ততটুকু পর্যন্ত, এই সাইট ব্যবহার করে বা এর
        সংখ্যার ওপর নির্ভর করে কোনো ক্ষতি হলে DebtRunway ও এর মালিক তার দায়
        নেয় না। আপনি যে আর্থিক সিদ্ধান্তই নিন, সেটা আপনার নিজের।
      </p>
      <p className="mt-3 leading-relaxed">
        কোনো হিসাব ভুল মনে হলে অনুগ্রহ করে{" "}
        <Link href="/bn/contact" className="font-medium text-brand underline">
          জানান
        </Link>
        । সংশোধন সাদরে গ্রহণ করা হয় আর গুরুত্বের সাথে দেখা হয়।
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        আমরা কিছু বিক্রি করি না
      </h2>
      <p className="mt-3 leading-relaxed">
        DebtRunway কোনো ঋণদাতা, দালাল, ঋণ-নিষ্পত্তি কোম্পানি বা ঋণ-পরামর্শ
        প্রতিষ্ঠান নয়। আমরা ঋণের ব্যবস্থা করি না, কোনো পণ্যের ওপর কমিশন নিই
        না, আর আপনি কোন সিদ্ধান্ত নিলেন তাতে আমাদের কোনো স্বার্থ নেই। সাইটটা
        বিজ্ঞাপনে চলবে।
      </p>
      <p className="mt-3 leading-relaxed">
        বিজ্ঞাপন বা বাইরের কোনো লিংক আমাদের সুপারিশ নয়। বিজ্ঞাপনদাতারা কী
        দিচ্ছে তা আমাদের নিয়ন্ত্রণে নেই, আর এখান থেকে যে সাইটে যান তার
        বিষয়বস্তু, শর্ত বা আচরণের দায়ও আমাদের নয়।
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        সাইটের ব্যবহার
      </h2>
      <p className="mt-3 leading-relaxed">
        নিজের পরিকল্পনার জন্য এই ক্যালকুলেটরগুলো ব্যবহার করতে আর এগুলোর লিংক
        শেয়ার করতে আপনাকে স্বাগত। অনুগ্রহ করে সাইটের লেখা বা কোড কপি করে অন্য
        কোথাও প্রকাশ করবেন না, আর অন্যদের জন্য সেবাটা ব্যাহত করার চেষ্টা করবেন
        না।
      </p>
      <p className="mt-3 leading-relaxed">
        ক্যালকুলেটর, লেখা ও ডিজাইন সাইটের মালিকের কাজ আর তাঁরই সম্পত্তি।
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        আপনার সংখ্যা আপনার কাছেই থাকে
      </h2>
      <p className="mt-3 leading-relaxed">
        প্রতিটা হিসাব আপনার ব্রাউজারেই চলে, আর আপনি যা লেখেন তা কখনো কোনো
        সার্ভারে পাঠানো হয় না।{" "}
        <Link href="/bn/privacy" className="font-medium text-brand underline">
          গোপনীয়তার পাতায়
        </Link>{" "}
        বিস্তারিত লেখা আছে।
      </p>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">পরিবর্তন</h2>
      <p className="mt-3 leading-relaxed">
        সাইট বদলানোর সাথে সাথে এই শর্তাবলিও হালনাগাদ হতে পারে। এখানে প্রকাশিত
        সংস্করণটাই প্রযোজ্য।
      </p>

      <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
        এসব নিয়ে কোনো প্রশ্ন?{" "}
        <Link href="/bn/contact" className="font-medium text-brand underline">
          যোগাযোগ করুন
        </Link>
        ।
      </p>
    </ContentPage>
  );
}
