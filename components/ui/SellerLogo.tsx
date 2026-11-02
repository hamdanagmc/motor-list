import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { imageUrl } from "@/lib/sanity/image";

/** Dealer logo from Sanity, or a two-line wordmark (as in the draft) when no logo is uploaded. */
export function SellerLogo({ name, logo }: { name: string; logo?: SanityImageSource | null }) {
  if (logo && typeof logo === "object" && "asset" in logo && logo.asset) {
    return <Image src={imageUrl(logo)} alt={name} width={72} height={36} className="h-9 w-[72px] object-contain" />;
  }
  const [first, ...rest] = name.toUpperCase().split(" ");
  return (
    <div
      className="flex h-9 w-[72px] shrink-0 flex-col items-center justify-center rounded-md border border-hair leading-none"
      role="img"
      aria-label={name}
    >
      <span className="text-[9px] font-bold tracking-[0.1em]">{first}</span>
      {rest.length > 0 && <span className="mt-0.5 text-[6px] tracking-[0.2em] text-mute">{rest.join(" ")}</span>}
    </div>
  );
}
