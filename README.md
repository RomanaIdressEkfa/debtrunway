# DebtRunway

Ten debt payoff calculators for a US audience, built on one verified
arithmetic engine. Live at [debtrunway.com](https://debtrunway.com).

Every figure is worked out in the visitor's browser. Nothing they type reaches
a server.

## What makes it different

Two things most calculators get wrong, and this one does not:

- **Minimum payments shrink.** Real credit card minimums are a percentage of
  the current balance, so as the balance falls the required payment falls with
  it and progress decelerates every month. Competitors model a flat payment,
  which understates the payoff time by decades. On a $5,000 balance at 22.9%
  with a 2% minimum, the honest answer is that it does not clear within 50
  years.
- **Consolidation is compared fairly.** A loan is usually shown against making
  minimum payments forever, which flatters almost any offer. This site also
  runs the scenario lender-funded calculators leave out: paying that same
  monthly amount against the debts you already have.

## The engine

[`src/lib/debt.ts`](src/lib/debt.ts) is the single source of truth behind all
ten pages. Each month interest accrues, then payments apply — minimums first,
then everything left over to the target debt, with a cleared debt's payment
rolling onto the next. All money is rounded to cents at every step so the
published schedule reconciles exactly.

```bash
npm run verify   # 47 checks against the engine
npm run dev      # local site on :3000
npm run build    # static export to out/
```

The verification suite covers hand-computed schedules, per-row arithmetic
(`start + interest − payment = end`), the invariant that avalanche never costs
more than snowball, percentage-based minimums, and the payment instructions
shown to readers.

## Stack

Next.js 16 with `output: "export"` — 122 static files, no server, no database.
Tailwind CSS 4, DM Sans, hand-drawn SVG charts with HTML axis labels so type
stays legible from 320px up.

Deployed on Cloudflare Pages; a push to `main` publishes.

## Layout

```
src/lib/debt.ts          payoff engine
src/lib/calculators.ts   page registry — nav, sitemap and related links read from here
src/components/          calculators and shared UI
src/app/<slug>/page.tsx  one page per calculator
scripts/verify-engine.ts the test suite
```

Adding a calculator means adding a page and one entry in the registry.

## Licence

All rights reserved.
