import type { SanityImageSource } from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import type { SIMILAR_QUERY_RESULT } from "@/sanity/types";
import { imageUrl } from "@/lib/sanity/image";
import { cn, formatAED, formatNumber } from "@/lib/utils/format";
import { Carousel } from "./Carousel";

export function SimilarVehicles({ items }: { items: SIMILAR_QUERY_RESULT }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="similar-title" className="bg-panel py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Carousel
          title={
            <h2 id="similar-title" className="text-[22px] font-semibold tracking-tight">
              Similar vehicles
            </h2>
          }
        >
          {items.map((v) => (
            <li key={v._id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
              <Link
                href={`/vehicle-stock/${v.slug}`}
                className="block overflow-hidden rounded-2xl bg-white focus-visible:ring-4 focus-visible:ring-apple/40 focus-visible:outline-none"
              >
                <div className="relative aspect-[1068/628] bg-panel">
                  {v.image?.asset && (
                    <Image
                      src={imageUrl(v.image as SanityImageSource)}
                      alt={v.image.alt ?? v.title}
                      fill
                      sizes="300px"
                      className={cn("object-cover", v.status === "sold" && "opacity-60 grayscale")}
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-[16px] font-bold">{formatAED(v.price)}</p>
                  <p className="mt-1 truncate text-[14px] font-medium">
                    {v.make} {v.model} {v.trim}
                  </p>
                  <p className="mt-1 text-[13px] text-mute">
                    {[
                      v.year,
                      v.mileage != null ? `${formatNumber(v.mileage)} km` : null,
                      v.city,
                      v.status === "sold" && "Sold",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
