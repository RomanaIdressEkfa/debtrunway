/**
 * The E-number data, checked where it could mislead someone.
 *
 * There is nothing to compute here, so these are not arithmetic checks. They
 * are checks on the claims: that the additives the forwarded lists wrongly
 * condemn are marked settled, that the ones which genuinely turn on their
 * source are not quietly given a verdict, and that the search finds a number
 * however a person happens to type it.
 *
 * A wrong verdict on this page is worse than a wrong number elsewhere on the
 * site — someone eats or refuses a food on it — so the data is held to the
 * source categories rather than to a general sense of what is halal.
 */

import {
  ADDITIVES,
  VERDICTS,
  countByVerdict,
  findAdditives,
  type Verdict,
} from "../src/lib/e-numbers";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

const verdictOf = (code: string) =>
  ADDITIVES.find((a) => a.code === code)?.verdict;

console.log("\n--- The data holds together ---\n");

{
  const codes = ADDITIVES.map((a) => a.code);
  ok("every code is unique", new Set(codes).size === codes.length, `${codes.length} additives`);
}

{
  const valid = new Set(Object.keys(VERDICTS));
  const bad = ADDITIVES.filter((a) => !valid.has(a.verdict));
  ok("every verdict is one of the five", bad.length === 0, bad.map((a) => a.code).join(", ") || "clean");
}

{
  const bad = ADDITIVES.filter((a) => !/^E\d/.test(a.code));
  ok("every code starts with E and a digit", bad.length === 0, bad.map((a) => a.code).join(", ") || "clean");
}

{
  // A verdict without an explanation is the thing this page exists to avoid.
  const thin = ADDITIVES.filter((a) => a.note.length < 60 || a.role.length < 8);
  ok("every additive carries a real explanation", thin.length === 0, thin.map((a) => a.code).join(", ") || "clean");
}

{
  const counts = countByVerdict();
  const total = (Object.values(counts) as number[]).reduce((a, b) => a + b, 0);
  ok("the counts sum to the list", total === ADDITIVES.length, `${total} of ${ADDITIVES.length}`);
}

console.log("\n--- The ones the forwarded lists wrongly condemn ---\n");

{
  // These appear on nearly every "haram E numbers" message and none of them
  // has an animal step. Marking any of them anything but settled would repeat
  // the error the page exists to correct.
  const wronglyCondemned: [string, string][] = [
    ["E330", "citric acid, made by fermenting sugar with a mould"],
    ["E621", "MSG, made by bacterial fermentation"],
    ["E322", "lecithin, overwhelmingly from soya or sunflower"],
    ["E300", "ascorbic acid, synthesised"],
    ["E296", "malic acid, synthesised"],
    ["E202", "potassium sorbate, synthesised"],
    ["E211", "sodium benzoate, synthesised"],
    ["E500", "sodium bicarbonate, a mineral"],
    ["E100", "turmeric, a root"],
    ["E160a", "carotene, from carrots or algae"],
  ];
  for (const [code, why] of wronglyCondemned) {
    ok(`${code} is settled — ${why}`, verdictOf(code) === "settled", verdictOf(code) ?? "missing");
  }
}

console.log("\n--- The ones a number genuinely cannot settle ---\n");

{
  // Each of these exists in both an animal and a non-animal form under the
  // same number. Giving any of them a confident verdict would be a lie.
  const mustBeDepends = ["E471", "E472a–f", "E422", "E570", "E631", "E920", "E640", "E153"];
  for (const code of mustBeDepends) {
    ok(`${code} depends on its source`, verdictOf(code) === "depends", verdictOf(code) ?? "missing");
  }
}

console.log("\n--- The ones that are what they are ---\n");

{
  ok("E441 gelatine is animal-derived", verdictOf("E441") === "animal", verdictOf("E441") ?? "missing");
  ok("E542 bone phosphate is animal-derived", verdictOf("E542") === "animal", verdictOf("E542") ?? "missing");
  ok("E1000 cholic acid is animal-derived", verdictOf("E1000") === "animal", verdictOf("E1000") ?? "missing");
  ok("E120 cochineal is insect", verdictOf("E120") === "insect", verdictOf("E120") ?? "missing");
  ok("E904 shellac is insect", verdictOf("E904") === "insect", verdictOf("E904") ?? "missing");
  // Beeswax is not the third insect case. It is secreted by the bee rather
  // than being the bee, and is permitted on the same reasoning as honey — so
  // it is settled, and the entry has to say why it is not E904.
  const beeswax = ADDITIVES.find((a) => a.code === "E901");
  ok("E901 beeswax is settled, not an insect case", beeswax?.verdict === "settled", beeswax?.verdict ?? "missing");
  ok(
    "...and says why it differs from shellac and cochineal",
    /honey/i.test(beeswax?.note ?? ""),
    beeswax?.note.slice(0, 60) ?? "missing",
  );
  ok("E1510 ethanol is the alcohol case", verdictOf("E1510") === "alcohol", verdictOf("E1510") ?? "missing");
}

{
  // Nothing may be flatly declared haram by number alone, because no E number
  // means pork. "animal" means it turns on the slaughter, which is different.
  const animals = ADDITIVES.filter((a) => a.verdict === "animal");
  const silent = animals.filter(
    (a) => !/slaughter|halal|certif|source|origin|fish|bovine|porcine|pig/i.test(a.note),
  );
  ok(
    "every animal-derived entry says what it turns on",
    silent.length === 0,
    silent.map((a) => a.code).join(", ") || `${animals.length} entries`,
  );
}

console.log("\n--- Searching the way people actually type ---\n");

{
  const ways = ["471", "E471", "e471", " e 471 ", "E471 "];
  for (const q of ways) {
    const hit = findAdditives(q).some((a) => a.code === "E471");
    ok(`"${q}" finds E471`, hit, hit ? "found" : "not found");
  }
}

{
  const byName: [string, string][] = [
    ["gelatin", "E441"],
    ["lecithin", "E322"],
    ["cochineal", "E120"],
    ["shellac", "E904"],
    ["glycerol", "E422"],
    ["carmine", "E120"],
  ];
  for (const [q, code] of byName) {
    const hit = findAdditives(q).some((a) => a.code === code);
    ok(`"${q}" finds ${code}`, hit, hit ? "found" : "not found");
  }
}

{
  ok("an empty search returns everything", findAdditives("   ").length === ADDITIVES.length, findAdditives("   ").length);
  ok("nonsense returns nothing", findAdditives("zzzqqq").length === 0, findAdditives("zzzqqq").length);
}

{
  // Every additive must be reachable by its own code, or it is unfindable.
  const unreachable = ADDITIVES.filter(
    (a) => !findAdditives(a.code).some((r) => r.code === a.code),
  );
  ok("every additive is findable by its code", unreachable.length === 0, unreachable.map((a) => a.code).join(", ") || "all 36");
}

console.log("\n--- The verdict labels ---\n");

{
  const used = new Set(ADDITIVES.map((a) => a.verdict));
  const unused = (Object.keys(VERDICTS) as Verdict[]).filter((v) => !used.has(v));
  ok("every verdict category is actually used", unused.length === 0, unused.join(", ") || "all five");
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
