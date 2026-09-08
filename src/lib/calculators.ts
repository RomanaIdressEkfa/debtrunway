/**
 * One source of truth for every calculator on the site.
 * The nav, the homepage grid, the related-links block and the sitemap all read
 * from here, so adding a calculator means adding a page and one entry.
 *
 * The homepage is deliberately not in this list. It is a hub that introduces
 * the tools rather than a tool itself, and the sitemap adds it separately.
 */
export interface CalculatorMeta {
  slug: string;
  /** Short label for navigation and cards. */
  nav: string;
  /** The <title> and the card heading. */
  title: string;
  /** Meta description and card body. Keep it under ~155 characters. */
  description: string;
  group: "estate" | "zakat" | "worship" | "finance" | "daily";
}

export const calculators: CalculatorMeta[] = [
  {
    slug: "/islamic-inheritance-calculator",
    nav: "Islamic inheritance",
    title: "Islamic Inheritance Calculator (Faraid)",
    description:
      "Divide an estate by the Qur'anic shares. Enter who survived and see each heir's fraction, the amount, and the rule it comes from.",
    group: "estate",
  },
  {
    slug: "/islamic-will-calculator",
    nav: "Islamic will",
    title: "Islamic Will Calculator (Wasiyyah)",
    description:
      "See how much of your estate you may direct by will, what each bequest is worth once the third and the heir rule apply, and what passes by faraid.",
    group: "estate",
  },
  {
    slug: "/zakat-calculator",
    nav: "Zakat",
    title: "Zakat Calculator",
    description:
      "Work out the nisab from today's gold or silver price, total your zakatable wealth, and see the 2.5% you owe.",
    group: "zakat",
  },
  {
    slug: "/zakat-on-business-calculator",
    nav: "Zakat on a business",
    title: "Zakat on Business Assets Calculator",
    description:
      "Stock at every stage, cash and invoices — and everything the business trades with rather than trades in, set aside with the reason.",
    group: "zakat",
  },
  {
    slug: "/zakat-on-gold-calculator",
    nav: "Zakat on gold",
    title: "Zakat on Gold and Silver Calculator",
    description:
      "Enter each piece with its weight and carat. The alloy comes out, and the position you follow on worn jewellery is applied and compared.",
    group: "zakat",
  },
  {
    slug: "/zakat-on-investments-calculator",
    nav: "Zakat on investments",
    title: "Zakat on Shares, Pensions and Crypto",
    description:
      "Work out zakat on a share portfolio, a pension or a 401(k). Choose the scholarly position you follow and see what the alternative gives.",
    group: "zakat",
  },
  {
    slug: "/zakat-al-fitr-calculator",
    nav: "Zakat al-Fitr",
    title: "Zakat al-Fitr Calculator",
    description:
      "Work out what your household owes at the end of Ramadan, in kilograms of your staple and in money, before the Eid prayer.",
    group: "zakat",
  },
  {
    slug: "/qurbani-calculator",
    nav: "Qurbani",
    title: "Qurbani Calculator — Shares, Cost and Ruling",
    description:
      "How many animals or shares your household needs, what it costs, and whether qurbani is wajib on you or a confirmed sunnah.",
    group: "worship",
  },
  {
    slug: "/fidya-and-kaffarah-calculator",
    nav: "Fidya and kaffarah",
    title: "Fidya and Kaffarah Calculator",
    description:
      "Work out what is owed for fasts of Ramadan not kept — which days are repaid by fasting, which by feeding, and which carry both.",
    group: "worship",
  },
  {
    slug: "/hajj-savings-calculator",
    nav: "Hajj savings",
    title: "Hajj Savings Calculator",
    description:
      "Work out when you can go, or what it takes each month — with the zakat your savings owe along the way, which most plans forget.",
    group: "worship",
  },
  {
    slug: "/islamic-home-finance-calculator",
    nav: "Islamic home finance",
    title: "Islamic Home Finance Calculator — Murabaha, Ijara, Musharakah",
    description:
      "What murabaha, ijara and diminishing musharakah each cost on the same figures, and what to ask a provider before signing.",
    group: "finance",
  },
  {
    slug: "/hijri-date-converter",
    nav: "Hijri date",
    title: "Hijri Date Converter — Islamic Calendar",
    description:
      "Today's Hijri date, either calendar converted to the other, and when Ramadan and the two Eids fall by the arithmetic.",
    group: "daily",
  },
  {
    slug: "/halal-e-numbers-checker",
    nav: "Halal E numbers",
    title: "Halal E Numbers Checker — What the Number Can and Cannot Tell You",
    description:
      "Look up any E number and see whether it is settled, depends on the source, or is a matter scholars differ on — and why the forwarded lists are wrong.",
    group: "daily",
  },
  {
    slug: "/prayer-times-calculator",
    nav: "Prayer times and Qibla",
    title: "Prayer Times and Qibla Direction Calculator",
    description:
      "Today's prayer times for your location and the convention you follow, plus the Qibla bearing — worked out on your device, never sent anywhere.",
    group: "daily",
  },
];

export const groupLabels: Record<CalculatorMeta["group"], string> = {
  estate: "Inheritance and estate",
  zakat: "Zakat",
  worship: "Fasting and worship",
  finance: "Home and finance",
  daily: "Every day",
};

export const bySlug = (slug: string) =>
  calculators.find((c) => c.slug === slug);

/** Everything except the page you are on, for the related-links block. */
export const others = (slug: string, limit = 4) =>
  calculators.filter((c) => c.slug !== slug).slice(0, limit);

/**
 * Group order for the nav, the footer and the homepage.
 *
 * Derived from groupLabels rather than repeated in three components, which is
 * how a new group came to be missing from two of them the last time one was
 * added.
 */
export const groups = Object.keys(groupLabels) as CalculatorMeta["group"][];
