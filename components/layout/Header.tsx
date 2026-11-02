import { Suspense } from "react";
import { Logo } from "@/components/ui/Logo";
import { HeaderActions } from "./HeaderActions";
import { DesktopNav, DesktopNavFallback, MobileNav } from "./MainNav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-[#FBFBFD]/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between gap-4 px-4 text-[13px] sm:px-6">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Logo />
        </div>
        <Suspense fallback={<DesktopNavFallback />}>
          <DesktopNav />
        </Suspense>
        <HeaderActions />
      </div>
    </header>
  );
}
