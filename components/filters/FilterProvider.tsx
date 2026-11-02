"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { FACETS_QUERY_RESULT } from "@/sanity/types";
import { LAST_LISTING_KEY, toSearch, type Filters } from "@/lib/utils/filters";
import { FilterDrawer } from "./FilterDrawer";

type FilterContextValue = {
  /** Optimistic: reflects a change immediately, then settles to the server-rendered URL state. */
  filters: Filters;
  update: (patch: Partial<Filters>) => void;
  replace: (next: Filters) => void;
  openDrawer: (group?: string) => void;
  isPending: boolean;
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function useFilters() {
  const ctx = use(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside <FilterProvider>");
  return ctx;
}

export function FilterProvider({
  filters,
  total,
  facets,
  children,
}: {
  filters: Filters;
  total: number;
  facets: FACETS_QUERY_RESULT;
  children: ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(filters);
  const [drawer, setDrawer] = useState<{ open: boolean; group?: string }>({ open: false });

  const replace = useCallback(
    (next: Filters) =>
      startTransition(() => {
        setOptimistic(next);
        router.replace(`/vehicle-stock${toSearch(next)}`, { scroll: false });
      }),
    [router, setOptimistic],
  );
  const update = useCallback(
    (patch: Partial<Filters>) => replace({ ...optimistic, ...patch, page: undefined }),
    [optimistic, replace],
  );

  // Lets "Back to results" on a vehicle page return to this exact view.
  const search = toSearch(filters);
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_LISTING_KEY, search);
    } catch {}
  }, [search]);

  return (
    <FilterContext
      value={{
        filters: optimistic,
        update,
        replace,
        isPending,
        openDrawer: (group) => setDrawer({ open: true, group }),
      }}
    >
      {children}
      <FilterDrawer
        open={drawer.open}
        group={drawer.group}
        onClose={() => setDrawer({ open: false })}
        total={total}
        facets={facets}
      />
    </FilterContext>
  );
}

/** Dims server-rendered results while a filter change is in flight. */
export function PendingResults({ children }: { children: ReactNode }) {
  const { isPending } = useFilters();
  return (
    <div aria-busy={isPending} className={isPending ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {children}
    </div>
  );
}
