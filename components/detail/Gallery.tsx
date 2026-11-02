"use client";

import { faChevronLeft, faChevronRight, faExpand, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { cn } from "@/lib/utils/format";

export type GalleryImage = { src: string; alt: string; lqip?: string | null };

const roundButton =
  "grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur hover:bg-white focus-visible:ring-4 focus-visible:ring-apple/40 focus-visible:outline-none";

export function Gallery({ images, sold }: { images: GalleryImage[]; sold: boolean }) {
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const n = images.length;
  const go = (delta: number) => setIndex((i) => (i + delta + n) % n);
  const current = images[index];

  const swipe = {
    onTouchStart: (e: TouchEvent) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e: TouchEvent) => {
      if (touchX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchX.current;
      touchX.current = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    },
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  if (!current) return <div className="aspect-[1068/628] rounded-2xl bg-panel" />;

  const arrows = (light: boolean) =>
    n > 1 && (
      <>
        <button
          type="button"
          onClick={() => go(-1)}
          className={cn(
            roundButton,
            "absolute top-1/2 left-3 -translate-y-1/2",
            light && "bg-black/45 text-white hover:bg-black/65",
          )}
          aria-label="Previous photo"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-[13px]" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className={cn(
            roundButton,
            "absolute top-1/2 right-3 -translate-y-1/2",
            light && "bg-black/45 text-white hover:bg-black/65",
          )}
          aria-label="Next photo"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-[13px]" />
        </button>
      </>
    );

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Vehicle photos" onKeyDown={onKeyDown}>
      <div className="relative aspect-[1068/628] overflow-hidden rounded-2xl bg-panel" {...swipe}>
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          preload={index === 0}
          sizes="(min-width: 1200px) 780px, (min-width: 1024px) 65vw, 100vw"
          placeholder={current.lqip ? "blur" : "empty"}
          blurDataURL={current.lqip ?? undefined}
          className={cn("object-cover", sold && "opacity-60 grayscale")}
        />
        <button
          type="button"
          onClick={() => {
            setLightbox(true);
            dialogRef.current?.showModal();
          }}
          className="absolute inset-0 cursor-zoom-in focus-visible:ring-4 focus-visible:ring-apple/40 focus-visible:outline-none focus-visible:ring-inset"
          aria-label={`Open photo ${index + 1} of ${n} full screen`}
        />
        {arrows(false)}
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[12px] text-white">
          {index + 1}/{n}
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-[12px] text-white">
          <FontAwesomeIcon icon={faExpand} aria-hidden />
        </span>
      </div>

      {n > 1 && (
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border-2 bg-panel focus-visible:ring-4 focus-visible:ring-apple/40 focus-visible:outline-none focus-visible:ring-inset",
                i === index ? "border-apple" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={img.src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setLightbox(false)}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-black p-0 text-white backdrop:bg-black"
      >
        <div className="relative h-full w-full" {...swipe}>
          {lightbox && (
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              fill
              sizes="100vw"
              loading="eager"
              className="object-contain"
            />
          )}
          {arrows(true)}
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className={cn(roundButton, "absolute top-4 right-4 bg-black/45 text-white hover:bg-black/65")}
            aria-label="Close photo viewer"
            autoFocus
          >
            <FontAwesomeIcon icon={faXmark} className="text-[15px]" />
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[13px] text-white/80" aria-live="polite">
            {index + 1} of {n}
          </p>
        </div>
      </dialog>
    </div>
  );
}
