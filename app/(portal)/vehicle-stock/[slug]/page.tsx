import { faChevronRight, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { SanityImageSource } from "@sanity/image-url";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/detail/BackLink";
import { FinanceCalculator } from "@/components/detail/FinanceCalculator";
import { Gallery } from "@/components/detail/Gallery";
import { SimilarVehicles } from "@/components/detail/SimilarVehicles";
import { Features, KeySpecs } from "@/components/detail/VehicleSections";
import { ContactButtons } from "@/components/ui/ContactButtons";
import { FavouriteButton } from "@/components/ui/FavouriteButton";
import { RichText } from "@/components/ui/RichText";
import { SellerLogo } from "@/components/ui/SellerLogo";
import { sanityFetch } from "@/lib/sanity/client";
import { imageUrl, ogImageUrl } from "@/lib/sanity/image";
import { SIMILAR_QUERY, VEHICLE_QUERY } from "@/lib/sanity/queries";
import { formatAED } from "@/lib/utils/format";

const getVehicle = (slug: string) => sanityFetch(VEHICLE_QUERY, { slug });

export async function generateMetadata({ params }: PageProps<"/vehicle-stock/[slug]">): Promise<Metadata> {
  const v = await getVehicle((await params).slug);
  if (!v) return { title: "Vehicle not found" };
  const hero = v.images?.[0];
  const description = v.shortDescription ?? `${v.title}, ${formatAED(v.price)}`;
  return {
    title: v.title,
    description,
    openGraph: {
      title: v.title,
      description,
      images: hero?.asset ? [{ url: ogImageUrl(hero as SanityImageSource), width: 1200, height: 630 }] : [],
    },
  };
}

export default async function VehiclePage({ params }: PageProps<"/vehicle-stock/[slug]">) {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) notFound();

  const similar = await sanityFetch(SIMILAR_QUERY, {
    slug,
    makeId: v.make?._id ?? null,
    bodyType: v.bodyType ?? null,
  });
  const sold = v.status === "sold";
  const title = [v.year, v.make?.name, v.model, v.trim].filter(Boolean).join(" ");
  const images = (v.images ?? []).flatMap((img) =>
    img.asset ? [{ src: imageUrl(img as SanityImageSource), alt: img.alt ?? title, lqip: img.lqip }] : [],
  );
  const badge = sold
    ? { label: "Sold", className: "bg-panel text-mute" }
    : v.status === "reserved"
      ? { label: "Reserved", className: "bg-panel text-mute" }
      : v.featured
        ? { label: "Featured", className: "bg-flame/10 text-flame" }
        : null;
  const makeHref = `/vehicle-stock?make=${v.make?.slug}`;
  const contact = {
    phone: v.seller?.phone,
    whatsapp: v.seller?.whatsapp,
    title,
    slug: v.slug,
    disabled: sold,
  };

  return (
    <div className="bg-white pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="flex flex-col-reverse gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Breadcrumb" className="min-w-0 text-[12px] text-mute">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {[
                { label: "Vehicle Stock", href: "/vehicle-stock" },
                { label: v.make?.name, href: makeHref },
                { label: v.model, href: `${makeHref}&model=${encodeURIComponent(v.model)}` },
              ].map(({ label, href }) => (
                <li key={href} className="flex items-center gap-2">
                  <Link href={href} className="hover:text-ink">
                    {label}
                  </Link>
                  <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-soft" aria-hidden />
                </li>
              ))}
              <li aria-current="page" className="truncate text-ink">
                {v.title}
              </li>
            </ol>
          </nav>
          <BackLink />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
          <div className="min-w-0">
            <Gallery images={images} sold={sold} />
          </div>

          <aside className="lg:sticky lg:top-16 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <div className="rounded-2xl border border-line p-6">
              {badge && (
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[12px] font-medium ${badge.className}`}
                >
                  {badge.label}
                </span>
              )}
              <h1 className="mt-3 text-[24px] leading-tight font-semibold tracking-tight">{title}</h1>
              <p className="mt-3 text-[28px] font-bold tracking-tight">{formatAED(v.price)}</p>
              {v.monthlyPrice && (
                <p className="mt-1 text-[15px] text-link">Financing from {formatAED(v.monthlyPrice)} / month</p>
              )}

              {v.seller && (
                <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <SellerLogo name={v.seller.name} logo={v.seller.logo as SanityImageSource | null} />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">{v.seller.name}</p>
                    {v.seller.city && (
                      <p className="text-[13px] text-mute">
                        <FontAwesomeIcon icon={faLocationDot} className="mr-1.5 text-soft" aria-hidden />
                        {v.seller.city}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-5 space-y-2">
                <ContactButtons {...contact} variant="block" />
                <FavouriteButton
                  slug={v.slug}
                  title={title}
                  withLabel
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-hair text-[14px] font-semibold hover:bg-panel"
                />
              </div>
              {sold && (
                <p className="mt-3 text-[13px] text-mute">This car has been sold. Contact options are disabled.</p>
              )}
            </div>
          </aside>

          <div className="min-w-0 space-y-12 pb-16 lg:col-start-1">
            <KeySpecs v={v} />
            {v.description?.length ? (
              <section aria-labelledby="description-title">
                <h2 id="description-title" className="mb-4 text-[22px] font-semibold tracking-tight">
                  Description
                </h2>
                <RichText value={v.description} />
              </section>
            ) : null}
            {v.features && <Features groups={v.features} />}
            {!sold && <FinanceCalculator price={v.price} />}
          </div>
        </div>
      </div>

      <SimilarVehicles items={similar} />

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="min-w-0 shrink-0">
          <p className="text-[15px] leading-tight font-bold">{formatAED(v.price)}</p>
          {sold && <p className="text-[12px] text-mute">Sold</p>}
        </div>
        <ContactButtons {...contact} variant="block" />
      </div>
    </div>
  );
}
