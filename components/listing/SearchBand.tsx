"use client";

import { faChevronDown, faMagnifyingGlass, faSliders } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useFilters } from "@/components/filters/FilterProvider";
import { activeCount, type Filters } from "@/lib/utils/filters";
import { cn, compactAED } from "@/lib/utils/format";

const summary = (list?: string[]) =>
  list ? (list.length > 1 ? `${list[0]} +${list.length - 1}` : list[0]) : undefined;

function priceSummary(f: Filters) {
  const unit = f.pmode === "monthly" ? "/mo" : "";
  if (f.priceMin && f.priceMax) return `${compactAED(f.priceMin)}–${compactAED(f.priceMax).slice(4)}${unit}`;
  if (f.priceMax) return `Under ${compactAED(f.priceMax)}${unit}`;
  if (f.priceMin) return `${compactAED(f.priceMin)}+${unit}`;
}

function yearSummary(f: Filters) {
  if (f.yearMin && f.yearMax) return f.yearMin === f.yearMax ? `Year: ${f.yearMin}` : `Year: ${f.yearMin}–${f.yearMax}`;
  if (f.yearMin) return `Year: ${f.yearMin}+`;
  if (f.yearMax) return `Year: up to ${f.yearMax}`;
}

export function SearchBand({ makeNames }: { makeNames: Record<string, string> }) {
  const { filters: f, update, openDrawer } = useFilters();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync when the query changes from elsewhere (pills, "Clear filters"), but never while the user is typing.
  useEffect(() => {
    const el = inputRef.current;
    if (el && document.activeElement !== el) el.value = f.q ?? "";
  }, [f.q]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const search = (value: string, delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const q = value.trim() || undefined;
      if (q !== f.q) update({ q });
    }, delay);
  };

  const chips = [
    { group: "g-make", label: "Make", value: summary(f.make?.map((s) => makeNames[s] ?? s)) },
    { group: "g-model", label: "Model", value: summary(f.model) },
    { group: "g-body", label: "Body Type", value: summary(f.body) },
    { group: "g-price", label: "Price (AED)", value: priceSummary(f) },
    { group: "g-year", label: "Year", value: yearSummary(f) },
    { group: "g-city", label: "Location", value: summary(f.city) },
  ];
  const count = activeCount(f);

  return (
    <section
      aria-label="Search and filters"
      className="sticky top-12 z-30 border-b border-line bg-white/90 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="mx-auto max-w-[1100px] px-4 pt-4 pb-3 xl:px-0">
        <div className="flex items-center gap-3">
          <form
            role="search"
            className="flex h-12 flex-1 items-center gap-3 rounded-full bg-fill px-5 transition focus-within:bg-white focus-within:ring-4 focus-within:ring-apple/20"
            onSubmit={(e) => {
              e.preventDefault();
              search(inputRef.current?.value ?? "", 0);
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-mute" aria-hidden />
            <label htmlFor="listing-search" className="sr-only">
              Search vehicles
            </label>
            <input
              ref={inputRef}
              id="listing-search"
              type="search"
              enterKeyHint="search"
              defaultValue={f.q}
              onChange={(e) => search(e.target.value, 250)}
              placeholder="Search make, model, trim or keyword"
              className="w-full min-w-0 bg-transparent text-[16px] outline-none placeholder:text-mute"
            />
          </form>
          <button
            type="button"
            onClick={() => openDrawer()}
            className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-apple text-white hover:bg-applehover focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none"
            aria-label={count ? `Filters, ${count} active` : "Filters"}
            aria-haspopup="dialog"
          >
            <FontAwesomeIcon icon={faSliders} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-semibold text-apple shadow ring-2 ring-apple">
                {count}
              </span>
            )}
          </button>
        </div>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {chips.map(({ group, label, value }) => (
            <button
              key={group}
              type="button"
              onClick={() => openDrawer(group)}
              aria-haspopup="dialog"
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none",
                value ? "bg-ink text-white" : "bg-panel hover:bg-[#EBEBF0]",
              )}
            >
              {value ?? label}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={cn("text-[10px]", value ? "text-white/70" : "text-mute")}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
