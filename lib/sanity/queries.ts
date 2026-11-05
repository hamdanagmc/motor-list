import { defineQuery } from "next-sanity";

// Every filter is a nullable param, so one static (typegen-able) query covers all combinations.
const VEHICLE_FILTER = `_type == "vehicle"
  && (!defined($q) || [title, make->name, model, trim, shortDescription] match $q)
  && (!defined($make) || make->slug.current in $make)
  && (!defined($model) || model in $model)
  && (!defined($bodyTypes) || bodyType in $bodyTypes)
  && (!defined($fuel) || fuelType in $fuel)
  && (!defined($trans) || transmission in $trans)
  && (!defined($drive) || drivetrain in $drive)
  && (!defined($cyl) || cylinders in $cyl)
  && (!defined($spec) || regionalSpec in $spec)
  && (!defined($city) || city in $city)
  && (!defined($saved) || slug.current in $saved)
  && (!defined($priceMin) || select($monthly => monthlyPrice, price) >= $priceMin)
  && (!defined($priceMax) || select($monthly => monthlyPrice, price) <= $priceMax)
  && (!defined($yearMin) || year >= $yearMin)
  && (!defined($yearMax) || year <= $yearMax)
  && (!defined($kmMax) || mileage <= $kmMax)`;

// Sold always sinks to the bottom; select() keys are null (a tie) unless their sort is active.
const VEHICLE_ORDER = `order(
  (status == "sold") asc,
  (select($sort == "price-asc" => price)) asc,
  (select($sort == "price-desc" => price)) desc,
  (select($sort == "year" => year)) desc,
  (select($sort == "km" => mileage)) asc,
  featured desc,
  publishedAt desc
)`;

const IMAGE = `{ alt, asset, crop, hotspot, "lqip": asset->metadata.lqip }`;

const CARD = `{
  _id,
  title,
  "slug": slug.current,
  status,
  featured,
  "make": make->name,
  model,
  trim,
  year,
  price,
  monthlyPrice,
  city,
  regionalSpec,
  mileage,
  shortDescription,
  "image": images[0]${IMAGE},
  "imageCount": coalesce(count(images), 0),
  "seller": seller->{ name, logo, phone, whatsapp }
}`;

export const LISTING_QUERY = defineQuery(`{
  "total": count(*[${VEHICLE_FILTER}]),
  "items": *[${VEHICLE_FILTER}] | ${VEHICLE_ORDER} [$start...$end] ${CARD}
}`);

// GROQ has no GROUP BY: keep the first document of each group, then count its siblings.
export const FACETS_QUERY = defineQuery(`{
  "makes": *[_type == "make"]{
    name,
    "slug": slug.current,
    logo,
    "count": count(*[_type == "vehicle" && references(^._id)]),
    "models": array::unique(*[_type == "vehicle" && references(^._id)].model)
  }[count > 0] | order(count desc, name asc),
  "bodyTypes": *[_type == "vehicle" && defined(bodyType) && _id == *[_type == "vehicle" && bodyType == ^.bodyType][0]._id]{
    "value": bodyType,
    "count": count(*[_type == "vehicle" && bodyType == ^.bodyType])
  },
  "cities": *[_type == "vehicle" && defined(city) && _id == *[_type == "vehicle" && city == ^.city][0]._id]{
    "value": city,
    "count": count(*[_type == "vehicle" && city == ^.city])
  } | order(count desc),
  "budgets": [
    { "max": 150000, "count": count(*[_type == "vehicle" && price < 150000]) },
    { "max": 250000, "count": count(*[_type == "vehicle" && price < 250000]) },
    { "max": 350000, "count": count(*[_type == "vehicle" && price < 350000]) },
    { "max": 500000, "count": count(*[_type == "vehicle" && price < 500000]) },
    { "min": 500000, "count": count(*[_type == "vehicle" && price >= 500000]) }
  ],
  "price": { "min": math::min(*[_type == "vehicle"].price), "max": math::max(*[_type == "vehicle"].price) },
  "monthly": { "min": math::min(*[_type == "vehicle"].monthlyPrice), "max": math::max(*[_type == "vehicle"].monthlyPrice) },
  "year": { "min": math::min(*[_type == "vehicle"].year), "max": math::max(*[_type == "vehicle"].year) },
  "mileageMax": math::max(*[_type == "vehicle"].mileage),
  "avgPrice": math::avg(*[_type == "vehicle"].price)
}`);

export const VEHICLE_QUERY = defineQuery(`*[_type == "vehicle" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  status,
  featured,
  "make": make->{ _id, name, "slug": slug.current },
  model,
  trim,
  year,
  price,
  monthlyPrice,
  bodyType,
  fuelType,
  transmission,
  drivetrain,
  cylinders,
  engineSize,
  mileage,
  regionalSpec,
  exteriorColor,
  interiorColor,
  doors,
  seats,
  warranty,
  serviceHistory,
  city,
  shortDescription,
  description,
  "images": images[]${IMAGE},
  features[]{ _key, category, items },
  "seller": seller->{ name, logo, phone, whatsapp, city }
}`);

export const SIMILAR_QUERY = defineQuery(`*[
  _type == "vehicle" && slug.current != $slug && (make._ref == $makeId || bodyType == $bodyType)
] | order((status == "sold") asc, (make._ref == $makeId) desc, publishedAt desc)[0...8] ${CARD}`);

export const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{ title, body }`);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0]{ welcomeMessage }`,
);
