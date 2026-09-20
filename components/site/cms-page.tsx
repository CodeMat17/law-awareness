import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/knowledge";
import { PageBlocks } from "@/components/site/page-blocks";
import { PolicyPage, type PolicySection } from "@/components/site/policy";
import { paragraphs, parseItems, type PageBlock } from "@/lib/cms/blocks";
import { getPage, type ResolvedPage } from "@/lib/content/page-repository";

/**
 * Renders a page composed in the CMS.
 *
 * The six standing pages under /about were six near-identical route files
 * differing only in their copy. They are now one renderer and six one-line
 * routes, so a change to how a page reads is made once.
 *
 * Two layouts are supported, chosen by the page's own `layout` field:
 *
 *   - `standard` - a page header followed by content blocks. Used by About.
 *   - `policy` - the numbered platform-document layout, which carries the
 *     sibling-document strip and the revision date. Its blocks are all
 *     `policySection`, mapped back onto the shape PolicyPage expects.
 */

/** Maps `policySection` blocks onto the reading layout's own section shape. */
function toPolicySections(blocks: PageBlock[]): PolicySection[] {
  return blocks
    .filter((block) => block.type === "policySection")
    .map((block) => {
      const list = parseItems(block.data.items).map((item) => ({
        term: item.term || undefined,
        body: item.body ?? "",
      }));

      return {
        heading: block.data.heading ?? "",
        paragraphs: paragraphs(block.data.paragraphs),
        // An empty list and an absent one render differently, so do not pass
        // an empty array where the layout expects nothing at all.
        list: list.length > 0 ? list : undefined,
      };
    });
}

/**
 * Metadata for a CMS page, for a route's `generateMetadata`.
 *
 * A page that has been unpublished still needs metadata for the 404 that
 * follows, so this returns a title rather than throwing.
 */
export async function cmsPageMetadata(path: string): Promise<Metadata> {
  const page = await getPage(path);
  if (!page) return { title: "Not found" };

  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription,
    alternates: { canonical: page.path },
  };
}

function StandardPage({ page }: { page: ResolvedPage }) {
  return (
    <>
      <PageHeader
        trail={[{ label: "Home", href: "/" }, { label: page.eyebrow }]}
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.lede || undefined}
      />
      <PageBlocks blocks={page.blocks} />
    </>
  );
}

/**
 * Fetches and renders the page at `path`.
 *
 * A path with no published page 404s. That is the correct response to an
 * editor unpublishing a page: the route still exists in the file system, but
 * there is nothing at it, and saying so is better than rendering an empty
 * shell.
 */
export async function CmsPage({ path }: { path: string }) {
  const page = await getPage(path);
  if (!page) notFound();

  if (page.layout === "policy") {
    return (
      <PolicyPage
        current={page.path}
        eyebrow={page.eyebrow}
        title={page.title}
        lede={page.lede}
        // The layout formats this as a date, so a page with no revision date
        // recorded falls back to today rather than rendering "Invalid Date".
        updated={page.updated ?? new Date().toISOString().slice(0, 10)}
        sections={toPolicySections(page.blocks)}
      />
    );
  }

  return <StandardPage page={page} />;
}
