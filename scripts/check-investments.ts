/** Quick sanity pass on the investment engine — the branches that matter. */
import { calculateInvestmentZakat } from "../src/lib/investment-zakat";

const base = {
  trading: 0, longTerm: 0, longTermMethod: "portion" as const, portionPct: 30,
  crypto: 0, accessible: 0, deductions: 0, locked: 0,
  lockedView: "defer" as const, vestedPct: 100,
};
let bad = 0;
const ok = (name: string, pass: boolean, got: unknown) => {
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}  — ${got}`);
  if (!pass) bad++;
};

const a = calculateInvestmentZakat({ ...base, longTerm: 100000 });
ok("30% portion of 100k gives a 30k base", a.base === 30000, a.base);
ok("...and the alternative is the full 100k", a.alternativeBase === 100000, a.alternativeBase);

const b = calculateInvestmentZakat({ ...base, longTerm: 100000, longTermMethod: "market" });
ok("market method gives the full 100k", b.base === 100000, b.base);
ok("...and its alternative is the 30k", b.alternativeBase === 30000, b.alternativeBase);

const t = calculateInvestmentZakat({ ...base, trading: 50000 });
ok("trading shares always count in full", t.base === 50000, t.base);

const d = calculateInvestmentZakat({ ...base, locked: 50000, lockedView: "defer" });
ok("a deferred locked pension adds nothing", d.base === 0, d.base);
ok("...and is reported as excluded, not dropped", d.excluded.length === 1, d.excluded.length);

const v = calculateInvestmentZakat({ ...base, locked: 50000, lockedView: "vested", vestedPct: 60 });
ok("60% vested of 50k gives 30k", v.base === 30000, v.base);

const n = calculateInvestmentZakat({ ...base, accessible: 1000, deductions: 5000 });
ok("deductions above the balance floor at zero", n.base === 0, n.base);

const p = calculateInvestmentZakat({ ...base, longTerm: 100000, portionPct: 500 });
ok("a portion above 100% is clamped", p.base === 100000, p.base);

const z = calculateInvestmentZakat({ ...base, trading: 40000 });
ok("zakat is 2.5% of the base", Math.abs(z.zakat - 1000) < 1e-9, z.zakat);

console.log(bad === 0 ? "\nAll good.\n" : `\n${bad} FAILED\n`);
process.exit(bad ? 1 : 0);
