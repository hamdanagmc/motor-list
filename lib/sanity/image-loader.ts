"use client";

// next/image loader: resizes on the Sanity CDN instead of re-encoding through Next's optimizer.
export default function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  return url.toString();
}
