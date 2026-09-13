/**
 * The Bengali side of the site.
 *
 * Kept apart from calculators.ts rather than added as a `bn` field on every
 * entry, for one reason: a translation is allowed to be missing. If the
 * Bengali text lived on the same object, every new calculator would either
 * ship with an empty Bengali string or block on someone writing one. Here, a
 * page that has not been translated simply is not in the map, and the site
 * can be honest about that instead of showing a blank.
 *
 * These are translations, not transliterations. "Zakat calculator" is written
 * as যাকাত ক্যালকুলেটর because that is what a Bengali speaker types into a
 * search box — not যাকাত গণকযন্ত্র, which is correct and which nobody says.
 */

import type { CalculatorMeta } from "./calculators";

export interface BnCopy {
  nav: string;
  title: string;
  description: string;
}

/** Calculator pages, by their English slug. */
export const BN_CALCULATORS: Record<string, BnCopy> = {
  "/islamic-inheritance-calculator": {
    nav: "ইসলামিক উত্তরাধিকার",
    title: "ইসলামিক উত্তরাধিকার ক্যালকুলেটর (ফারায়েজ)",
    description:
      "কুরআনে নির্ধারিত অংশ অনুযায়ী সম্পত্তি ভাগ করুন। কে কে জীবিত আছেন লিখুন — প্রত্যেকের ভাগ, টাকার অঙ্ক আর কোন নিয়মে পেলেন তা দেখুন।",
  },
  "/islamic-will-calculator": {
    nav: "ইসলামিক উইল",
    title: "ইসলামিক উইল ক্যালকুলেটর (ওসিয়ত)",
    description:
      "সম্পত্তির কতটুকু ওসিয়ত করতে পারবেন, এক-তৃতীয়াংশ ও ওয়ারিশের নিয়ম প্রয়োগের পর প্রতিটি ওসিয়ত কত দাঁড়ায়, আর বাকিটা ফারায়েজে কীভাবে ভাগ হয়।",
  },
  "/zakat-calculator": {
    nav: "যাকাত",
    title: "যাকাত ক্যালকুলেটর",
    description:
      "আজকের সোনা বা রুপার দাম থেকে নিসাব বের করুন, যাকাতযোগ্য সম্পদের হিসাব করুন, আর ২.৫% কত হয় দেখুন।",
  },
  "/zakat-on-gold-calculator": {
    nav: "সোনার যাকাত",
    title: "সোনা ও রুপার যাকাত ক্যালকুলেটর",
    description:
      "প্রতিটি গহনা ওজন আর ক্যারেটসহ দিন — ভরি বা গ্রামে। খাদ বাদ যাবে, আর পরিহিত গহনা নিয়ে আপনি যে মত অনুসরণ করেন সেটাই প্রয়োগ হবে।",
  },
  "/zakat-on-business-calculator": {
    nav: "ব্যবসার যাকাত",
    title: "ব্যবসার সম্পদের যাকাত ক্যালকুলেটর",
    description:
      "প্রতিটি স্তরের মজুদ, নগদ ও বাকি — আর ব্যবসা যা দিয়ে চলে বনাম যা বিক্রি করে, কারণসহ আলাদা করা।",
  },
  "/zakat-on-investments-calculator": {
    nav: "বিনিয়োগের যাকাত",
    title: "শেয়ার, পেনশন ও ক্রিপ্টোর যাকাত",
    description:
      "শেয়ার, পেনশন বা ৪০১(কে)-এর যাকাত বের করুন। আপনি যে আলেমের মত অনুসরণ করেন সেটা বেছে নিন, আর অন্য মতে কত হতো তাও দেখুন।",
  },
  "/zakat-al-fitr-calculator": {
    nav: "যাকাতুল ফিতর",
    title: "যাকাতুল ফিতর ক্যালকুলেটর",
    description:
      "রমজান শেষে আপনার পরিবারের কত ওয়াজিব — প্রধান খাদ্যের কেজিতে ও টাকায়, ঈদের নামাজের আগে।",
  },
  "/qurbani-calculator": {
    nav: "কুরবানি",
    title: "কুরবানি ক্যালকুলেটর — ভাগ, খরচ ও হুকুম",
    description:
      "আপনার পরিবারে কয়টি পশু বা ভাগ লাগবে, খরচ কত, আর আপনার ওপর কুরবানি ওয়াজিব না সুন্নতে মুআক্কাদা।",
  },
  "/fidya-and-kaffarah-calculator": {
    nav: "ফিদিয়া ও কাফফারা",
    title: "ফিদিয়া ও কাফফারা ক্যালকুলেটর",
    description:
      "রমজানের যে রোজা রাখা হয়নি তার হিসাব — কোনগুলো কাজা, কোনগুলো ফিদিয়া, আর কোনগুলোতে দুটোই।",
  },
  "/hajj-savings-calculator": {
    nav: "হজের সঞ্চয়",
    title: "হজের সঞ্চয় ক্যালকুলেটর",
    description:
      "কবে যেতে পারবেন, বা মাসে কত জমাতে হবে — সাথে সঞ্চয়ের ওপর যে যাকাত আসে, যেটা বেশিরভাগ হিসাবেই বাদ পড়ে।",
  },
  "/islamic-home-finance-calculator": {
    nav: "ইসলামিক হোম ফাইন্যান্স",
    title: "ইসলামিক হোম ফাইন্যান্স ক্যালকুলেটর",
    description:
      "একই সংখ্যায় মুরাবাহা, ইজারা ও কমতে থাকা মুশারাকার খরচ কত দাঁড়ায়, আর চুক্তির আগে প্রতিষ্ঠানকে কী কী জিজ্ঞেস করবেন।",
  },
  "/hijri-date-converter": {
    nav: "হিজরি তারিখ",
    title: "হিজরি তারিখ রূপান্তর — ইসলামিক ক্যালেন্ডার",
    description:
      "আজকের হিজরি তারিখ, এক ক্যালেন্ডার থেকে আরেকটিতে রূপান্তর, আর হিসাব অনুযায়ী রমজান ও দুই ঈদ কবে পড়ে।",
  },
  "/halal-e-numbers-checker": {
    nav: "হালাল E নম্বর",
    title: "হালাল E নম্বর যাচাই — সত্যিই কি হারাম?",
    description:
      "যেকোনো E নম্বর দেখুন — এটা নিশ্চিত, নাকি উৎসের ওপর নির্ভর করে, নাকি আলেমদের মতভেদ আছে। আর ফরওয়ার্ড হওয়া তালিকাগুলো কেন ভুল।",
  },
  "/prayer-times-calculator": {
    nav: "নামাজের সময় ও কিবলা",
    title: "নামাজের সময় ও কিবলার দিক",
    description:
      "আপনার এলাকার আজকের নামাজের সময় ও আপনি যে পদ্ধতি মানেন সেই অনুযায়ী হিসাব, সাথে কিবলার দিক — সব আপনার ডিভাইসেই, কোথাও পাঠানো হয় না।",
  },
};

/** Section headings on the homepage and in the nav. */
export const BN_GROUPS: Record<CalculatorMeta["group"], string> = {
  estate: "উত্তরাধিকার ও সম্পত্তি",
  zakat: "যাকাত",
  worship: "রোজা ও ইবাদত",
  finance: "বাড়ি ও অর্থ",
  daily: "প্রতিদিনের",
};

/** Everything the shell says: header, footer, shared buttons. */
export const BN_UI = {
  calculators: "ক্যালকুলেটর",
  answers: "প্রশ্নোত্তর",
  about: "পরিচিতি",
  support: "সহায়তা",
  contact: "যোগাযোগ",
  privacy: "গোপনীয়তা",
  terms: "শর্তাবলি",
  home: "হোম",
  allAnswers: "সব প্রশ্নোত্তর",
  notAFatwa: "এটি ফতোয়া নয়",
  workItOut: "হিসাব করুন",
  commonQuestions: "সাধারণ প্রশ্ন",
} as const;

/** The homepage, which is the one page that is all its own text. */
export const BN_HOME = {
  titleA: "টাকার প্রশ্ন,",
  titleB: "নির্ভরযোগ্য উত্তর",
  intro:
    "ইসলামিক অর্থনীতির যে অংশগুলোর একটা নির্দিষ্ট, যাচাইযোগ্য উত্তর আছে — সেগুলোর জন্য বিনামূল্যে ক্যালকুলেটর। সম্পত্তি কীভাবে ভাগ হয়, যাকাত কত আসে। প্রতিটা সংখ্যার সাথে তার নিয়মটাও থাকে।",
  answersHeading: "প্রশ্নোত্তর",
  answersTitle: "মানুষ যেসব প্রশ্ন সত্যিই খোঁজে",
  answersBody:
    "ব্যাংকের সুদ, ক্রেডিট কার্ড, বীমা, শেয়ার যাচাই, ব্যাংকে চাকরি, মর্টগেজ, মেয়ে কেন ছেলের অর্ধেক পায়, দত্তক সন্তান আদৌ ওয়ারিশ হয় কি না, আর বছরের পর বছর কাজা নামাজ — বিস্তারিত, আলেমদের মতভেদসহ।",
  whyHeading: "এই ক্যালকুলেটরগুলো কেন",
  whyA:
    "ইসলামিক অর্থনীতির বেশিরভাগ প্রশ্নেই আলেম লাগে। কয়েকটায় লাগে শুধু অঙ্ক — আর সেই কয়েকটাই প্রায় সব জায়গায় ভুলভাবে করা হয়। উত্তরাধিকারের ভাগ এমনভাবে গোল করা হয় যে যোগ করলে আর এক হয় না। যাকাতের ক্যালকুলেটরে নিসাব বসানো থাকে, যেটা যে মাসে লেখা হয়েছিল কেবল সে মাসেই ঠিক ছিল।",
  whyB:
    "এখানকার প্রতিটা ইঞ্জিন ক্লাসিক্যাল কিতাবের উদাহরণের সাথে মিলিয়ে যাচাই করা, আর যেখানে মাযহাবগুলোর মতভেদ আছে সেখানে পাতাটা দুই পক্ষের কথাই বলে — চুপচাপ একটা বেছে নেয় না।",
} as const;

export const bnFor = (slug: string): BnCopy | undefined => BN_CALCULATORS[slug];

/** Which calculators have Bengali text, so a page can refuse to half-exist. */
export const bnTranslated = (slug: string): boolean => slug in BN_CALCULATORS;
