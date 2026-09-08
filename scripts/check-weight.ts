/**
 * The weight units, checked where a wrong conversion would change zakat.
 *
 * The important check is not that the arithmetic multiplies. It is that the
 * tola constant is the one the fiqh tables are built from — 7.5 tola has to
 * come out at exactly 87.48g, or the calculator quietly disagrees with every
 * printed nisab in South Asia and nobody can tell which is wrong.
 *
 * The second thing worth checking is `restate`, because it runs on data the
 * reader has already typed. A bug there does not throw or blank a field; it
 * multiplies someone's gold by twelve and looks entirely normal on screen.
 */

import {
  ANNA_PER_TOLA,
  GRAMS_PER_TOLA,
  WEIGHT_UNITS,
  formatWeight,
  fromGrams,
  restate,
  toGrams,
  tolaAndAnna,
  unitById,
} from "../src/lib/weight";
import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS } from "../src/lib/zakat";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};
const near = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol;

console.log("\n--- The nisab in the units it was recorded in ---\n");

{
  // The whole reason for choosing 11.664 over the physical 11.6638.
  const tolas = fromGrams(GOLD_NISAB_GRAMS, "tola");
  ok("the gold nisab is exactly 7.5 bhori", near(tolas, 7.5), tolas);
}

{
  const tolas = fromGrams(SILVER_NISAB_GRAMS, "tola");
  ok("the silver nisab is exactly 52.5 bhori", near(tolas, 52.5), tolas);
}

{
  ok("7.5 bhori is exactly 87.48g", near(toGrams(7.5, "tola"), 87.48), toGrams(7.5, "tola"));
  ok("52.5 bhori is exactly 612.36g", near(toGrams(52.5, "tola"), 612.36), toGrams(52.5, "tola"));
}

{
  // The classical ratio: 20 dinars to 200 dirhams, so silver nisab is seven
  // times the gold one by weight.
  const ratio = SILVER_NISAB_GRAMS / GOLD_NISAB_GRAMS;
  ok("silver nisab is seven times gold by weight", near(ratio, 7), ratio);
}

console.log("\n--- The units themselves ---\n");

{
  ok("one gram is one gram", toGrams(1, "g") === 1, toGrams(1, "g"));
  ok("one bhori is 11.664g", near(toGrams(1, "tola"), GRAMS_PER_TOLA), toGrams(1, "tola"));
  ok(
    "sixteen anna make one bhori",
    near(toGrams(ANNA_PER_TOLA, "anna"), GRAMS_PER_TOLA),
    toGrams(ANNA_PER_TOLA, "anna"),
  );
  ok("a troy ounce is 31.1034768g", near(toGrams(1, "ozt"), 31.1034768), toGrams(1, "ozt"));
  ok(
    "a troy ounce is about 2.666 bhori",
    Math.abs(fromGrams(toGrams(1, "ozt"), "tola") - 2.666) < 0.001,
    fromGrams(toGrams(1, "ozt"), "tola"),
  );
}

{
  // An unknown id must fall back to grams rather than to NaN, because it
  // reaches the engine as a weight either way.
  ok("an unknown unit falls back to grams", unitById("nonsense").id === "g", unitById("nonsense").id);
  ok("...and converts as grams", toGrams(5, "nonsense") === 5, toGrams(5, "nonsense"));
}

{
  let broken = 0;
  for (const u of WEIGHT_UNITS) {
    for (const v of [0.5, 1, 7.5, 40, 612.36]) {
      if (!near(fromGrams(toGrams(v, u.id), u.id), v, 1e-9)) broken++;
    }
  }
  ok("every unit converts out and back", broken === 0, broken === 0 ? "20 pairs" : broken);
}

console.log("\n--- Restating a typed field ---\n");

{
  // The bug this exists to prevent: 40g becoming 40 bhori.
  const asTola = restate("40", "g", "tola");
  ok("40g restated is not 40 bhori", asTola !== "40", asTola);
  ok(
    "...it is 3.429355 bhori",
    near(Number(asTola), 40 / GRAMS_PER_TOLA, 5e-5),
    `${asTola} against ${(40 / GRAMS_PER_TOLA).toFixed(6)}`,
  );
}

{
  // Round-tripping through the picker must not erode the figure. Rounding is
  // relative to a tenth of a milligram of metal rather than to a fixed digit
  // count, so four switches land back on the weight that was typed. A fixed
  // four decimals did not: the troy ounce step lost 0.0015g each pass.
  let chain = "87.48";
  chain = restate(chain, "g", "tola");
  chain = restate(chain, "tola", "anna");
  chain = restate(chain, "anna", "ozt");
  chain = restate(chain, "ozt", "g");
  ok(
    "g → bhori → anna → ozt → g returns the same weight",
    Math.abs(Number(chain) - 87.48) < 0.001,
    `${chain} from 87.48`,
  );
}

{
  ok("the same unit is left alone", restate("40", "g", "g") === "40", restate("40", "g", "g"));
  ok("an empty field stays empty", restate("", "g", "tola") === "", `"${restate("", "g", "tola")}"`);
  ok(
    "a half-typed figure survives",
    restate("1.", "g", "tola") !== "" && restate("1.", "g", "tola").startsWith("0.0857"),
    restate("1.", "g", "tola"),
  );
  ok("zero is left alone", restate("0", "g", "tola") === "0", restate("0", "g", "tola"));
  ok(
    "nonsense is left alone rather than zeroed",
    restate("abc", "g", "tola") === "abc",
    restate("abc", "g", "tola"),
  );
}

console.log("\n--- How weights are written out ---\n");

{
  ok("87.48g reads as 87.5 g", formatWeight(87.48, "g") === "87.5 g", formatWeight(87.48, "g"));
  ok(
    "the gold nisab reads as 7.5 bhori",
    formatWeight(GOLD_NISAB_GRAMS, "tola") === "7.5 bhori",
    formatWeight(GOLD_NISAB_GRAMS, "tola"),
  );
  ok(
    "the silver nisab reads as 52.5 bhori",
    formatWeight(SILVER_NISAB_GRAMS, "tola") === "52.5 bhori",
    formatWeight(SILVER_NISAB_GRAMS, "tola"),
  );
  ok(
    "a thousand grams carries a separator",
    formatWeight(1000, "g").includes(","),
    formatWeight(1000, "g"),
  );
}

{
  // The jeweller's form: 3 bhori 8 anna is three and a half tola.
  const grams = 3.5 * GRAMS_PER_TOLA;
  ok("3.5 bhori reads as 3 bhori 8 anna", tolaAndAnna(grams) === "3 bhori 8 anna", tolaAndAnna(grams));
  ok(
    "a whole bhori drops the anna",
    tolaAndAnna(GRAMS_PER_TOLA) === "1 bhori",
    tolaAndAnna(GRAMS_PER_TOLA),
  );
  ok(
    "under one bhori is given in anna alone",
    tolaAndAnna(GRAMS_PER_TOLA / 2) === "8 anna",
    tolaAndAnna(GRAMS_PER_TOLA / 2),
  );
  ok(
    "the gold nisab is 7 bhori 8 anna",
    tolaAndAnna(GOLD_NISAB_GRAMS) === "7 bhori 8 anna",
    tolaAndAnna(GOLD_NISAB_GRAMS),
  );
}

console.log("\n--- What it does to a real calculation ---\n");

{
  // A Dhaka household: 5 bhori of gold. Entered in the wrong unit it would be
  // 5 grams, and the answer would be off by a factor of eleven.
  const grams = toGrams(5, "tola");
  ok("5 bhori of gold is 58.32g", near(grams, 58.32), grams);
  ok("...which is below the gold nisab", grams < GOLD_NISAB_GRAMS, `${grams} against ${GOLD_NISAB_GRAMS}`);
  ok(
    "...but 8 bhori is above it",
    toGrams(8, "tola") > GOLD_NISAB_GRAMS,
    `${toGrams(8, "tola")} against ${GOLD_NISAB_GRAMS}`,
  );
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
