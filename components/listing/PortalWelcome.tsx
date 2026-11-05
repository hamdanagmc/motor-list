/** Sits outside the sticky search band so it scrolls away and only the search stays pinned. Also used by loading.tsx to avoid a layout shift. */
export function PortalWelcome() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-8 pb-4 sm:pt-10 sm:pb-6 xl:px-0">
      <p className="text-[17px] leading-snug font-semibold tracking-tight text-balance sm:text-[22px]">
        Welcome to AGMC - Internal Stock Portal for Albatha Family & Friends
      </p>
    </div>
  );
}
