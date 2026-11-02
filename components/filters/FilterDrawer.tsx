"use client";

import { faMagnifyingGlass, faSpinner, faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { FACETS_QUERY_RESULT } from "@/sanity/types";
import { BODY_TYPES, CYLINDERS, DRIVETRAINS, FUEL_TYPES, REGIONAL_SPECS, TRANSMISSIONS } from "@/lib/options";
import { cn, formatAED, formatNumber } from "@/lib/utils/format";
import { BodyTypeIcon } from "./BodyTypeIcon";
import { useFilters } from "./FilterProvider";

type Props = { open: boolean; group?: string; onClose: () => void; total: number; facets: FACETS_QUERY_RESULT };

const toggle = <T,>(list: T[] | undefined, value: T) => {
  const next = list?.includes(value) ? list.filter((v) => v !== value) : [...(list ?? []), value];
  return next.length ? next : undefined;
};
const roundUp = (n: number, step: number) => Math.max(step, Math.ceil(n / step) * step);
const initials = (name: string) =>
  name.includes(" ") || name.includes("-")
    ? name
        .split(/[\s-]+/)
        .map((w) => w[0])
        .join("")
    : name.slice(0, 2).toUpperCase();

export function FilterDrawer({ open, group, onClose, total, facets }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { filters: f, update, replace, isPending } = useFilters();
  const [makeQuery, setMakeQuery] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) {
      const target = group ? document.getElementById(group) : null;
      bodyRef.current?.scrollTo({ top: target ? target.offsetTop - 8 : 0 });
    }
  }, [open, group]);

  const monthly = f.pmode === "monthly";
  const priceCap = monthly ? roundUp(facets.monthly.max ?? 0, 1_000) : roundUp(facets.price.max ?? 0, 100_000);
  const kmCap = roundUp(facets.mileageMax ?? 0, 10_000);
  const years = Array.from(
    { length: (facets.year.max ?? 0) - (facets.year.min ?? 0) + 1 },
    (_, i) => (facets.year.max ?? 0) - i,
  ).filter(Boolean);
  const makes = facets.makes.filter((m) => m.name.toLowerCase().includes(makeQuery.trim().toLowerCase()));
  const models = [...new Set(facets.makes.filter((m) => f.make?.includes(m.slug)).flatMap((m) => m.models))].sort();

  const toggleMake = (slug: string) => {
    const make = toggle(f.make, slug);
    const allowed = facets.makes.filter((m) => make?.includes(m.slug)).flatMap((m) => m.models);
    const model = f.model?.filter((m) => allowed.includes(m));
    update({ make, model: model?.length ? model : undefined });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="filters-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className={cn(
        "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 text-ink shadow-[-12px_0_40px_rgba(0,0,0,0.12)] sm:w-[420px]",
        "translate-x-full transition-[translate,overlay,display] transition-discrete duration-300 open:translate-x-0 starting:open:translate-x-full",
        "backdrop:bg-black/30 backdrop:opacity-0 backdrop:transition-[opacity,overlay,display] backdrop:transition-discrete backdrop:duration-300 open:backdrop:opacity-100 starting:open:backdrop:opacity-0",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-line px-6">
          <h2 id="filters-title" className="text-[17px] font-semibold">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-panel hover:bg-[#EBEBF0] focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none"
            aria-label="Close filters"
          >
            <FontAwesomeIcon icon={faXmark} className="text-[13px]" />
          </button>
        </div>

        <div ref={bodyRef} className="relative flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
          <Group id="g-fuel" title="Fuel">
            <Pills values={FUEL_TYPES} selected={f.fuel} onToggle={(v) => update({ fuel: toggle(f.fuel, v) })} />
          </Group>

          <Group id="g-make" title="Make">
            <label className="flex h-10 items-center gap-2.5 rounded-full bg-fill px-4 focus-within:bg-white focus-within:ring-4 focus-within:ring-apple/20">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[13px] text-mute" />
              <span className="sr-only">Search makes</span>
              <input
                type="search"
                value={makeQuery}
                onChange={(e) => setMakeQuery(e.target.value)}
                placeholder="Search makes"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-mute"
              />
            </label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {makes.map((m) => (
                <Tile key={m.slug} on={Boolean(f.make?.includes(m.slug))} onClick={() => toggleMake(m.slug)}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[10px] font-bold">
                    {initials(m.name)}
                  </span>
                  <span className="max-w-full truncate px-1 text-[12px]">{m.name}</span>
                </Tile>
              ))}
            </div>
            {makes.length === 0 && <p className="mt-3 text-[14px] text-mute">No makes match “{makeQuery}”.</p>}
          </Group>

          <Group id="g-model" title="Model">
            {models.length ? (
              <Pills values={models} selected={f.model} onToggle={(v) => update({ model: toggle(f.model, v) })} />
            ) : (
              <p className="flex h-11 items-center justify-between rounded-xl border border-hair px-4 text-[14px] text-mute">
                Select a make first <FontAwesomeIcon icon={faChevronDown} className="text-[11px]" />
              </p>
            )}
          </Group>

          <Group id="g-body" title="Body type">
            <div className="grid grid-cols-3 gap-2">
              {BODY_TYPES.map((b) => (
                <Tile key={b} on={Boolean(f.body?.includes(b))} onClick={() => update({ body: toggle(f.body, b) })}>
                  <BodyTypeIcon type={b} className="w-14 text-ink/70" />
                  <span className="text-[12px]">{b}</span>
                </Tile>
              ))}
            </div>
          </Group>

          <Group
            id="g-price"
            title="Price (AED)"
            aside={
              <div
                className="inline-flex rounded-full bg-panel p-[2px] text-[13px]"
                role="group"
                aria-label="Price type"
              >
                {(["cash", "monthly"] as const).map((mode) => {
                  const on = (mode === "monthly") === monthly;
                  return (
                    <button
                      key={mode}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        !on &&
                        update({
                          pmode: mode === "monthly" ? "monthly" : undefined,
                          priceMin: undefined,
                          priceMax: undefined,
                        })
                      }
                      className={cn(
                        "rounded-full px-3.5 py-1 capitalize",
                        on ? "bg-white font-medium shadow-sm" : "text-mute",
                      )}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Min" value={f.priceMin} onCommit={(priceMin) => update({ priceMin })} />
              <NumberField label="Max" value={f.priceMax} onCommit={(priceMax) => update({ priceMax })} />
            </div>
            <RangeField
              key={`${f.pmode}-${f.priceMax}`}
              label="Maximum price"
              min={0}
              max={priceCap}
              step={monthly ? 100 : 10_000}
              value={f.priceMax ?? priceCap}
              format={(v) => (v >= priceCap ? "Any price" : `Up to ${formatAED(v)}${monthly ? " / month" : ""}`)}
              onCommit={(v) => update({ priceMax: v >= priceCap ? undefined : v })}
            />
          </Group>

          <Group id="g-year" title="Year">
            <div className="grid grid-cols-2 gap-2 text-[14px]">
              {(
                [
                  ["From", "yearMin"],
                  ["To", "yearMax"],
                ] as const
              ).map(([label, key]) => (
                <label
                  key={key}
                  className="flex h-11 items-center justify-between rounded-xl border border-hair px-3.5 focus-within:ring-4 focus-within:ring-apple/20"
                >
                  <span className="text-mute">{label}</span>
                  <select
                    value={f[key] ?? ""}
                    onChange={(e) => update({ [key]: e.target.value ? Number(e.target.value) : undefined })}
                    className="bg-transparent text-right outline-none"
                  >
                    <option value="">Any</option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </Group>

          <Group id="g-mileage" title="Mileage">
            <RangeField
              key={f.kmMax ?? "any"}
              label="Maximum mileage"
              min={0}
              max={kmCap}
              step={5_000}
              value={f.kmMax ?? kmCap}
              format={(v) => (v >= kmCap ? "Any mileage" : `Up to ${formatNumber(v)} km`)}
              onCommit={(v) => update({ kmMax: v >= kmCap ? undefined : v })}
            />
          </Group>

          <Group id="g-trans" title="Transmission">
            <Pills values={TRANSMISSIONS} selected={f.trans} onToggle={(v) => update({ trans: toggle(f.trans, v) })} />
          </Group>
          <Group id="g-drive" title="Drivetrain">
            <Pills values={DRIVETRAINS} selected={f.drive} onToggle={(v) => update({ drive: toggle(f.drive, v) })} />
          </Group>
          <Group id="g-cyl" title="Cylinders">
            <Pills
              values={CYLINDERS.map(String)}
              selected={f.cyl?.map(String)}
              onToggle={(v) => update({ cyl: toggle(f.cyl, Number(v)) })}
            />
          </Group>
          <Group id="g-spec" title="Regional specs">
            <Pills values={REGIONAL_SPECS} selected={f.spec} onToggle={(v) => update({ spec: toggle(f.spec, v) })} />
          </Group>
          <Group id="g-city" title="City" last>
            <Pills
              values={facets.cities.flatMap((c) => (c.value ? [c.value] : []))}
              selected={f.city}
              onToggle={(v) => update({ city: toggle(f.city, v) })}
            />
          </Group>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-line bg-white/90 px-6 py-4 backdrop-blur">
          <button
            type="button"
            onClick={() => replace({ q: f.q, sort: f.sort })}
            className="rounded text-[15px] text-apple hover:underline"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 items-center gap-2 rounded-full bg-apple px-7 text-[15px] font-medium text-white hover:bg-applehover focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none"
          >
            {isPending && <FontAwesomeIcon icon={faSpinner} spin className="text-[13px]" />}
            Show {formatNumber(total)} {total === 1 ? "car" : "cars"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function Group({
  id,
  title,
  aside,
  last,
  children,
}: {
  id: string;
  title: string;
  aside?: ReactNode;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("py-6", !last && "border-b border-line")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 id={`${id}-title`} className="text-[17px] font-semibold">
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Pills({
  values,
  selected,
  onToggle,
}: {
  values: readonly string[];
  selected?: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => {
        const on = Boolean(selected?.includes(v));
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(v)}
            className={cn(
              "rounded-full px-4 py-2 text-[14px] focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none",
              on ? "bg-ink text-white" : "bg-panel hover:bg-[#EBEBF0]",
            )}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}

function Tile({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "flex min-w-0 flex-col items-center gap-1.5 rounded-xl border-2 py-3 focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none",
        on ? "border-apple bg-white" : "border-transparent bg-panel hover:bg-[#EBEBF0]",
      )}
    >
      {children}
    </button>
  );
}

/** Uncontrolled; remounts (via key) when the committed value changes from outside. */
function NumberField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value?: number;
  onCommit: (v: number | undefined) => void;
}) {
  const commit = (raw: string) => {
    const n = Number(raw.replace(/\D/g, ""));
    const next = raw.trim() && n > 0 ? n : undefined;
    if (next !== value) onCommit(next);
  };
  return (
    <label className="flex h-11 flex-col justify-center rounded-xl border border-hair px-3.5 focus-within:ring-4 focus-within:ring-apple/20">
      <span className="text-[10px] leading-none text-mute">{label}</span>
      <input
        key={value ?? ""}
        defaultValue={value ? formatNumber(value) : ""}
        inputMode="numeric"
        placeholder="Any"
        onBlur={(e) => commit(e.currentTarget.value)}
        onKeyDown={(e) => e.key === "Enter" && commit(e.currentTarget.value)}
        className="bg-transparent text-[14px] outline-none placeholder:text-mute"
      />
    </label>
  );
}

/** Shows the live value while dragging; commits on release so each drag is one navigation. */
function RangeField({
  label,
  min,
  max,
  step,
  value,
  format,
  onCommit,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  format: (v: number) => string;
  onCommit: (v: number) => void;
}) {
  const [v, setV] = useState(Math.min(value, max));
  const commit = () => v !== value && onCommit(v);
  return (
    <div className="mt-4">
      <p className="mb-3 text-[14px] text-mute" aria-hidden>
        {format(v)}
      </p>
      <input
        type="range"
        aria-label={label}
        aria-valuetext={format(v)}
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
        onPointerUp={commit}
        onKeyUp={commit}
        onBlur={commit}
        style={{ "--fill": `${((v - min) / (max - min || 1)) * 100}%` } as CSSProperties}
        className="w-full"
      />
    </div>
  );
}
