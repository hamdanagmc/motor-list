"use client";

import { faBell, faHeart } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Menu, menuItemClass } from "@/components/ui/Menu";
import { useFavourites } from "@/lib/favourites";

const iconButton = "relative grid h-8 w-8 place-items-center rounded-full text-ink/80 hover:text-ink";

export function HeaderActions() {
  const { data } = useSession();
  const { ids } = useFavourites();
  const user = data?.user;
  const initials = (user?.name ?? user?.email ?? "")
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  // "none" matches no slug, so an empty list shows the "nothing saved yet" state.
  const savedHref = `/vehicle-stock?saved=${ids.length ? ids.join(",") : "none"}`;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link href={savedHref} className={iconButton} aria-label={`Saved vehicles (${ids.length})`}>
        <FontAwesomeIcon icon={faHeart} className="text-[15px]" />
        {ids.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-apple px-1 text-[10px] font-semibold text-white">
            {ids.length}
          </span>
        )}
      </Link>

      <Menu
        label="Notifications"
        trigger={<FontAwesomeIcon icon={faBell} className="text-[15px]" />}
        triggerClassName={iconButton}
        panelClassName="w-[260px]"
      >
        {() => <p className="px-3 py-4 text-center text-mute">No new notifications.</p>}
      </Menu>

      <Menu
        label="Account"
        trigger={
          <span className="grid h-7 w-7 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">
            {initials}
          </span>
        }
        triggerClassName="rounded-full focus-visible:ring-4 focus-visible:ring-apple/30 focus-visible:outline-none"
        panelClassName="w-[240px]"
      >
        {(close) => (
          <>
            <div className="border-b border-line px-3 pt-2 pb-3">
              <p className="truncate font-semibold">{user?.name}</p>
              <p className="truncate text-[13px] text-mute">{user?.email}</p>
            </div>
            <Link href={savedHref} onClick={close} className={`${menuItemClass} mt-1.5`}>
              Saved vehicles <span className="text-soft">{ids.length}</span>
            </Link>
            <button type="button" onClick={() => signOut({ callbackUrl: "/login" })} className={menuItemClass}>
              Sign out <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-[13px] text-mute" />
            </button>
          </>
        )}
      </Menu>
    </div>
  );
}
