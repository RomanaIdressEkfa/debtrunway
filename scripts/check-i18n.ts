/**
 * The language routing, checked where getting it wrong is silent.
 *
 * Every failure this guards against looks fine on screen. A path that does
 * not round-trip sends the language toggle to a page that does not exist; a
 * missing hreflang means Google never connects the two versions and may treat
 * the Bengali page as duplicate content; a canonical pointing at the wrong
 * language quietly tells Google to drop one of them.
 *
 * None of that shows up in a browser. It shows up months later as a page that
 * never ranked.
 */

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_NAMES,
  alternatesFor,
  localeOf,
  toLocale,
} from "../src/lib/i18n";
import { calculators } from "../src/lib/calculators";
import { ANSWERS } from "../src/lib/answers";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

/** Every path the site has, in its English form. */
const PATHS = [
  "/",
  ...calculators.map((c) => c.slug),
  "/answers",
  ...ANSWERS.map((a) => `/answers/${a.slug}`),
  "/about",
  "/support",
  "/contact",
  "/privacy",
  "/terms",
];

console.log("\n--- The two locales ---\n");

{
  ok("there are exactly two locales", LOCALES.length === 2, LOCALES.join(", "));
  ok("English is the default", DEFAULT_LOCALE === "en", DEFAULT_LOCALE);
  ok(
    "each language is named in its own script",
    LOCALE_NAMES.bn === "বাংলা" && LOCALE_NAMES.en === "English",
    `${LOCALE_NAMES.en} / ${LOCALE_NAMES.bn}`,
  );
}

console.log("\n--- Paths convert, and convert back ---\n");

{
  const broken = PATHS.filter((p) => toLocale(toLocale(p, "bn"), "en") !== p);
  ok(
    "every English path survives a trip through Bengali and back",
    broken.length === 0,
    broken.join("; ") || `${PATHS.length} paths`,
  );
}

{
  const broken = PATHS.filter((p) => toLocale(p, "en") !== p);
  ok(
    "asking for English leaves an English path alone",
    broken.length === 0,
    broken.join("; ") || "unchanged",
  );
}

{
  // The home page is the one that does not follow the pattern: /bn, not /bn/.
  ok("the home page becomes /bn", toLocale("/", "bn") === "/bn", toLocale("/", "bn"));
  ok("and /bn comes back as /", toLocale("/bn", "en") === "/", toLocale("/bn", "en"));
}

{
  const broken = PATHS.filter((p) => {
    const bn = toLocale(p, "bn");
    return !bn.startsWith("/bn");
  });
  ok("every Bengali path sits under /bn", broken.length === 0, broken.join("; ") || "all");
}

{
  // Applying Bengali twice must not produce /bn/bn/...
  const doubled = PATHS.filter((p) => toLocale(toLocale(p, "bn"), "bn").includes("/bn/bn"));
  ok(
    "asking for Bengali twice does not nest it",
    doubled.length === 0,
    doubled.join("; ") || "idempotent",
  );
}

console.log("\n--- The locale is readable from the path ---\n");

{
  const wrong = PATHS.filter((p) => localeOf(p) !== "en");
  ok("English paths read as English", wrong.length === 0, wrong.join("; ") || "all");
}

{
  const wrong = PATHS.filter((p) => localeOf(toLocale(p, "bn")) !== "bn");
  ok("Bengali paths read as Bengali", wrong.length === 0, wrong.join("; ") || "all");
}

{
  // The trap: a page whose slug merely begins with the letters bn.
  ok(
    "a slug starting with 'bn' is not mistaken for Bengali",
    localeOf("/bnf-calculator") === "en",
    localeOf("/bnf-calculator"),
  );
}

console.log("\n--- What Google is told ---\n");

{
  const a = alternatesFor("/zakat-calculator");
  ok(
    "canonical points at the page itself",
    a.canonical === "/zakat-calculator",
    a.canonical,
  );
  ok(
    "both languages are declared",
    a.languages.en === "/zakat-calculator" && a.languages.bn === "/bn/zakat-calculator",
    `${a.languages.en} + ${a.languages.bn}`,
  );
  ok(
    "x-default sends everyone else to English",
    a.languages["x-default"] === "/zakat-calculator",
    a.languages["x-default"],
  );
}

{
  // The canonical must name the page declaring it. The first version of
  // alternatesFor ignored the locale, so the Bengali page shipped
  // canonical: "/" — an instruction to Google that the Bengali page is a
  // duplicate of the English one and should be dropped. It would have been
  // built, deployed, crawled and then silently discarded, achieving the
  // exact opposite of translating it.
  const bn = alternatesFor("/zakat-calculator", "bn");
  ok(
    "a Bengali page is canonical to itself, not to the English one",
    bn.canonical === "/bn/zakat-calculator",
    bn.canonical,
  );
  ok(
    "...and still declares the same pair as the English page",
    bn.languages.en === "/zakat-calculator" &&
      bn.languages.bn === "/bn/zakat-calculator",
    `${bn.languages.en} + ${bn.languages.bn}`,
  );
}

{
  // hreflang has to be reciprocal or Google ignores the pair entirely.
  const broken = PATHS.filter((p) => {
    const a = alternatesFor(p);
    return a.languages.en !== p || a.languages.bn !== toLocale(p, "bn");
  });
  ok(
    "every page declares both of its versions",
    broken.length === 0,
    broken.join("; ") || `${PATHS.length} pages`,
  );
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
