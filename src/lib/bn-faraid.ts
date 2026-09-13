/**
 * The faraid engine's own words, in Bengali.
 *
 * The engine writes its heir names and share reasons as English strings, and
 * it keeps doing so. Translating them at the point of display rather than
 * inside faraid.ts is deliberate: that file carries the Qur'anic shares, the
 * hajb rules, awl and radd, and 78 checks against the classical worked
 * examples. Editing it to add a second language would put the arithmetic at
 * risk to change some labels, and the arithmetic is the part nobody may get
 * wrong.
 *
 * The obvious weakness of a lookup table is that it fails silently: change a
 * word in the engine and the Bengali page quietly reverts to English for that
 * one line, and nobody notices. check-bn-faraid.ts closes that by reading the
 * engine's source, collecting every string it can emit, and failing when one
 * has no translation here. A gap becomes a red test instead of a page that is
 * Bengali except in the places that matter.
 */

/**
 * Heir names and share reasons, keyed by the exact English the engine emits.
 *
 * Where a share is stated as a fraction the Bengali keeps the fraction in
 * words — এক-ষষ্ঠাংশ rather than ১/৬ — because that is how the shares are
 * spoken and written in Bengali fiqh texts, and a reader checking this page
 * against a kitab should meet the same phrasing.
 */
export const BN_FARAID: Record<string, string> = {
  // --- Heirs ---
  Daughters: "মেয়েরা",
  "Full brother": "সহোদর ভাই",
  "Full brothers": "সহোদর ভাইয়েরা",
  "Full siblings": "সহোদর ভাই-বোন",
  "Full sister": "সহোদর বোন",
  "Full sisters": "সহোদর বোনেরা",
  Grandmother: "দাদি/নানি",
  Grandmothers: "দাদি-নানিরা",
  "Maternal grandmother": "নানি",
  "Maternal half-sibling": "বৈমাত্রেয় ভাই-বোন (মায়ের দিক থেকে)",
  "Maternal half-siblings": "মায়ের দিক থেকে ভাই-বোনেরা",
  "Paternal grandfather": "দাদা",
  "Paternal grandmother": "দাদি",
  "Paternal half-brother": "বৈমাত্রেয় ভাই",
  "Paternal half-brothers": "বৈমাত্রেয় ভাইয়েরা",
  "Paternal half-siblings": "বাবার দিক থেকে ভাই-বোনেরা",
  "Paternal half-sister": "বৈমাত্রেয় বোন",
  "Paternal half-sisters": "বৈমাত্রেয় বোনেরা",
  "Son's children": "ছেলের সন্তান",
  "Son's daughter": "ছেলের মেয়ে (পৌত্রী)",
  "Son's daughters": "ছেলের মেয়েরা",
  "Son's son": "ছেলের ছেলে (পৌত্র)",
  "Son's sons": "ছেলের ছেলেরা",

  // --- Fixed shares, with the reason they apply ---
  "One eighth — her husband left a child":
    "এক-অষ্টমাংশ — স্বামীর সন্তান রয়েছে",
  "One eighth, divided equally between them — their husband left a child":
    "এক-অষ্টমাংশ, নিজেদের মধ্যে সমানভাবে ভাগ — স্বামীর সন্তান রয়েছে",
  "One half — an only daughter, with no son":
    "অর্ধেক — একমাত্র মেয়ে, কোনো ছেলে নেই",
  "One half — an only full sister": "অর্ধেক — একমাত্র সহোদর বোন",
  "One half — an only paternal half-sister":
    "অর্ধেক — একমাত্র বৈমাত্রেয় বোন",
  "One half — no child or grandchild":
    "অর্ধেক — কোনো সন্তান বা পৌত্র-পৌত্রী নেই",
  "One half, standing in a daughter's place":
    "অর্ধেক, মেয়ের স্থলাভিষিক্ত হয়ে",
  "One quarter — his wife left a child":
    "এক-চতুর্থাংশ — স্ত্রীর সন্তান রয়েছে",
  "One quarter — no child or grandchild":
    "এক-চতুর্থাংশ — কোনো সন্তান বা পৌত্র-পৌত্রী নেই",
  "One quarter, divided equally between them — no child or grandchild":
    "এক-চতুর্থাংশ, নিজেদের মধ্যে সমানভাবে ভাগ — কোনো সন্তান বা পৌত্র-পৌত্রী নেই",
  "One sixth": "এক-ষষ্ঠাংশ",
  "One sixth as a fixed share, plus whatever is left over":
    "নির্ধারিত অংশ হিসেবে এক-ষষ্ঠাংশ, সাথে যা অবশিষ্ট থাকে",
  "One sixth — a son or son's son takes the residue":
    "এক-ষষ্ঠাংশ — অবশিষ্ট অংশ ছেলে বা ছেলের ছেলে নেবে",
  "One sixth — her child left children of their own":
    "এক-ষষ্ঠাংশ — তাঁর সন্তানের নিজেরও সন্তান রয়েছে",
  "One sixth — two or more siblings survive":
    "এক-ষষ্ঠাংশ — দুই বা ততোধিক ভাই-বোন জীবিত",
  "One sixth, completing the two thirds set aside for the daughters":
    "এক-ষষ্ঠাংশ, মেয়েদের জন্য নির্ধারিত দুই-তৃতীয়াংশ পূর্ণ করতে",
  "One sixth, divided equally between them, in the mother's place":
    "এক-ষষ্ঠাংশ, নিজেদের মধ্যে সমানভাবে ভাগ, মায়ের স্থলে",
  "One sixth, in the mother's place": "এক-ষষ্ঠাংশ, মায়ের স্থলে",
  "One third — no child, and fewer than two siblings":
    "এক-তৃতীয়াংশ — কোনো সন্তান নেই, আর ভাই-বোন দুইয়ের কম",
  "One third, divided equally — brothers and sisters alike":
    "এক-তৃতীয়াংশ, সমানভাবে ভাগ — ভাই ও বোন উভয়েই সমান",
  "Two thirds, divided equally": "দুই-তৃতীয়াংশ, সমানভাবে ভাগ",
  "Two thirds, divided equally — two or more daughters, with no son":
    "দুই-তৃতীয়াংশ, সমানভাবে ভাগ — দুই বা ততোধিক মেয়ে, কোনো ছেলে নেই",
  "Two thirds, divided equally, standing in the daughters' place":
    "দুই-তৃতীয়াংশ, সমানভাবে ভাগ, মেয়েদের স্থলাভিষিক্ত হয়ে",

  // --- Residue ---
  "Everything the fixed shares leave behind":
    "নির্ধারিত অংশগুলো দেওয়ার পর যা অবশিষ্ট থাকে",
  "One share of the remainder to each daughter for every two to a son":
    "অবশিষ্ট অংশে ছেলের দুই ভাগের বিপরীতে মেয়ের এক ভাগ",
  "Two shares of the remainder to each son for every one to a daughter":
    "অবশিষ্ট অংশে প্রতি মেয়ের এক ভাগের বিপরীতে ছেলের দুই ভাগ",
  "What remains once the daughters have taken their share":
    "মেয়েরা নিজেদের অংশ নেওয়ার পর যা অবশিষ্ট থাকে",
};

/**
 * Translate an engine string, falling back to the English.
 *
 * The fallback is deliberate and so is the check that makes it unnecessary:
 * a reader meeting one English line on a Bengali page is a small failure, and
 * a page that throws because a word changed is a large one.
 */
export const bnFaraid = (s: string): string => BN_FARAID[s] ?? s;

/**
 * The picker's own labels, which the component owns rather than the engine.
 *
 * Kept in a second map so the coverage check can hold the engine's strings to
 * a strict standard — every one translated, none stale — without tripping
 * over UI text the engine has never heard of.
 */
export const BN_FARAID_UI: Record<string, string> = {
  // Group headings and their hints
  "Spouse and parents": "স্বামী-স্ত্রী ও পিতা-মাতা",
  "The nearest heirs, and the ones most often miscounted.":
    "সবচেয়ে নিকট আত্মীয়, আর এখানেই হিসাব সবচেয়ে বেশি ভুল হয়।",
  Children: "সন্তান",
  "A son changes almost every other share on this page.":
    "একজন ছেলে থাকলে এই পাতার প্রায় প্রতিটি অংশই বদলে যায়।",
  "Son's children": "ছেলের সন্তান",
  "They inherit only through a son who died before the deceased.":
    "মৃতের আগে মারা যাওয়া ছেলের মাধ্যমেই কেবল তারা ওয়ারিশ হয়।",
  Grandparents: "দাদা-দাদি ও নানি",
  "A father blocks his own mother; a mother blocks both grandmothers.":
    "বাবা থাকলে তাঁর মা বাদ পড়েন; মা থাকলে দাদি ও নানি দুজনেই বাদ পড়েন।",
  Siblings: "ভাই-বোন",
  "All of them are excluded by a son, a son's son, or the father.":
    "ছেলে, ছেলের ছেলে বা বাবা থাকলে এঁদের কেউই পান না।",

  // Rows
  Husband: "স্বামী",
  Wives: "স্ত্রী",
  "They divide a single share between them":
    "একটি অংশ তাঁরা নিজেদের মধ্যে ভাগ করে নেন",
  Father: "বাবা",
  Mother: "মা",
  Sons: "ছেলে",
  "Father's father": "বাবার বাবা",
  "Father's mother": "বাবার মা",
  "Mother's mother": "মায়ের মা",
  "Full brothers": "সহোদর ভাই",
  "Full sisters": "সহোদর বোন",
  "Half-brothers (father's side)": "বৈমাত্রেয় ভাই (বাবার দিক)",
  "Half-sisters (father's side)": "বৈমাত্রেয় বোন (বাবার দিক)",
  "Half-siblings (mother's side)": "ভাই-বোন (মায়ের দিক)",
  "Brothers and sisters together — they take equally":
    "ভাই ও বোন একসাথে — তাঁরা সমান অংশ পান",

  // Steps and money fields
  "What was left behind": "যা রেখে গেছেন",
  "Total estate": "মোট সম্পত্তি",
  "Everything owned at death, before anything is taken out":
    "মৃত্যুর সময় যা কিছু ছিল, কিছু বাদ দেওয়ার আগে",
  "Funeral costs": "দাফন-কাফনের খরচ",
  "Paid before anything else": "সবার আগে এটাই দিতে হয়",
  "Outstanding debts": "বকেয়া ঋণ",
  "Settled in full before any heir inherits":
    "কোনো ওয়ারিশ পাওয়ার আগে পুরোটা শোধ করতে হয়",
  "Bequest (wasiyyah)": "ওসিয়ত",
  "Capped at one third, and only to someone who is not an heir":
    "সর্বোচ্চ এক-তৃতীয়াংশ, আর কেবল এমন কাউকে যিনি ওয়ারিশ নন",
  "Who survived": "কে কে জীবিত আছেন",
  "Save this division as a PDF": "এই বণ্টন PDF করে রাখুন",
};

/** Either map, English if neither has it. */
export const bnFaraidUi = (s: string): string =>
  BN_FARAID_UI[s] ?? BN_FARAID[s] ?? s;
