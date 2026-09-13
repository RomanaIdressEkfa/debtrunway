/**
 * Every string the faraid engine can emit has a Bengali translation.
 *
 * The Bengali inheritance page translates the engine's output through a
 * lookup table rather than by editing faraid.ts, because that file carries
 * the Qur'anic shares, hajb, awl and radd, and 78 checks against the
 * classical worked examples. Touching it to change some labels would put the
 * arithmetic at risk for no gain.
 *
 * A lookup table fails silently, though, and that is the whole reason this
 * check exists. Reword one line in the engine and the Bengali page reverts to
 * English for that line only — on a page about dividing a dead person's
 * estate, in the middle of a Bengali sentence. Nobody would report it and
 * nobody would notice.
 *
 * So the engine's source is read here and every quoted string it could put in
 * front of a reader is required to have a translation. A gap is a red test
 * rather than a page that is Bengali except where it counts.
 */

import { readFileSync } from "node:fs";
import { BN_FARAID, bnFaraid } from "../src/lib/bn-faraid";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

/**
 * Strings the engine emits for a reader: heir names and share reasons.
 *
 * Matched on a capital letter and a reasonable length, which is what those
 * look like and what internal identifiers do not. Anything shorter than nine
 * characters is a key or a type, not a sentence shown to anybody.
 */
const source = readFileSync("src/lib/faraid.ts", "utf8");
const emitted = [
  ...new Set((source.match(/"[A-Z][^"]{8,90}"/g) ?? []).map((s) => s.slice(1, -1))),
].sort();

console.log("\n--- Every engine string is translated ---\n");

{
  const missing = emitted.filter((s) => !(s in BN_FARAID));
  ok(
    "no string the engine can print is left in English",
    missing.length === 0,
    missing.length === 0
      ? `${emitted.length} strings covered`
      : `MISSING: ${missing.join(" | ")}`,
  );
}

{
  // The other direction: a translation for a string the engine no longer
  // emits is dead weight, and usually means a rewording was half-followed.
  const stale = Object.keys(BN_FARAID).filter((s) => !emitted.includes(s));
  ok(
    "no translation is left over from wording the engine has dropped",
    stale.length === 0,
    stale.length === 0 ? "none stale" : `STALE: ${stale.join(" | ")}`,
  );
}

console.log("\n--- The translations are real ---\n");

{
  // A Bengali string that is still the English one is a placeholder someone
  // meant to come back to.
  const untranslated = Object.entries(BN_FARAID).filter(([en, bn]) => en === bn);
  ok(
    "no entry is its own translation",
    untranslated.length === 0,
    untranslated.map(([en]) => en).join(" | ") || "all differ",
  );
}

{
  const notBengali = Object.entries(BN_FARAID).filter(
    ([, bn]) => !/[ঀ-৿]/.test(bn),
  );
  ok(
    "every translation actually contains Bengali",
    notBengali.length === 0,
    notBengali.map(([en]) => en).join(" | ") || `${Object.keys(BN_FARAID).length} entries`,
  );
}

console.log("\n--- The fallback behaves ---\n");

{
  ok(
    "a known string comes back translated",
    bnFaraid("Daughters") === "মেয়েরা",
    bnFaraid("Daughters"),
  );
  ok(
    "an unknown string comes back unchanged rather than blank",
    bnFaraid("Something the engine never says") === "Something the engine never says",
    bnFaraid("Something the engine never says"),
  );
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
