/**
 * E numbers and what can actually be said about them.
 *
 * A list of "haram E numbers" has circulated by forwarded message for thirty
 * years and it is mostly wrong. It is wrong in both directions, which is the
 * part people miss: it condemns additives that are minerals or made by
 * fermentation, and it clears additives that genuinely can be animal-derived.
 *
 * The reason it cannot be right is structural. An E number names a substance,
 * not a source. E471 is mono- and diglycerides of fatty acids, and those fatty
 * acids can come from palm oil or from beef tallow. The number is identical
 * either way. No list can tell you which is in the packet in your hand, and a
 * list that claims to is guessing.
 *
 * So this tool sorts additives by what can honestly be said:
 *
 *   settled  — the substance can only be mineral, synthetic, or plant, so the
 *              number alone answers the question.
 *   depends  — the substance exists in both animal and non-animal forms. The
 *              number tells you nothing; the manufacturer does.
 *   animal   — animal-derived by definition, so it turns on the slaughter.
 *   insect   — from insects, where scholars genuinely differ.
 *   alcohol  — involves ethanol, where the positions differ by use and amount.
 *
 * The honest answer for a great many of the most-asked numbers is "depends",
 * and saying so is the whole point. A tool that returned a confident halal or
 * haram for E471 would be more satisfying and less true.
 */

export type Verdict = "settled" | "depends" | "animal" | "insect" | "alcohol";

export interface Additive {
  code: string;
  name: string;
  /** What it does in the food. */
  role: string;
  verdict: Verdict;
  /** The specific thing worth knowing, in a sentence or two. */
  note: string;
  /** Commonly searched alternative names. */
  also?: string[];
}

export const VERDICTS: Record<
  Verdict,
  { label: string; short: string; tone: "good" | "warn" | "bad" | "info" }
> = {
  settled: {
    label: "Settled",
    short: "Mineral, synthetic or plant. The number answers it.",
    tone: "good",
  },
  depends: {
    label: "Depends on the source",
    short: "Exists in both animal and non-animal forms. Ask the manufacturer.",
    tone: "warn",
  },
  animal: {
    label: "Animal-derived",
    short: "Turns on whether the animal was lawfully slaughtered.",
    tone: "bad",
  },
  insect: {
    label: "From insects",
    short: "Scholars differ genuinely here.",
    tone: "info",
  },
  alcohol: {
    label: "Involves ethanol",
    short: "Positions differ by amount and by purpose.",
    tone: "info",
  },
};

export const ADDITIVES: Additive[] = [
  // --- The ones people actually search for ---
  {
    code: "E471",
    name: "Mono- and diglycerides of fatty acids",
    role: "Emulsifier — keeps fat and water together in bread, ice cream, margarine",
    verdict: "depends",
    note: "The single most-asked number, and the answer is genuinely 'it depends'. The fatty acids can come from palm or soya oil, or from beef or pork tallow. In Europe most is plant-derived because plant oil is cheaper, but that is a commercial tendency rather than a rule. Only the manufacturer knows.",
    also: ["mono and diglycerides", "E 471"],
  },
  {
    code: "E472a–f",
    name: "Esters of mono- and diglycerides",
    role: "Emulsifier — the E471 family, modified with acids",
    verdict: "depends",
    note: "Same question as E471, one step further along: acetic (472a), lactic (472b), citric (472c), tartaric (472d), mono/diacetyl tartaric or DATEM (472e), and mixed (472f). Every one of them inherits its source from the fatty acid it was built on.",
    also: ["E472", "DATEM", "E472e"],
  },
  {
    code: "E120",
    name: "Cochineal, carminic acid, carmine",
    role: "Red colour — sweets, drinks, yoghurt, cosmetics",
    verdict: "insect",
    note: "Made from the crushed bodies of the cochineal scale insect. The majority of contemporary scholars hold it impermissible on the general prohibition of consuming insects; a minority permit it, reasoning that the substance is transformed. Many manufacturers have moved to E163 or beetroot for exactly this reason.",
    also: ["carmine", "cochineal"],
  },
  {
    code: "E441",
    name: "Gelatine",
    role: "Gelling agent — sweets, desserts, capsules",
    verdict: "animal",
    note: "Made from the skin and bones of cattle, pigs or fish. Pork gelatine is impermissible by consensus; beef gelatine requires lawful slaughter; fish gelatine raises no question. The code is largely obsolete in labelling — gelatine is usually named outright — but people still search for it.",
    also: ["gelatin", "gelatine"],
  },
  {
    code: "E920",
    name: "L-cysteine",
    role: "Flour treatment — softens dough in bread and pastry",
    verdict: "depends",
    note: "This one deserves its reputation. It has historically been produced from duck feathers, pig bristle and human hair, as well as by bacterial fermentation. Human hair is rejected by scholars on the ground of human dignity regardless of any other question. Fermented and synthetic versions are widely used now, but the number does not tell you which you have.",
    also: ["cysteine", "E921"],
  },
  {
    code: "E631",
    name: "Disodium inosinate",
    role: "Flavour enhancer — crisps, instant noodles, stock",
    verdict: "depends",
    note: "Produced from meat or fish, or by fermentation from tapioca starch. It appears constantly on forwarded 'haram lists' as though it were always pork-derived, which is not true — but nor is it always plant-derived. It is the second most common thing worth actually asking about.",
    also: ["E627", "E635", "disodium inosinate"],
  },
  {
    code: "E422",
    name: "Glycerol, glycerine",
    role: "Humectant and sweetener — keeps things moist",
    verdict: "depends",
    note: "A by-product of soap and biodiesel manufacture, so it can come from plant oils, from animal fats, or be made synthetically. Widely used, widely asked about, and genuinely unanswerable from the number.",
    also: ["glycerine", "glycerol", "E 422"],
  },
  {
    code: "E570",
    name: "Fatty acids, stearic acid",
    role: "Anti-caking and glazing agent",
    verdict: "depends",
    note: "Stearic acid is abundant in both plant oils and animal fats. In tablets and supplements it is frequently plant-derived; in confectionery glazes it may not be.",
    also: ["stearic acid", "E572", "magnesium stearate"],
  },
  {
    code: "E904",
    name: "Shellac",
    role: "Glazing agent — the shine on sweets and apples",
    verdict: "insect",
    note: "A resin secreted by the lac insect and scraped from branches. Most contemporary scholars permit it, reasoning that it is a secretion rather than the insect itself — the same reasoning that permits honey. A minority object. Insect fragments in unrefined shellac are a separate question that refining addresses.",
    also: ["shellac", "confectioner's glaze"],
  },
  {
    code: "E542",
    name: "Bone phosphate",
    role: "Anti-caking agent",
    verdict: "animal",
    note: "Made from degreased animal bone, as the name says. It turns on the slaughter, and it is unusual among the numbers here in leaving no ambiguity about its origin.",
    also: ["edible bone phosphate"],
  },
  {
    code: "E640",
    name: "Glycine",
    role: "Flavour enhancer and masking agent",
    verdict: "depends",
    note: "An amino acid, produced either synthetically or by hydrolysing animal protein such as gelatine. Both routes are in commercial use.",
  },
  {
    code: "E1105",
    name: "Lysozyme",
    role: "Preservative — mainly in cheese and wine",
    verdict: "depends",
    note: "Extracted from egg white, which raises no question in itself. What is worth knowing is its use in winemaking, which is where most people encounter it on a label.",
  },
  {
    code: "E1000",
    name: "Cholic acid",
    role: "Emulsifier",
    verdict: "animal",
    note: "A bile acid, obtained from the bile of cattle or pigs. Rare in food, and unambiguous when present.",
  },
  {
    code: "E153",
    name: "Vegetable carbon",
    role: "Black colour",
    verdict: "depends",
    note: "The name says vegetable and it usually is — charred plant material. But carbon black has historically also been made from bone char, and the number covers both. Rare enough that asking is easy.",
    also: ["carbon black"],
  },

  // --- The ones the forwarded lists get wrong ---
  {
    code: "E330",
    name: "Citric acid",
    role: "Acidity regulator — in almost everything sour",
    verdict: "settled",
    note: "Produced industrially by fermenting sugar with Aspergillus niger, a mould. It is not made from animals and never has been at commercial scale. It appears on nearly every circulated 'haram list' and belongs on none of them.",
    also: ["citric acid"],
  },
  {
    code: "E621",
    name: "Monosodium glutamate, MSG",
    role: "Flavour enhancer",
    verdict: "settled",
    note: "Made by bacterial fermentation of molasses or starch. The health folklore around MSG is a separate matter from its permissibility, and on permissibility there is no real question.",
    also: ["MSG", "monosodium glutamate"],
  },
  {
    code: "E100",
    name: "Curcumin",
    role: "Yellow colour — from turmeric",
    verdict: "settled",
    note: "Extracted from the turmeric root. Worth noting only because it is often listed beside numbers that do need checking.",
  },
  {
    code: "E140",
    name: "Chlorophyll",
    role: "Green colour",
    verdict: "settled",
    note: "The pigment plants use for photosynthesis, extracted from nettles, grass or alfalfa.",
  },
  {
    code: "E150a–d",
    name: "Caramel colour",
    role: "Brown colour — cola, sauces, bread",
    verdict: "settled",
    note: "Made by heating sugar, with ammonia or sulphites in the 150b–d variants. Plant-derived throughout. The variants differ in process rather than in origin.",
    also: ["caramel colour", "E150"],
  },
  {
    code: "E160a",
    name: "Carotenes",
    role: "Orange colour",
    verdict: "settled",
    note: "From carrots, algae or synthesis. Worth one caveat: the carotene itself is fine, but it is fat-soluble and is sometimes carried in gelatine for use in drinks — the carrier rather than the colour is the thing to ask about.",
    also: ["beta carotene"],
  },
  {
    code: "E322",
    name: "Lecithin",
    role: "Emulsifier — chocolate, margarine, bread",
    verdict: "settled",
    note: "Almost always from soya beans or sunflower seeds. Egg lecithin exists and is used in some products, which raises no question either. It appears on forwarded lists and should not.",
    also: ["soy lecithin", "lecithin"],
  },
  {
    code: "E202",
    name: "Potassium sorbate",
    role: "Preservative",
    verdict: "settled",
    note: "Synthetic, made from sorbic acid. No animal route exists commercially.",
  },
  {
    code: "E211",
    name: "Sodium benzoate",
    role: "Preservative — soft drinks, sauces",
    verdict: "settled",
    note: "Synthetic. Benzoic acid occurs naturally in cranberries and is made industrially from toluene.",
  },
  {
    code: "E223",
    name: "Sodium metabisulphite",
    role: "Preservative and antioxidant",
    verdict: "settled",
    note: "A mineral salt. The sulphite family, E220 to E228, is synthetic throughout.",
    also: ["sulphites", "E220"],
  },
  {
    code: "E296",
    name: "Malic acid",
    role: "Acidity regulator — sour sweets",
    verdict: "settled",
    note: "Occurs in apples and is made synthetically at scale. No animal route.",
  },
  {
    code: "E300",
    name: "Ascorbic acid, vitamin C",
    role: "Antioxidant",
    verdict: "settled",
    note: "Made from glucose by fermentation and chemical steps. Plant-derived throughout.",
    also: ["vitamin C", "ascorbic acid"],
  },
  {
    code: "E406",
    name: "Agar",
    role: "Gelling agent — the usual gelatine substitute",
    verdict: "settled",
    note: "From red seaweed. Where a product uses agar rather than gelatine, that is generally a deliberate choice by the manufacturer and a good sign.",
    also: ["agar agar"],
  },
  {
    code: "E407",
    name: "Carrageenan",
    role: "Thickener — dairy, plant milks",
    verdict: "settled",
    note: "From red seaweed, in the same way as agar. It turns up constantly in plant milks and dairy desserts, and the arguments about it concern digestion rather than lawfulness.",
  },
  {
    code: "E410",
    name: "Locust bean gum",
    role: "Thickener",
    verdict: "settled",
    note: "From carob seeds. The name causes alarm and refers to the carob tree, not to insects.",
    also: ["carob gum"],
  },
  {
    code: "E412",
    name: "Guar gum",
    role: "Thickener",
    verdict: "settled",
    note: "Ground from the seed of the guar bean, a legume grown mostly in India and Pakistan. There is no animal or alcohol step anywhere in making it.",
  },
  {
    code: "E415",
    name: "Xanthan gum",
    role: "Thickener — gluten-free baking, sauces",
    verdict: "settled",
    note: "Made by bacterial fermentation of sugar. One caveat that rarely matters: the growth medium is occasionally dairy or wheat-derived, which is an allergen question rather than a permissibility one.",
  },
  {
    code: "E440",
    name: "Pectin",
    role: "Gelling agent — jam",
    verdict: "settled",
    note: "From citrus peel and apple pomace. The number sits next to E441 in the list, which is how it ends up wrongly suspected.",
  },
  {
    code: "E500",
    name: "Sodium carbonates",
    role: "Raising agent — baking soda",
    verdict: "settled",
    note: "A mineral salt, mined or made from brine, and the ordinary baking soda of a kitchen. E500 to E509 are carbonates throughout, with no animal route at any point.",
    also: ["baking soda", "bicarbonate"],
  },
  {
    code: "E901",
    name: "Beeswax",
    role: "Glazing agent",
    verdict: "settled",
    note: "Secreted by bees, and permitted on the same reasoning as honey. Listed here because it is often lumped in with E904 and E120 as an 'insect number' without the distinction being made.",
  },

  // --- Alcohol ---
  {
    code: "E1510",
    name: "Ethanol",
    role: "Carrier solvent — flavourings, colours, extracts",
    verdict: "alcohol",
    note: "Used to dissolve flavourings rather than as a drink, and usually present in traces after processing. Scholars differ: some prohibit any quantity, others permit what neither intoxicates nor remains in meaningful amount, particularly where it is not from grape or date. Vanilla extract is where most people meet this question.",
    also: ["alcohol", "ethyl alcohol"],
  },
  {
    code: "E334",
    name: "Tartaric acid",
    role: "Acidity regulator — baking powder, sweets",
    verdict: "alcohol",
    note: "Traditionally recovered from the sediment of winemaking, which is why it appears on lists. Synthetic and non-wine routes exist and are common. Worth asking about where a product is European and traditional.",
    also: ["E335", "E336", "cream of tartar"],
  },
];

/** Matches a code or a name, loosely enough for how people actually type. */
export function findAdditives(query: string): Additive[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  if (q === "") return ADDITIVES;

  // "471" should find E471, and "e471" should too.
  const bare = q.replace(/^e/, "");

  return ADDITIVES.filter((a) => {
    const code = a.code.toLowerCase().replace(/\s+/g, "");
    if (code.includes(q) || code.includes(`e${bare}`)) return true;
    if (a.name.toLowerCase().replace(/\s+/g, "").includes(q)) return true;
    if (a.role.toLowerCase().replace(/\s+/g, "").includes(q)) return true;
    return (a.also ?? []).some((s) =>
      s.toLowerCase().replace(/\s+/g, "").includes(q),
    );
  });
}

export const countByVerdict = (): Record<Verdict, number> => {
  const counts = { settled: 0, depends: 0, animal: 0, insect: 0, alcohol: 0 };
  for (const a of ADDITIVES) counts[a.verdict]++;
  return counts;
};
