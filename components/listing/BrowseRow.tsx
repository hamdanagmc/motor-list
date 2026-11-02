import Link from "next/link";
import type { FACETS_QUERY_RESULT } from "@/sanity/types";
import { BODY_TYPES } from "@/lib/options";
import { formatNumber } from "@/lib/utils/format";

type Item = { label: string; href: string; count: number };

export function BrowseRow({ title, items }: { title: string; items: Item[] }) {
  return (
    <section aria-label={title} className="px-4 py-3 xl:px-0">
      <h2 className="text-[16px] font-semibold">{title}</h2>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {items.map(({ label, href, count }) =>
          count > 0 ? (
            <Link
              key={label}
              href={href}
              className="flex h-7 shrink-0 items-center rounded-full border border-hair px-3 text-[12px] hover:border-ink"
            >
              {label} ({count})
            </Link>
          ) : (
            <span
              key={label}
              className="flex h-7 shrink-0 items-center rounded-full border border-hair px-3 text-[12px] text-mute"
            >
              {label} (0)
            </span>
          ),
        )}
      </div>
    </section>
  );
}

/** Rows interleaved after the 4th, 8th and 12th card, as in the draft. Keyed by card index. */
export function browseRows(facets: FACETS_QUERY_RESULT): Record<number, React.ReactNode> {
  const body = new Map(facets.bodyTypes.map((b) => [b.value, b.count]));
  return {
    3: (
      <BrowseRow
        title="View popular models"
        items={facets.models.slice(0, 8).map((m) => ({
          label: `${m.make} ${m.model}`,
          href: `/vehicle-stock?make=${m.makeSlug}&model=${encodeURIComponent(m.model)}`,
          count: m.count,
        }))}
      />
    ),
    7: (
      <BrowseRow
        title="View cars by budget"
        items={facets.budgets.map((b) =>
          "max" in b
            ? { label: `Under AED ${formatNumber(b.max)}`, href: `/vehicle-stock?priceMax=${b.max}`, count: b.count }
            : { label: `AED ${formatNumber(b.min)}+`, href: `/vehicle-stock?priceMin=${b.min}`, count: b.count },
        )}
      />
    ),
    11: (
      <BrowseRow
        title="View cars by body type"
        items={BODY_TYPES.map((b) => ({ label: b, href: `/vehicle-stock?body=${b}`, count: body.get(b) ?? 0 }))}
      />
    ),
  };
}
