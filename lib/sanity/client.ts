import { cacheLife, cacheTag } from "next/cache";
import { createClient, type ClientReturn, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Next's cache is the cache layer; the CDN would serve stale data right after a webhook revalidation.
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN || undefined,
});

/** Cached GROQ fetch. Tags are document `_type`s, invalidated by /api/revalidate. */
export async function sanityFetch<const Q extends string>(
  query: Q,
  params: QueryParams = {},
  tags: string[] = ["vehicle", "make", "seller"],
): Promise<ClientReturn<Q, unknown>> {
  "use cache";
  cacheLife("hours");
  cacheTag(...tags);
  return client.fetch(query, params);
}
