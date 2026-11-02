import { PAGE_SIZE, SORTS, type Sort } from "../options";

/** Listing state. Lives entirely in the URL so every view is shareable and server-rendered. */
export type Filters = {
  q?: string;
  make?: string[];
  model?: string[];
  body?: string[];
  fuel?: string[];
  trans?: string[];
  drive?: string[];
  cyl?: number[];
  spec?: string[];
  city?: string[];
  saved?: string[];
  pmode?: "monthly";
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  kmMax?: number;
  sort?: Sort;
  page?: number;
};

export type SearchParams = Record<string, string | string[] | undefined>;

const LIST_KEYS = ["make", "model", "body", "fuel", "trans", "drive", "spec", "city", "saved"] as const;
const NUM_KEYS = ["priceMin", "priceMax", "yearMin", "yearMax", "kmMax"] as const;

export function parseFilters(sp: SearchParams): Filters {
  const get = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  };
  const list = (k: string) => {
    const items = get(k)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return items?.length ? items : undefined;
  };
  const num = (k: string) => {
    const n = Number(get(k));
    return get(k) !== undefined && Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const f: Filters = { q: get("q") };
  for (const k of LIST_KEYS) f[k] = list(k);
  for (const k of NUM_KEYS) f[k] = num(k);
  const cyl = list("cyl")?.map(Number).filter(Number.isInteger);
  f.cyl = cyl?.length ? cyl : undefined;
  if (get("pmode") === "monthly") f.pmode = "monthly";
  const sort = get("sort");
  if (SORTS.some((s) => s.value === sort && s.value !== "newest")) f.sort = sort as Sort;
  const page = Math.floor(num("page") ?? 1);
  if (page > 1) f.page = page;
  return f;
}

/** Inverse of parseFilters. Omits empty values so URLs stay short. */
export function toSearch(f: Filters): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) continue;
    if (k === "page" && v === 1) continue;
    sp.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  const s = sp.toString().replace(/%2C/g, ",");
  return s ? `?${s}` : "";
}

/** GROQ params for LISTING_QUERY. Every param must be present; null disables that clause. */
export function toQueryParams(f: Filters) {
  const page = f.page ?? 1;
  return {
    q: f.q ? f.q.split(/\s+/).map((w) => `${w}*`) : null,
    make: f.make ?? null,
    model: f.model ?? null,
    bodyTypes: f.body ?? null,
    fuel: f.fuel ?? null,
    trans: f.trans ?? null,
    drive: f.drive ?? null,
    cyl: f.cyl ?? null,
    spec: f.spec ?? null,
    city: f.city ?? null,
    saved: f.saved ?? null,
    monthly: f.pmode === "monthly",
    priceMin: f.priceMin ?? null,
    priceMax: f.priceMax ?? null,
    yearMin: f.yearMin ?? null,
    yearMax: f.yearMax ?? null,
    kmMax: f.kmMax ?? null,
    sort: f.sort ?? "newest",
    start: (page - 1) * PAGE_SIZE,
    end: page * PAGE_SIZE,
  };
}

/** Number of active filter groups, for the badge on the filter button. Search and sort don't count. */
export function activeCount(f: Filters): number {
  return [
    f.make,
    f.model,
    f.body,
    f.fuel,
    f.trans,
    f.drive,
    f.cyl,
    f.spec,
    f.city,
    f.saved,
    f.priceMin ?? f.priceMax,
    f.yearMin ?? f.yearMax,
    f.kmMax,
  ].filter((v) => v !== undefined).length;
}

/** sessionStorage key holding the last listing query, used by "Back to results". */
export const LAST_LISTING_KEY = "motorlist:last-listing";
