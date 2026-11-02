"use client";

import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFavourites } from "@/lib/favourites";
import { cn } from "@/lib/utils/format";

export function FavouriteButton({
  slug,
  title,
  className,
  withLabel = false,
}: {
  slug: string;
  title: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { isSaved, toggle, ready } = useFavourites();
  const saved = isSaved(slug);
  return (
    <button
      type="button"
      disabled={!ready}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : saved ? `Remove ${title} from saved` : `Save ${title}`}
      onClick={() => toggle(slug)}
      className={cn(
        "focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none disabled:cursor-default",
        className,
      )}
    >
      <FontAwesomeIcon
        icon={saved ? faHeart : faHeartRegular}
        className={cn("text-[14px]", saved && "text-[#FF3B30]")}
        aria-hidden
      />
      {withLabel && (saved ? "Saved" : "Save")}
    </button>
  );
}
