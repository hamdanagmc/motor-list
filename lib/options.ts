// Single source of truth for enumerated vehicle fields.
// Imported by the Sanity schema (Studio dropdowns) and the filter UI, so keep it free of Sanity imports.

export const BODY_TYPES = ["SUV", "Sedan", "Crossover", "Coupe", "Pickup", "Hatchback"] as const;
export const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Plug-in hybrid", "Electric"] as const;
export const TRANSMISSIONS = ["Automatic", "Manual"] as const;
export const DRIVETRAINS = ["FWD", "RWD", "AWD", "4WD"] as const;
export const CYLINDERS = [3, 4, 6, 8, 10, 12] as const;
export const REGIONAL_SPECS = ["GCC", "American", "European", "Japanese", "Canadian", "Other"] as const;
export const CITIES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
  "Al Ain",
] as const;
export const STATUSES = ["available", "reserved", "sold"] as const;
export const FEATURE_CATEGORIES = [
  "Safety",
  "Comfort",
  "Entertainment",
  "Technology",
  "Exterior",
  "Performance",
] as const;

export const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "year", label: "Year: newest" },
  { value: "km", label: "Mileage: lowest" },
] as const;
export type Sort = (typeof SORTS)[number]["value"];

export const PAGE_SIZE = 12;
export const FINANCE_RATE = 2.99;

export const NAV = [
  { href: "/vehicle-stock", label: "Vehicle Stock" },
  { href: "/employee-benefits", label: "Employee Benefits" },
  { href: "/terms-and-conditions", label: "Terms and Conditions" },
] as const;
