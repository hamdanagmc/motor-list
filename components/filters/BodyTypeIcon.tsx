// Outline silhouettes ported from the UX Pilot draft.
const PATHS: Record<string, string> = {
  SUV: "M4 24V17l7-8h33l10 7h6v8",
  Sedan: "M4 24v-5l9-3 8-6h19l10 6 10 3v5",
  Crossover: "M4 24v-6l9-7h30l10 6 7 1v6",
  Coupe: "M4 24v-5l11-3 11-6h12l14 6 8 3v5",
  Pickup: "M4 24v-8l7-7h17v7h32v8",
  Hatchback: "M4 24v-7l10-7h24l9 6 13 2v6",
};

export function BodyTypeIcon({ type, className }: { type: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[type] ?? PATHS.Sedan} />
      <path d="M4 24h6M22 24h20M54 24h6" />
      <circle cx="16" cy="24" r="5" />
      <circle cx="48" cy="24" r="5" />
    </svg>
  );
}
