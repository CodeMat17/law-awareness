import type { Metadata } from "next";
import { CmsPage, cmsPageMetadata } from "@/components/site/cms-page";
import { Leadership } from "@/components/site/leadership";
import { MissionVision } from "@/components/site/mission-vision";
import { getContent } from "@/lib/content/repository";

/**
 * Composed in the CMS. Everything this page says - its header, its sections
 * and its metadata - is edited under /admin/pages, not here. The people at the
 * foot of it are the "Leadership & boards" collection.
 *
 * Prerendered, not rendered per request. The Convex client fetches without a
 * cache, which would otherwise make every one of these routes dynamic and put
 * a database round trip in front of a page whose content changes a few times a
 * year. `force-static` prerenders it and still honours revalidation.
 *
 * Revalidated hourly as a floor. Publishing an edit calls `revalidatePath` on
 * this route (lib/cms/actions.ts), so a change is live immediately and the
 * window below only bounds how stale the page can get if that call is missed.
 */
export const dynamic = "force-static";
export const revalidate = 3600;

export function generateMetadata(): Promise<Metadata> {
  return cmsPageMetadata("/about");
}

export default async function AboutPage() {
  const members = await getContent().getLeadershipMembers();
  return (
    <CmsPage
      path="/about"
      intro={<MissionVision />}
      outro={<Leadership members={members} />}
    />
  );
}
