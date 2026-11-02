import { faM } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { cn } from "@/lib/utils/format";

export function Logo({ large = false, href = "/vehicle-stock" }: { large?: boolean; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center font-semibold tracking-tight",
        large ? "gap-3 text-[22px]" : "gap-2 text-[15px]",
      )}
    >
      <span
        className={cn(
          "grid place-items-center bg-ink text-white",
          large ? "h-9 w-9 rounded-lg text-[15px]" : "h-6 w-6 rounded-md text-[11px]",
        )}
        aria-hidden
      >
        <FontAwesomeIcon icon={faM} />
      </span>
      Motorlist
    </Link>
  );
}
