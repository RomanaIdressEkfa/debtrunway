/**
 * The answers section.
 *
 * These exist because most of what people actually type into a search box is
 * a question rather than a calculation, and a calculator page cannot rank for
 * "is my salary haram if my employer is a bank" however good its FAQ is.
 *
 * One rule governs what goes in here, and it is a rule about restraint: an
 * answer is written long or not at all. Fifty two-paragraph pages covering
 * every topic imaginable is precisely the pattern Google's scaled-content
 * policy was written to catch, and a site that trips it loses the good pages
 * along with the thin ones. Six answers that genuinely settle something are
 * worth more than fifty that gesture at it.
 *
 * The second rule is the one the whole site runs on: where scholars differ,
 * say so and say who, rather than picking one and presenting it as the
 * answer. None of this is a fatwa and every page says as much.
 */

export interface Block {
  kind: "p" | "h2" | "ul";
  /** Paragraph or heading text; for a list, the items. */
  text?: string;
  items?: string[];
}

export interface Answer {
  slug: string;
  /** The question as someone would actually type it. */
  question: string;
  /** Shorter, for the <title>. */
  title: string;
  /** Meta description and the line under the question on the index. */
  summary: string;
  /**
   * The day it went live, as YYYY-MM-DD.
   *
   * It reaches the reader through dateCreated in the page schema, so it has
   * to be the real date rather than the build date — a page that claims to
   * have been written today, every day, is making a false claim about how
   * current it is.
   */
  published: string;
  /** Which cluster it belongs to. */
  topic: "money" | "worship" | "family";
  /** The short answer, given before the reasoning. */
  short: string;
  body: Block[];
  /** Calculators worth a link from this answer. */
  related?: { href: string; label: string }[];
}

const p = (text: string): Block => ({ kind: "p", text });
const h2 = (text: string): Block => ({ kind: "h2", text });
const ul = (items: string[]): Block => ({ kind: "ul", items });

export const ANSWERS: Answer[] = [
  {
    slug: "what-to-do-with-bank-interest",
    question: "What should I do with the interest my bank has paid me?",
    title: "What to do with bank interest",
    summary:
      "Give it away without expecting reward for it, and to whom. Why leaving it in the account is the one option scholars agree against.",
    published: "2026-09-08",
    topic: "money",
    short:
      "Take it out and give it away, without intending it as charity and without expecting reward for it. What is disputed is who may receive it. What is not disputed is that leaving it with the bank is the worst of the options.",
    body: [
      p(
        "Almost everyone in a country with a conventional banking system ends up holding some. A current account pays a little; a savings account pays more; sometimes it arrives without being asked for. The question is not whether taking it was permissible — it was not — but what to do with money that is now sitting in your account.",
      ),
      h2("Why it cannot simply stay there"),
      p(
        "This is the one point on which there is no real disagreement. Keeping it means benefiting from it, which is the thing prohibited in the first place. Nor can it be quietly spent on ordinary expenses, since spending is benefiting. It has to leave your wealth.",
      ),
      p(
        "It also cannot be left with the bank in the hope that this is somehow cleaner. Several contemporary scholars make this point sharply: money surrendered back to the institution strengthens the very system in question, and it certainly does not reach anyone in need. Between the two, giving it away is agreed on by everyone who has addressed it.",
      ),
      h2("The intention matters, and it is unusual"),
      p(
        "This is where people most often go wrong. The money is disposed of, not donated. You do not intend it as sadaqah, you do not expect reward for it, and you do not count it towards your zakat. It is closer to putting down something you should not be holding than to giving a gift.",
      ),
      p(
        "The practical consequence is that it must be tracked separately from your actual charity. Mixing it into your normal giving muddles both — the disposal becomes a donation in your own mind, and your real sadaqah is diluted by money that was never yours to be generous with.",
      ),
      h2("Who may receive it"),
      p(
        "Here scholars do differ, and the difference is worth knowing before you give.",
      ),
      ul([
        "The most common position permits giving it to the poor generally, on the reasoning that the prohibition attaches to your benefiting from it rather than to the money being unusable by anyone.",
        "A more cautious position restricts it to public benefit that is not worship — infrastructure, road repair, hospital costs, disaster relief — rather than to individuals.",
        "A stricter minority hold that it should not be given to a mosque, an Islamic school or anything carrying the character of worship, since these are places for pure wealth.",
      ]),
      p(
        "In practice many charities in Britain and America maintain a separate fund for exactly this and will tell you plainly which of their work it goes to. Asking that question of a charity is a fair one, and a well-run charity will have a ready answer.",
      ),
      h2("Then close the tap"),
      p(
        "Disposal deals with what has arrived. It does not deal with what is arriving. Most banks in Muslim-minority countries offer a basic account that pays nothing, and switching to one ends the problem rather than managing it annually. Where an Islamic bank is available and its products satisfy your own scholar, that is the fuller answer.",
      ),
      p(
        "One last point that catches people out: this money is not part of your zakatable wealth, because it is not lawfully yours. Deduct it before you calculate, or you will end up paying zakat on money you are about to give away entirely.",
      ),
    ],
    related: [
      { href: "/zakat-calculator", label: "Work out your zakat" },
      {
        href: "/islamic-home-finance-calculator",
        label: "Islamic home finance, compared",
      },
    ],
  },

  {
    slug: "are-credit-cards-haram",
    question: "Are credit cards haram?",
    title: "Are credit cards haram?",
    summary:
      "The card is not the problem; the contract behind it is. Why paying in full each month is the pivot, and why some scholars object even then.",
    published: "2026-09-08",
    topic: "money",
    short:
      "The card itself is a payment instrument and carries no ruling. What matters is the agreement behind it, and specifically whether you ever pay interest. Cleared in full every month, most contemporary scholars permit it with reservations; carrying a balance is riba by consensus.",
    body: [
      p(
        "This is one of the most searched questions in Islamic finance and one of the most confusingly answered, because two different things get discussed under one name: the plastic, and the contract.",
      ),
      h2("Carrying a balance is not a grey area"),
      p(
        "If you do not clear the statement and the card charges you for the delay, that charge is interest on a debt. There is no meaningful disagreement about this. It is the textbook case of riba, and no arrangement of the fees, no cashback, and no argument about modern economics changes it.",
      ),
      p(
        "This is worth stating plainly because the rest of the discussion assumes you never do it. Every permission below is conditional on the balance being cleared in full, every month, without exception.",
      ),
      h2("Where the disagreement actually sits"),
      p(
        "A card cleared in full costs you nothing in interest, and the merchant rather than you pays the network. On that basis many contemporary scholars and councils permit it, treating the card as a payment mechanism and the interest clause as a term that never activates.",
      ),
      p(
        "Others object even then, on two grounds worth understanding rather than dismissing. The first is that you have signed a contract that stipulates riba — the objection is to the agreement itself, not only to paying under it. The second is that the arrangement is a debt facility by nature, and a person who intends never to use it is still one bad month away from using it.",
      ),
      p(
        "Both positions are held by serious people. Which you follow is a decision to take with a scholar rather than from a page.",
      ),
      h2("The parts nobody disputes"),
      ul([
        "A fixed annual fee for the card, charged as a service, is generally accepted — it is a price for a service rather than a charge for time on money.",
        "Cash withdrawals on a credit card almost always attract interest immediately, with no grace period. Avoid them entirely.",
        "Rewards and cashback funded by merchant fees are widely accepted; rewards funded by interest charged to other cardholders are viewed less kindly.",
        "A debit card raises none of these questions at all, since it moves money you already have.",
      ]),
      h2("Buy now, pay later"),
      p(
        "The newer instalment services are often assumed to be safer because they advertise no interest. Read the late-payment terms before assuming that. Where the charge for missing a payment is a genuine administrative cost it is treated differently from where it is a percentage of the outstanding sum, and several of these services are the latter dressed as the former.",
      ),
      h2("The practical answer"),
      p(
        "If you use a card, set it to clear in full automatically on the statement date and never touch cash advances. That removes the disputed element for most of the scholars who permit it, and removes the undisputed element entirely. If you find you cannot reliably clear it, the honest conclusion is that the card is not for you — and a debit card does the same job with no ruling attached.",
      ),
    ],
    related: [
      { href: "/zakat-calculator", label: "Which debts reduce your zakat" },
    ],
  },

  {
    slug: "is-conventional-insurance-haram",
    question: "Is conventional insurance haram?",
    title: "Is conventional insurance permissible?",
    summary:
      "The three objections scholars raise, why compulsory cover is treated differently, and what takaful actually changes.",
    published: "2026-09-08",
    topic: "money",
    short:
      "The majority position is that conventional commercial insurance is not permissible, on three grounds: uncertainty, gambling, and interest in how premiums are invested. Cover the law compels you to hold is widely treated as an exception, and takaful is the alternative where it exists.",
    body: [
      p(
        "Insurance is unusual among modern financial questions because the objection is not a single one. Three separate problems are raised, and understanding which applies to a given policy tells you more than the label on it.",
      ),
      h2("The three objections"),
      ul([
        "Gharar — excessive uncertainty. Neither side knows whether anything will be paid, when, or how much. A contract of exchange in which what is exchanged is unknown is defective in classical terms.",
        "Maysir — gambling. You pay a small sum against a large uncertain payout, and either you lose the premium or the insurer loses the claim. The structure resembles a wager.",
        "Riba. Premiums are pooled and invested, overwhelmingly in interest-bearing instruments, and payouts come partly from that return.",
      ]),
      p(
        "The third objection is the least discussed and often the most decisive, because it applies even to policies where the first two are mild.",
      ),
      h2("Where compulsion changes the answer"),
      p(
        "Motor insurance in most countries, employer's liability, and in some places health cover are required by law. The widely held position is that necessity — darura — permits taking the minimum cover the law demands, on the general principle that a prohibition eases where compliance is genuinely compelled.",
      ),
      p(
        "Two limits are usually attached. The permission extends to the compulsory minimum rather than to comprehensive cover chosen for convenience. And where a takaful alternative is genuinely available in your market, the necessity argument weakens considerably, because you are no longer compelled to use the objectionable form.",
      ),
      h2("What takaful actually changes"),
      p(
        "Takaful restructures the arrangement as mutual assistance rather than exchange. Participants contribute to a fund on the basis that it is a donation used to help whoever suffers loss; the operator manages it for a fee rather than owning it; surplus may be returned to participants; and the fund is invested in shariah-compliant assets.",
      ),
      p(
        "That addresses all three objections, at least in structure. Whether a particular takaful operator delivers it in substance is a separate question, and worth asking: how the surplus is treated and where the fund is invested are the two answers that distinguish a real takaful from a relabelled policy.",
      ),
      h2("What about life insurance"),
      p(
        "Conventional life insurance attracts the objections most strongly, and a further one specific to it — that the payout is often invested and returned with an interest element. Family takaful exists in several markets as the alternative. Where neither is available and dependants would be left destitute, some scholars permit term cover on the necessity argument; others hold that provision for dependants should be made by saving and by a properly drafted will instead.",
      ),
      p(
        "That last route has the advantage of raising no ruling at all, which is worth weighing before treating insurance as the only way to protect a family.",
      ),
    ],
    related: [
      { href: "/islamic-will-calculator", label: "Plan an Islamic will" },
      {
        href: "/islamic-inheritance-calculator",
        label: "How an estate divides",
      },
    ],
  },

  {
    slug: "how-to-know-if-a-share-is-halal",
    question: "How do I know if a share is halal?",
    title: "How to tell whether a share is halal",
    summary:
      "The two screens scholars apply — what the business does, and what its balance sheet looks like — plus the purification step almost everyone forgets.",
    published: "2026-09-08",
    topic: "money",
    short:
      "Two screens. The business itself must be lawful, and its finances must stay within thresholds on debt and interest income. If it passes both, a proportion of the dividend still has to be given away — the step most people skip.",
    body: [
      p(
        "Owning a share is owning a slice of a company, so the question is not really about the share. It is about whether you may own part of that business, and then about what to do with the part of its income that is not clean.",
      ),
      h2("The first screen: what the business does"),
      p(
        "A company whose core activity is prohibited is excluded regardless of its accounts. The usual list is conventional banking and insurance, alcohol, tobacco, pork, gambling, weapons in some formulations, and adult entertainment.",
      ),
      p(
        "Most standards allow a small tolerance for incidental income — a supermarket that sells alcohol among a thousand other things is treated differently from a brewery. Five per cent of revenue is the threshold most commonly applied, and income within it is dealt with by purification rather than by exclusion.",
      ),
      h2("The second screen: what the balance sheet looks like"),
      p(
        "A lawful business can still be financed in a way that makes owning it problematic. The financial screens vary between standards, and the differences are real enough that the same company can pass one and fail another.",
      ),
      ul([
        "Interest-bearing debt, usually capped at a third of market capitalisation or of total assets depending on the standard.",
        "Interest-bearing investments and cash, capped similarly.",
        "Receivables, capped in some standards on the reasoning that a company which is mostly debts owed to it is trading in debt.",
      ]),
      p(
        "AAOIFI, the Dow Jones Islamic Market indices and several national boards each publish their own thresholds. Where they disagree, the disagreement is about where a reasonable line falls rather than about the principle.",
      ),
      h2("Purification, which almost everyone forgets"),
      p(
        "A company that passes both screens still earns a little interest on its cash. Your share of that is not yours to keep, so a proportion of the dividend is calculated and given away — disposed of, in the same manner as bank interest, without intending charity and without expecting reward.",
      ),
      p(
        "Screening services publish a purification ratio per share for exactly this. It is usually small, and it is the difference between owning a compliant share and owning it compliantly.",
      ),
      h2("Where this leaves the practical investor"),
      p(
        "Screening every holding by hand is not realistic for most people, which is why compliant funds and screening apps exist. What is worth knowing is which standard your fund or app applies, since the answer can differ, and whether it handles purification or leaves it to you.",
      ),
      p(
        "Once the holdings are settled, zakat on them is a separate question again — and one where the positions differ by more than threefold depending on whether you hold to trade or to keep.",
      ),
    ],
    related: [
      {
        href: "/zakat-on-investments-calculator",
        label: "Zakat on shares and pensions",
      },
      { href: "/zakat-calculator", label: "Zakat on everything together" },
    ],
  },

  {
    slug: "is-my-salary-haram-if-my-employer-deals-in-interest",
    question: "Is my salary haram if my employer deals in interest?",
    title: "Is my salary haram if I work for a bank?",
    summary:
      "What your own role is doing matters more than what the company does. The line most scholars draw, and where it leaves ordinary jobs.",
    published: "2026-09-08",
    topic: "money",
    short:
      "Most scholars look at your own work rather than at your employer's whole business. Directly writing, recording, witnessing or facilitating interest contracts is what the hadith names; work with no such connection is generally treated as lawful, though several hold that leaving is better where an alternative exists.",
    body: [
      p(
        "This question reaches more people than any other on this page, because a great many Muslims work for banks, insurers, or companies with conventional finance somewhere in them. Panic is not a useful response, and neither is dismissal.",
      ),
      h2("What the text actually names"),
      p(
        "The hadith commonly cited curses the one who consumes riba, the one who pays it, the one who writes it down, and the two who witness it — adding that they are all the same. What it names is participation in the transaction: consuming, paying, recording, witnessing.",
      ),
      p(
        "That is narrower than 'anyone employed by an institution that does this somewhere'. The scholars who take it strictly and those who take it broadly both start from that text, and the disagreement is about how far the circle of participation extends.",
      ),
      h2("The line most scholars draw"),
      p(
        "The common approach asks what your role does, not what the letterhead says.",
      ),
      ul([
        "Directly involved — drafting interest-bearing contracts, processing interest payments, selling interest-bearing products, auditing them, recording them. Widely held to fall within the prohibition.",
        "Supporting the interest business specifically — a system built solely to run the loan book, a team whose whole output serves it.",
        "General employment with no such connection — cleaning, catering, IT for the building, security, HR. Widely treated as lawful work sold for a wage, on the basis that the wage is paid for that work rather than for the transaction.",
      ]),
      p(
        "Even in the third case a number of scholars hold that moving to work with no such association is better where a real alternative exists — a recommendation rather than a prohibition, and one that recognises that people have families and mortgages and cannot always simply resign.",
      ),
      h2("The case that comes up most"),
      p(
        "An ordinary company that is not a financial institution but keeps money in an interest-bearing account, or has a loan. This is almost every business in the world, and treating it as contaminating would make lawful employment nearly impossible. The mainstream position does not treat it as a problem: the company's income comes from its actual trade, and your wage comes from that.",
      ),
      h2("If you conclude you should leave"),
      p(
        "The advice given consistently is not to leave with nothing arranged. Look, plan, and move — a family made destitute is not the outcome any of this is aimed at. Scholars who counsel leaving generally counsel doing it deliberately.",
      ),
      p(
        "And the money already earned is not usually revisited. The rulings are about what you do next, not about unwinding a decade of wages you spent on rent.",
      ),
    ],
    related: [
      { href: "/zakat-calculator", label: "Zakat on what you have saved" },
    ],
  },

  {
    slug: "is-a-conventional-mortgage-ever-permissible",
    question: "Is a conventional mortgage ever permissible?",
    title: "Is a conventional mortgage ever permissible?",
    summary:
      "The majority position, the minority necessity arguments and their conditions, and why the answer has changed as alternatives have appeared.",
    published: "2026-09-08",
    topic: "money",
    short:
      "The majority position is that it is not, because it is a loan at interest whatever it buys. A minority permitted it in Muslim-minority countries on grounds of need — but those rulings were conditioned on there being no alternative, and in Britain and America there now is one.",
    body: [
      p(
        "This is the most consequential financial question most Muslim families in the West will face, and it deserves the actual state of the discussion rather than a slogan in either direction.",
      ),
      h2("Why the default answer is no"),
      p(
        "A conventional mortgage is a loan of money repaid with more money, secured on a house. The house does not change what the contract is. Riba is prohibited in the Qur'an in unusually severe terms, and the prohibition attaches to the lending, not to what the borrowing is for.",
      ),
      p(
        "This is the position of the overwhelming majority of scholars, classical and contemporary, and it is the starting point for every serious discussion of the question.",
      ),
      h2("The necessity arguments, and their conditions"),
      p(
        "A minority of scholars — most prominently in some European fatwa councils during the 1990s — permitted it for Muslims in countries where no lawful alternative existed, reasoning from need and from the harm of a community permanently locked out of home ownership.",
      ),
      p(
        "Those rulings are frequently quoted and rarely quoted in full. They carried conditions:",
      ),
      ul([
        "No shariah-compliant alternative available in that market.",
        "A genuine need for housing rather than an investment purchase or an upgrade.",
        "The minimum necessary rather than the maximum obtainable.",
        "Not a rule for all times and places, but a dispensation for a described situation.",
      ]),
      p(
        "The first condition is the one that has changed. Britain has had Islamic home finance providers for over two decades; the United States and Canada have several. A dispensation granted because there was no alternative reads very differently in a market that now has one, and a number of the scholars who supported it then have said so.",
      ),
      h2("What the alternatives actually are"),
      p(
        "Diminishing musharakah, murabaha and ijara are the three structures on offer, and they are genuinely different contracts rather than three names for a mortgage. They also attract their own criticism — that some implementations reproduce a loan in substance while changing its form, benchmarking rent to an interest index being the usual complaint.",
      ),
      p(
        "That criticism deserves to be taken seriously rather than waved away, and it is a reason to read the contract rather than the brochure. But 'the alternative is imperfect' is a different claim from 'the alternative does not exist', and only the second supported the original dispensation.",
      ),
      h2("The option nobody markets"),
      p(
        "Renting while saving raises none of these questions at all. It is slower, it feels like standing still in a rising market, and no institution advertises it because nobody profits from it.",
      ),
      p(
        "It is also worth saying plainly: the obligation to avoid riba does not create an obligation to own a house. A great many people who put this question to a scholar are hoping to be told they may buy now. Some are told to wait, and that is an answer rather than an evasion.",
      ),
    ],
    related: [
      {
        href: "/islamic-home-finance-calculator",
        label: "Compare the three Islamic structures",
      },
      { href: "/hajj-savings-calculator", label: "Saving with zakat counted" },
    ],
  },

  // --- Family ---
  {
    slug: "why-does-a-daughter-inherit-half",
    question: "Why does a daughter inherit half of what a son inherits?",
    title: "Why does a daughter inherit half?",
    summary:
      "The rule is narrower than it is usually stated, and the reasoning behind it is about obligations rather than worth. What it does and does not apply to.",
    published: "2026-09-08",
    topic: "family",
    short:
      "It applies where sons and daughters inherit together as residuaries, and not across the scheme as a whole — in most configurations a woman takes the same as the man in her position, or more, or he takes nothing. Where it does apply, the stated reason is that the shares carry different obligations: his is encumbered by maintenance he owes, hers is not.",
    body: [
      p(
        "This is the single most asked question about Islamic inheritance, and it is usually asked about a rule that is stated more broadly than it exists. There is no general principle that a woman inherits half of a man. There is a specific rule, in a specific configuration, and outside it the scheme does something else entirely.",
      ),
      h2("Where the rule actually applies"),
      p(
        "The verse is 4:11, and its subject is children inheriting together: where a deceased person leaves both sons and daughters, they take the residue in a two-to-one ratio. The same ratio governs full and consanguine siblings inheriting together in the absence of descendants.",
      ),
      p(
        "That is close to the whole of it. Run the other configurations and the picture is not what the question assumes:",
      ),
      ul([
        "A mother and a father, where the deceased left children: each takes exactly one sixth. The same share, not half.",
        "Uterine siblings — those related through the mother alone — share equally regardless of sex, by the plain text of 4:12.",
        "A daughter with no brothers takes half the estate on her own, and two or more daughters take two thirds between them. In many families that is more than any other single claimant receives.",
        "A wife inherits from her husband and a husband from his wife, but a wife whose husband dies also keeps her mahr and her own property entirely, having owed nothing towards the household from either.",
        "A grandmother inherits where a grandfather in the equivalent position may not, depending on the configuration.",
      ]),
      p(
        "Work through a few real families in the calculator and the pattern becomes visible: the two-to-one ratio governs one relationship among many, and a great deal of the scheme is either equal or favours the woman.",
      ),
      h2("The reasoning that is given for it"),
      p(
        "Where the ratio does apply, the classical explanation is not about the worth of the heirs. It is about what each share is obliged to carry.",
      ),
      p(
        "Under the same body of law, a man owes the mahr at marriage, owes the complete maintenance of his wife — housing, food, clothing, medical care — owes the maintenance of his children, and owes support to his parents and often his unmarried sisters if they need it. None of that is discharged from his wife's wealth, and he cannot require her to contribute a penny of it even if she is the wealthier of the two.",
      ),
      p(
        "A woman's property, by contrast, is hers alone. Her earnings are hers, her inheritance is hers, her mahr is hers, and she owes no maintenance from any of it — not to her husband, not to her children, not to her household. She may spend it entirely on herself, and if she chooses to contribute to the household that is a gift rather than a duty.",
      ),
      p(
        "So the two shares are not comparable amounts. His is a gross figure with claims already attached; hers is net. That is the argument, and it is worth understanding on its own terms before agreeing or disagreeing with it.",
      ),
      h2("The honest part"),
      p(
        "The rationale describes a system of obligations working as designed. Whether it is working that way in a particular family in 2026 is a separate question, and the answer is often no. Plenty of Muslim women support households. Plenty of Muslim men do not maintain their sisters. A rationale that assumes the obligations are being met does not automatically fit a case where they are not.",
      ),
      p(
        "Contemporary scholars have discussed this, and the range of response is narrower than people expect. The shares themselves are given in the text with named fractions, so the overwhelming majority hold they are not open to revision by changed circumstance — a rule stated numerically in revelation is not treated as a rule of thumb. What is open is everything the scheme deliberately leaves open.",
      ),
      h2("What is open"),
      p(
        "Two doors are wide, and most people asking this question do not know they are there.",
      ),
      p(
        "The first is the bequest. Up to a third of the estate may be directed by will to anyone who is not already an heir — an unmarried daughter's guardian, a charity, a foster child, a relative the scheme does not reach. It cannot be used to top up an heir's share, which is precisely the rule that keeps the third from swallowing the scheme, but it is a third of the estate placed entirely at your discretion.",
      ),
      p(
        "The second is the lifetime gift. Property given away while you are alive is simply not part of the estate when you die, and a parent who wishes to provide more for a particular child in their lifetime may do so. The caution attached is real and often missed: the majority position holds that gifts among children should be even-handed, on the strength of the hadith of Nu'man ibn Bashir, whose father was told to take back a gift made to him alone. A gift with a reason — a child with a disability, a child who has been supporting you — is treated differently from a gift that simply prefers one child.",
      ),
      p(
        "Between the two, a person who wants a particular daughter provided for has means. What they cannot do is rewrite the fixed shares and call the result an Islamic distribution.",
      ),
    ],
    related: [
      {
        href: "/islamic-inheritance-calculator",
        label: "See the shares for your own family",
      },
      { href: "/islamic-will-calculator", label: "What the third can do" },
    ],
  },
  {
    slug: "do-adopted-children-inherit",
    question: "Do adopted children inherit in Islam?",
    title: "Do adopted and step-children inherit?",
    summary:
      "Not by the fixed shares — and that is not the end of it. Why the one-third bequest exists for this case, and the will a British court will override.",
    published: "2026-09-08",
    topic: "family",
    short:
      "No, not through faraid: the fixed shares run on lineage, and adoption in the Western legal sense does not create it. But an adopted or foster child is not an heir, which means the one-third bequest is available to them without restriction — the case the third exists for.",
    body: [
      p(
        "People usually arrive at this question having been told the first half of the answer and not the second, and it lands badly. The fixed shares do not reach an adopted child. That is true, and stopping there makes the scheme look as though it has nothing to say to a family that has raised a child for twenty years.",
      ),
      h2("Why the shares run on lineage"),
      p(
        "The relevant passage is 33:4-5, which addresses the practice directly and instructs that such children be called by the names of their own fathers. What is being ruled out is not the raising of a child who needs a home — that is encouraged in the strongest terms — but the legal fiction that severs the child from their origins and substitutes a new parentage.",
      ),
      p(
        "The reason is that lineage does structural work throughout the law. It determines who may marry whom. It determines who is mahram, and therefore what the household looks like as the child grows up. It determines who owes maintenance to whom. And it determines inheritance. A fiction that rewrites lineage does not rewrite one thing; it silently rewrites all four.",
      ),
      p(
        "What Islamic law offers in its place is kafala — guardianship, provision, care, a home, everything a child needs, without the substitution of parentage. The reward described for it is considerable. What it does not carry is an automatic share of the estate.",
      ),
      h2("Which is exactly what the third is for"),
      p(
        "The bequest may be made to anyone who is not already an heir, up to one third of the net estate. The restriction that catches most people — no bequest to an heir without the other heirs' consent — does not apply here, because an adopted or foster child is not among the heirs.",
      ),
      p(
        "So the child you raised can be left up to a third of everything you own, freely, by a document you write yourself. That is not a workaround. It is the mechanism working as intended: the fixed shares handle the relations the law recognises automatically, and the third handles the ones it does not.",
      ),
      p(
        "The same is true of a step-child, who does not inherit from a step-parent, and of a foster child, and of anyone else whose claim on you is real and whom the scheme does not reach. Note the one thing people forget: a step-child still inherits from their own biological parents in the ordinary way, so the question is only about the step-parent's estate.",
      ),
      h2("The provisions outside the estate"),
      p(
        "Several routes do not touch the estate at all, and they are worth knowing because the third is a ceiling on the will, not a ceiling on what you can provide.",
      ),
      ul([
        "A lifetime gift — property transferred while you are alive is not part of the estate at death, and there is no third to work within.",
        "A takaful policy or a pension with a nominated beneficiary, which in many jurisdictions passes outside the estate entirely. Whether that is treated as estate property is a genuine question scholars differ on, so it is worth asking about rather than assuming.",
        "A trust, where the local law offers one, holding property for the child directly.",
      ]),
      h2("The trap worth naming"),
      p(
        "In Britain, the United States, Canada and Australia, a legally adopted child is your child for every purpose the courts recognise — including inheritance, and including a claim against your estate if a will excludes them. An Islamic will drafted without regard to that can be challenged, varied, or set aside, and the family is left with litigation instead of a distribution.",
      ),
      p(
        "The reverse trap is just as common: a will that satisfies the local court but distributes on lines the fixed shares do not recognise. Both failures come from treating this as a document you can copy from a website.",
      ),
      p(
        "Work out the shares first so you know what the scheme gives, decide what the third should do, and then have the document drafted by someone who practises succession law where you actually live. The calculators here will do the first two. The third part is not a calculation.",
      ),
    ],
    related: [
      {
        href: "/islamic-will-calculator",
        label: "Work out what the third can carry",
      },
      {
        href: "/islamic-inheritance-calculator",
        label: "See who the fixed shares reach",
      },
    ],
  },

  // --- Worship ---
  {
    slug: "do-i-have-to-make-up-missed-prayers",
    question: "Do I have to make up prayers I have missed?",
    title: "Do I have to make up missed prayers?",
    summary:
      "Sleep and forgetfulness are agreed. Years of deliberate abandonment are not — and the two positions differ. Both are set out, with how to actually begin.",
    published: "2026-09-08",
    topic: "worship",
    short:
      "A prayer missed through sleep or forgetfulness is prayed when you remember, by consensus. For prayers abandoned deliberately over years the four schools require them to be made up; a minority position holds they cannot be made up at all and what remains is repentance. Both positions agree on what you do next.",
    body: [
      p(
        "The people who ask this are rarely asking about one missed Asr. They are asking about a period — a few years, sometimes a decade — and the arithmetic frightens them into doing nothing, which is the one outcome every scholar on every side of this would call the worst.",
      ),
      h2("The part nobody disputes"),
      p(
        "Where a prayer is missed through sleep or forgetfulness, it is prayed when the person wakes or remembers, and there is no sin in it. The hadith is explicit: whoever sleeps through a prayer or forgets it should pray it when he remembers it, and there is no expiation for it beyond that.",
      ),
      p(
        "The same applies to a prayer missed through unconsciousness, and to a woman's prayers during menstruation, which are not made up at all — the obligation lapses rather than accumulating. Fasts missed for that reason are made up; prayers are not. It is a distinction people frequently get backwards.",
      ),
      h2("Where the disagreement is"),
      p(
        "The hard case is prayer abandoned deliberately, over a long period, by someone who knew and could have prayed.",
      ),
      p(
        "The four schools hold that these are made up. The reasoning runs from the lesser to the greater: if someone excused by sleep must still pray it, someone with no excuse can hardly be under a lighter obligation. This is the position of the overwhelming majority, it is what a local imam will almost certainly tell you, and it is the safer course in the sense that acting on it cannot leave you having done too little.",
      ),
      p(
        "The minority position — held by Ibn Hazm, and by Ibn Taymiyyah and Ibn al-Qayyim after him — is that a prayer deliberately abandoned outside its time cannot be made up, because the time was part of the act and it is gone. On this view, making them up is not merely unnecessary but not possible, and what is required instead is sincere repentance, a firm resolve never to abandon another, and an increase in voluntary prayer to make up the deficiency.",
      ),
      p(
        "Both positions read the same hadith. The majority reads its naming of sleep and forgetfulness as an example. The minority reads the naming as a limit — these two cases, and by implication not others.",
      ),
      h2("What they agree on, which is most of it"),
      p(
        "Neither position offers comfort about the years. Neither treats it as a small matter. And both arrive at the same three instructions: repent sincerely, never abandon another prayer from today, and pray more than the minimum.",
      ),
      p(
        "Anyone using the minority view as a reason to do nothing has misunderstood it, since it asks for more voluntary prayer, not less prayer. And anyone using the majority view to conclude that the debt is unpayable and there is no point beginning has drawn the opposite of the conclusion it supports.",
      ),
      h2("If you are making them up, how"),
      p(
        "The practical advice is consistent and it is not what people expect.",
      ),
      ul([
        "Estimate honestly rather than exactly. Nobody can reconstruct which prayers were missed in 2014. A considered estimate made in good faith is what the scholars ask for, and the paralysis of trying to count precisely is itself a reason people never begin.",
        "Attach them to the prayers you are already praying. One or two make-up prayers after each of the five is a rate that finishes a large number over a few years without becoming an ordeal that gets abandoned in a fortnight.",
        "On order: the Hanafi position requires the missed prayers to be made up in sequence, but that requirement lapses once the number exceeds a day and night — six prayers — which is why it does not apply to the case being asked about here. The Shafi'i position treats order as recommended rather than required.",
        "The current prayer comes first when its time is running out. A make-up prayer never displaces a prayer in its own time.",
        "There is no expiation by feeding or by money in place of a missed prayer. That mechanism exists for missed fasts, not for prayers, and being told otherwise is the most common misinformation on this subject.",
      ]),
      h2("The advice that matters most"),
      p(
        "Begin. On the majority position you are discharging a real obligation, and on the minority position you are increasing voluntary prayer, which it explicitly asks for. There is no reading of the disagreement on which starting is wrong, and there is no reading on which continuing to miss them is right.",
      ),
      p(
        "If the number is large enough to feel hopeless, take it to a scholar who knows your circumstances. That is a better use of the question than a search result — this one included.",
      ),
    ],
    related: [
      {
        href: "/prayer-times-calculator",
        label: "Today's prayer times where you are",
      },
      {
        href: "/fidya-and-kaffarah-calculator",
        label: "Missed fasts, which do work differently",
      },
    ],
  },
];

export const bySlugAnswer = (slug: string) =>
  ANSWERS.find((a) => a.slug === slug);

export const topicLabels: Record<Answer["topic"], string> = {
  money: "Money and work",
  worship: "Worship",
  family: "Family",
};

export { p as para, h2 as heading, ul as list };
