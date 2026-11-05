import { PortalWelcomeSkeleton } from "@/components/listing/PortalWelcome";

// Skeleton shimmer from the draft, shown while the listing streams in.
export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading vehicles">
      <PortalWelcomeSkeleton />
      <div className="sticky top-12 z-30 border-b border-line bg-white">
        <div className="mx-auto max-w-[1100px] px-4 pt-4 pb-3 xl:px-0">
          <div className="h-12 rounded-full bg-fill" />
          <div className="mt-3 flex gap-2 overflow-hidden">
            {[64, 68, 98, 104, 60, 86].map((w, i) => (
              <div key={i} className="h-9 shrink-0 rounded-full bg-panel" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1100px] px-4 pt-5 pb-4 xl:px-0">
        <div className="shimmer h-6 w-28 rounded" />
        <div className="mt-4 flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer h-7 w-24 rounded-full" />
          ))}
        </div>
      </div>
      <div className="bg-panel py-4">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-4 bg-white p-4 md:flex-row md:gap-6">
              <div className="shimmer aspect-[1068/628] w-full shrink-0 md:w-[320px]" />
              <div className="min-w-0 flex-1 space-y-3">
                <div className="shimmer h-5 w-40 rounded" />
                <div className="shimmer h-3 w-56 rounded" />
                <div className="shimmer h-4 w-72 rounded" />
                <div className="shimmer h-3 w-full rounded" />
                <div className="flex justify-between pt-2">
                  <div className="shimmer h-9 w-[72px] rounded-md" />
                  <div className="shimmer h-10 w-[218px] rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
