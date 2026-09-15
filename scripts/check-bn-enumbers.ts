/**
 * Every additive on the E number page has Bengali words, and the search still
 * finds the same rows in both languages.
 *
 * The English list in e-numbers.ts is the source of truth for which additives
 * exist, what their verdict is and how they match a query. bn-enumbers.ts only
 * supplies words. That split is what keeps the two pages from disagreeing
 * about whether E471 is settled — but it also means a code edited on one side
 * and not the other reverts a note to English in the middle of a Bengali page,
 * silently, on the one page whose entire purpose is telling people what is
 * actually knowable. So both directions are checked here.
 */

import { ADDITIVES, VERDICTS, findAdditives } from "../src/lib/e-numbers";
import {
  BN_ADDITIVES,
  BN_VERDICTS,
  ENUMBER_COPY,
  asciiDigits,
  bnAdditive,
  findAdditivesBn,
} from "../src/lib/bn-enumbers";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

console.log("\n--- Every additive is translated ---\n");

{
  const missing = ADDITIVES.filter((a) => !(a.code in BN_ADDITIVES));
  ok(
    "no additive is left in English",
    missing.length === 0,
    missing.length === 0
      ? `${ADDITIVES.length} additives covered`
      : `MISSING: ${missing.map((a) => a.code).join(", ")}`,
  );
}

{
  // The other direction. A Bengali entry for a code the English list dropped
  // is dead weight, and usually means a rename was half-followed.
  const codes = new Set(ADDITIVES.map((a) => a.code));
  const stale = Object.keys(BN_ADDITIVES).filter((c) => !codes.has(c));
  ok(
    "no translation is left over from an additive that was removed",
    stale.length === 0,
    stale.length === 0 ? "none stale" : `STALE: ${stale.join(", ")}`,
  );
}

{
  const empty = Object.entries(BN_ADDITIVES).filter(
    ([, b]) => !b.name.trim() || !b.role.trim() || !b.note.trim(),
  );
  ok(
    "every entry has a name, a role and a note",
    empty.length === 0,
    empty.map(([c]) => c).join(", ") || "all three fields present everywhere",
  );
}

{
  const notBengali = Object.entries(BN_ADDITIVES).filter(
    ([, b]) => !/[ঀ-৿]/.test(b.name) || !/[ঀ-৿]/.test(b.note),
  );
  ok(
    "every name and note actually contains Bengali",
    notBengali.length === 0,
    notBengali.map(([c]) => c).join(", ") ||
      `${Object.keys(BN_ADDITIVES).length} entries`,
  );
}

{
  // A note that is materially shorter than its English original is a summary,
  // not a translation — and on this page the note is the whole answer.
  const thin = ADDITIVES.filter(
    (a) => BN_ADDITIVES[a.code] && BN_ADDITIVES[a.code].note.length < a.note.length * 0.5,
  );
  ok(
    "no note was quietly shortened into a summary",
    thin.length === 0,
    thin.map((a) => a.code).join(", ") || "all notes carry their full sense",
  );
}

console.log("\n--- The verdicts line up ---\n");

{
  const missing = Object.keys(VERDICTS).filter((v) => !(v in BN_VERDICTS));
  ok(
    "all five verdicts have Bengali labels",
    missing.length === 0,
    missing.join(", ") || Object.keys(BN_VERDICTS).join(", "),
  );
}

{
  const notBengali = Object.entries(BN_VERDICTS).filter(
    ([, v]) => !/[ঀ-৿]/.test(v.label) || !/[ঀ-৿]/.test(v.short),
  );
  ok(
    "no verdict label is still English",
    notBengali.length === 0,
    notBengali.map(([v]) => v).join(", ") || "all five translated",
  );
}

console.log("\n--- Both languages find the same additives ---\n");

{
  // The codes are printed on the packet in English on both pages, so a code
  // search has to behave identically or the two pages are different tools.
  const same = ["E471", "471", "e120", "E441", "1510"].every(
    (q) =>
      JSON.stringify(findAdditives(q).map((a) => a.code)) ===
      JSON.stringify(findAdditivesBn(q).map((a) => a.code)),
  );
  ok("a code search returns the same rows in both languages", same, "5 queries");
}

{
  ok(
    "an English ingredient name still works on the Bengali page",
    findAdditivesBn("gelatine").some((a) => a.code === "E441"),
    findAdditivesBn("gelatine").map((a) => a.code).join(", ") || "nothing",
  );
}

{
  ok(
    "a Bengali ingredient name finds its additive",
    findAdditivesBn("জেলাটিন").some((a) => a.code === "E441"),
    findAdditivesBn("জেলাটিন").map((a) => a.code).join(", ") || "nothing",
  );
}

{
  // A reader typing on a Bengali keyboard types Bengali digits.
  ok("Bengali digits are read as digits", asciiDigits("৪৭১") === "471", asciiDigits("৪৭১"));
  ok(
    "৪৭১ finds E471",
    findAdditivesBn("৪৭১").some((a) => a.code === "E471"),
    findAdditivesBn("৪৭১").map((a) => a.code).join(", ") || "nothing",
  );
}

{
  ok(
    "an empty query lists everything, as it does in English",
    findAdditivesBn("").length === ADDITIVES.length,
    `${findAdditivesBn("").length} of ${ADDITIVES.length}`,
  );
}

{
  ok(
    "a query matching nothing returns nothing rather than everything",
    findAdditivesBn("কাঁঠাল").length === 0,
    findAdditivesBn("কাঁঠাল").length,
  );
}

console.log("\n--- The page's own words ---\n");

{
  const en = ENUMBER_COPY.en;
  const bn = ENUMBER_COPY.bn;
  const keys = Object.keys(en) as (keyof typeof en)[];
  ok(
    "the two copy blocks have exactly the same keys",
    keys.length === Object.keys(bn).length && keys.every((k) => k in bn),
    keys.join(", "),
  );

  const stillEnglish = keys.filter(
    (k) => typeof bn[k] === "string" && !/[ঀ-৿]/.test(bn[k] as string),
  );
  ok(
    "no Bengali copy string was left untranslated",
    stillEnglish.length === 0,
    stillEnglish.join(", ") || `${keys.length} strings`,
  );

  ok(
    "the empty-result message names what was searched for",
    bn.empty("E999").includes("E999") && en.empty("E999").includes("E999"),
    bn.empty("E999").slice(0, 28),
  );
}

console.log("\n--- The fallback behaves ---\n");

{
  const gelatine = ADDITIVES.find((a) => a.code === "E441")!;
  ok(
    "a known additive comes back translated",
    bnAdditive(gelatine).name === "জেলাটিন",
    bnAdditive(gelatine).name,
  );

  const unknown = { ...gelatine, code: "E0000" };
  ok(
    "an additive with no entry falls back to English rather than blank",
    bnAdditive(unknown).name === gelatine.name &&
      bnAdditive(unknown).note === gelatine.note,
    bnAdditive(unknown).name,
  );
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
