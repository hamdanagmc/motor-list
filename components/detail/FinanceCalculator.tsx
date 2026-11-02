"use client";

import { useId, useState, type CSSProperties } from "react";
import { FINANCE_RATE } from "@/lib/options";
import { flatRateMonthly } from "@/lib/utils/finance";
import { cn, formatAED } from "@/lib/utils/format";

const TERMS = [1, 2, 3, 4, 5];

export function FinanceCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(String(FINANCE_RATE));
  const id = useId();

  const rateNum = Math.max(0, Number(rate) || 0);
  const down = Math.round((price * downPct) / 100);
  const { principal, interest, total, monthly } = flatRateMonthly(price, down, rateNum, years);

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-2xl bg-panel p-6 sm:p-8">
      <h2 id={`${id}-title`} className="text-[22px] font-semibold tracking-tight">
        Finance calculator
      </h2>
      <p className="mt-4 text-[13px] text-mute">Estimated monthly payment</p>
      <p className="text-[32px] font-bold tracking-tight" aria-live="polite">
        {formatAED(Math.round(monthly))}
        <span className="text-[17px] font-medium text-mute"> / month</span>
      </p>

      <div className="mt-6 space-y-6">
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <label htmlFor={`${id}-down`} className="text-[15px] font-medium">
              Down payment
            </label>
            <span className="text-[14px] text-mute">
              {formatAED(down)} ({downPct}%)
            </span>
          </div>
          <input
            id={`${id}-down`}
            type="range"
            min={20}
            max={80}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            aria-valuetext={`${downPct}%, ${formatAED(down)}`}
            style={{ "--fill": `${((downPct - 20) / 60) * 100}%` } as CSSProperties}
            className="w-full"
          />
        </div>

        <fieldset>
          <legend className="mb-3 text-[15px] font-medium">Term</legend>
          <div className="grid grid-cols-5 gap-2">
            {TERMS.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={years === t}
                onClick={() => setYears(t)}
                className={cn(
                  "h-10 rounded-full text-[14px] focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none",
                  years === t ? "bg-ink text-white" : "bg-white hover:bg-[#EBEBF0]",
                )}
              >
                {t} yr
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`${id}-rate`} className="text-[15px] font-medium">
            Flat rate
          </label>
          <div className="flex h-10 w-28 items-center rounded-full bg-white px-4 focus-within:ring-4 focus-within:ring-apple/20">
            <input
              id={`${id}-rate`}
              type="number"
              inputMode="decimal"
              min={0}
              max={20}
              step={0.01}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full bg-transparent text-right text-[15px] outline-none"
            />
            <span className="ml-1 text-mute">%</span>
          </div>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-hair border-t border-hair text-[14px]">
        {[
          ["Loan amount", principal],
          ["Total interest", interest],
          ["Total payable", total],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between py-3">
            <dt className="text-mute">{label}</dt>
            <dd className="font-medium">{formatAED(Math.round(Number(value)))}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[12px] text-mute">
        Estimate only. Flat-rate interest on the full loan amount; subject to lender approval.
      </p>
    </section>
  );
}
