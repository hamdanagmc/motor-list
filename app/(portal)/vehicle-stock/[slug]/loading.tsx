export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading vehicle" className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6">
      <div className="shimmer my-5 h-3 w-72 rounded" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
        <div>
          <div className="shimmer aspect-[1068/628] rounded-2xl" />
          <div className="mt-2 flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="shimmer h-16 w-28 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-2xl border border-line p-6">
          <div className="shimmer h-6 w-3/4 rounded" />
          <div className="shimmer h-8 w-1/2 rounded" />
          <div className="shimmer h-4 w-2/3 rounded" />
          <div className="shimmer mt-6 h-10 w-full rounded-lg" />
          <div className="shimmer h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
