/**
 * Two languages, two sets of URLs.
 *
 * The tempting version is a button that swaps the text in place, and it is
 * the wrong one. A search engine sees whatever the page ships as HTML, so a
 * client-side swap means Google indexes the English and never learns the
 * Bengali exists — which defeats the entire reason for translating: someone
 * in Bangladesh searching in Bengali has to be able to *find* the page.
 *
 * So Bengali lives at its own addresses under /bn/, and the two versions
 * point at each other with hreflang. Google indexes both and serves whichever
 * matches the searcher.
 *
 * The English URLs deliberately do not move. They are the ones Google has
 * spent weeks learning, a few are already indexed, and changing them to
 * /en/... to look symmetrical would throw that away for nothing.
 */

export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  // Each in its own language, which is the only version a reader looking for
  // it can recognise. "Bengali" written in English helps nobody who needs it.
  en: "English",
  bn: "বাংলা",
};

/** What goes in <html lang>. */
export const HTML_LANG: Record<Locale, string> = {
  en: "en",
  bn: "bn",
};

/**
 * The Bengali twin of an English path, and back.
 *
 * Kept as two small functions rather than a map of every page, so adding a
 * translated page never means remembering to register it somewhere else.
 */
export function toLocale(path: string, locale: Locale): string {
  const bare = path.startsWith("/bn/")
    ? path.slice(3)
    : path === "/bn"
      ? "/"
      : path;
  if (locale === "en") return bare;
  return bare === "/" ? "/bn" : `/bn${bare}`;
}

export function localeOf(path: string): Locale {
  return path === "/bn" || path.startsWith("/bn/") ? "bn" : "en";
}

/**
 * The alternates block for a page that exists in both languages.
 *
 * `locale` is which version is being rendered, and it is not optional for a
 * reason worth stating: the canonical has to point at the page declaring it.
 * The first version of this ignored the locale, so the Bengali homepage
 * shipped `canonical: "/"` — telling Google that the canonical form of the
 * Bengali page is the English one, which is an instruction to drop it as a
 * duplicate. The page would have been built, deployed, indexed and then
 * silently discarded, achieving the exact opposite of translating it.
 *
 * The hreflang pair is identical on both pages, which is what Google
 * requires: a one-sided declaration is ignored outright.
 *
 * x-default points at English — it is what a searcher in neither language
 * should land on, and it is the version that has been up longest.
 */
export function alternatesFor(barePath: string, locale: Locale = "en") {
  const en = toLocale(barePath, "en");
  const bn = toLocale(barePath, "bn");
  return {
    canonical: locale === "bn" ? bn : en,
    languages: {
      en,
      bn,
      "x-default": en,
    },
  };
}
