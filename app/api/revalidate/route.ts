import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { contentTag, siteBackedCollections } from "@/lib/content/convex-repository";

/**
 * Rebuilds the public site after a Convex change the admin did not make.
 *
 * Public pages are cached until their content changes, with no timer behind
 * them. Admin saves invalidate exactly what they touched (lib/cms/actions.ts),
 * but a seed or an edit in the Convex dashboard writes straight to the
 * database, and Next has no way to hear about it. This is how it is told:
 *
 *   node scripts/revalidate.mjs
 *
 * It invalidates every content tag and the root layout, so every page is
 * rebuilt on its next visit. Deliberately coarse - it runs a few times a year.
 *
 * Guarded by REVALIDATE_SECRET, sent as a bearer token. Without the variable
 * the route refuses everything rather than running open.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const sent = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";

  if (!secret || !safeEqual(sent, secret)) {
    return Response.json({ ok: false }, { status: 401 });
  }

  for (const collection of siteBackedCollections) {
    // Expire outright rather than serve one more stale copy.
    revalidateTag(contentTag(collection), { expire: 0 });
  }
  revalidatePath("/", "layout");

  return Response.json({ ok: true, tags: siteBackedCollections.size });
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
