/**
 * The two newer engines, checked at their branches.
 *
 * Faraid has its own file because it is checked against worked examples with
 * settled answers in the classical texts. These two cannot be: there is no
 * canonical answer to "zakat on a 401(k)" to check against, because that is
 * exactly the thing scholars differ on. So what is asserted here is narrower
 * and more mechanical — that the arithmetic does what the chosen position
 * says it does, that a position the reader did not choose does not leak into
 * the total, and that nothing entered can quietly disappear or go negative.
 */

import { calculateInvestmentZakat } from "../src/lib/investment-zakat";
import { calculateGoldZakat, purityOf, type Item } from "../src/lib/gold-zakat";

let failures = 0;
let checks = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
};

/* ---------------- shares, pensions, crypto ---------------- */

console.log("\n--- Investments ---\n");

const inv = {
  trading: 0,
  longTerm: 0,
  longTermMethod: "portion" as const,
  portionPct: 30,
  crypto: 0,
  accessible: 0,
  deductions: 0,
  locked: 0,
  lockedView: "defer" as const,
  vestedPct: 100,
};

{
  const r = calculateInvestmentZakat({ ...inv, longTerm: 100000 });
  ok("30% of a 100k long-term holding gives a 30k base", r.base === 30000, r.base);
  ok("...and the alternative shown is the full 100k", r.alternativeBase === 100000, r.alternativeBase);
}
{
  const r = calculateInvestmentZakat({ ...inv, longTerm: 100000, longTermMethod: "market" });
  ok("the market method gives the full 100k", r.base === 100000, r.base);
  ok("...and its alternative is the 30k", r.alternativeBase === 30000, r.alternativeBase);
}
{
  const r = calculateInvestmentZakat({ ...inv, trading: 50000 });
  ok("shares held for trading always count in full", r.base === 50000, r.base);
}
{
  const r = calculateInvestmentZakat({ ...inv, locked: 50000, lockedView: "defer" });
  ok("a deferred locked pension adds nothing", r.base === 0, r.base);
  ok("...but is reported as excluded rather than dropped", r.excluded.length === 1, r.excluded.length);
}
{
  const r = calculateInvestmentZakat({ ...inv, locked: 50000, lockedView: "vested", vestedPct: 60 });
  ok("60% vested of 50k gives a 30k base", r.base === 30000, r.base);
}
{
  const r = calculateInvestmentZakat({ ...inv, accessible: 1000, deductions: 5000 });
  ok("deductions larger than the balance floor at zero", r.base === 0, r.base);
}
{
  const r = calculateInvestmentZakat({ ...inv, longTerm: 100000, portionPct: 500 });
  ok("a proportion above 100% is clamped", r.base === 100000, r.base);
}
{
  const r = calculateInvestmentZakat({ ...inv, trading: 40000 });
  ok("zakat is 2.5% of the base", Math.abs(r.zakat - 1000) < 1e-9, r.zakat);
}

/* ---------------- gold and silver ---------------- */

console.log("\n--- Gold and silver ---\n");

const piece = (over: Partial<Item>): Item => ({
  id: "x",
  label: "x",
  metal: "gold",
  grams: 0,
  purity: 1,
  use: "stored",
  ...over,
});

const gz = (
  items: Item[],
  school: "hanafi" | "majority" = "hanafi",
  otherWealth = 0,
) =>
  calculateGoldZakat({
    items,
    school,
    goldPricePerGram: 100,
    silverPricePerGram: 2,
    standard: "silver",
    otherWealth,
  });

{
  const r = gz([piece({ grams: 40, purity: purityOf(22) })]);
  ok("40g at 22 carat is 36.67g of gold", Math.abs(r.countedGoldGrams - 36.6667) < 0.001, r.countedGoldGrams.toFixed(4));
}
{
  const r = gz([piece({ grams: 40, purity: purityOf(18) })]);
  ok("40g at 18 carat is exactly 30g", Math.abs(r.countedGoldGrams - 30) < 1e-9, r.countedGoldGrams);
}
{
  const worn = [piece({ grams: 40, use: "worn" })];
  ok("the Hanafi position counts worn jewellery", gz(worn, "hanafi").countedGoldGrams === 40, gz(worn, "hanafi").countedGoldGrams);
  ok("the majority position exempts it", gz(worn, "majority").countedGoldGrams === 0, gz(worn, "majority").countedGoldGrams);
  ok("...and says what it left out", gz(worn, "majority").exemptValue === 4000, gz(worn, "majority").exemptValue);
}
{
  const r = gz([piece({ grams: 40, use: "stored" })], "majority");
  ok("bullion counts on every view", r.countedGoldGrams === 40, r.countedGoldGrams);
}
{
  const r = gz([piece({ grams: 1 })]);
  ok("below the nisab nothing is due", r.due === false && r.zakat === 0, r.zakat);
}
{
  const r = gz([piece({ grams: 1 })], "hanafi", 5000);
  ok("other wealth can carry it over the nisab", r.due === true, r.total);
}
{
  const r = gz([piece({ grams: 40, metal: "silver", purity: 0.925 })]);
  ok("sterling silver is weighed at 92.5%", Math.abs(r.countedSilverGrams - 37) < 1e-9, r.countedSilverGrams);
}

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);
process.exit(failures === 0 ? 0 : 1);
