import type { Metadata } from "next";
import Link from "next/link";
import ContentPage from "@/components/ContentPage";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "যোগাযোগ | DebtRunway" },
  description:
    "DebtRunway-এর সাথে যোগাযোগ করুন — কোনো হিসাবে ভুল, সাইট নিয়ে প্রশ্ন, বা অন্য যেকোনো কিছু।",
  alternates: alternatesFor("/contact", "bn"),
};

const EMAIL = "hello@debtrunway.com";

const reasons = [
  {
    title: "কোনো হিসাব ভুল মনে হচ্ছে",
    body: "এই বার্তাটাই আমরা সবচেয়ে বেশি পেতে চাই। কোন পাতা, কী কী সংখ্যা দিয়েছিলেন, আর কী আশা করেছিলেন — লিখে পাঠান। প্রতিটা রিপোর্ট ইঞ্জিনের টেস্টের সাথে মিলিয়ে দেখা হয়।",
  },
  {
    title: "কিছু ভেঙে গেছে বা ব্যবহার করতে কষ্ট হচ্ছে",
    body: "ফোনে লেআউট ভেঙে যাচ্ছে, কোনো বোতাম কাজ করছে না, কোনো লেখা বুঝতে সমস্যা হচ্ছে। ছোট ছোট রিপোর্ট থেকেই সবচেয়ে ভালো সমাধান আসে।",
  },
  {
    title: "যে ক্যালকুলেটরটা থাকলে ভালো হতো",
    body: "এমন কিছু খুঁজতে এসেছিলেন যা এই সাইটে এখনো নেই? সেটা জানা দরকার।",
  },
  {
    title: "অন্যদের সাথে এগুলো ব্যবহার করা",
    body: "আর্থিক পরামর্শদাতা, শিক্ষক আর সামাজিক সংগঠন এই ক্যালকুলেটরগুলো ব্যবহার করতে ও লিংক দিতে পারেন। শুধু একটু জানিয়ে রাখবেন।",
  },
];

export default function Contact() {
  return (
    <ContentPage
      heading="যোগাযোগ"
      intro="DebtRunway একজন মানুষই চালান। বার্তা সত্যিকারের একটা ইনবক্সে পৌঁছায় আর সত্যিকারের উত্তর পায়।"
    >
      {/* No contact form here either: a form needs a server, and this site
          deliberately has none. */}
      <div className="card-shadow mt-8 rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-widest text-muted uppercase">
          ইমেইল
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-2 block text-2xl font-bold break-all text-brand underline decoration-brand/30 underline-offset-4 transition hover:decoration-brand sm:text-3xl"
        >
          {EMAIL}
        </a>
        <p className="mt-4 leading-relaxed text-muted">
          লিখেছেন{" "}
          <a
            href="https://www.linkedin.com/in/romanaidressekfa/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline decoration-line underline-offset-2 transition hover:text-brand hover:decoration-brand"
          >
            রোমানা ইদ্রিস একফা
          </a>
          , একজন স্বাধীন ফুল-স্ট্যাক ওয়েব ডেভেলপার। উত্তর পেতে কয়েক দিন লাগতে
          পারে — এটা সাপোর্ট ডেস্কওয়ালা কোনো কোম্পানি নয়, আর এক ঘণ্টার
          প্রতিশ্রুতি দেওয়ার চেয়ে সত্যি কথাটা বলাই ভালো মনে হলো।
        </p>

        <a
          href="https://www.linkedin.com/in/romanaidressekfa/"
          target="_blank"
          rel="noopener noreferrer"
          className="press mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 21V9.5h5.16V21H2.4Zm7.9 0V9.5h4.95v1.57h.07c.69-1.24 2.37-2.05 4.06-2.05 4.34 0 5.14 2.65 5.14 6.1V21h-5.16v-4.98c0-1.19-.02-2.72-1.7-2.72-1.71 0-1.97 1.29-1.97 2.63V21H10.3Z" />
          </svg>
          LinkedIn-এ যুক্ত হন
        </a>
      </div>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        যেসব বিষয়ে লিখতে পারেন
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="rounded-xl border border-line bg-surface p-4 sm:p-5"
          >
            <dt className="font-semibold">{r.title}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-muted">{r.body}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-2xl font-bold tracking-tight">
        যেসব বিষয়ে সাহায্য করা সম্ভব নয়
      </h2>
      <p className="mt-3 leading-relaxed">
        আমরা আর্থিক পরামর্শ দিতে পারি না, আপনার হয়ে কোনো ঋণদাতার সাথে কথা বলতে
        পারি না, বা নির্দিষ্ট কোনো দেনা নিয়ে কী করবেন তা বলতে পারি না।
        DebtRunway কোনো ঋণদাতা, দালাল বা ঋণ-পরামর্শ প্রতিষ্ঠান নয় —{" "}
        <Link href="/bn/terms" className="font-medium text-brand underline">
          শর্তাবলি ও দাবিত্যাগ
        </Link>{" "}
        পাতায় কারণটা লেখা আছে।
      </p>
      <p className="mt-3 leading-relaxed">
        হিসাব নয়, কোনো ফতোয়া দরকার হলে আপনার স্থানীয় ইমাম বা স্বীকৃত কোনো
        ফতোয়া বিভাগই শুরু করার ঠিক জায়গা — আর সম্পত্তি বা উত্তরাধিকারের আইনি
        দিক জড়িত থাকলে আপনার দেশের একজন আইনজীবী।
      </p>

      <div className="mt-12 rounded-2xl border border-brand/25 bg-brand-soft px-5 py-4">
        <p className="leading-relaxed text-brand">
          <strong>ক্যালকুলেটরে আপনি যা লেখেন তার কিছুই আমাদের কাছে আসে না।</strong>{" "}
          সবটাই আপনার ব্রাউজারে থাকে। আপনার সংখ্যাগুলো আমাদের দেখাতে চাইলে
          ইমেইলে নিজেই লিখে পাঠাতে হবে।
        </p>
      </div>
    </ContentPage>
  );
}
