"use client";

import { faCheck, faSort, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useFilters } from "@/components/filters/FilterProvider";
import { Menu, menuItemClass } from "@/components/ui/Menu";
import { SORTS } from "@/lib/options";
import { cn, formatNumber } from "@/lib/utils/format";

export function ResultsHeader({
  total,
  makes,
}: {
  total: number;
  makes: { name: string; slug: string; count: number }[];
}) {
  const { filters: f, update, openDrawer } = useFilters();
  const sort = SORTS.find((s) => s.value === (f.sort ?? "newest")) ?? SORTS[0];
  const pill = "flex h-7 shrink-0 items-center rounded-full border px-3 text-[12px]";

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1100px] px-4 pt-5 pb-4 xl:px-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[18px] font-bold" aria-live="polite">
              <span className="sr-only">Vehicle stock: </span>
              {formatNumber(total)} {total === 1 ? "result" : "results"}
            </h1>
            {f.saved && (
              <button
                type="button"
                onClick={() => update({ saved: undefined })}
                className="flex h-7 items-center gap-1.5 rounded-full bg-ink px-3 text-[12px] text-white"
                aria-label="Show all vehicles, not only saved"
              >
                Saved only <FontAwesomeIcon icon={faXmark} className="text-[11px]" />
              </button>
            )}
          </div>
          <Menu
            label={`Sort by: ${sort.label}`}
            trigger={
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faSort} className="text-[12px]" aria-hidden />
                {sort.label}
              </span>
            }
            triggerClassName="rounded text-[14px] font-medium text-link hover:underline"
            panelClassName="w-[240px]"
          >
            {(close) =>
              SORTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={s.value === sort.value}
                  className={menuItemClass}
                  onClick={() => {
                    close();
                    update({ sort: s.value === "newest" ? undefined : s.value });
                  }}
                >
                  {s.label}
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={cn("text-[12px] text-apple", s.value !== sort.value && "invisible")}
                  />
                </button>
              ))
            }
          </Menu>
        </div>

        <nav aria-label="Browse by make" className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {makes.slice(0, 8).map((m) => {
            const active = f.make?.length === 1 && f.make[0] === m.slug;
            return (
              <Link
                key={m.slug}
                href={`/vehicle-stock?make=${m.slug}`}
                aria-current={active ? "true" : undefined}
                className={cn(pill, active ? "border-ink font-medium" : "border-hair hover:border-ink")}
              >
                {m.name} ({m.count})
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => openDrawer("g-make")}
            className={cn(pill, "border-hair text-link hover:border-link")}
          >
            See more
          </button>
        </nav>
      </div>
    </section>
  );
}
