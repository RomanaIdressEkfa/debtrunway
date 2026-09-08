/**
 * The metadata, held to the lengths search engines actually render.
 *
 * This is not a style preference. Google renders roughly 600 pixels of title
 * and cuts the rest, which lands near 60 characters, and a truncated title
 * loses whatever was at the end — usually the specific words someone searched
 * for. Descriptions are cut near 160. Neither is penalised, but a cut title
 * reads worse in the result and gets clicked less, and click-through is the
 * one ranking input a small site can move quickly.
 *
 * An audit of the built HTML found five titles and three descriptions over
 * the line, most of them written months apart by someone who had no way to
 * see the limit while typing. So the limit lives here now, and a new page
 * cannot quietly go over it.
 *
 * The site suffix is counted, because the reader sees the rendered title and
 * not the registry field.
 */

import { calculators } from "../src/lib/calculators";
import { ANSWERS, topicLabels } from "../src/lib/answers";

/** What next/font's template appends to every page title. */
const SUFFIX = " | DebtRunway";
const TITLE_MAX = 60;
const DESC_MAX = 160;
/** Under this, a description is not doing its job of earning the click. */
const DESC_MIN = 70;

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

console.log("\n--- Titles fit the result ---\n");

{
  const long = calculators.filter(
    (c) => c.title.length + SUFFIX.length > TITLE_MAX,
  );
  ok(
    "every calculator title fits in 60 characters",
    long.length === 0,
    long.length === 0
      ? `${calculators.length} titles`
      : long.map((c) => `${c.slug} at ${c.title.length + SUFFIX.length}`).join("; "),
  );
}

{
  const long = ANSWERS.filter((a) => a.title.length + SUFFIX.length > TITLE_MAX);
  ok(
    "every answer title fits in 60 characters",
    long.length === 0,
    long.length === 0
      ? `${ANSWERS.length} titles`
      : long.map((a) => `${a.slug} at ${a.title.length + SUFFIX.length}`).join("; "),
  );
}

console.log("\n--- Descriptions fit, and earn the click ---\n");

{
  const bad = calculators.filter(
    (c) => c.description.length > DESC_MAX || c.description.length < DESC_MIN,
  );
  ok(
    "every calculator description is 70 to 160 characters",
    bad.length === 0,
    bad.length === 0
      ? `${calculators.length} descriptions`
      : bad.map((c) => `${c.slug} at ${c.description.length}`).join("; "),
  );
}

{
  const bad = ANSWERS.filter(
    (a) => a.summary.length > DESC_MAX || a.summary.length < DESC_MIN,
  );
  ok(
    "every answer summary is 70 to 160 characters",
    bad.length === 0,
    bad.length === 0
      ? `${ANSWERS.length} summaries`
      : bad.map((a) => `${a.slug} at ${a.summary.length}`).join("; "),
  );
}

console.log("\n--- Nothing collides ---\n");

{
  // Two pages with the same title compete with each other for the same query
  // and Google picks one, usually not the one you wanted.
  const titles = [
    ...calculators.map((c) => c.title),
    ...ANSWERS.map((a) => a.title),
  ];
  const dupes = titles.filter((t, i) => titles.indexOf(t) !== i);
  ok("no two pages share a title", dupes.length === 0, dupes.join("; ") || `${titles.length} distinct`);
}

{
  const descs = [
    ...calculators.map((c) => c.description),
    ...ANSWERS.map((a) => a.summary),
  ];
  const dupes = descs.filter((d, i) => descs.indexOf(d) !== i);
  ok("no two pages share a description", dupes.length === 0, dupes.length || "all distinct");
}

{
  const slugs = [
    ...calculators.map((c) => c.slug.replace(/^\//, "")),
    ...ANSWERS.map((a) => `answers/${a.slug}`),
  ];
  const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
  ok("no two pages share a URL", dupes.length === 0, dupes.join("; ") || `${slugs.length} URLs`);
}

console.log("\n--- The shape of a URL ---\n");

{
  const bad = [...calculators.map((c) => c.slug)].filter(
    (s) => !/^\/[a-z0-9]+(-[a-z0-9]+)*$/.test(s),
  );
  ok("calculator slugs are lowercase and hyphenated", bad.length === 0, bad.join("; ") || "clean");
}

{
  const bad = ANSWERS.map((a) => a.slug).filter(
    (s) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s),
  );
  ok("answer slugs are lowercase and hyphenated", bad.length === 0, bad.join("; ") || "clean");
}

{
  // A slug long enough to be truncated in a result is a slug nobody reads.
  const long = ANSWERS.filter((a) => a.slug.length > 60);
  ok(
    "no answer slug runs past 60 characters",
    long.length === 0,
    long.map((a) => `${a.slug} at ${a.slug.length}`).join("; ") || "clean",
  );
}

console.log("\n--- The answers hold their own shape ---\n");

{
  /**
   * The floor is 400 words, and the number is a floor rather than a target.
   *
   * It was written at 500 first, which failed four of the money answers at
   * 437 to 485. Those pages are not thin — they state the positions, name who
   * holds them, and stop when the question is settled. Padding them to clear
   * an invented threshold would have made them worse, so the threshold moved
   * rather than the prose.
   *
   * What 400 catches is the real failure mode: a two-paragraph page written
   * to occupy a keyword. Nothing here should ever be one, and if a future
   * answer trips this, the fix is to say more or to not publish it — never to
   * lower the number again.
   */
  const words = (a: (typeof ANSWERS)[number]) =>
    a.body.reduce(
      (n, b) =>
        n +
        (b.text ?? "").split(/\s+/).filter(Boolean).length +
        (b.items ?? []).join(" ").split(/\s+/).filter(Boolean).length,
      0,
    );
  const thin = ANSWERS.filter((a) => words(a) < 400);
  ok(
    "no answer is a thin page",
    thin.length === 0,
    thin.map((a) => `${a.slug} at ${words(a)}`).join("; ") ||
      `shortest ${Math.min(...ANSWERS.map(words))} words, longest ${Math.max(...ANSWERS.map(words))}`,
  );
}

{
  const noHeadings = ANSWERS.filter(
    (a) => a.body.filter((b) => b.kind === "h2").length < 2,
  );
  ok(
    "every answer is broken up by headings",
    noHeadings.length === 0,
    noHeadings.map((a) => a.slug).join("; ") || "all have two or more",
  );
}

{
  // Internal links are the whole reason the answers sit alongside the tools.
  const orphans = ANSWERS.filter((a) => (a.related ?? []).length === 0);
  ok(
    "every answer links out to a calculator",
    orphans.length === 0,
    orphans.map((a) => a.slug).join("; ") || `${ANSWERS.length} linked`,
  );
}

{
  const bad = ANSWERS.flatMap((a) =>
    (a.related ?? [])
      .filter((r) => r.href.startsWith("/") && !r.href.startsWith("/answers/"))
      .filter((r) => !calculators.some((c) => c.slug === r.href))
      .map((r) => `${a.slug} → ${r.href}`),
  );
  ok("every related link points at a page that exists", bad.length === 0, bad.join("; ") || "all resolve");
}

{
  const empty = (Object.keys(topicLabels) as (keyof typeof topicLabels)[]).filter(
    (t) => !ANSWERS.some((a) => a.topic === t),
  );
  ok("no topic heading is empty", empty.length === 0, empty.join("; ") || "all three filled");
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
