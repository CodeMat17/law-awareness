import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { ReviewStatus, WorkflowStatus } from "@/lib/content/types";
import type { PageBlock } from "./blocks";
import {
  collections,
  getCollection,
  titleFieldFor,
  type CollectionId,
} from "./collections";
import { publicHrefFor } from "./public-href";
import type {
  ActivityEntry,
  CmsListFilters,
  CmsRecord,
  CmsRecordSummary,
  CmsRepository,
  CollectionCounts,
} from "./repository";

/**
 * Convex-backed CMS adapter.
 *
 * Every method mirrors the in-memory adapter it replaces, so the admin pages
 * and server actions are unchanged - they were always written against the
 * `CmsRepository` interface for exactly this swap.
 *
 * The `actor` argument each interface method carries is deliberately not
 * accepted here. Convex derives the actor from the caller's token, which is the
 * only account of who did something that a client cannot influence - taking it
 * as an argument would invite trusting a name the browser supplied.
 *
 * The other structural difference is authentication. Convex enforces roles
 * server-side (convex/model/roles.ts), which means every call from here has to
 * carry the caller's Clerk token. There is no service key and no way to read
 * or write content as nobody: an unauthenticated admin request fails at Convex
 * rather than being trusted because it came from our own server.
 */

async function token(): Promise<string> {
  const { getToken } = await auth();
  const value = await getToken({ template: "convex" });
  if (!value) throw new Error("Not authenticated");
  return value;
}

/**
 * The list-row shape, as returned by the projecting queries in
 * convex/content.ts. Those queries omit `fields` and `blocks` so that drawing
 * a list does not transfer the body of every record in it.
 */
interface ContentSummaryRow {
  collection: string;
  recordId: string;
  title: string;
  subtitle?: string;
  status: WorkflowStatus;
  review?: ReviewStatus;
  reviewedBy?: string;
  lastReviewed?: string;
  publicHref?: string;
  updatedAt: number;
}

/** The whole row, as returned by the single-record queries and mutations. */
interface ContentRow extends ContentSummaryRow {
  fields: Record<string, string>;
  blocks?: PageBlock[];
}

function toSummary(row: ContentSummaryRow): CmsRecordSummary {
  return {
    id: row.recordId,
    collection: row.collection as CollectionId,
    title: row.title,
    subtitle: row.subtitle,
    status: row.status,
    review: row.review,
    reviewedBy: row.reviewedBy,
    lastReviewed: row.lastReviewed,
    publicHref: row.publicHref,
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

function toRecord(row: ContentRow): CmsRecord {
  return {
    ...toSummary(row),
    fields: row.fields,
    blocks: row.blocks,
  };
}

const REVIEW_VALUES: ReviewStatus[] = [
  "educational",
  "reviewed",
  "updated",
  "archived",
];

function asReviewStatus(value: string | undefined): ReviewStatus | undefined {
  return value && (REVIEW_VALUES as string[]).includes(value)
    ? (value as ReviewStatus)
    : undefined;
}

export class ConvexCmsRepository implements CmsRepository {
  async listCollectionsSummary(): Promise<CollectionCounts[]> {
    const counts = await fetchQuery(
      api.content.collectionCounts,
      {},
      { token: await token() }
    );
    const byId = new Map(counts.map((entry) => [entry.collection, entry]));

    // Every registered collection appears, including ones with no rows yet:
    // the dashboard lists what an editor can work on, not only what exists.
    return collections.map((definition) => {
      const entry = byId.get(definition.id);
      return {
        collection: definition.id,
        total: entry?.total ?? 0,
        draft: entry?.draft ?? 0,
        review: entry?.review ?? 0,
        published: entry?.published ?? 0,
        archived: entry?.archived ?? 0,
      };
    });
  }

  async list(
    collection: CollectionId,
    filters: CmsListFilters = {}
  ): Promise<CmsRecordSummary[]> {
    const rows = await fetchQuery(
      api.content.listByCollection,
      {
        collection,
        status: filters.status,
        query: filters.query,
      },
      { token: await token() }
    );
    return rows.map(toSummary);
  }

  async get(collection: CollectionId, id: string): Promise<CmsRecord | null> {
    const row = await fetchQuery(
      api.content.getRecord,
      { collection, recordId: id },
      { token: await token() }
    );
    return row ? toRecord(row) : null;
  }

  /**
   * Adds a record. Convex decides the rest: it refuses a duplicate id and
   * starts every new record as a draft, so nothing an editor creates here can
   * reach the public site without a separate publish.
   */
  async create(
    collection: CollectionId,
    id: string,
    fields: Record<string, string>
  ): Promise<CmsRecord> {
    const definition = getCollection(collection);
    const publicHref = publicHrefFor(collection, fields);

    const row = await fetchMutation(
      api.content.create,
      {
        collection,
        recordId: id,
        title: fields[titleFieldFor(collection)] || id,
        subtitle:
          definition?.id === "pages" && fields.path ? fields.path : undefined,
        fields,
        blocks: definition?.hasBlocks ? [] : undefined,
        publicHref,
      },
      { token: await token() }
    );
    return toRecord(row);
  }

  /**
   * Saves fields, and derives from them the values the database stores
   * alongside: the record's display title and its review metadata.
   *
   * That derivation belongs here rather than in Convex because it depends on
   * the collection registry - only this layer knows that a ticker item's title
   * lives in `headline` while a glossary entry's lives in `term`.
   */
  async updateFields(
    collection: CollectionId,
    id: string,
    fields: Record<string, string>
  ): Promise<CmsRecord> {
    const definition = getCollection(collection);
    const title = fields[titleFieldFor(collection)];

    const row = await fetchMutation(
      api.content.updateFields,
      {
        collection,
        recordId: id,
        fields,
        title: title || undefined,
        // A page's subtitle in the admin list is its route, which is the one
        // thing that identifies it at a glance.
        subtitle:
          definition?.id === "pages" && fields.path ? fields.path : undefined,
        // A page is resolved on the public site by `publicHref`, so an edited
        // path has to move the column the lookup reads, not only the field.
        publicHref:
          definition?.id === "pages" && fields.path ? fields.path : undefined,
        review: asReviewStatus(fields.review),
        reviewedBy: "reviewedBy" in fields ? fields.reviewedBy : undefined,
        lastReviewed: "lastReviewed" in fields ? fields.lastReviewed : undefined,
      },
      { token: await token() }
    );
    return toRecord(row);
  }

  /** Replaces a page's blocks. Block-composed collections only. */
  async updateBlocks(
    collection: CollectionId,
    id: string,
    blocks: PageBlock[]
  ): Promise<CmsRecord> {
    const row = await fetchMutation(
      api.content.updateFields,
      { collection, recordId: id, fields: {}, blocks },
      { token: await token() }
    );
    return toRecord(row);
  }

  async setStatus(
    collection: CollectionId,
    id: string,
    status: WorkflowStatus
  ): Promise<CmsRecord> {
    const row = await fetchMutation(
      api.content.setStatus,
      { collection, recordId: id, status },
      { token: await token() }
    );
    return toRecord(row);
  }

  async remove(collection: CollectionId, id: string): Promise<void> {
    await fetchMutation(
      api.content.remove,
      { collection, recordId: id },
      { token: await token() }
    );
  }

  async recentActivity(limit = 8): Promise<ActivityEntry[]> {
    const rows = await fetchQuery(
      api.content.recentActivity,
      { limit },
      { token: await token() }
    );
    return rows.map((row) => ({
      id: row._id,
      collection: row.collection as CollectionId,
      recordId: row.recordId,
      title: row.title,
      action: row.action,
      actor: row.actor,
      at: new Date(row.at).toISOString(),
    }));
  }

  async reviewQueue(limit = 6): Promise<CmsRecordSummary[]> {
    const rows = await fetchQuery(
      api.content.reviewQueue,
      { limit },
      { token: await token() }
    );
    return rows.map(toSummary);
  }
}
