/**
 * Fetches the gold and silver price once, at build time, and writes it into
 * the bundle as data.
 *
 * The obvious alternative is to fetch from the visitor's browser when the page
 * loads. This site does not, for three reasons:
 *
 *   1. It would break the promise the site makes. Every page says nothing you
 *      enter leaves your browser. A request to a metals API from the visitor's
 *      own machine sends their IP address to a third party on every page load,
 *      which is exactly the kind of thing that promise exists to rule out.
 *   2. It would put the calculator at the mercy of someone else's uptime. A
 *      free endpoint that rate-limits or disappears would take the zakat page
 *      down with it, for everyone, until it came back.
 *   3. A key would have to ship in the JavaScript, where anyone can read it
 *      and burn the quota. This particular endpoint needs no key today, which
 *      is not a thing to depend on.
 *
 * Fetching here instead gives the visitor a filled-in price with no request of
 * their own, and the field stays editable for anyone whose local rate differs
 * or who is reading a stale build.
 *
 * Prices move by a percent or so a day and nisab is a threshold rather than a
 * precise figure, so a build-day price is honest as long as the page says when
 * it was taken — which it does.
 *
 * If the fetch fails the previous file is left exactly as it is and the build
 * continues. A stale price is a far smaller problem than a broken deploy.
 */

import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "src", "lib", "metal-prices.json");

/** One troy ounce, which is what the metals market quotes in. */
const TROY_OUNCE_GRAMS = 31.1034768;

/** The currencies the picker offers. Kept short: a list of 160 helps nobody. */
const CURRENCIES = [
  "USD", "GBP", "EUR", "CAD", "AUD", "SAR", "AED", "QAR",
  "MYR", "IDR", "PKR", "INR", "BDT", "TRY", "EGP", "NGN", "ZAR",
];

const METALS_URL = "https://api.gold-api.com/price";
const FX_URL = "https://open.er-api.com/v6/latest/USD";

const get = async (url: string) => {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(20_000),
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return res.json();
};

async function main() {
  const gold = await get(`${METALS_URL}/XAU`);
  const silver = await get(`${METALS_URL}/XAG`);
  const fx = await get(FX_URL);

  const goldOz = Number(gold?.price);
  const silverOz = Number(silver?.price);
  if (!Number.isFinite(goldOz) || !Number.isFinite(silverOz)) {
    throw new Error("metal prices came back unparseable");
  }

  const rates: Record<string, number> = {};
  for (const code of CURRENCIES) {
    const rate = Number(fx?.rates?.[code]);
    // A missing currency is dropped rather than defaulted to 1, which would
    // quietly price a nisab in dollars and label it rupees.
    if (Number.isFinite(rate) && rate > 0) rates[code] = rate;
  }
  if (!rates.USD) rates.USD = 1;

  const data = {
    fetchedAt: new Date().toISOString().slice(0, 10),
    goldPerGramUSD: goldOz / TROY_OUNCE_GRAMS,
    silverPerGramUSD: silverOz / TROY_OUNCE_GRAMS,
    rates,
  };

  fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log(
    `metals: gold $${data.goldPerGramUSD.toFixed(2)}/g, silver $${data.silverPerGramUSD.toFixed(3)}/g, ` +
      `${Object.keys(rates).length} currencies, ${data.fetchedAt}`,
  );
}

main().catch((err) => {
  const existing = fs.existsSync(OUT);
  console.warn(
    `metals: fetch failed (${err instanceof Error ? err.message : err}). ` +
      (existing
        ? "Keeping the prices already in the bundle."
        : "No price file exists; the calculators will start empty."),
  );
  // Never fail the build over this. The fields are editable either way.
  process.exit(0);
});
