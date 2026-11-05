const band = "mx-auto max-w-[1100px] px-4 pt-8 pb-4 sm:pt-10 sm:pb-6 xl:px-0";

/** Message from Studio → Site Settings. Sits outside the sticky search band so it scrolls away and only the search stays pinned. */
export function PortalWelcome({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className={band}>
      <p className="text-[17px] leading-snug font-semibold tracking-tight text-balance sm:text-[22px]">{message}</p>
    </div>
  );
}

/** Same height as the message (two lines on phones, one from sm up), so the page doesn't jump when results stream in. */
export function PortalWelcomeSkeleton() {
  return (
    <div className={band}>
      <div className="shimmer h-[47px] max-w-[720px] rounded sm:h-[30px]" />
    </div>
  );
}
