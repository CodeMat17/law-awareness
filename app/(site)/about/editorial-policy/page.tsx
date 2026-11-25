import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/site/cms-page";

/**
 * Composed in the CMS. Everything this page says - its header, its sections
 * and its metadata - is edited under /admin/pages, not here.
 *
 * Prerendered, not rendered per request. The Convex client fetches without a
 * cache, which would otherwise make every one of these routes dynamic and put
 * a database round trip in front of a page whose content changes a few times a
 * year. `force-static` prerenders it and still honours revalidation.
 *
 * Never revalidated on a timer. Publishing an edit calls `revalidatePath` on
 * this route (lib/cms/actions.ts), and a change made outside the admin is
 * picked up by POST /api/revalidate (scripts/revalidate.mjs).
 */
export const dynamic = "force-static";
export const revalidate = false;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("/about/editorial-policy");
}

export default function EditorialPolicyPage() {
  return <CmsPage path="/about/editorial-policy" />;
}
