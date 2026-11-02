import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { VEHICLE_QUERY_RESULT } from "@/sanity/types";
import { formatKm } from "@/lib/utils/format";

type Vehicle = NonNullable<VEHICLE_QUERY_RESULT>;

export function KeySpecs({ v }: { v: Vehicle }) {
  const specs: [string, string | number | null | undefined][] = [
    ["Year", v.year],
    ["Mileage", v.mileage != null ? formatKm(v.mileage) : null],
    ["Regional spec", v.regionalSpec],
    ["Body type", v.bodyType],
    ["Fuel", v.fuelType],
    ["Transmission", v.transmission],
    ["Drivetrain", v.drivetrain],
    ["Cylinders", v.cylinders],
    ["Engine", v.engineSize],
    ["Exterior colour", v.exteriorColor],
    ["Interior colour", v.interiorColor],
    ["Doors", v.doors],
    ["Seats", v.seats],
    ["Warranty", v.warranty],
    ["Service history", v.serviceHistory],
    ["City", v.city],
  ];
  return (
    <section aria-labelledby="specs-title">
      <h2 id="specs-title" className="text-[22px] font-semibold tracking-tight">
        Key specs
      </h2>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
        {specs
          .filter(([, value]) => value != null && value !== "")
          .map(([label, value]) => (
            <div key={label} className="border-t border-line pt-3">
              <dt className="text-[13px] text-mute">{label}</dt>
              <dd className="mt-0.5 text-[15px] font-medium">{value}</dd>
            </div>
          ))}
      </dl>
    </section>
  );
}

export function Features({ groups }: { groups: NonNullable<Vehicle["features"]> }) {
  const filled = groups.filter((g) => g.items?.length);
  if (!filled.length) return null;
  return (
    <section aria-labelledby="features-title">
      <h2 id="features-title" className="text-[22px] font-semibold tracking-tight">
        Features and options
      </h2>
      <div className="mt-5 space-y-6">
        {filled.map((g) => (
          <div key={g._key}>
            <h3 className="text-[15px] font-semibold">{g.category}</h3>
            <ul className="mt-2 grid gap-x-6 gap-y-2 text-[15px] text-ink/85 sm:grid-cols-2">
              {g.items?.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <FontAwesomeIcon icon={faCheck} className="mt-1 text-[12px] text-apple" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
