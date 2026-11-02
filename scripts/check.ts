// Self-check for the URL-state and finance logic. Run: npm run check
import assert from "node:assert/strict";
import { activeCount, parseFilters, toQueryParams, toSearch } from "../lib/utils/filters";
import { flatRateMonthly } from "../lib/utils/finance";

// URL → filters → URL round-trips, dropping junk and defaults.
const f = parseFilters({
  q: " land cruiser ",
  make: "toyota,nissan",
  cyl: "6,x,8",
  priceMax: "300000",
  yearMin: "-5",
  sort: "bogus",
  page: "2",
  pmode: "monthly",
});
assert.deepEqual(f.make, ["toyota", "nissan"]);
assert.deepEqual(f.cyl, [6, 8]);
assert.equal(f.yearMin, undefined, "negative numbers rejected");
assert.equal(f.sort, undefined, "unknown sort falls back to default");
assert.equal(f.q, "land cruiser");
assert.equal(toSearch(f), "?q=land+cruiser&make=toyota,nissan&priceMax=300000&cyl=6,8&pmode=monthly&page=2");
assert.deepEqual(parseFilters(Object.fromEntries(new URLSearchParams(toSearch(f)))), f);
assert.equal(toSearch({ page: 1 }), "");
assert.equal(activeCount(f), 3);

// GROQ params: every key present, search words become prefix matches, page 2 → items 12–24.
const p = toQueryParams(f);
assert.deepEqual(p.q, ["land*", "cruiser*"]);
assert.equal(p.bodyTypes, null);
assert.equal(p.monthly, true);
assert.deepEqual([p.start, p.end], [12, 24]);

// AED 100,000 car, AED 20,000 down, 2.99% flat over 5 years: 80,000 + 11,960 interest over 60 months.
const m = flatRateMonthly(100_000, 20_000, 2.99, 5);
assert.equal(m.principal, 80_000);
assert.equal(Math.round(m.interest), 11_960);
assert.equal(Math.round(m.monthly), 1_533);
assert.equal(flatRateMonthly(50_000, 80_000, 2.99, 5).monthly, 0, "down payment above price clamps to zero");

console.log("check: ok");
