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
    title: "Is my salary haram if my employer deals in interest?",
    summary:
      "What your own role is doing matters more than what the company does. The line most scholars draw, and where it leaves ordinary jobs.",
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
];

export const bySlugAnswer = (slug: string) =>
  ANSWERS.find((a) => a.slug === slug);

export const topicLabels: Record<Answer["topic"], string> = {
  money: "Money and work",
  worship: "Worship",
  family: "Family",
};

export { p as para, h2 as heading, ul as list };
