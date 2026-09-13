/**
 * Which calculators have a Bengali page of their own, as opposed to merely a
 * Bengali name on a card.
 *
 * The distinction matters on the Bengali homepage. A card whose title reads
 * in Bengali and whose link opens an English page is honest enough while the
 * translation is in progress; a card that links to /bn/something that has not
 * been built is a 404. So the list is explicit, and a page joins it on the
 * day it exists rather than the day it is planned.
 */
export const BN_PAGES: readonly string[] = [
  "/zakat-calculator",
  "/islamic-inheritance-calculator",
  "/zakat-on-gold-calculator",
];

export const hasBnPage = (slug: string) => BN_PAGES.includes(slug);
