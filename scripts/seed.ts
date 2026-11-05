/**
 * Seeds Sanity with the 12 vehicles from the UX Pilot draft, plus makes, sellers, the two content pages and site settings.
 * Idempotent: fixed document IDs + createOrReplace, and Sanity de-duplicates identical image uploads.
 *
 *   npm run seed   (runs `sanity exec scripts/seed.ts --with-user-token`)
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-11-01" });
const IMG = "https://storage.googleapis.com/uxpilot-auth.appspot.com/";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const block = (text: string, style = "normal", listItem?: "bullet") => ({
  _type: "block",
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
  ...(listItem ? { listItem, level: 1 } : {}),
});

const MAKES = ["Porsche", "Toyota", "Nissan", "BMW", "Tesla", "Mercedes-Benz", "Land Rover", "Lexus"];

// ponytail: placeholder contact numbers; replace with real branch numbers in Studio.
const SELLERS = [
  { name: "Marina Prestige", city: "Dubai" },
  { name: "Al Wasl Motors", city: "Abu Dhabi" },
  { name: "Desert Drive", city: "Sharjah" },
  { name: "Bavaria Approved", city: "Dubai" },
  { name: "Volt Auto", city: "Dubai" },
  { name: "Palm Gallery", city: "Dubai" },
  { name: "Jumeirah Car Hub", city: "Dubai" },
  { name: "Gulf Premium", city: "Abu Dhabi" },
  { name: "SZR Motors", city: "Dubai" },
].map((s, i) => ({
  ...s,
  phone: `+971 4 000 00${String(i + 1).padStart(2, "0")}`,
  whatsapp: `9715000000${String(i + 1).padStart(2, "0")}`,
}));

type Car = {
  make: string;
  model: string;
  trim: string;
  year: number;
  desc: string;
  price: number;
  monthly: number;
  featured?: boolean;
  sold?: boolean;
  city: string;
  spec: string;
  km: number;
  seller: string;
  days: number;
  img: string[];
  body: string;
  fuel: string;
  trans: string;
  drive: string;
  cyl?: number;
  engine: string;
  ext: string;
  int: string;
  doors: number;
  seats: number;
  warranty: string;
  service: string;
  extras: Partial<Record<"Safety" | "Comfort" | "Entertainment" | "Technology" | "Exterior" | "Performance", string[]>>;
};

const CARS: Car[] = [
  {
    make: "Porsche",
    model: "911",
    trim: "Carrera S",
    year: 2022,
    featured: true,
    desc: "2022 Porsche 911 Carrera S | Guards Red | Full agency service history | Warranty until 2027",
    price: 545000,
    monthly: 8500,
    city: "Dubai",
    spec: "GCC",
    km: 21000,
    seller: "Marina Prestige",
    days: 1,
    img: ["gen_74ad3d4e68_3cee97850b678675", "gen_74ad3d4e68_a8078528e3600c05"],
    body: "Coupe",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "RWD",
    cyl: 6,
    engine: "3.0L twin-turbo flat-six",
    ext: "Guards Red",
    int: "Black leather",
    doors: 2,
    seats: 4,
    warranty: "Porsche warranty until 2027",
    service: "Full agency service history",
    extras: {
      Performance: ["Sport Chrono package", "Sports exhaust", "PASM sport suspension"],
      Entertainment: ["BOSE surround sound"],
    },
  },
  {
    make: "Toyota",
    model: "Land Cruiser",
    trim: "GR Sport",
    year: 2024,
    featured: true,
    desc: "2024 Toyota Land Cruiser GR Sport | Brand new | 5-year dealer warranty | Precious White Pearl",
    price: 389000,
    monthly: 6050,
    city: "Abu Dhabi",
    spec: "GCC",
    km: 0,
    seller: "Al Wasl Motors",
    days: 2,
    img: ["gen_2cfe410a88_0f3b8d593f3a2c57"],
    body: "SUV",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "4WD",
    cyl: 6,
    engine: "3.5L twin-turbo V6",
    ext: "Precious White Pearl",
    int: "Black and red leather",
    doors: 5,
    seats: 7,
    warranty: "5-year dealer warranty",
    service: "New vehicle",
    extras: {
      Performance: ["E-KDSS suspension", "Front and rear differential locks"],
      Entertainment: ["JBL 14-speaker audio"],
    },
  },
  {
    make: "Nissan",
    model: "Patrol",
    trim: "LE Platinum",
    year: 2023,
    desc: "2023 Nissan Patrol LE Platinum | V8 5.6L | Single owner | Service contract until 2026",
    price: 289000,
    monthly: 4500,
    city: "Sharjah",
    spec: "GCC",
    km: 14500,
    seller: "Desert Drive",
    days: 5,
    img: ["gen_5429fcc308_576e5443bf824ae6"],
    body: "SUV",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "4WD",
    cyl: 8,
    engine: "5.6L V8",
    ext: "Super Black",
    int: "Beige leather",
    doors: 5,
    seats: 8,
    warranty: "Service contract until December 2026",
    service: "Single owner, full agency service history",
    extras: {
      Comfort: ["Rear-seat entertainment screens", "Cool box"],
      Performance: ["Hydraulic Body Motion Control"],
    },
  },
  {
    make: "BMW",
    model: "X5",
    trim: "xDrive40i M Sport",
    year: 2022,
    desc: "2022 BMW X5 xDrive40i M Sport | Certified Pre-Owned | 2-year approved warranty | Panoramic roof",
    price: 259000,
    monthly: 4050,
    city: "Dubai",
    spec: "GCC",
    km: 32000,
    seller: "Bavaria Approved",
    days: 7,
    img: ["gen_ae65d87b73_4cb492f2b6cad1b9"],
    body: "SUV",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "AWD",
    cyl: 6,
    engine: "3.0L turbo inline-six",
    ext: "Black Sapphire",
    int: "Cognac Vernasca leather",
    doors: 5,
    seats: 5,
    warranty: "2-year BMW approved warranty",
    service: "Full agency service history",
    extras: { Exterior: ["Panoramic glass roof", "M Sport package"], Technology: ["Head-up display"] },
  },
  {
    make: "Tesla",
    model: "Model Y",
    trim: "Long Range AWD",
    year: 2024,
    desc: "2024 Tesla Model Y Long Range AWD | Brand new | Autopilot | 533 km range",
    price: 199000,
    monthly: 3100,
    city: "Dubai",
    spec: "GCC",
    km: 0,
    seller: "Volt Auto",
    days: 3,
    img: ["gen_44a7d2a003_0670208b2be98ecb"],
    body: "Crossover",
    fuel: "Electric",
    trans: "Automatic",
    drive: "AWD",
    engine: "Dual-motor electric, 533 km range",
    ext: "Pearl White",
    int: "Black vegan leather",
    doors: 5,
    seats: 5,
    warranty: "4-year vehicle, 8-year battery warranty",
    service: "New vehicle",
    extras: { Technology: ["Autopilot", "Over-the-air updates", "Phone key"], Exterior: ["Glass roof"] },
  },
  {
    make: "Mercedes-Benz",
    model: "AMG GT",
    trim: "GT C",
    year: 2021,
    desc: "2021 Mercedes-AMG GT | Iridium Silver | European spec | Burmester sound | Carbon package",
    price: 489000,
    monthly: 7600,
    city: "Dubai",
    spec: "European",
    km: 26500,
    seller: "Palm Gallery",
    days: 14,
    img: ["gen_ffaa93fc55_fd7443beef1567b1"],
    body: "Coupe",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "RWD",
    cyl: 8,
    engine: "4.0L twin-turbo V8",
    ext: "Iridium Silver",
    int: "Black Nappa leather",
    doors: 2,
    seats: 2,
    warranty: "Extended warranty until 2027",
    service: "Full service history",
    extras: {
      Entertainment: ["Burmester surround sound"],
      Exterior: ["AMG carbon package"],
      Performance: ["AMG Ride Control", "Rear-axle steering"],
    },
  },
  {
    make: "Land Rover",
    model: "Range Rover Sport",
    trim: "P400 Dynamic SE",
    year: 2023,
    featured: true,
    desc: "2023 Range Rover Sport P400 Dynamic SE | Santorini Black | Agency warranty | Meridian sound",
    price: 459000,
    monthly: 7150,
    city: "Dubai",
    spec: "GCC",
    km: 18200,
    seller: "Jumeirah Car Hub",
    days: 4,
    img: ["gen_425cc6b7e0_117b170542b3269d"],
    body: "SUV",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "AWD",
    cyl: 6,
    engine: "3.0L turbo inline-six mild hybrid",
    ext: "Santorini Black",
    int: "Ebony Windsor leather",
    doors: 5,
    seats: 5,
    warranty: "Agency warranty until December 2026",
    service: "Full agency service history",
    extras: { Entertainment: ["Meridian surround sound"], Performance: ["Adaptive air suspension"] },
  },
  {
    make: "Toyota",
    model: "RAV4",
    trim: "Adventure Hybrid",
    year: 2024,
    desc: "2024 Toyota RAV4 Adventure Hybrid | Brand new | AWD-i | 5-year warranty",
    price: 139000,
    monthly: 2150,
    city: "Ajman",
    spec: "GCC",
    km: 0,
    seller: "Al Wasl Motors",
    days: 0,
    img: ["gen_d39b1f5827_6991e6bbcc75803d"],
    body: "Crossover",
    fuel: "Hybrid",
    trans: "Automatic",
    drive: "AWD",
    cyl: 4,
    engine: "2.5L hybrid inline-four",
    ext: "Lunar Rock",
    int: "Black SofTex",
    doors: 5,
    seats: 5,
    warranty: "5-year dealer warranty",
    service: "New vehicle",
    extras: { Technology: ["Toyota Safety Sense 2.5"] },
  },
  {
    make: "BMW",
    model: "M4",
    trim: "Competition",
    year: 2023,
    desc: "2023 BMW M4 Competition | Isle of Man Green | Carbon bucket seats | Agency service history",
    price: 365000,
    monthly: 5700,
    city: "Abu Dhabi",
    spec: "GCC",
    km: 9800,
    seller: "Gulf Premium",
    days: 21,
    img: ["gen_e9b8e2369c_373063b330634ec7"],
    body: "Coupe",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "RWD",
    cyl: 6,
    engine: "3.0L twin-turbo inline-six",
    ext: "Isle of Man Green",
    int: "Kyalami Orange and black Merino leather",
    doors: 2,
    seats: 4,
    warranty: "BMW warranty until 2028",
    service: "Agency service history",
    extras: { Comfort: ["M carbon bucket seats"], Performance: ["M Drive Professional", "Adaptive M suspension"] },
  },
  {
    make: "Porsche",
    model: "Taycan",
    trim: "4S",
    year: 2023,
    desc: "2023 Porsche Taycan 4S | Frozen Blue | Performance Battery Plus | Warranty until 2027",
    price: 419000,
    monthly: 6500,
    city: "Dubai",
    spec: "GCC",
    km: 7200,
    seller: "Marina Prestige",
    days: 6,
    img: ["gen_c362646b36_0802fc4154c9141f"],
    body: "Sedan",
    fuel: "Electric",
    trans: "Automatic",
    drive: "AWD",
    engine: "Dual-motor electric, Performance Battery Plus",
    ext: "Frozen Blue Metallic",
    int: "Black and Chalk leather",
    doors: 4,
    seats: 4,
    warranty: "Porsche warranty until 2027",
    service: "Full agency service history",
    extras: { Performance: ["Performance Battery Plus", "Adaptive air suspension"], Technology: ["Passenger display"] },
  },
  {
    make: "Lexus",
    model: "LX 600",
    trim: "Prestige",
    year: 2022,
    desc: "2022 Lexus LX 600 Prestige | Certified Pre-Owned | Mark Levinson audio | Full Lexus service history",
    price: 449000,
    monthly: 6990,
    city: "Dubai",
    spec: "GCC",
    km: 27400,
    seller: "SZR Motors",
    days: 10,
    img: ["gen_3bf9e1b247_dffdfe7581a9e726"],
    body: "SUV",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "4WD",
    cyl: 6,
    engine: "3.5L twin-turbo V6",
    ext: "Sonic Titanium",
    int: "Black semi-aniline leather",
    doors: 5,
    seats: 7,
    warranty: "2-year certified pre-owned warranty",
    service: "Full Lexus service history",
    extras: { Entertainment: ["Mark Levinson 25-speaker audio"], Comfort: ["Rear executive seating"] },
  },
  {
    make: "Porsche",
    model: "Macan",
    trim: "GTS",
    year: 2022,
    sold: true,
    desc: "2022 Porsche Macan GTS | Python Green | Sport Chrono | Full agency service history",
    price: 279000,
    monthly: 4350,
    city: "Dubai",
    spec: "GCC",
    km: 29500,
    seller: "Marina Prestige",
    days: 32,
    img: ["gen_6e593eaf2d_d0e34f26909d2ead"],
    body: "Crossover",
    fuel: "Petrol",
    trans: "Automatic",
    drive: "AWD",
    cyl: 6,
    engine: "2.9L twin-turbo V6",
    ext: "Python Green",
    int: "Black leather with Race-Tex",
    doors: 5,
    seats: 5,
    warranty: "Porsche Approved warranty until 2026",
    service: "Full agency service history",
    extras: { Performance: ["Sport Chrono package"] },
  },
];

const BASE_FEATURES = {
  Safety: [
    "Adaptive cruise control",
    "Blind-spot monitoring",
    "Lane-keep assist",
    "360° camera",
    "Front and rear parking sensors",
  ],
  Comfort: ["Keyless entry and start", "Heated and ventilated front seats", "Multi-zone climate control"],
  Entertainment: ["Apple CarPlay and Android Auto", "Wireless phone charging"],
  Technology: ["Digital instrument cluster", "Navigation"],
  Exterior: ["LED headlights", "Power tailgate"],
  Performance: [] as string[],
};

async function uploadImage(id: string) {
  const res = await fetch(`${IMG}${id}.png`);
  if (!res.ok) throw new Error(`Image ${id} failed: ${res.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename: `${id}.png` });
  return asset._id;
}

async function main() {
  const tx = client.transaction();

  for (const name of MAKES) {
    tx.createOrReplace({
      _id: `make-${slugify(name)}`,
      _type: "make",
      name,
      slug: { _type: "slug", current: slugify(name) },
    });
  }
  for (const s of SELLERS) {
    tx.createOrReplace({ _id: `seller-${slugify(s.name)}`, _type: "seller", ...s });
  }

  for (const car of CARS) {
    const title = `${car.year} ${car.make} ${car.model} ${car.trim}`;
    const slug = slugify(title);
    console.log(`Uploading images for ${title}`);
    const assetIds = await Promise.all(car.img.map(uploadImage));
    const seller = SELLERS.find((s) => s.name === car.seller)!;
    const features = Object.entries(BASE_FEATURES)
      .map(([category, items]) => ({
        _type: "featureGroup",
        _key: key(),
        category,
        items: [...items, ...(car.extras[category as keyof Car["extras"]] ?? [])],
      }))
      .filter((g) => g.items.length);

    tx.createOrReplace({
      _id: `vehicle-${slug}`,
      _type: "vehicle",
      title,
      slug: { _type: "slug", current: slug },
      status: car.sold ? "sold" : "available",
      featured: Boolean(car.featured),
      make: { _type: "reference", _ref: `make-${slugify(car.make)}` },
      model: car.model,
      trim: car.trim,
      year: car.year,
      bodyType: car.body,
      fuelType: car.fuel,
      transmission: car.trans,
      drivetrain: car.drive,
      cylinders: car.cyl,
      engineSize: car.engine,
      mileage: car.km,
      price: car.price,
      monthlyPrice: car.monthly,
      regionalSpec: car.spec,
      exteriorColor: car.ext,
      interiorColor: car.int,
      doors: car.doors,
      seats: car.seats,
      warranty: car.warranty,
      serviceHistory: car.service,
      city: car.city,
      shortDescription: car.desc,
      description: [
        block(`${car.desc.replace(/ \| /g, ". ")}.`),
        block(
          `Finished in ${car.ext} with a ${car.int.toLowerCase()} interior, this ${car.model} has covered ${car.km.toLocaleString("en-US")} km. ${car.warranty}; ${car.service.toLowerCase()}.`,
        ),
        block(`Available to view at ${seller.name}, ${car.city}. Contact the branch to book a viewing or test drive.`),
      ],
      images: assetIds.map((ref, i) => ({
        _type: "image",
        _key: key(),
        asset: { _type: "reference", _ref: ref },
        alt: i === 0 ? title : `${title}, rear view`,
      })),
      features,
      seller: { _type: "reference", _ref: `seller-${slugify(seller.name)}` },
      publishedAt: new Date(Date.now() - car.days * 86_400_000).toISOString(),
    });
  }

  const studioNote = (title: string) =>
    block(
      `This page is managed in Sanity Studio under Page → ${title}. Replace this placeholder with the approved copy.`,
    );

  tx.createOrReplace({
    _id: "page-employee-benefits",
    _type: "page",
    title: "Employee Benefits",
    slug: { _type: "slug", current: "employee-benefits" },
    body: [
      studioNote("Employee Benefits"),
      block("Buying a vehicle from stock", "h2"),
      block(
        "Every vehicle on AGMC Used Cars is available to AGMC employees. Contact the listed branch directly by phone or WhatsApp to reserve a car.",
      ),
      block("Finance", "h2"),
      block(
        "Monthly prices are indicative, based on a 2.99% flat rate. Use the calculator on each vehicle page to estimate a payment for your own down payment and term.",
      ),
      block("What to bring", "h2"),
      block("Emirates ID", "normal", "bullet"),
      block("Employee ID card", "normal", "bullet"),
      block("Valid UAE driving licence", "normal", "bullet"),
    ],
  });
  tx.createOrReplace({
    _id: "page-terms-and-conditions",
    _type: "page",
    title: "Terms and Conditions",
    slug: { _type: "slug", current: "terms-and-conditions" },
    body: [
      studioNote("Terms and Conditions"),
      block("Use of this portal", "h2"),
      block(
        "AGMC Used Cars is for AGMC employees only. Do not share listings, prices or screenshots outside the company.",
      ),
      block("Prices and availability", "h2"),
      block(
        "Prices include VAT unless stated. Vehicles are subject to prior sale; a vehicle is only reserved once the branch confirms it in writing.",
      ),
      block("Finance estimates", "h2"),
      block("Monthly payments shown are estimates only and are subject to lender approval."),
    ],
  });

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    welcomeMessage: "Welcome to AGMC - Internal Stock Portal - Albatha Employees & Family",
  });

  const result = await tx.commit();
  console.log(`Seeded ${result.results.length} documents.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
