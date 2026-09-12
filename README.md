# DebtRunway

Fourteen Islamic calculators and nine long-form answers, each engine checked
against worked examples from the classical texts. Live at
[debtrunway.com](https://debtrunway.com).

Every figure is worked out in the visitor's browser. Nothing anyone types —
the value of an estate, who in a family has died, what is held in gold —
reaches a server, because there is no server: the site is a static export.

## Why it exists

The site began as ten debt-payoff calculators. It no longer is one, and the
reason is the whole point of the project.

Four are cursed in the hadith over riba: the one who consumes it, the one who
pays it, the one who deals in it, and **the one who records it**. A site whose
purpose was computing interest was doing the fourth. So the interest engine was
deleted rather than retired, and what replaced it computes the things Islamic
law actually has fixed, checkable answers for.

## What it does

**Inheritance and estate** — faraid by the Qur'anic shares, and what a will may
direct within the third.

**Zakat** — the nisab from today's metal price, and zakat on business assets,
on gold and silver by piece and carat, on shares and pensions, and zakat al-Fitr.

**Fasting and worship** — qurbani shares and the ruling, fidya and kaffarah,
and a Hajj savings plan that counts the zakat the savings owe on the way.

**Home and finance** — murabaha, ijara and diminishing musharakah costed on the
same figures.

**Every day** — the Hijri calendar, prayer times and the Qibla, and an E-number
checker that says which numbers a source can and cannot settle.

**Answers** — nine questions that have no calculator: bank interest, credit
cards, insurance, screening a share, working for a bank, mortgages, why a
daughter inherits half, whether an adopted child inherits, and missed prayers.

## Where scholars differ, it says so

No engine here picks a madhhab and presents it as the answer. The gold
calculator applies the position you follow on worn jewellery *and shows what
the other gives*. Prayer times ask which of six conventions you use. The Asr
shadow factor is a setting, not a constant. Nothing on the site is a fatwa and
every page says so.

## The engines

```bash
npm run verify   # 306 checks across seven suites
npm run dev      # local site on :3000
npm run build    # static export to out/ — 240 files
```

| Suite | Checks | What it holds |
|---|---:|---|
| `verify-faraid.ts` | 78 | Furud, asaba, hajb, awl, radd, Umariyyatan — against the classical worked examples, including awl 12→15, 6→8 and 24→27 |
| `check-engines.ts` | 82 | Zakat on investments, gold, business; fidya, hajj, qurbani, home finance |
| `check-prayer.ts` | 36 | Solar position and Qibla bearings for cities on four continents, plus both high-latitude fallbacks |
| `check-additives.ts` | 47 | That the wrongly-condemned E numbers are marked settled, and the ones a number cannot settle are never given a verdict |
| `check-weight.ts` | 32 | That 7.5 bhori is exactly 87.48g, and that switching units restates the weight rather than reinterpreting the digits |
| `check-seo.ts` | 18 | Title and description lengths, duplicate URLs, and that the privacy page names any analytics script that is loaded |
| `check-hijri.ts` | 13 | Every day from 1900 to 2200 converted out and back — 109,573 of them |

[`src/lib/faraid.ts`](src/lib/faraid.ts) works in exact integer fractions
rather than floats, because an estate divided into thirds and eighths has to
reconcile to the last unit and 0.1 + 0.2 does not.

## Stack

Next.js 16 with `output: "export"`, Tailwind CSS 4, no database and no
server-side anything. Cinzel Decorative for titles, Roboto Slab for prose,
Inter for figures, Amiri for the Arabic.

Metal prices are fetched at **build** time, not from the visitor's browser —
a live feed would mean a request from every reader to a third party on a site
whose whole promise is that nothing leaves the page. A GitHub Action rebuilds
daily so the nisab stays current.

Deployed on Cloudflare; a push to `main` publishes.

## Layout

```
src/lib/<topic>.ts        one engine per subject, no UI
src/lib/calculators.ts    page registry — nav, footer, homepage and sitemap read from it
src/lib/answers.ts        the written answers, as data so page and schema share a source
src/components/           calculators and shared UI
src/app/<slug>/page.tsx   one page per calculator
scripts/check-*.ts        the suites above
```

Adding a calculator means adding an engine, a page, and one entry in the
registry.

## Licence

All rights reserved. Readable and checkable — that is the point of publishing
it — but not licensed for reuse.
