import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faCamera, faCarSide, faGauge, faGlobe, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { SanityImageSource } from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";
import { ContactButtons } from "@/components/ui/ContactButtons";
import { FavouriteButton } from "@/components/ui/FavouriteButton";
import { SellerLogo } from "@/components/ui/SellerLogo";
import type { LISTING_QUERY_RESULT } from "@/sanity/types";
import { imageUrl } from "@/lib/sanity/image";
import { cn, formatAED, formatNumber } from "@/lib/utils/format";

export type CardVehicle = LISTING_QUERY_RESULT["items"][number];

export function VehicleCard({ vehicle: v, preload = false }: { vehicle: CardVehicle; preload?: boolean }) {
  const sold = v.status === "sold";
  const dot = (
    <span className="mx-1.5 text-soft" aria-hidden>
      •
    </span>
  );
  const status = sold
    ? { label: "Sold", className: "text-mute" }
    : v.status === "reserved"
      ? { label: "Reserved", className: "text-mute" }
      : v.featured
        ? { label: "Featured", className: "text-flame" }
        : null;

  return (
    <article className="relative flex flex-col gap-4 bg-white p-4 has-[a[data-card-link]:focus-visible]:ring-4 has-[a[data-card-link]:focus-visible]:ring-apple/40 md:flex-row md:gap-6">
      <div className="relative aspect-[1068/628] w-full shrink-0 self-start overflow-hidden bg-panel md:w-[320px]">
        {v.image?.asset ? (
          <Image
            src={imageUrl(v.image as SanityImageSource)}
            alt={v.image.alt ?? v.title}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            preload={preload}
            placeholder={v.image.lqip ? "blur" : "empty"}
            blurDataURL={v.image.lqip ?? undefined}
            className={cn("object-cover", sold && "opacity-60 grayscale")}
          />
        ) : (
          <div className="grid h-full place-items-center text-[32px] text-soft">
            <FontAwesomeIcon icon={faCarSide} aria-hidden />
          </div>
        )}
        <FavouriteButton
          slug={v.slug}
          title={v.title}
          className="absolute top-2.5 right-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-sm"
        />
        {v.imageCount > 0 && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[12px] text-white">
            <FontAwesomeIcon icon={faCamera} className="text-[11px]" aria-hidden />
            {v.imageCount}
            <span className="sr-only">photos</span>
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[18px] font-bold tracking-tight">{formatAED(v.price)}</p>
          {status && <span className={cn("text-[13px] font-medium", status.className)}>{status.label}</span>}
        </div>
        {v.monthlyPrice && (
          <p className="mt-1 text-[14px] text-link">Financing from {formatAED(v.monthlyPrice)} / month</p>
        )}
        <h2 className="mt-2 text-[16px] font-medium">
          <Link href={`/vehicle-stock/${v.slug}`} data-card-link className="outline-none after:absolute after:inset-0">
            {v.make}
            {dot}
            {v.model}
            {v.trim && (
              <>
                {dot}
                {v.trim}
              </>
            )}
          </Link>
        </h2>
        {v.shortDescription && <p className="mt-1 truncate text-[14px] text-ink/80">{v.shortDescription}</p>}
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-mute">
          {v.city && <Meta icon={faLocationDot}>{v.city}</Meta>}
          {v.regionalSpec && <Meta icon={faGlobe}>{v.regionalSpec}</Meta>}
          <Meta icon={faCalendar}>{v.year}</Meta>
          {v.mileage != null && <Meta icon={faGauge}>{formatNumber(v.mileage)} KM</Meta>}
        </ul>

        {/* mt-auto pins the dealer row to the bottom when the photo is taller than the text. */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          {v.seller ? <SellerLogo name={v.seller.name} logo={v.seller.logo as SanityImageSource | null} /> : <span />}
          <ContactButtons
            phone={v.seller?.phone}
            whatsapp={v.seller?.whatsapp}
            title={v.title}
            slug={v.slug}
            disabled={sold}
          />
        </div>
      </div>
    </article>
  );
}

function Meta({ icon, children }: { icon: typeof faGlobe; children: React.ReactNode }) {
  return (
    <li>
      <FontAwesomeIcon icon={icon} className="mr-1.5 text-soft" aria-hidden />
      {children}
    </li>
  );
}
