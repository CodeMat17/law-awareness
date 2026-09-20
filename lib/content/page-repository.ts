import { unstable_cache } from "next/cache";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { contentTag } from "./convex-repository";
import type { PageBlock } from "@/lib/cms/blocks";
import { pageSeedByPath, pageSeeds, type PageSeed } from "./pages";

/**
 * Read path for CMS-composed pages.
 *
 * Convex is the source of truth. The seed in ./pages.ts is a fallback for two
 * cases that both need the site to keep rendering:
 *
 *   - a local checkout with no Convex deployment configured;
 *   - a deployment that has not been seeded yet.
 *
 * It is deliberately not a cache. If Convex answers, its answer wins even when
 * it differs from the seed - otherwise an editor could delete a section and
 * find the old copy still on the page.
 *
 * Freshness is handled at the route level: page routes set `revalidate`, and
 * publishing a page calls `revalidatePath` on its route (lib/cms/actions.ts),
 * so an edit is live as soon as it is published rather than at the next
 * revalidation window.
 */

export interface ResolvedPage {
  path: string;
  title: string;
  eyebrow: string;
  lede: string;
  layout: "standard" | "policy";
  updated?: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks: PageBlock[];
}

function fromSeed(seed: PageSeed): ResolvedPage {
  return {
    path: seed.path,
    title: seed.title,
    eyebrow: seed.eyebrow,
    lede: seed.lede,
    layout: seed.layout,
    updated: seed.updated,
    metaTitle: seed.metaTitle,
    metaDescription: seed.metaDescription,
    blocks: seed.blocks,
  };
}

/** Whether a Convex deployment is configured for this environment at all. */
function convexConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CONVEX_URL);
}

type ContentRow = {
  fields: Record<string, string>;
  blocks?: PageBlock[];
  title: string;
};

function fromRow(row: ContentRow): ResolvedPage {
  return {
    path: row.fields.path,
    title: row.fields.title || row.title,
    eyebrow: row.fields.eyebrow ?? "",
    lede: row.fields.lede ?? "",
    layout: row.fields.layout === "policy" ? "policy" : "standard",
    updated: row.fields.updated || undefined,
    metaTitle: row.fields.metaTitle || undefined,
    metaDescription: row.fields.metaDescription || undefined,
    blocks: row.blocks ?? [],
  };
}

/**
 * The published page at `path`, or null if there is none.
 *
 * A Convex failure falls back to the seed rather than propagating. A content
 * backend being briefly unreachable should degrade a page to its last known
 * copy, not return a 500 to a reader - and the platform documents in
 * particular are ones people arrive at needing to read.
 */
/**
 * The stored page at one route, or null if nothing is stored there.
 *
 * Reads a single document through the `by_collection_href` index rather than
 * the whole collection. Every standing route on the site renders through here,
 * and pages carry their blocks, so resolving a path by fetching every page and
 * searching in memory made one page's render cost the stored text of all of
 * them - the sort of read that is invisible in development and expensive in
 * aggregate.
 *
 * Cached per path and invalidated by the `pages` content tag, which
 * `revalidateFor` in lib/cms/actions.ts fires whenever a page record changes.
 */
const fetchPage = (path: string) =>
  unstable_cache(
    async () => {
      return await fetchQuery(api.content.publishedByHref, {
        collection: "pages",
        href: path,
      });
    },
    ["content", "page", path],
    { tags: [contentTag("pages")], revalidate: 3600 }
  )();

/**
 * Whether any page has been published yet.
 *
 * Shared across every route rather than being asked per path, because the
 * answer is a property of the deployment, not of the page being rendered.
 */
const fetchPagesExist = unstable_cache(
  async () => {
    return await fetchQuery(api.content.hasPublished, { collection: "pages" });
  },
  ["content", "pages-exist"],
  { tags: [contentTag("pages")], revalidate: 3600 }
);

export async function getPage(path: string): Promise<ResolvedPage | null> {
  const seed = pageSeedByPath(path);

  if (!convexConfigured()) return seed ? fromSeed(seed) : null;

  try {
    const row = await fetchPage(path);
    if (row) return fromRow(row);

    // Reaching Convex and finding nothing is only a fallback case before the
    // deployment has been seeded. Once any page exists, an absent path means
    // the page is genuinely unpublished, and the seed must not resurrect it.
    if (await fetchPagesExist()) return null;
    return seed ? fromSeed(seed) : null;
  } catch {
    return seed ? fromSeed(seed) : null;
  }
}

/**
 * Every published page, for sitemap generation.
 *
 * The one caller that genuinely needs the whole collection. Cached on the same
 * tag as the single-page reads, so a sitemap request cannot turn into a fresh
 * read of every page's blocks.
 */
const fetchPages = unstable_cache(
  async () => {
    return await fetchQuery(api.content.publishedByCollection, {
      collection: "pages",
    });
  },
  ["content", "pages"],
  { tags: [contentTag("pages")], revalidate: 3600 }
);

export async function getPages(): Promise<ResolvedPage[]> {
  if (!convexConfigured()) return pageSeeds.map(fromSeed);

  try {
    const rows = await fetchPages();
    if (rows.length === 0) return pageSeeds.map(fromSeed);
    return rows.map(fromRow);
  } catch {
    return pageSeeds.map(fromSeed);
  }
}
