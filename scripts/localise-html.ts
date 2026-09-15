/**
 * Stamp lang="bn" on the Bengali pages of the export.
 *
 * Every page shipped <html lang="en">, the Bengali ones included, because the
 * root layout writes that attribute and a static export has exactly one root
 * layout. So each Bengali page was telling a crawler two contradictory things:
 * hreflang said bn, the document said en. A screen reader took the document at
 * its word and read Bengali aloud in an English voice, which is the kind of
 * failure nobody sighted ever notices.
 *
 * Next has a way to do this properly — route groups with a root layout each —
 * and it would mean two copies of the shell, two copies of the font wiring and
 * the metadata and the analytics beacon, kept in step by hand. For one
 * attribute that is the worse trade. The export is plain files; this edits the
 * files.
 *
 * It asserts afterwards rather than trusting itself: if a single page under
 * /bn still says lang="en" when this finishes, the build fails here instead of
 * publishing a page that lies about its own language.
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "out/bn";

const htmlFiles = (dir: string): string[] => {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
};

let files: string[];
try {
  files = htmlFiles(ROOT);
} catch {
  console.error(`localise-html: ${ROOT} is missing — did the export run?`);
  process.exit(1);
}

let changed = 0;
for (const file of files) {
  const before = readFileSync(file, "utf8");
  // Only the opening <html> tag. A lang="en" inside the page body belongs to
  // something quoting English on purpose and is not this script's business.
  const after = before.replace(/(<html\s[^>]*?)lang="en"/, '$1lang="bn"');
  if (after !== before) {
    writeFileSync(file, after);
    changed++;
  }
}

const stillEnglish = files.filter((f) =>
  /<html\s[^>]*?lang="en"/.test(readFileSync(f, "utf8")),
);

if (stillEnglish.length > 0) {
  console.error(
    `localise-html: FAILED — ${stillEnglish.length} Bengali page(s) still say lang="en":`,
  );
  for (const f of stillEnglish) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  `localise-html: ${changed} of ${files.length} Bengali pages stamped lang="bn"`,
);
