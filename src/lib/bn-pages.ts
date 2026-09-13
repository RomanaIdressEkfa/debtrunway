/**
 * Which pages exist in Bengali.
 *
 * Two things read this list, and both of them break without it.
 *
 * The Bengali homepage links its cards here or to the English page, so a card
 * that reads in Bengali never opens a 404. And the language toggle offers
 * Bengali only where Bengali is really there — it shipped on all twenty-seven
 * pages while four had a translation, pointing the other twenty-three at
 * /bn/something-nobody-built. A control whose whole job is to say "this is
 * also in your language" was saying it falsely.
 *
 * A page joins this list on the day it is built, not the day it is planned.
 */
export const BN_PAGES: readonly string[] = [
  "/zakat-calculator",
  "/islamic-inheritance-calculator",
  "/zakat-on-gold-calculator",
];

export const hasBnPage = (slug: string) => BN_PAGES.includes(slug);

/**
 * Does the page at this path have a Bengali twin?
 *
 * Takes a full pathname rather than a registry slug, because the toggle only
 * knows where the reader is. The homepage is the special case: "/" and "/bn"
 * both exist and neither is in the list above.
 */
export function hasBnVersion(pathname: string): boolean {
  const bare = pathname.replace(/\/$/, "") || "/";
  if (bare === "/" || bare === "/bn") return true;
  const english = bare.startsWith("/bn/") ? bare.slice(3) : bare;
  return BN_PAGES.includes(english);
}
