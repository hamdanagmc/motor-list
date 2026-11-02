"use client";

import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, menuItemClass } from "@/components/ui/Menu";
import { NAV } from "@/lib/options";
import { cn } from "@/lib/utils/format";

function useIsActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopLinks({ isActive = () => false }: { isActive?: (href: string) => boolean }) {
  return (
    <nav aria-label="Main" className="hidden items-center gap-8 text-ink/80 md:flex">
      {NAV.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={isActive(href) ? "page" : undefined}
          className={cn("rounded hover:text-ink", isActive(href) && "font-medium text-ink")}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function DesktopNav() {
  return <DesktopLinks isActive={useIsActive()} />;
}

/** Prerendered shell while the pathname (runtime data on dynamic routes) resolves. */
export function DesktopNavFallback() {
  return <DesktopLinks />;
}

/** Only mounts once the menu is opened, so its pathname read never blocks prerendering. */
function MobileLinks({ close }: { close: () => void }) {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main">
      {NAV.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={close}
          aria-current={isActive(href) ? "page" : undefined}
          className={cn(menuItemClass, isActive(href) && "font-semibold")}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNav() {
  return (
    <div className="md:hidden">
      <Menu
        label="Open menu"
        align="left"
        trigger={<FontAwesomeIcon icon={faBars} className="text-[15px]" />}
        triggerClassName="grid h-8 w-8 place-items-center rounded-full text-ink/80 hover:text-ink"
        panelClassName="w-[240px]"
      >
        {(close) => <MobileLinks close={close} />}
      </Menu>
    </div>
  );
}
