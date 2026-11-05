import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/format";
import agmcLogo from "@/public/agmc-logo.jpg";

export function Logo({ large = false, href = "/vehicle-stock" }: { large?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center font-semibold tracking-tight whitespace-nowrap",
        large ? "gap-3 text-[22px]" : "gap-2 text-[15px]",
      )}
    >
      {/* unoptimized: the global image loader only handles Sanity CDN URLs. multiply: hides the JPEG's white box on tinted backgrounds. */}
      {/* ponytail: 166px-wide JPEG, slightly soft at the large size on retina. Swap for an SVG if brand can supply one. */}
      <Image
        src={agmcLogo}
        alt="AGMC"
        unoptimized
        loading="eager"
        className={cn("w-auto mix-blend-multiply", large ? "h-7" : "h-4 min-[360px]:h-5")}
      />
      Used Cars
    </Link>
  );
}
