import { revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

// Sanity webhook target. Configure in sanity.io/manage → API → Webhooks:
//   URL: https://<host>/api/revalidate   Projection: { _type }   Secret: SANITY_REVALIDATE_SECRET
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return Response.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) return Response.json({ message: "Invalid signature" }, { status: 401 });
  if (!body?._type) return Response.json({ message: "Missing _type" }, { status: 400 });

  // expire: 0, not "max": editors publish and refresh, so the next visit must wait for fresh content, not get the old copy.
  revalidateTag(body._type, { expire: 0 });
  return Response.json({ revalidated: body._type });
}
