import { cacheLife } from "next/cache";
import Link from "next/link";
import { BODY_TYPES, FUEL_TYPES, NAV } from "@/lib/options";
import { sanityFetch } from "@/lib/sanity/client";
import { FACETS_QUERY } from "@/lib/sanity/queries";

export async function Footer() {
  "use cache";
  cacheLife("days");
  const { cities } = await sanityFetch(FACETS_QUERY);
  const columns = [
    { title: "Browse by fuel", links: FUEL_TYPES.map((v) => [v, `?fuel=${encodeURIComponent(v)}`]) },
    { title: "Browse by city", links: cities.map((c) => [c.value, `?city=${encodeURIComponent(c.value ?? "")}`]) },
    { title: "Browse by body type", links: BODY_TYPES.map((v) => [v, `?body=${v}`]) },
  ];

  return (
    <footer className="bg-panel text-[12px] text-mute">
      <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-6 sm:px-6">
        <p className="border-b border-hair pb-5 leading-relaxed">
          Prices include VAT unless stated. Monthly payments are indicative and subject to lender approval. Stock is
          subject to prior sale; contact the branch to confirm availability.
        </p>
        <div className="grid grid-cols-2 gap-8 py-7 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 font-semibold text-ink">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map(([label, query]) => (
                  <li key={label}>
                    <Link href={`/vehicle-stock${query}`} className="hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-hair pt-5 sm:flex-row">
          <p>Copyright © {new Date().getFullYear()} AGMC. For internal use only.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-1">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:underline">
                {label}
              </Link>
            ))}
          </nav>
          <p>United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
