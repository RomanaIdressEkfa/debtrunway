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

/**
 * The gold and silver calculator's labels.
 *
 * It sits in this file rather than a third one because it shares the same
 * shape and the same lookup function: keyed on the exact English, falling
 * back to it when a key is missing. The engine strings for this calculator
 * come from gold-zakat.ts and are few enough to live here beside the UI.
 */
export const BN_GOLD: Record<string, string> = {
  // Step 1
  "Today's price": "আজকের দাম",
  "Filled in from the market, in the currency you pick. Change either figure if your local rate differs.":
    "বাজার থেকে বসানো, আপনি যে মুদ্রা বাছবেন সেই অনুযায়ী। আপনার এলাকার দাম আলাদা হলে বদলে নিন।",
  "Prices are shown in it": "এই মুদ্রাতেই সব দেখানো হবে",
  "Gold, per gram": "সোনা, প্রতি গ্রাম",
  "Pure, 24 carat": "খাঁটি, ২৪ ক্যারেট",
  "Silver, per gram": "রুপা, প্রতি গ্রাম",
  "Fine silver": "খাঁটি রুপা",

  // Step 2
  "What is in the box": "বাক্সে কী কী আছে",
  "Weigh each piece as it is, alloy and all — the carat takes the alloy back out. Zakat is owed on the gold, not on the copper it is mixed with.":
    "প্রতিটি গহনা যেমন আছে তেমনই ওজন করুন, খাদসহ — ক্যারেট দিয়ে খাদটা বাদ চলে যাবে। যাকাত সোনার ওপর, তার সাথে মেশানো তামার ওপর নয়।",
  "What the piece is": "গহনাটা কী",
  "Bangles, ring, coins": "চুড়ি, আংটি, মুদ্রা",
  Weight: "ওজন",
  Carat: "ক্যারেট",
  Fineness: "বিশুদ্ধতা",
  Purity: "বিশুদ্ধতা",
  Worn: "পরা হয়",
  Stored: "রাখা আছে",

  // Step 3
  "Which position on worn jewellery": "পরিহিত গহনায় কোন মত",
  "This is the one question that changes the answer most, and the schools genuinely differ on it. Neither position is the calculator's to pick.":
    "এই একটা প্রশ্নেই উত্তর সবচেয়ে বেশি বদলায়, আর এখানে মাযহাবগুলোর মধ্যে প্রকৃত মতভেদ আছে। কোনটা নেবেন সেটা ক্যালকুলেটরের ঠিক করার বিষয় নয়।",
  "Hanafi — use makes no difference to gold and silver":
    "হানাফি — সোনা-রুপায় ব্যবহারে কোনো পার্থক্য হয় না",
  "Maliki, Shafi'i, Hanbali — lawful jewellery in normal use":
    "মালিকি, শাফিয়ি, হাম্বলি — স্বাভাবিক ব্যবহারের বৈধ গহনা বাদ",
  "All of it is zakatable": "সবটাতেই যাকাত",
  "Worn jewellery is exempt": "পরিহিত গহনা বাদ",

  // Other wealth and the answer
  "Your other zakatable wealth": "আপনার বাকি যাকাতযোগ্য সম্পদ",
  "Cash, bank, investments — the nisab is measured on everything together":
    "নগদ, ব্যাংক, বিনিয়োগ — নিসাব সবকিছু একসাথে ধরে মাপা হয়",
  "Measure nisab against": "নিসাব কিসের সাথে মাপবেন",
  "Enter a metal price above and the answer appears here.":
    "উপরে ধাতুর দাম দিন, উত্তর এখানে দেখা যাবে।",
  "Below the nisab": "নিসাবের নিচে",
  "Metal value": "ধাতুর মূল্য",
  "Piece by piece": "গহনা ধরে ধরে",
  "Pure metal": "খাঁটি ধাতু",
  Weighed: "ওজন",
  Counted: "ধরা হলো",
  Piece: "গহনা",
  "This is one part only": "এটা কেবল একটা অংশ",
  "This is a calculator, not a fatwa.": "এটা একটা ক্যালকুলেটর, ফতোয়া নয়।",
};

/** Gold calculator strings, falling back to English. */
export const bnGold = (s: string): string => BN_GOLD[s] ?? s;

/**
 * Prayer times and Qibla.
 *
 * The prayer names are the one place where translation is not a choice: a
 * Bengali speaker does not read "Dhuhr", they read জোহর, and a timetable that
 * says Dhuhr is a timetable they have to decode line by line every day.
 *
 * The calculation method names stay recognisable rather than literal. "Muslim
 * World League" becomes মুসলিম ওয়ার্ল্ড লীগ, not a translated description of
 * what the body does — someone told by their mosque to use MWL needs to find
 * that name in the list.
 */
export const BN_PRAYER: Record<string, string> = {
  // The five, plus sunrise
  Fajr: "ফজর",
  Sunrise: "সূর্যোদয়",
  Dhuhr: "জোহর",
  Asr: "আসর",
  Maghrib: "মাগরিব",
  Isha: "এশা",

  // Conventions
  "Muslim World League": "মুসলিম ওয়ার্ল্ড লীগ",
  ISNA: "ISNA (উত্তর আমেরিকা)",
  "Egyptian General Authority": "মিশরীয় জেনারেল অথরিটি",
  "Umm al-Qura": "উম্মুল কুরা (সৌদি আরব)",
  "University of Islamic Sciences, Karachi": "করাচি ইসলামিক বিশ্ববিদ্যালয়",
  "Institute of Geophysics, Tehran": "তেহরান জিওফিজিক্স ইনস্টিটিউট",

  // Asr
  Hanafi: "হানাফি",
  "Maliki, Shafi'i, Hanbali": "মালিকি, শাফিয়ি, হাম্বলি",
  "Shadow ×1": "ছায়া ×১",
  "Shadow ×2": "ছায়া ×২",

  // Location
  "Your location": "আপনার অবস্থান",
  "Your coordinates": "আপনার স্থানাঙ্ক",
  Latitude: "অক্ষাংশ",
  Longitude: "দ্রাঘিমাংশ",
  "Positive north, negative south": "উত্তরে ধনাত্মক, দক্ষিণে ঋণাত্মক",
  "Positive east, negative west": "পূর্বে ধনাত্মক, পশ্চিমে ঋণাত্মক",
  "Use my exact location": "আমার সঠিক অবস্থান ব্যবহার করুন",
  "Asking your browser…": "ব্রাউজারকে জিজ্ঞেস করা হচ্ছে…",
  "Using the coordinates you entered.":
    "আপনার দেওয়া স্থানাঙ্ক ব্যবহার করা হচ্ছে।",
  "Using the exact location your browser gave, which stayed in this tab.":
    "ব্রাউজার যে সঠিক অবস্থান দিয়েছে সেটাই ব্যবহার হচ্ছে — যা এই ট্যাবের বাইরে যায়নি।",
  "Your location could not be read. The times below stay on your time zone.":
    "আপনার অবস্থান পড়া যায়নি। নিচের সময়গুলো আপনার টাইম জোন ধরে দেখানো হচ্ছে।",

  // Results
  "Working out your times…": "আপনার সময় বের করা হচ্ছে…",
  "Check these against your local mosque.":
    "আপনার এলাকার মসজিদের সাথে মিলিয়ে নিন।",
  Next: "পরবর্তী",
  Qibla: "কিবলা",
};

export const bnPrayer = (s: string): string => BN_PRAYER[s] ?? s;

/**
 * Zakat al-Fitr and qurbani — the two Ramadan and Eid pages.
 *
 * Staples are translated to what is actually eaten and actually said. The
 * engine offers wheat, barley, dates and raisins because those are the four
 * named in the hadith, and rice because it is what most of the Muslim world
 * eats; in Bengali the rice entry is চাল, and a Bangladeshi reader will pick
 * it without hesitating.
 */
export const BN_FITR_QURBANI: Record<string, string> = {
  // --- Fitr ---
  "Which staple, and at what price": "কোন খাদ্য, আর কত দাম",
  "Who you are paying for": "কার কার পক্ষ থেকে দিচ্ছেন",
  "Price per kilogram": "প্রতি কেজির দাম",
  "People in the household": "পরিবারের সদস্য",
  "One more person": "একজন বাড়ান",
  "One fewer person": "একজন কমান",
  "Per person": "জনপ্রতি",
  "Total to give": "মোট দিতে হবে",
  "How much wheat": "কতটুকু গম",
  "Half a sa'": "অর্ধ সা'",
  "Hanafi, for wheat": "হানাফি — গমের ক্ষেত্রে",
  "It has to arrive before the Eid prayer.":
    "ঈদের নামাজের আগেই পৌঁছাতে হবে।",

  // Staples
  "Wheat or flour": "গম বা আটা",
  Barley: "যব",
  Dates: "খেজুর",
  Raisins: "কিশমিশ",
  Rice: "চাল",

  // --- Qurbani ---
  "Is it obligatory on you?": "আপনার ওপর কি ওয়াজিব?",
  "Who and what": "কার জন্য, আর কী",
  "Wealth you hold over Eid": "ঈদের সময় আপনার যে সম্পদ",
  "Cash, gold, savings — no lunar year needed here":
    "নগদ, সোনা, সঞ্চয় — এখানে এক বছর পার হওয়া লাগে না",
  "Sets the nisab": "এটা দিয়ে নিসাব ঠিক হয়",
  "Prices are in it": "এই মুদ্রাতেই দাম",
  "People to cover": "কতজনের জন্য",
  "Everyone the household is sacrificing for":
    "পরিবারের যাদের পক্ষ থেকে কুরবানি হবে",
  "Price of one share": "এক ভাগের দাম",
  "What a share in the animal costs": "পশুর এক ভাগে কত পড়ে",
  "The whole animal": "পুরো পশু",
  "Enter a price above to see the cost.":
    "উপরে দাম দিলে খরচ দেখা যাবে।",
  "Wajib above the nisab": "নিসাবের উপরে হলে ওয়াজিব",
  "Hanafi — obligatory on anyone holding the threshold during Eid":
    "হানাফি — ঈদের দিনগুলোতে নিসাব পরিমাণ সম্পদ থাকলে ওয়াজিব",
  "Maliki, Shafi'i, Hanbali — strongly urged, not obligatory":
    "মালিকি, শাফিয়ি, হাম্বলি — সুন্নতে মুআক্কাদা, ওয়াজিব নয়",

  // Animals
  Goat: "ছাগল",
  Sheep: "ভেড়া",
  Cow: "গরু",
  Buffalo: "মহিষ",
  Camel: "উট",

  // Distribution
  "Your household": "আপনার পরিবার",
  "Relatives, neighbours and friends": "আত্মীয়, প্রতিবেশী ও বন্ধু",
  "The poor": "গরিব-মিসকিন",

  // Shared
  "Maliki, Shafi'i, Hanbali": "মালিকি, শাফিয়ি, হাম্বলি",
  "This is a calculator, not a fatwa.": "এটা একটা ক্যালকুলেটর, ফতোয়া নয়।",
};

export const bnFitrQurbani = (s: string): string => BN_FITR_QURBANI[s] ?? s;

/**
 * Fidya, kaffarah and the Hijri calendar.
 *
 * The month names are the interesting part. Hijri months already have settled
 * Bengali spellings that every Bangladeshi Muslim reads — মুহাররম, রমজান — so
 * those are transliterations of the Arabic into the script people know, not
 * translations of what the names mean.
 */
export const BN_FIDYA_HIJRI: Record<string, string> = {
  // --- Fidya and kaffarah ---
  "Which days, and why": "কোন দিনগুলো, আর কেন",
  "Missed, and you can still fast them": "ছুটে গেছে, এখনো রাখতে পারবেন",
  "Missed, and you will never be able to fast them":
    "ছুটে গেছে, আর কখনোই রাখতে পারবেন না",
  "Broken deliberately, with no excuse":
    "ইচ্ছাকৃতভাবে ভেঙেছেন, কোনো ওজর ছাড়া",
  "Of those, how many are past a later Ramadan":
    "এর মধ্যে কয়টা পরের রমজান পার হয়ে গেছে",
  "Days you did not make up before the following Ramadan came round":
    "পরের রমজান আসার আগে যে দিনগুলোর কাজা করেননি",
  "What one day's feeding costs": "একদিনের খাওয়ানোর খরচ কত",
  "Wheat, per kilogram": "গম, প্রতি কেজি",
  "By weight of wheat": "গমের ওজন ধরে",
  "Rate for one day": "একদিনের হার",
  "The figure your mosque or charity announces":
    "আপনার মসজিদ বা সংস্থা যে অঙ্ক ঘোষণা করে",
  "In your own currency, as announced locally":
    "আপনার নিজের মুদ্রায়, স্থানীয়ভাবে যেমন ঘোষণা হয়",
  "The fast alone": "শুধু রোজা",
  "Feeding as well": "সাথে খাওয়ানোও",
  "Line by line": "ধাপে ধাপে",

  // --- Hijri ---
  "Gregorian to Hijri": "ইংরেজি থেকে হিজরি",
  "Hijri to Gregorian": "হিজরি থেকে ইংরেজি",
  "In the Hijri calendar": "হিজরি ক্যালেন্ডারে",
  "In the Gregorian calendar": "ইংরেজি ক্যালেন্ডারে",
  "Type any date and the other calendar follows. The fields start on today.":
    "যেকোনো তারিখ লিখুন, অন্য ক্যালেন্ডারটা সাথে সাথে বদলাবে। ঘরগুলো আজকের তারিখে শুরু হয়।",
  Day: "দিন",
  Month: "মাস",
  Year: "সন",
  "1 to 30": "১ থেকে ৩০",
  "Reading today's date…": "আজকের তারিখ পড়া হচ্ছে…",
  "What is coming": "সামনে যা আসছে",
  "Your zakat anniversary": "আপনার যাকাতের তারিখ",
  "This is arithmetic, not a sighting.": "এটা হিসাব, চাঁদ দেখা নয়।",
  "Ramadan begins": "রমজান শুরু",
  "Eid al-Fitr": "ঈদুল ফিতর",
  "Day of Arafah": "আরাফার দিন",
  "Eid al-Adha": "ঈদুল আজহা",
  "Islamic New Year": "হিজরি নববর্ষ",
  Ashura: "আশুরা",

  // Hijri months, in the spellings Bengali readers already know
  Muharram: "মুহাররম",
  Safar: "সফর",
  "Rabi' al-Awwal": "রবিউল আউয়াল",
  "Rabi' al-Thani": "রবিউস সানি",
  "Jumada al-Ula": "জমাদিউল আউয়াল",
  "Jumada al-Akhirah": "জমাদিউস সানি",
  Rajab: "রজব",
  "Sha'ban": "শাবান",
  Ramadan: "রমজান",
  Shawwal: "শাওয়াল",
  "Dhu al-Qa'dah": "জিলকদ",
  "Dhu al-Hijjah": "জিলহজ",

  // Gregorian months
  January: "জানুয়ারি",
  February: "ফেব্রুয়ারি",
  March: "মার্চ",
  April: "এপ্রিল",
  May: "মে",
  June: "জুন",
  July: "জুলাই",
  August: "আগস্ট",
  September: "সেপ্টেম্বর",
  October: "অক্টোবর",
  November: "নভেম্বর",
  December: "ডিসেম্বর",
};

export const bnFidyaHijri = (s: string): string => BN_FIDYA_HIJRI[s] ?? s;
