"use client";

import { useMemo, useState } from "react";
import {
  HALF_SAA_WHEAT_KG,
  KAFFARAH_DAYS,
  KAFFARAH_PEOPLE,
  calculateFidya,
  type DelayView,
  type RateMethod,
} from "@/lib/fidya";
import { plain } from "@/lib/format";
import { CornerMotif } from "./Ornament";
import { Card, Notice, NumberField as Money } from "./ui";

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function FidyaCalculator() {
  const [makeUp, setMakeUp] = useState("");
  const [fidyaDays, setFidyaDays] = useState("");
  const [kaffarahDays, setKaffarahDays] = useState("");
  const [delayed, setDelayed] = useState("");
  const [delayView, setDelayView] = useState<DelayView>("majority");
  const [rateMethod, setRateMethod] = useState<RateMethod>("weight");
  const [published, setPublished] = useState("");
  const [wheat, setWheat] = useState("");
  const [canFast, setCanFast] = useState(true);

  const result = useMemo(
    () =>
      calculateFidya({
        makeUpDays: num(makeUp),
        fidyaDays: num(fidyaDays),
        kaffarahDays: num(kaffarahDays),
        delayedDays: num(delayed),
        delayView,
        rateMethod,
        publishedRate: num(published),
        wheatPricePerKg: num(wheat),
        canFastSixty: canFast,
      }),
    [makeUp, fidyaDays, kaffarahDays, delayed, delayView, rateMethod, published, wheat, canFast],
  );

  const nothing =
    result.lines.length === 0;

  return (
    <div className="stagger space-y-4">
      {/* ---------- Step 1 ---------- */}
      <Card className="no-print">
        <StepHeading
          n={1}
          title="Which days, and why"
          sub="These three are different obligations and are constantly mistaken for one another. Put each day in one box only."
        />

        <div className="mt-5 space-y-4">
          <Count
            label="Missed, and you can still fast them"
            hint="Illness that passed, travel, menstruation, pregnancy. Owed as fasts — no money."
            value={makeUp}
            onChange={setMakeUp}
          />
          <Count
            label="Missed, and you will never be able to fast them"
            hint="Chronic illness with no prospect of recovery, or old age. This is what fidya is for."
            value={fidyaDays}
            onChange={setFidyaDays}
          />
          <Count
            label="Broken deliberately, with no excuse"
            hint="Eating or drinking on purpose during a fast of Ramadan. This is what kaffarah is for."
            value={kaffarahDays}
            onChange={setKaffarahDays}
          />
        </div>

        {num(makeUp) > 0 && (
          <div className="mt-5 border-t border-line pt-5">
            <Count
              label="Of those, how many are past a later Ramadan"
              hint="Days you did not make up before the following Ramadan came round"
              value={delayed}
              onChange={setDelayed}
            />
            {num(delayed) > 0 && (
              <fieldset className="mt-4">
                <legend className="text-base font-semibold">
                  On a delayed make-up
                </legend>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  The fast is owed on every view. Whether feeding is owed on top
                  of it is where the schools part.
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {(
                    [
                      ["majority", "Feeding as well", "Maliki, Shafi'i, Hanbali"],
                      ["hanafi", "The fast alone", "Hanafi"],
                    ] as const
                  ).map(([value, label, who]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDelayView(value)}
                      aria-pressed={delayView === value}
                      className={`press rounded-xl border px-4 py-3 text-left transition ${
                        delayView === value
                          ? "border-brand bg-brand-soft"
                          : "border-line hover:border-brand"
                      }`}
                    >
                      <span
                        className={`block text-base font-semibold ${delayView === value ? "text-brand" : ""}`}
                      >
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">
                        {who}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}
      </Card>

      {/* ---------- Step 2 ---------- */}
      {(num(fidyaDays) > 0 || num(kaffarahDays) > 0 || num(delayed) > 0) && (
        <Card className="no-print">
          <StepHeading
            n={2}
            title="What one day's feeding costs"
            sub="Where your mosque publishes a figure, that is the one to use — they are pricing the food your community actually eats."
          />

          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {(
              [
                ["published", "A published rate", "The figure your mosque or charity announces"],
                ["weight", "By weight of wheat", `Half a sa', about ${HALF_SAA_WHEAT_KG} kg, per day`],
              ] as const
            ).map(([value, label, why]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRateMethod(value)}
                aria-pressed={rateMethod === value}
                className={`press rounded-xl border px-4 py-3 text-left transition ${
                  rateMethod === value
                    ? "border-brand bg-brand-soft"
                    : "border-line hover:border-brand"
                }`}
              >
                <span
                  className={`block text-base font-semibold ${rateMethod === value ? "text-brand" : ""}`}
                >
                  {label}
                </span>
                <span className="mt-0.5 block text-sm leading-snug text-muted">
                  {why}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            {rateMethod === "published" ? (
              <Money
                label="Rate for one day"
                hint="In your own currency, as announced locally"
                value={published}
                onChange={setPublished}
              />
            ) : (
              <Money
                label="Wheat, per kilogram"
                hint={`Multiplied by ${HALF_SAA_WHEAT_KG} kg to give one day's feeding`}
                value={wheat}
                onChange={setWheat}
              />
            )}
          </div>

          {num(kaffarahDays) > 0 && (
            <label className="mt-5 flex cursor-pointer items-start gap-2.5 border-t border-line pt-5 text-base">
              <input
                type="checkbox"
                checked={canFast}
                onChange={(e) => setCanFast(e.target.checked)}
                className="mt-1 h-4.5 w-4.5 accent-[var(--brand)]"
              />
              <span>
                Able to fast {KAFFARAH_DAYS} consecutive days
                <span className="mt-0.5 block text-sm leading-snug text-muted">
                  Untick only if that is genuinely not possible — then the
                  kaffarah becomes feeding {KAFFARAH_PEOPLE} people per day
                  broken.
                </span>
              </span>
            </label>
          )}
        </Card>
      )}

      {/* ---------- The answer ---------- */}
      {nothing ? (
        <Notice>
          Enter the days above and what you owe appears here — in fasts, in
          money, or in both.
        </Notice>
      ) : (
        <>
          <section className="answer-panel shimmer relative isolate overflow-hidden rounded-2xl bg-brand-panel p-5 text-white sm:p-7">
            <div
              className="band-grid islamic-grid absolute inset-0 opacity-90"
              aria-hidden
            />
            <CornerMotif className="top-0 right-0 h-36 w-36 text-white/35" />
            <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
              What is owed
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-8 gap-y-2">
              {result.totalFasts > 0 && (
                <p className="text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                  {result.totalFasts}
                  <span className="ml-2 text-lg font-medium text-white/80">
                    {result.totalFasts === 1 ? "fast" : "fasts"}
                  </span>
                </p>
              )}
              {result.totalMoney > 0 && (
                <p className="text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
                  {plain(result.totalMoney)}
                  <span className="ml-2 text-lg font-medium text-white/80">
                    to give
                  </span>
                </p>
              )}
              {result.needsRate && (
                <p className="text-lg text-white/85">
                  Enter a rate above to see the money owed.
                </p>
              )}
            </div>
            {result.perDay > 0 && (
              <p className="mt-4 border-t border-white/20 pt-4 text-base text-white/85">
                One day&rsquo;s feeding reckoned at {plain(result.perDay)}.
              </p>
            )}
          </section>

          <Card>
            <h2 className="rule-gold display text-2xl">Line by line</h2>
            <div className="mt-5 space-y-3">
              {result.lines.map((l) => (
                <div key={l.label} className="rounded-xl bg-background p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-base font-semibold">{l.label}</span>
                    <span className="text-base font-bold tabular-nums text-brand">
                      {l.fasts > 0
                        ? `${l.fasts} ${l.fasts === 1 ? "fast" : "fasts"}`
                        : l.amount > 0
                          ? plain(l.amount)
                          : "—"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {l.detail}
                  </p>
                </div>
              ))}
            </div>

            {result.notes.length > 0 && (
              <div className="mt-5 space-y-3 border-t border-line pt-4">
                {result.notes.map((n) => (
                  <p key={n} className="text-base leading-relaxed text-muted">
                    {n}
                  </p>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <Notice tone="danger">
        <strong>This is a calculator, not a fatwa.</strong> Whether a
        particular illness makes fasting permanently impossible, whether a
        broken fast was deliberate in the sense the rule means, and what a
        delayed make-up carries are all questions of fact and of school, not of
        arithmetic. Put your own case to someone qualified.
      </Notice>
    </div>
  );
}

/* ---------- small pieces ---------- */

function StepHeading({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
        {n}
      </span>
      <div>
        <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
        <p className="mt-1.5 text-base leading-relaxed text-muted">{sub}</p>
      </div>
    </div>
  );
}

function Count({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line px-4 py-3.5">
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium">{label}</span>
        <span className="mt-0.5 block text-sm leading-snug text-muted">
          {hint}
        </span>
      </span>
      <span className="flex w-24 shrink-0 items-center rounded-lg border border-line bg-surface px-3 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          inputMode="numeric"
          aria-label={label}
          className="w-full min-w-0 bg-transparent py-2.5 text-lg font-bold tabular-nums outline-none"
        />
      </span>
    </label>
  );
}

