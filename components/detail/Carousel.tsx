"use client";

import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, type ReactNode } from "react";

const arrow =
  "grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-sm hover:bg-[#EBEBF0] focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none";

/** Native scroll-snap row; the arrows just scroll it by one viewport. */
export function Carousel({ title, children }: { title: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.9, behavior: "smooth" });
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        {title}
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => scroll(-1)} className={arrow} aria-label="Scroll left">
            <FontAwesomeIcon icon={faChevronLeft} className="text-[12px]" />
          </button>
          <button type="button" onClick={() => scroll(1)} className={arrow} aria-label="Scroll right">
            <FontAwesomeIcon icon={faChevronRight} className="text-[12px]" />
          </button>
        </div>
      </div>
      <ul ref={ref} className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1">
        {children}
      </ul>
    </>
  );
}
