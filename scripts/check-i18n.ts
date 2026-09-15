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

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
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
import { BN_PAGES, hasBnVersion } from "../src/lib/bn-pages";

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

console.log("\n--- The toggle never offers a page that is not there ---\n");

{
  /**
   * The toggle shipped on every page while four had a Bengali version, so on
   * the rest it linked to /bn/something-nobody-built. A 404 on the one
   * control whose job is to say "this is also in your language".
   *
   * Nothing about that looked wrong until it was clicked, and it was clicked
   * on twenty-three pages.
   */
  const translated = PATHS.filter((p) => hasBnVersion(p));
  const untranslated = PATHS.filter((p) => !hasBnVersion(p));

  ok(
    "every page the toggle offers in Bengali really exists",
    translated.every((p) => p === "/" || BN_PAGES.includes(p)),
    translated.join(", "),
  );
  ok(
    "pages without a Bengali version are not offered one",
    untranslated.every((p) => !BN_PAGES.includes(p)),
    `${untranslated.length} pages stay English-only`,
  );
  ok(
    "the home page is always offered, in both directions",
    hasBnVersion("/") && hasBnVersion("/bn"),
    "both",
  );
  ok(
    "a Bengali page knows it has an English twin",
    BN_PAGES.every((p) => hasBnVersion(`/bn${p}`)),
    `${BN_PAGES.length} pairs`,
  );
  ok(
    "a trailing slash does not confuse it",
    hasBnVersion("/zakat-calculator/") === hasBnVersion("/zakat-calculator"),
    "same answer either way",
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


console.log("\n--- Neither language leaks into the other's pages ---\n");

/**
 * No shared component hardcodes Bengali.
 *
 * QuickNisab did, and the result was the worst of both languages at once: the
 * English homepage showed Bengali hints under English headings, and the
 * Bengali homepage showed English headings over Bengali hints. It rendered
 * without error, it passed every other check, and the only way to catch it was
 * to look at the built page — which is the one thing nobody does on a page
 * they wrote months ago.
 *
 * A component that serves both languages takes a `lang` prop and reads its
 * words from a bn-* module. The allowlist below is the short list of places
 * where Bengali on an English page is the intent rather than the bug.
 */
{
  // Bengali LETTERS, not the whole block: ৳ is a currency sign and belongs in
  // an English sentence about taka. A Bengali word always carries a letter.
  const BENGALI = /[অ-হ]/;

  /** Bengali belongs in these, and only these, outside src/app/bn and lib. */
  const DELIBERATE = new Set([
    // The toggle has to say "বাংলা" in Bengali or it is not a language toggle.
    "LanguageToggle.tsx",
    // The donation panel and its prompt are bilingual by design: a Bangladeshi
    // reader meets them on whichever page they happened to land on.
    "SupportPanel.tsx",
    "SupportPrompt.tsx",
    // The 404 is the one page whose language cannot be known at build time:
    // a static export renders it once and the host serves that file for every
    // address that does not exist, /bn included. It carries both languages
    // and picks in the browser.
    "NotFoundBody.tsx",
  ]);

  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        // Bengali pages are supposed to be in Bengali.
        if (entry.name === "bn") continue;
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".tsx")) continue;
      if (DELIBERATE.has(entry.name)) continue;
      const source = readFileSync(full, "utf8");
      // Strip comments first: a note explaining a bhori conversion is not a
      // label, and failing on one would teach people to stop writing them.
      const code = source
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "");
      if (BENGALI.test(code)) offenders.push(full.replace(/\\/g, "/"));
    }
  };
  walk("src/components");
  walk("src/app");

  ok(
    "no shared component or English page hardcodes Bengali",
    offenders.length === 0,
    offenders.join("; ") || "checked src/components and src/app",
  );
}


console.log("\n--- Bengali pages link to Bengali pages ---\n");

/**
 * No Bengali page sends a reader into English by accident.
 *
 * Eleven did. They were written while their targets existed only in English,
 * the targets were translated later, and nothing went back to repoint them —
 * so a Bengali page about zakat offered "সোনার যাকাত" and opened the English
 * gold page. Every one of them rendered, and no test knew.
 *
 * /support is the one deliberate exception: it is a single bilingual page
 * rather than two, which is why it is absent from BN_PAGES.
 */
{
  const BILINGUAL = new Set(["/support"]);
  const offenders: string[] = [];

  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith(".tsx")) continue;
      const source = readFileSync(full, "utf8");
      for (const m of source.matchAll(/href="(\/[^"]*)"/g)) {
        const href = m[1].replace(/\/$/, "") || "/";
        if (href.startsWith("/bn")) continue;
        if (BILINGUAL.has(href)) continue;
        // A link to a page with no Bengali version is honest; a link to one
        // that has a Bengali version, from a Bengali page, is the bug.
        if (hasBnVersion(href)) {
          offenders.push(`${full.replace(/\\/g, "/")} → ${href}`);
        }
      }
    }
  };
  walk("src/app/bn");

  // The same trap one level down. A calculator component that takes a lang
  // prop renders on both versions of its page, so an internal href written as
  // a bare string is English on the Bengali page — which is how seven of them
  // sent a Bengali reader to /zakat-calculator from inside a Bengali tool.
  for (const entry of readdirSync("src/components", { withFileTypes: true })) {
    if (!entry.name.endsWith(".tsx")) continue;
    const source = readFileSync(join("src/components", entry.name), "utf8");
    if (!/lang\s*=\s*"en"/.test(source)) continue;
    for (const m of source.matchAll(/href="(\/[a-z0-9\-/]*)"/g)) {
      const href = m[1].replace(/\/$/, "") || "/";
      if (href.startsWith("/bn")) continue;
      if (BILINGUAL.has(href)) continue;
      if (hasBnVersion(href)) {
        offenders.push(`src/components/${entry.name} → ${href}`);
      }
    }
  }

  ok(
    "no Bengali page links to the English version of a translated page",
    offenders.length === 0,
    offenders.join(" | ") || "every in-content link stays in Bengali",
  );
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
