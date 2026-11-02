"use client";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { LAST_LISTING_KEY } from "@/lib/utils/filters";

const noop = () => () => {};
const lastSearch = () => {
  try {
    return sessionStorage.getItem(LAST_LISTING_KEY) ?? "";
  } catch {
    return "";
  }
};

/** Returns to the listing with the filters, sort and page the user came from. */
export function BackLink() {
  const search = useSyncExternalStore(noop, lastSearch, () => "");
  return (
    <Link
      href={`/vehicle-stock${search}`}
      className="flex items-center gap-1.5 rounded text-[14px] text-link hover:underline"
    >
      <FontAwesomeIcon icon={faChevronLeft} className="text-[11px]" aria-hidden />
      Back to results
    </Link>
  );
}
