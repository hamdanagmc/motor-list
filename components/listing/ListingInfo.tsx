import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FACETS_QUERY_RESULT } from "@/sanity/types";
import { FINANCE_RATE } from "@/lib/options";
import { formatAED } from "@/lib/utils/format";

const list = (items: string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}` : (items[0] ?? "");

/** About + FAQ from the draft's lower section. Every number is computed from Sanity facets. */
export function ListingInfo({ facets }: { facets: FACETS_QUERY_RESULT }) {
  const total = facets.makes.reduce((n, m) => n + m.count, 0);
  const cities = facets.cities.flatMap((c) => (c.value ? [c.value] : []));
  const faqs = [
    {
      q: "How many cars are in stock?",
      a: `There are currently ${total} cars listed across ${list(cities)}.`,
    },
    {
      q: "Which makes have the most stock?",
      a: `${list(facets.makes.slice(0, 4).map((m) => m.name))} have the most cars listed right now.`,
    },
    {
      q: "What is the average price?",
      a: `The average listed price is around ${formatAED(Math.round((facets.avgPrice ?? 0) / 1000) * 1000)}, with prices starting from ${formatAED(facets.price.min ?? 0)}.`,
    },
    {
      q: "Can I finance a car?",
      a: `Yes. Monthly prices are estimates at a ${FINANCE_RATE}% flat rate. Use the finance calculator on any vehicle page to try your own down payment and term.`,
    },
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[800px] px-6 py-16">
        <h2 className="text-[28px] font-semibold tracking-tight">About AGMC Used Cars</h2>
        <p className="mt-4 text-[17px] leading-[1.6] text-ink/85">
          AGMC Used Cars is AGMC’s internal stock portal. Every listing shows the full spec sheet, regional spec,
          service history and an indicative monthly price, so you can compare cars like for like and contact the branch
          directly by phone or WhatsApp.
        </p>

        <h2 className="mt-14 text-[28px] font-semibold tracking-tight">Frequently asked questions</h2>
        <div className="mt-6 border-t border-line">
          {faqs.map(({ q, a }, i) => (
            <details key={q} className="group border-b border-line" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-[14px] text-mute transition-transform group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="-mt-1 pb-5 text-[15px] leading-relaxed text-mute">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
