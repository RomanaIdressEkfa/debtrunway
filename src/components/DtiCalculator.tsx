"use client";

import { useState } from "react";
import { usd } from "@/lib/format";
import { Card, Field, Notice, ResultHero } from "./ui";

const num = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/** The bands US mortgage underwriters generally work to. */
const BANDS = [
  {
    limit: 36,
    label: "Comfortable",
    tone: "brand" as const,
    note: "Below 36% is the range lenders like. You should have room to borrow and room to breathe.",
  },
  {
    limit: 43,
    label: "Acceptable",
    tone: "brand" as const,
    note: "Most lenders still approve up to 43% — it is the usual ceiling for a qualified mortgage — but you have less margin for a bad month.",
  },
  {
    limit: 50,
    label: "Stretched",
    tone: "danger" as const,
    note: "Above 43% many lenders decline, and those that do not will price the risk into your rate. Paying down a balance moves this quickly.",
  },
  {
    limit: Infinity,
    label: "Overextended",
    tone: "danger" as const,
    note: "At half your income or more going to debt, new credit is largely out of reach. Reducing what you owe matters more than any rate you could shop for.",
  },
];

export default function DtiCalculator() {
  const [income, setIncome] = useState("5800");
  const [housing, setHousing] = useState("1650");
  const [car, setCar] = useState("410");
  const [cards, setCards] = useState("230");
  const [student, setStudent] = useState("290");
  const [other, setOther] = useState("0");

  const gross = num(income);
  const housingCost = num(housing);
  const debts =
    housingCost + num(car) + num(cards) + num(student) + num(other);

  const dti = gross > 0 ? (debts / gross) * 100 : 0;
  const frontEnd = gross > 0 ? (housingCost / gross) * 100 : 0;
  const band = BANDS.find((b) => dti <= b.limit) ?? BANDS[BANDS.length - 1];
  const leftOver = gross - debts;

  // How much the monthly debt load would have to fall to reach 36%.
  const targetPayment = gross * 0.36;
  const reduceBy = Math.max(0, debts - targetPayment);

  return (
    <div className="stagger space-y-4">
      <Card className="no-print">
        <h2 className="text-lg font-semibold">Your monthly figures</h2>
        <p className="mt-1 text-sm text-muted">
          Use gross income — what you earn before tax — because that is what
          lenders use.
        </p>

        <div className="mt-5">
          <Field
            label="Gross monthly income"
            hint="Salary before deductions, plus any reliable additional income."
            value={income}
            onChange={setIncome}
            placeholder="5800"
            prefix="$"
            large
          />
        </div>

        <div className="mt-6 grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
          <Field
            label="Rent or mortgage"
            hint="Include property tax and insurance if escrowed."
            value={housing}
            onChange={setHousing}
            placeholder="1650"
            prefix="$"
          />
          <Field
            label="Car payments"
            value={car}
            onChange={setCar}
            placeholder="410"
            prefix="$"
          />
          <Field
            label="Credit card minimums"
            value={cards}
            onChange={setCards}
            placeholder="230"
            prefix="$"
          />
          <Field
            label="Student loans"
            value={student}
            onChange={setStudent}
            placeholder="290"
            prefix="$"
          />
          <Field
            label="Other loan payments"
            hint="Personal loans, child support, alimony."
            value={other}
            onChange={setOther}
            placeholder="0"
            prefix="$"
          />
        </div>

        <p className="mt-5 text-sm text-muted">
          Leave out groceries, utilities, phone bills and subscriptions —
          lenders count debt obligations, not living costs.
        </p>
      </Card>

      {gross <= 0 ? (
        <Notice tone="danger">
          Enter your gross monthly income to work out your ratio.
        </Notice>
      ) : (
        <>
          <ResultHero
            tone={band.tone === "danger" ? "danger" : "brand"}
            eyebrow="Your debt-to-income ratio"
            value={`${dti.toFixed(1)}%`}
            sub={band.label}
            stats={[
              { label: "Housing only", value: `${frontEnd.toFixed(1)}%` },
              { label: "Debt payments", value: `${usd(debts)}/mo` },
              { label: "Left after debts", value: `${usd(leftOver)}/mo` },
            ]}
          />

          <Card>
            {/* A plain meter reads faster than the number alone. */}
            <div className="mt-6">
              <div
                className="relative h-3 w-full overflow-hidden rounded-full bg-line"
                role="img"
                aria-label={`Debt-to-income ratio ${dti.toFixed(1)} percent, rated ${band.label}`}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, dti)}%`,
                    backgroundColor:
                      band.tone === "danger" ? "var(--danger)" : "var(--brand)",
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>0%</span>
                <span>36% comfortable</span>
                <span>43% ceiling</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mt-5">
              <Notice tone={band.tone}>{band.note}</Notice>
            </div>

            {reduceBy > 0 && (
              <p className="mt-4 text-sm text-muted">
                To reach the comfortable 36% band you would need your monthly
                debt payments to fall by{" "}
                <strong className="text-foreground">{usd(reduceBy)}</strong> —
                from {usd(debts)} down to {usd(targetPayment)}. Clearing your
                smallest balance is usually the fastest way to move it.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
