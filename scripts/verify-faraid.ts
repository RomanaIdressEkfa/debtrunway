/**
 * The faraid engine checked against worked examples from the standard texts.
 *
 * Every case below has a settled answer that can be looked up, which is the
 * point: this file is not testing that the code agrees with itself, it is
 * testing that the code agrees with the books. Run it with `npm run verify:faraid`
 * after any change to src/lib/faraid.ts.
 */

import {
  distribute,
  emptyHeirs,
  fracLabel,
  type Heirs,
  type Estate,
} from "../src/lib/faraid";

let failures = 0;
let checks = 0;

const check = (name: string, pass: boolean, detail = "") => {
  checks++;
  if (!pass) failures++;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

/** A clean estate of 1 unit, so shares and amounts read the same. */
const estate = (total = 240): Estate => ({
  total,
  funeral: 0,
  debts: 0,
  bequest: 0,
});

const who = (partial: Partial<Heirs>): Heirs => ({ ...emptyHeirs(), ...partial });

/** Asserts one heir's share, written as the books write it. */
const shareOf = (
  name: string,
  heirs: Partial<Heirs>,
  label: string,
  expected: string,
  total = 240,
) => {
  const r = distribute(estate(total), who(heirs));
  const found = r.awards.find((a) => a.label === label);
  check(
    `${name}: ${label} takes ${expected}`,
    found ? fracLabel(found.share) === expected : false,
    found ? `got ${fracLabel(found.share)}` : `${label} not in the result`,
  );
};

/** Every case must divide the estate exactly, with nothing left over. */
const sumsToOne = (name: string, heirs: Partial<Heirs>) => {
  const r = distribute(estate(), who(heirs));
  const total = r.awards.reduce((s, a) => s + a.amount, 0);
  check(
    `${name}: the shares divide the estate exactly`,
    Math.abs(total - r.distributable) < 1e-9,
    `${total.toFixed(6)} of ${r.distributable}`,
  );
};

console.log("\n--- 1. The Qur'anic shares, one heir at a time ---\n");

shareOf("Husband, no child", { husband: true, fullBrothers: 1 }, "Husband", "1/2");
shareOf("Husband, with a child", { husband: true, sons: 1 }, "Husband", "1/4");
shareOf("Wife, no child", { wives: 1, fullBrothers: 1 }, "Wife", "1/4");
shareOf("Wife, with a child", { wives: 1, sons: 1 }, "Wife", "1/8");
shareOf("Four wives share the eighth", { wives: 4, sons: 1 }, "Wives", "1/8");
shareOf("Mother, no child or siblings", { mother: true, fullBrothers: 1 }, "Mother", "1/3");
shareOf("Mother, with a child", { mother: true, sons: 1 }, "Mother", "1/6");
shareOf(
  "Mother drops to a sixth on two siblings",
  { mother: true, fullBrothers: 2, father: false, husband: true },
  "Mother",
  "1/6",
);
shareOf("Father, with a son", { father: true, sons: 1 }, "Father", "1/6");
shareOf("An only daughter", { daughters: 1, fullBrothers: 1 }, "Daughter", "1/2");
shareOf("Two daughters", { daughters: 2, fullBrothers: 1 }, "Daughters", "2/3");
// A full brother is added to soak up the residue: without a residuary heir
// radd fires and lifts the sixth, which is correct but hides the fixed share.
shareOf("One maternal half-sibling", { maternalSiblings: 1, husband: true, fullBrothers: 1 }, "Maternal half-sibling", "1/6");
shareOf("Two maternal half-siblings", { maternalSiblings: 2, husband: true, fullBrothers: 1 }, "Maternal half-siblings", "1/3");
shareOf("An only full sister", { fullSisters: 1, husband: true }, "Full sister", "1/2");

console.log("\n--- 2. Two parts to one, between son and daughter ---\n");

{
  const r = distribute(estate(), who({ sons: 1, daughters: 1 }));
  const son = r.awards.find((a) => a.label === "Son");
  const dau = r.awards.find((a) => a.label === "Daughter");
  check("Son and daughter: son takes 2/3", son ? fracLabel(son.share) === "2/3" : false, son && `got ${fracLabel(son.share)}`);
  check("Son and daughter: daughter takes 1/3", dau ? fracLabel(dau.share) === "1/3" : false, dau && `got ${fracLabel(dau.share)}`);
  check("Son receives exactly twice the daughter", !!son && !!dau && Math.abs(son.eachAmount - dau.eachAmount * 2) < 1e-9);
}

{
  // Two sons and two daughters: six parts, each son two, each daughter one.
  const r = distribute(estate(600), who({ sons: 2, daughters: 2 }));
  const son = r.awards.find((a) => a.label === "Sons");
  const dau = r.awards.find((a) => a.label === "Daughters");
  check("2 sons + 2 daughters: each son gets 200 of 600", son ? Math.abs(son.eachAmount - 200) < 1e-9 : false, son && `got ${son.eachAmount}`);
  check("2 sons + 2 daughters: each daughter gets 100 of 600", dau ? Math.abs(dau.eachAmount - 100) < 1e-9 : false, dau && `got ${dau.eachAmount}`);
}

console.log("\n--- 3. Awl: the shares overflow and all shrink together ---\n");

{
  // The classic 12 -> 15. Husband 1/4, two daughters 2/3, father 1/6, mother 1/6.
  const heirs = who({ husband: true, daughters: 2, father: true, mother: true });
  const r = distribute(estate(), heirs);
  check("Husband + 2 daughters + both parents triggers awl", r.awl);
  check("...and the shares had come to 5/4", fracLabel(r.totalBefore) === "5/4", `got ${fracLabel(r.totalBefore)}`);
  const husband = r.awards.find((a) => a.label === "Husband");
  const daughters = r.awards.find((a) => a.label === "Daughters");
  check("...husband falls from 1/4 to 3/15", husband ? fracLabel(husband.share) === "1/5" : false, husband && `got ${fracLabel(husband.share)}`);
  check("...daughters fall from 2/3 to 8/15", daughters ? fracLabel(daughters.share) === "8/15" : false, daughters && `got ${fracLabel(daughters.share)}`);
  sumsToOne("Awl 12->15", heirs);
}

{
  // The classic 6 -> 8. Husband 1/2, two full sisters 2/3, mother 1/6.
  const heirs = who({ husband: true, fullSisters: 2, mother: true });
  const r = distribute(estate(), heirs);
  check("Husband + 2 full sisters + mother triggers awl", r.awl);
  check("...and the shares had come to 4/3", fracLabel(r.totalBefore) === "4/3", `got ${fracLabel(r.totalBefore)}`);
  const husband = r.awards.find((a) => a.label === "Husband");
  check("...husband falls from 1/2 to 3/8", husband ? fracLabel(husband.share) === "3/8" : false, husband && `got ${fracLabel(husband.share)}`);
  sumsToOne("Awl 6->8", heirs);
}

{
  // The classic 24 -> 27, known as al-minbariyya.
  const heirs = who({ wives: 1, daughters: 2, mother: true, father: true });
  const r = distribute(estate(), heirs);
  check("Wife + 2 daughters + both parents triggers awl", r.awl);
  check("...and the shares had come to 9/8", fracLabel(r.totalBefore) === "9/8", `got ${fracLabel(r.totalBefore)}`);
  const wife = r.awards.find((a) => a.label === "Wife");
  check("...wife falls from 1/8 to 1/9", wife ? fracLabel(wife.share) === "1/9" : false, wife && `got ${fracLabel(wife.share)}`);
  sumsToOne("Awl 24->27", heirs);
}

console.log("\n--- 4. The Umariyyatan: a spouse and both parents ---\n");

{
  // Husband 1/2; mother takes a third of the remaining half, not of the whole.
  const heirs = who({ husband: true, mother: true, father: true });
  const r = distribute(estate(), heirs);
  const mother = r.awards.find((a) => a.label === "Mother");
  const father = r.awards.find((a) => a.label === "Father");
  check("Husband + parents: mother takes 1/6, not 1/3", mother ? fracLabel(mother.share) === "1/6" : false, mother && `got ${fracLabel(mother.share)}`);
  check("Husband + parents: father takes 1/3", father ? fracLabel(father.share) === "1/3" : false, father && `got ${fracLabel(father.share)}`);
  check("Husband + parents: no awl is needed", !r.awl);
  sumsToOne("Umariyya, husband", heirs);
}

{
  // Wife 1/4; mother takes a third of the remaining three quarters.
  const heirs = who({ wives: 1, mother: true, father: true });
  const r = distribute(estate(), heirs);
  const mother = r.awards.find((a) => a.label === "Mother");
  const father = r.awards.find((a) => a.label === "Father");
  check("Wife + parents: mother takes 1/4", mother ? fracLabel(mother.share) === "1/4" : false, mother && `got ${fracLabel(mother.share)}`);
  check("Wife + parents: father takes 1/2", father ? fracLabel(father.share) === "1/2" : false, father && `got ${fracLabel(father.share)}`);
  sumsToOne("Umariyya, wife", heirs);
}

{
  // Both parents with no spouse: the special case does not apply.
  const r = distribute(estate(), who({ mother: true, father: true }));
  const mother = r.awards.find((a) => a.label === "Mother");
  check("Parents alone: mother takes the full 1/3", mother ? fracLabel(mother.share) === "1/3" : false, mother && `got ${fracLabel(mother.share)}`);
}

console.log("\n--- 5. Radd: the surplus returns to the sharers ---\n");

{
  const r = distribute(estate(), who({ daughters: 1 }));
  const dau = r.awards.find((a) => a.label === "Daughter");
  check("An only daughter, alone, ends up with everything", dau ? fracLabel(dau.share) === "1" : false, dau && `got ${fracLabel(dau.share)}`);
  check("...and that is recorded as radd", r.radd);
}

{
  // Daughter 1/2 and mother 1/6 come to 2/3; the last third returns 3:1.
  const heirs = who({ daughters: 1, mother: true });
  const r = distribute(estate(), heirs);
  const dau = r.awards.find((a) => a.label === "Daughter");
  const mum = r.awards.find((a) => a.label === "Mother");
  check("Daughter + mother: daughter ends at 3/4", dau ? fracLabel(dau.share) === "3/4" : false, dau && `got ${fracLabel(dau.share)}`);
  check("Daughter + mother: mother ends at 1/4", mum ? fracLabel(mum.share) === "1/4" : false, mum && `got ${fracLabel(mum.share)}`);
  sumsToOne("Radd, daughter and mother", heirs);
}

{
  // A spouse takes no part in radd: the wife keeps her eighth exactly.
  const r = distribute(estate(), who({ wives: 1, daughters: 1 }));
  const wife = r.awards.find((a) => a.label === "Wife");
  const dau = r.awards.find((a) => a.label === "Daughter");
  check("Wife + daughter: wife stays on 1/8", wife ? fracLabel(wife.share) === "1/8" : false, wife && `got ${fracLabel(wife.share)}`);
  check("Wife + daughter: daughter takes the rest, 7/8", dau ? fracLabel(dau.share) === "7/8" : false, dau && `got ${fracLabel(dau.share)}`);
}

console.log("\n--- 6. Blocking (hajb) ---\n");

{
  const r = distribute(estate(), who({ sons: 1, fullBrothers: 2, fullSisters: 1 }));
  check("A son blocks the full siblings", !r.awards.some((a) => a.label.includes("Full")));
  check("...and the block is explained", r.blocked.some((b) => b.label === "Full siblings"));
}

{
  const r = distribute(estate(), who({ mother: true, maternalGrandmother: true, sons: 1 }));
  check("A mother blocks the grandmother", !r.awards.some((a) => a.label.includes("randmother")));
  check("...and the block is explained", r.blocked.some((b) => b.by === "the mother"));
}

{
  const r = distribute(estate(), who({ father: true, paternalGrandfather: true, sons: 1 }));
  check("A father blocks the grandfather", !r.awards.some((a) => a.label.includes("randfather")));
}

{
  const r = distribute(estate(), who({ sons: 1, grandsons: 2, granddaughters: 1 }));
  check("A son blocks the son's children", !r.awards.some((a) => a.label.includes("Son's")));
}

{
  const r = distribute(estate(), who({ daughters: 1, maternalSiblings: 2, husband: true }));
  check("A daughter blocks the maternal half-siblings", !r.awards.some((a) => a.label.includes("Maternal")));
}

{
  const r = distribute(estate(), who({ father: true, fullBrothers: 1, mother: true }));
  check("A father blocks the full brothers", !r.awards.some((a) => a.label.includes("Full")));
}

console.log("\n--- 7. Son's daughters ---\n");

{
  // One daughter takes a half; the son's daughters take the sixth that
  // completes the two thirds.
  const heirs = who({ daughters: 1, granddaughters: 2, fullBrothers: 1 });
  const r = distribute(estate(), heirs);
  const gd = r.awards.find((a) => a.label === "Son's daughters");
  check("1 daughter + son's daughters: they take 1/6", gd ? fracLabel(gd.share) === "1/6" : false, gd && `got ${fracLabel(gd.share)}`);
  sumsToOne("Daughter and son's daughters", heirs);
}

{
  const r = distribute(estate(), who({ daughters: 2, granddaughters: 2, fullBrothers: 1 }));
  check("2 daughters block the son's daughters", !r.awards.some((a) => a.label.includes("Son's")));
}

{
  const r = distribute(estate(), who({ granddaughters: 1, fullBrothers: 1 }));
  const gd = r.awards.find((a) => a.label === "Son's daughter");
  check("A son's daughter alone takes a daughter's 1/2", gd ? fracLabel(gd.share) === "1/2" : false, gd && `got ${fracLabel(gd.share)}`);
}

console.log("\n--- 8. The father's two positions ---\n");

{
  // With daughters but no son, the father takes his sixth and the remainder.
  const heirs = who({ daughters: 1, father: true });
  const r = distribute(estate(), heirs);
  const father = r.awards.find((a) => a.label === "Father");
  check("Daughter + father: father takes 1/6 plus the rest, so 1/2", father ? fracLabel(father.share) === "1/2" : false, father && `got ${fracLabel(father.share)}`);
  check("...recorded as a fixed share and a residue", father?.basis === "fixed+residue");
  sumsToOne("Daughter and father", heirs);
}

{
  const r = distribute(estate(), who({ father: true, mother: true, sons: 2 }));
  const father = r.awards.find((a) => a.label === "Father");
  check("Father with sons is held to 1/6", father ? fracLabel(father.share) === "1/6" : false, father && `got ${fracLabel(father.share)}`);
}

console.log("\n--- 9. Debts, funeral and bequest come first ---\n");

{
  const r = distribute({ total: 1000, funeral: 100, debts: 300, bequest: 0 }, who({ sons: 1 }));
  check("Funeral and debts leave 600 to divide", r.distributable === 600, `got ${r.distributable}`);
}

{
  const r = distribute({ total: 1000, funeral: 0, debts: 0, bequest: 500 }, who({ sons: 1 }));
  check("A bequest above a third is capped at the third", Math.abs(r.bequest - 1000 / 3) < 1e-9, `got ${r.bequest}`);
  check("...and the cap is explained", r.bequestCapped);
}

{
  const r = distribute({ total: 1000, funeral: 0, debts: 0, bequest: 200 }, who({ sons: 1 }));
  check("A bequest under a third is left alone", r.bequest === 200 && !r.bequestCapped);
}

{
  const r = distribute({ total: 500, funeral: 100, debts: 900, bequest: 0 }, who({ sons: 1 }));
  check("Debts beyond the estate leave nothing to divide", r.insolvent && r.awards.length === 0);
}

console.log("\n--- 10. Every combination still divides the estate exactly ---\n");

sumsToOne("Wife + son + daughter", { wives: 1, sons: 1, daughters: 1 });
sumsToOne("Husband + mother + 2 maternal siblings", { husband: true, mother: true, maternalSiblings: 2 });
sumsToOne("Mother + father + son", { mother: true, father: true, sons: 1 });
sumsToOne("4 wives + 3 sons + 2 daughters", { wives: 4, sons: 3, daughters: 2 });
sumsToOne("Husband + full sister", { husband: true, fullSisters: 1 });
sumsToOne("Grandmother + son", { maternalGrandmother: true, sons: 1 });
sumsToOne("Grandfather + daughter", { paternalGrandfather: true, daughters: 1 });
sumsToOne("Paternal half-sisters alone", { paternalSisters: 2 });
sumsToOne("Son's son + son's daughter", { grandsons: 1, granddaughters: 1 });
sumsToOne("Full sister beside a daughter", { daughters: 1, fullSisters: 1 });

console.log(
  `\n${failures === 0 ? "All good" : `${failures} FAILED`} — ${checks - failures}/${checks} checks passed\n`,
);

process.exit(failures === 0 ? 0 : 1);
