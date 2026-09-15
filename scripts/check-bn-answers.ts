/**
 * The Bengali answers say the same thing the English ones say.
 *
 * These are the longest pages on the site, and the only ones whose whole value
 * is in being precise about disagreement: "the majority hold X, a minority
 * hold Y" is the sentence pattern the section exists for. A translation that
 * drops a list item, loses a heading, or quietly shortens a paragraph into a
 * summary would still render, still read fluently, and still be a different
 * answer than the English page it claims to be a version of.
 *
 * So this checks structure rather than meaning — which is the part a machine
 * can check. Same slugs, same block sequence, same number of list items, and
 * no paragraph collapsed to a fraction of its original. It cannot tell whether
 * the Bengali is good; it can tell when it stopped being the same answer.
 */

import { ANSWERS, type Block } from "../src/lib/answers";
import {
  BN_ANSWERS,
  BN_ANSWER_UI,
  BN_TOPIC_LABELS,
  bnAnswer,
} from "../src/lib/bn-answers";
import { BN_PAGES } from "../src/lib/bn-pages";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

const text = (b: Block) =>
  b.kind === "ul" ? (b.items ?? []).join(" ") : (b.text ?? "");

console.log("\n--- Every answer has a Bengali version ---\n");

{
  const missing = ANSWERS.filter((a) => !BN_ANSWERS[a.slug]);
  ok(
    "no answer is left in English",
    missing.length === 0,
    missing.map((a) => a.slug).join(", ") ||
      `${ANSWERS.length} answers covered`,
  );
}

{
  const slugs = new Set(ANSWERS.map((a) => a.slug));
  const stale = Object.keys(BN_ANSWERS).filter((s) => !slugs.has(s));
  ok(
    "no Bengali answer exists for a slug the English list dropped",
    stale.length === 0,
    stale.join(", ") || "none stale",
  );
}

console.log("\n--- The two versions have the same shape ---\n");

{
  const wrong: string[] = [];
  for (const a of ANSWERS) {
    const bn = bnAnswer(a.slug);
    if (!bn) continue;
    const en = a.body.map((b) => b.kind).join(",");
    const got = bn.body.map((b) => b.kind).join(",");
    if (en !== got) wrong.push(`${a.slug}: ${got} vs ${en}`);
  }
  ok(
    "every answer has the same block sequence in both languages",
    wrong.length === 0,
    wrong.join(" | ") || `${ANSWERS.length} answers`,
  );
}

{
  const wrong: string[] = [];
  for (const a of ANSWERS) {
    const bn = bnAnswer(a.slug);
    if (!bn) continue;
    a.body.forEach((b, i) => {
      if (b.kind !== "ul") return;
      const enCount = (b.items ?? []).length;
      const bnCount = (bn.body[i]?.items ?? []).length;
      if (enCount !== bnCount) {
        wrong.push(`${a.slug} list ${i}: ${bnCount} vs ${enCount}`);
      }
    });
  }
  ok(
    "no list gained or lost an item in translation",
    wrong.length === 0,
    wrong.join(" | ") || "all lists match",
  );
}

{
  // Bengali runs a little shorter than English for the same content, so the
  // floor is generous. What it catches is a paragraph replaced by a sentence.
  const thin: string[] = [];
  for (const a of ANSWERS) {
    const bn = bnAnswer(a.slug);
    if (!bn) continue;
    a.body.forEach((b, i) => {
      const en = text(b).length;
      const got = text(bn.body[i] ?? { kind: "p", text: "" }).length;
      if (en > 120 && got < en * 0.45) {
        thin.push(`${a.slug} block ${i}: ${got} vs ${en}`);
      }
    });
  }
  ok(
    "no block was shortened into a summary",
    thin.length === 0,
    thin.join(" | ") || "every block carries its full text",
  );
}

console.log("\n--- The Bengali is actually Bengali ---\n");

{
  const notBengali: string[] = [];
  for (const [slug, bn] of Object.entries(BN_ANSWERS)) {
    for (const field of ["question", "title", "summary", "short"] as const) {
      if (!/[অ-হ]/.test(bn[field])) notBengali.push(`${slug}.${field}`);
    }
    bn.body.forEach((b, i) => {
      if (!/[অ-হ]/.test(text(b))) notBengali.push(`${slug}.body[${i}]`);
    });
  }
  ok(
    "no field was left in English",
    notBengali.length === 0,
    notBengali.join(", ") || `${Object.keys(BN_ANSWERS).length} answers`,
  );
}

{
  const stillEnglish = Object.entries(BN_ANSWER_UI).filter(
    ([, v]) => typeof v === "string" && !/[অ-হ]/.test(v),
  );
  ok(
    "the chrome around an answer is translated",
    stillEnglish.length === 0,
    stillEnglish.map(([k]) => k).join(", ") ||
      `${Object.keys(BN_ANSWER_UI).length} strings`,
  );
}

{
  const missing = ["money", "worship", "family"].filter(
    (t) => !BN_TOPIC_LABELS[t] || !/[অ-হ]/.test(BN_TOPIC_LABELS[t]),
  );
  ok(
    "all three topic headings are translated",
    missing.length === 0,
    missing.join(", ") || Object.values(BN_TOPIC_LABELS).join(", "),
  );
}

console.log("\n--- The related links point somewhere real ---\n");

{
  // A Bengali answer linking to an English calculator is not wrong, but a
  // Bengali answer linking to /bn/something-that-does-not-exist is a 404 in
  // the one place a reader is most likely to click.
  const broken: string[] = [];
  for (const [slug, bn] of Object.entries(BN_ANSWERS)) {
    for (const r of bn.related ?? []) {
      if (!r.href.startsWith("/bn/")) continue;
      const english = r.href.slice(3);
      if (!BN_PAGES.includes(english)) broken.push(`${slug} → ${r.href}`);
    }
  }
  ok(
    "no Bengali answer links to a Bengali page that does not exist",
    broken.length === 0,
    broken.join(" | ") || "every /bn link resolves",
  );
}

{
  const noLabel = Object.entries(BN_ANSWERS).flatMap(([slug, bn]) =>
    (bn.related ?? [])
      .filter((r) => !/[অ-হ]/.test(r.label))
      .map((r) => `${slug}: ${r.label}`),
  );
  ok(
    "every related link is labelled in Bengali",
    noLabel.length === 0,
    noLabel.join(" | ") || "all labels translated",
  );
}

{
  const inPages = Object.keys(BN_ANSWERS).every((s) =>
    BN_PAGES.includes(`/answers/${s}`),
  );
  ok(
    "every translated answer is registered in BN_PAGES",
    inPages && BN_PAGES.includes("/answers"),
    `${Object.keys(BN_ANSWERS).length} answers + the index`,
  );
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
