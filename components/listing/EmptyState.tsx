import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function EmptyState({ saved = false }: { saved?: boolean }) {
  return (
    <div className="bg-white px-6 py-20 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-panel text-mute">
        <FontAwesomeIcon icon={saved ? faHeart : faCarSide} className="text-[20px]" aria-hidden />
      </div>
      <p className="mt-5 text-[19px] font-semibold">{saved ? "No saved cars yet." : "No cars match your filters."}</p>
      <p className="mt-1 text-[14px] text-mute">
        {saved
          ? "Tap the heart on any car to keep it here."
          : "Try removing a filter or searching for another make or model."}
      </p>
      <Link
        href="/vehicle-stock"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-apple px-6 text-[15px] font-medium text-white hover:bg-applehover"
      >
        {saved ? "Browse all cars" : "Clear filters"}
      </Link>
    </div>
  );
}
