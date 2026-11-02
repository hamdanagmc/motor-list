"use client";

import { useSession } from "next-auth/react";
import { useCallback, useSyncExternalStore } from "react";

// ponytail: favourites live in this browser's localStorage, namespaced per signed-in email.
// To move them to a database, swap read()/write() for API calls; components only use useFavourites().
const EVENT = "motorlist:favourites";
const EMPTY: string[] = [];
let snapshot: { key: string; raw: string | null; ids: string[] } | null = null;

function read(key: string): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {}
  if (snapshot?.key === key && snapshot.raw === raw) return snapshot.ids;
  let ids = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) ids = parsed.filter((s): s is string => typeof s === "string");
  } catch {}
  snapshot = { key, raw, ids };
  return ids;
}

function write(key: string, ids: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

export function useFavourites() {
  const email = useSession().data?.user?.email;
  const key = email ? `motorlist:favourites:${email}` : null;
  const ids = useSyncExternalStore(
    subscribe,
    () => (key ? read(key) : EMPTY),
    () => EMPTY,
  );
  const toggle = useCallback(
    (slug: string) => {
      if (key) write(key, ids.includes(slug) ? ids.filter((s) => s !== slug) : [...ids, slug]);
    },
    [key, ids],
  );
  return { ids, ready: key !== null, isSaved: (slug: string) => ids.includes(slug), toggle };
}
