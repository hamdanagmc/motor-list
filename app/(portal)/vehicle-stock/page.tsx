import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { FilterProvider, PendingResults } from "@/components/filters/FilterProvider";
import { browseRows } from "@/components/listing/BrowseRow";
import { EmptyState } from "@/components/listing/EmptyState";
import { ListingInfo } from "@/components/listing/ListingInfo";
import { Pagination } from "@/components/listing/Pagination";
import { ResultsHeader } from "@/components/listing/ResultsHeader";
import { SearchBand } from "@/components/listing/SearchBand";
import { VehicleCard } from "@/components/listing/VehicleCard";
import { PAGE_SIZE } from "@/lib/options";
import { sanityFetch } from "@/lib/sanity/client";
import { FACETS_QUERY, LISTING_QUERY } from "@/lib/sanity/queries";
import { parseFilters, toQueryParams, toSearch } from "@/lib/utils/filters";

export const metadata: Metadata = { title: "Vehicle Stock" };

export default async function VehicleStockPage({ searchParams }: PageProps<"/vehicle-stock">) {
  const filters = parseFilters(await searchParams);
  const [{ total, items }, facets] = await Promise.all([
    sanityFetch(LISTING_QUERY, toQueryParams(filters)),
    sanityFetch(FACETS_QUERY),
  ]);

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if ((filters.page ?? 1) > lastPage) redirect(`/vehicle-stock${toSearch({ ...filters, page: lastPage })}`);

  const rows = browseRows(facets);
  const makeNames = Object.fromEntries(facets.makes.map((m) => [m.slug, m.name]));

  return (
    <FilterProvider filters={filters} total={total} facets={facets}>
      <SearchBand makeNames={makeNames} />
      <ResultsHeader total={total} makes={facets.makes} />
      <section aria-label="Vehicles" className="bg-panel py-4">
        <div className="mx-auto max-w-[1100px]">
          <PendingResults>
            {items.length ? (
              <>
                <div className="flex flex-col gap-4">
                  {items.map((vehicle, i) => (
                    <Fragment key={vehicle._id}>
                      <VehicleCard vehicle={vehicle} preload={i === 0} />
                      {rows[i]}
                    </Fragment>
                  ))}
                </div>
                <Pagination filters={filters} total={total} />
              </>
            ) : (
              <EmptyState saved={Boolean(filters.saved)} />
            )}
          </PendingResults>
        </div>
      </section>
      <ListingInfo facets={facets} />
    </FilterProvider>
  );
}
