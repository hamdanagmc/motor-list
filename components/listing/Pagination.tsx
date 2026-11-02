import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { PAGE_SIZE } from "@/lib/options";
import { toSearch, type Filters } from "@/lib/utils/filters";
import { cn, formatNumber } from "@/lib/utils/format";

/** 1 … 4 5 6 … 12 */
function pageWindow(page: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const pages = [1, page - 1, page, page + 1, count].filter((p) => p >= 1 && p <= count);
  return [...new Set(pages)].flatMap((p, i, arr) => (i > 0 && p - arr[i - 1] > 1 ? ["gap" as const, p] : [p]));
}

export function Pagination({ filters, total }: { filters: Filters; total: number }) {
  const page = filters.page ?? 1;
  const count = Math.ceil(total / PAGE_SIZE);
  const href = (p: number) => `/vehicle-stock${toSearch({ ...filters, page: p })}`;
  const arrow = "grid h-9 w-9 place-items-center rounded-full";

  return (
    <nav aria-label="Pagination" className="flex flex-col items-center gap-3 pt-10 pb-4">
      {count > 1 && (
        <div className="flex items-center gap-1.5 text-[15px]">
          {page > 1 ? (
            <Link href={href(page - 1)} className={cn(arrow, "hover:bg-white")} aria-label="Previous page">
              <FontAwesomeIcon icon={faChevronLeft} className="text-[12px]" />
            </Link>
          ) : (
            <span className={cn(arrow, "text-soft")} aria-hidden>
              <FontAwesomeIcon icon={faChevronLeft} className="text-[12px]" />
            </span>
          )}
          {pageWindow(page, count).map((p, i) =>
            p === "gap" ? (
              <span key={`gap-${i}`} className="w-6 text-center text-mute" aria-hidden>
                …
              </span>
            ) : (
              <Link
                key={p}
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-full",
                  p === page ? "bg-ink font-medium text-white" : "hover:bg-white",
                )}
              >
                {p}
              </Link>
            ),
          )}
          {page < count ? (
            <Link href={href(page + 1)} className={cn(arrow, "hover:bg-white")} aria-label="Next page">
              <FontAwesomeIcon icon={faChevronRight} className="text-[12px]" />
            </Link>
          ) : (
            <span className={cn(arrow, "text-soft")} aria-hidden>
              <FontAwesomeIcon icon={faChevronRight} className="text-[12px]" />
            </span>
          )}
        </div>
      )}
      <p className="text-[13px] text-mute">
        Showing {formatNumber((page - 1) * PAGE_SIZE + 1)}–{formatNumber(Math.min(page * PAGE_SIZE, total))} of{" "}
        {formatNumber(total)}
      </p>
    </nav>
  );
}
