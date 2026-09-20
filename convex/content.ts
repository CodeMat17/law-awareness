import { v, type Infer } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { requireRole } from "./model/roles";
import { reviewValidator, workflowValidator } from "./schema";

/**
 * Content API for the CMS and the public site.
 *
 * Two audiences with different rules share this file:
 *
 *   - Public reads (`publishedByCollection`, `publishedRecord`) take no
 *     authentication and return only `published` rows. They are the site's
 *     entire content source.
 *   - Editorial reads and every mutation are guarded by `requireRole`, which
 *     runs here on Convex's servers and is the real security boundary. The
 *     checks in lib/cms/auth.ts only decide what to render.
 *
 * Keeping both on one table means an editor moving a record to `published` is
 * the same event that makes it appear on the site - there is no second copy to
 * fall out of step.
 */

const blockValidator = v.object({
  key: v.string(),
  type: v.string(),
  data: v.record(v.string(), v.string()),
});

/* -------------------------------------------------------------------------- */
/* Counters                                                                    */
/* -------------------------------------------------------------------------- */

const STATUSES = ["draft", "review", "published", "archived"] as const;
type Status = (typeof STATUSES)[number];

/**
 * Applies a delta to one collection's counter row, creating it if this is the
 * first record of that collection.
 *
 * Counters are maintained on the write path because reads outnumber writes by
 * orders of magnitude here: an editor publishes a handful of records a day,
 * and the dashboard is loaded far more often than that. Paying a small,
 * bounded cost per write buys a dashboard that costs four numbers per
 * collection instead of the whole library.
 */
async function bump(
  ctx: MutationCtx,
  collection: string,
  changes: Partial<Record<Status, number>>
): Promise<void> {
  const row = await ctx.db
    .query("contentCounters")
    .withIndex("by_collection", (q) => q.eq("collection", collection))
    .unique();

  if (!row) {
    await ctx.db.insert("contentCounters", {
      collection,
      draft: Math.max(0, changes.draft ?? 0),
      review: Math.max(0, changes.review ?? 0),
      published: Math.max(0, changes.published ?? 0),
      archived: Math.max(0, changes.archived ?? 0),
    });
    return;
  }

  const patch: Partial<Record<Status, number>> = {};
  for (const status of STATUSES) {
    const delta = changes[status];
    if (delta) patch[status] = Math.max(0, row[status] + delta);
  }
  if (Object.keys(patch).length > 0) await ctx.db.patch(row._id, patch);
}

/* -------------------------------------------------------------------------- */
/* Public reads                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Published rows of one collection, in editor-defined order.
 *
 * Unauthenticated on purpose: this is what renders the public site. Reading
 * through `by_collection_status` means an unpublished draft is never loaded at
 * all, rather than being loaded and filtered out in application code where a
 * mistake could leak it.
 */
export const publishedByCollection = query({
  args: { collection: v.string() },
  handler: async (ctx, { collection }) => {
    const rows = await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_status", (q) =>
        q.eq("collection", collection).eq("status", "published")
      )
      .collect();
    return rows.sort((a, b) => a.order - b.order);
  },
});

/**
 * Published rows of several collections in one round trip.
 *
 * Pages assemble from multiple collections - the site layout alone needs the
 * ticker and the navigation - and issuing one query per collection would put a
 * serial round trip in front of every render.
 */
export const publishedByCollections = query({
  args: { collections: v.array(v.string()) },
  handler: async (ctx, { collections }) => {
    const result: Record<string, Doc<"contentRecords">[]> = {};
    for (const collection of collections) {
      const rows = await ctx.db
        .query("contentRecords")
        .withIndex("by_collection_status", (q) =>
          q.eq("collection", collection).eq("status", "published")
        )
        .collect();
      result[collection] = rows.sort((a, b) => a.order - b.order);
    }
    return result;
  },
});

/** One published row by its stable id. Returns null for anything unpublished. */
export const publishedRecord = query({
  args: { collection: v.string(), recordId: v.string() },
  handler: async (ctx, { collection, recordId }) => {
    const row = await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_record", (q) =>
        q.eq("collection", collection).eq("recordId", recordId)
      )
      .unique();
    return row && row.status === "published" ? row : null;
  },
});

/**
 * One published row by its public route.
 *
 * The CMS-composed pages are addressed by path, not by stable id, and there is
 * one of them behind every standing route on the site. Resolving a path by
 * reading the whole `pages` collection and searching it in application code
 * meant rendering any one page cost the stored blocks of every page - so this
 * resolves through `by_collection_href` and reads exactly one document.
 *
 * `publicHref` is kept equal to the page's `path` field by `updateFields`.
 */
export const publishedByHref = query({
  args: { collection: v.string(), href: v.string() },
  handler: async (ctx, { collection, href }) => {
    const row = await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_href", (q) =>
        q.eq("collection", collection).eq("publicHref", href)
      )
      .first();
    return row && row.status === "published" ? row : null;
  },
});

/**
 * Whether a collection has any published rows at all.
 *
 * `publishedByHref` returning null has two meanings - the route is genuinely
 * unpublished, or nothing has been seeded yet - and the caller falls back to
 * its bundled copy only in the second case. Answering that with one document
 * read keeps the distinction without re-reading the collection.
 */
export const hasPublished = query({
  args: { collection: v.string() },
  handler: async (ctx, { collection }) => {
    const row = await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_status", (q) =>
        q.eq("collection", collection).eq("status", "published")
      )
      .first();
    return row !== null;
  },
});

/* -------------------------------------------------------------------------- */
/* Editorial reads                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Every row of a collection regardless of status, for the admin list.
 *
 * Filtering happens here rather than in the caller so a large collection does
 * not have to cross the wire to be searched. `viewer` is enough to read: the
 * CMS is legible to anyone with a role, and only writing is restricted.
 *
 * Only the columns the list renders are returned. The list shows a title, a
 * subtitle, a status and the review metadata; sending `fields` and `blocks`
 * as well meant opening a collection transferred the full body text of every
 * record in it to draw a list of links. The editor screen reads one whole
 * record through `getRecord` when a record is actually opened.
 */
export const listByCollection = query({
  args: {
    collection: v.string(),
    status: v.optional(v.union(workflowValidator, v.literal("all"))),
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, "viewer");

    const status = args.status;
    const rows =
      status && status !== "all"
        ? await ctx.db
            .query("contentRecords")
            .withIndex("by_collection_status", (q) =>
              q.eq("collection", args.collection).eq("status", status)
            )
            .collect()
        : await ctx.db
            .query("contentRecords")
            .withIndex("by_collection", (q) =>
              q.eq("collection", args.collection)
            )
            .collect();

    const needle = args.query?.trim().toLowerCase();
    const matched = needle
      ? rows.filter(
          (row) =>
            row.title.toLowerCase().includes(needle) ||
            (row.subtitle?.toLowerCase().includes(needle) ?? false)
        )
      : rows;

    return matched.sort((a, b) => a.order - b.order).map(toSummary);
  },
});

/** The columns the admin list and the review queue render, and no others. */
function toSummary(row: Doc<"contentRecords">) {
  return {
    collection: row.collection,
    recordId: row.recordId,
    title: row.title,
    subtitle: row.subtitle,
    status: row.status,
    review: row.review,
    reviewedBy: row.reviewedBy,
    lastReviewed: row.lastReviewed,
    publicHref: row.publicHref,
    updatedAt: row.updatedAt,
  };
}

/** One row by stable id, at any status, for the admin editor. */
export const getRecord = query({
  args: { collection: v.string(), recordId: v.string() },
  handler: async (ctx, { collection, recordId }) => {
    await requireRole(ctx, "viewer");
    return await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_record", (q) =>
        q.eq("collection", collection).eq("recordId", recordId)
      )
      .unique();
  },
});

interface CollectionCount {
  collection: string;
  total: number;
  draft: number;
  review: number;
  published: number;
  archived: number;
}

function countsFromRows(rows: Doc<"contentRecords">[]): CollectionCount[] {
  const counts = new Map<string, CollectionCount>();
  for (const row of rows) {
    const entry = counts.get(row.collection) ?? {
      collection: row.collection,
      total: 0,
      draft: 0,
      review: 0,
      published: 0,
      archived: 0,
    };
    entry.total += 1;
    entry[row.status] += 1;
    counts.set(row.collection, entry);
  }
  return [...counts.values()];
}

/**
 * Per-collection counts for the admin dashboard.
 *
 * Served from `contentCounters`, which the mutations below maintain, so a
 * dashboard load reads one small row per collection rather than the whole
 * content library.
 *
 * The fallback covers exactly one case: a deployment whose records predate the
 * counters table, where reporting zeroes would be worse than paying for a
 * scan. Running `recountCollections` once retires it.
 */
export const collectionCounts = query({
  args: {},
  handler: async (ctx): Promise<CollectionCount[]> => {
    await requireRole(ctx, "viewer");

    const counters = await ctx.db.query("contentCounters").collect();
    if (counters.length === 0) {
      return countsFromRows(await ctx.db.query("contentRecords").collect());
    }

    return counters.map((row) => ({
      collection: row.collection,
      total: row.draft + row.review + row.published + row.archived,
      draft: row.draft,
      review: row.review,
      published: row.published,
      archived: row.archived,
    }));
  },
});

/**
 * Rebuilds every counter row from the records themselves.
 *
 * The counters are a cache, and a cache needs a way back to the truth: this is
 * it, for a deployment seeded before the table existed or one where a failed
 * write left a number adrift. Admin-only, because it is the one function here
 * that deliberately reads the whole table.
 */
export const recountCollections = mutation({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, "admin");
    await rebuildCounters(ctx);
  },
});

async function rebuildCounters(ctx: MutationCtx): Promise<void> {
  const counts = countsFromRows(await ctx.db.query("contentRecords").collect());
  const existing = await ctx.db.query("contentCounters").collect();
  const byCollection = new Map(existing.map((row) => [row.collection, row]));

  for (const entry of counts) {
    const row = byCollection.get(entry.collection);
    const value = {
      collection: entry.collection,
      draft: entry.draft,
      review: entry.review,
      published: entry.published,
      archived: entry.archived,
    };
    if (row) {
      byCollection.delete(entry.collection);
      await ctx.db.patch(row._id, value);
    } else {
      await ctx.db.insert("contentCounters", value);
    }
  }

  // Collections that no longer have any records keep a row of zeroes rather
  // than disappearing, so the dashboard renders them the same either way.
  for (const row of byCollection.values()) {
    await ctx.db.patch(row._id, {
      draft: 0,
      review: 0,
      published: 0,
      archived: 0,
    });
  }
}

/**
 * Drafts and in-review records across every collection, most recent first.
 *
 * Both statuses are read through `by_status_updated` in descending order and
 * cut to `limit` before they are merged, so the queue costs at most twice the
 * rows it shows however much unpublished work has accumulated.
 */
export const reviewQueue = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 6 }) => {
    await requireRole(ctx, "viewer");

    const recent = async (status: "draft" | "review") =>
      await ctx.db
        .query("contentRecords")
        .withIndex("by_status_updated", (q) => q.eq("status", status))
        .order("desc")
        .take(limit);

    const [inReview, drafts] = [await recent("review"), await recent("draft")];

    return [...inReview, ...drafts]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit)
      .map(toSummary);
  },
});

/** Most recent editorial actions, newest first. */
export const recentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 8 }) => {
    await requireRole(ctx, "viewer");
    return await ctx.db
      .query("contentActivity")
      .withIndex("by_at")
      .order("desc")
      .take(limit);
  },
});

/* -------------------------------------------------------------------------- */
/* Mutations                                                                   */
/* -------------------------------------------------------------------------- */

async function log(
  ctx: MutationCtx,
  row: { collection: string; recordId: string; title: string },
  action: string,
  actor: string
): Promise<void> {
  await ctx.db.insert("contentActivity", {
    collection: row.collection,
    recordId: row.recordId,
    title: row.title,
    action,
    actor,
    at: Date.now(),
  });
}

async function findRecord(
  ctx: MutationCtx,
  collection: string,
  recordId: string
): Promise<Doc<"contentRecords">> {
  const row = await ctx.db
    .query("contentRecords")
    .withIndex("by_collection_record", (q) =>
      q.eq("collection", collection).eq("recordId", recordId)
    )
    .unique();
  if (!row) throw new Error("Record not found");
  return row;
}

/**
 * Saves the editable fields of a record.
 *
 * `title`, `subtitle` and the review metadata are derived by the caller from
 * the collection registry, because the registry - not this function - knows
 * which field is a given collection's title. Convex stores what it is told and
 * stays free of the content model.
 */
export const updateFields = mutation({
  args: {
    collection: v.string(),
    recordId: v.string(),
    fields: v.record(v.string(), v.string()),
    blocks: v.optional(v.array(blockValidator)),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    review: v.optional(reviewValidator),
    reviewedBy: v.optional(v.string()),
    lastReviewed: v.optional(v.string()),
    /**
     * The record's public route, when the caller derives one from the fields
     * it is saving. Pages are addressed by path, and `publishedByHref` reads
     * them through this column - so an edited path has to land here too, or
     * the page would answer at its old route until it was re-created.
     */
    publicHref: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const editor = await requireRole(ctx, "author");
    const row = await findRecord(ctx, args.collection, args.recordId);

    await ctx.db.patch(row._id, {
      fields: { ...row.fields, ...args.fields },
      ...(args.publicHref ? { publicHref: args.publicHref } : {}),
      ...(args.blocks ? { blocks: args.blocks } : {}),
      ...(args.title ? { title: args.title } : {}),
      ...(args.subtitle !== undefined ? { subtitle: args.subtitle } : {}),
      ...(args.review ? { review: args.review } : {}),
      ...(args.reviewedBy !== undefined
        ? { reviewedBy: args.reviewedBy || undefined }
        : {}),
      ...(args.lastReviewed !== undefined
        ? { lastReviewed: args.lastReviewed }
        : {}),
      updatedAt: Date.now(),
      updatedBy: editor.name,
    });

    await log(
      ctx,
      { ...row, title: args.title ?? row.title },
      "updated",
      editor.name
    );
    return (await ctx.db.get(row._id))!;
  },
});

/**
 * Moves a record through the editorial workflow.
 *
 * Publishing and archiving change what the public sees, so they need `editor`;
 * moving something to draft or into review does not, so `author` is enough.
 * lib/cms/actions.ts applies the same split for the redirect-level check, but
 * this is the one that binds.
 */
export const setStatus = mutation({
  args: {
    collection: v.string(),
    recordId: v.string(),
    status: workflowValidator,
  },
  handler: async (ctx, args) => {
    const minimum =
      args.status === "published" || args.status === "archived"
        ? "editor"
        : "author";
    const editor = await requireRole(ctx, minimum);
    const row = await findRecord(ctx, args.collection, args.recordId);

    await ctx.db.patch(row._id, {
      status: args.status,
      updatedAt: Date.now(),
      updatedBy: editor.name,
    });
    if (row.status !== args.status) {
      await bump(ctx, row.collection, {
        [row.status]: -1,
        [args.status]: 1,
      });
    }
    await log(ctx, row, `moved to ${args.status}`, editor.name);
    return (await ctx.db.get(row._id))!;
  },
});

/** Permanently removes a record. Admin only; the activity entry survives it. */
export const remove = mutation({
  args: { collection: v.string(), recordId: v.string() },
  handler: async (ctx, args) => {
    const editor = await requireRole(ctx, "admin");
    const row = await findRecord(ctx, args.collection, args.recordId);
    await ctx.db.delete(row._id);
    await bump(ctx, row.collection, { [row.status]: -1 });
    await log(ctx, row, "deleted", editor.name);
  },
});

/**
 * Creates a record. The caller supplies the stable id so that content authored
 * elsewhere - a seed file, an import - keeps its identity.
 */
export const create = mutation({
  args: {
    collection: v.string(),
    recordId: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    fields: v.record(v.string(), v.string()),
    blocks: v.optional(v.array(blockValidator)),
    publicHref: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const editor = await requireRole(ctx, "author");

    const existing = await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_record", (q) =>
        q.eq("collection", args.collection).eq("recordId", args.recordId)
      )
      .unique();
    if (existing) throw new Error("A record with that id already exists");

    // New records start as drafts whoever creates them: appearing on the
    // public site is an `editor` decision, made through `setStatus`.
    const id = await ctx.db.insert("contentRecords", {
      collection: args.collection,
      recordId: args.recordId,
      title: args.title,
      subtitle: args.subtitle,
      status: "draft",
      fields: args.fields,
      blocks: args.blocks,
      publicHref: args.publicHref,
      order: Date.now(),
      updatedAt: Date.now(),
      updatedBy: editor.name,
    });
    await bump(ctx, args.collection, { draft: 1 });

    await log(
      ctx,
      {
        collection: args.collection,
        recordId: args.recordId,
        title: args.title,
      },
      "created",
      editor.name
    );
    return (await ctx.db.get(id))!;
  },
});

/** Reorders a collection. Positions are assigned from the given id sequence. */
export const reorder = mutation({
  args: { collection: v.string(), recordIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const editor = await requireRole(ctx, "author");
    for (const [index, recordId] of args.recordIds.entries()) {
      const row = await findRecord(ctx, args.collection, recordId);
      await ctx.db.patch(row._id, {
        order: index,
        updatedAt: Date.now(),
        updatedBy: editor.name,
      });
    }
  },
});

/* -------------------------------------------------------------------------- */
/* Seeding                                                                     */
/* -------------------------------------------------------------------------- */

const seedRecordValidator = v.object({
  collection: v.string(),
  recordId: v.string(),
  title: v.string(),
  subtitle: v.optional(v.string()),
  status: workflowValidator,
  review: v.optional(reviewValidator),
  reviewedBy: v.optional(v.string()),
  lastReviewed: v.optional(v.string()),
  publicHref: v.optional(v.string()),
  fields: v.record(v.string(), v.string()),
  blocks: v.optional(v.array(blockValidator)),
  order: v.number(),
});

type SeedRecord = Infer<typeof seedRecordValidator>;

/**
 * The body of a seed, shared by the admin-only mutation and the internal one.
 *
 * Kept as a plain function rather than duplicated: the two entry points differ
 * only in who is allowed to call them and in whose name the records are
 * stamped, and a second copy of this loop would eventually disagree with the
 * first about what `overwrite` means.
 */
async function applySeed(
  ctx: MutationCtx,
  args: {
    records: SeedRecord[];
    overwrite?: boolean;
    finalize?: boolean;
  },
  actor: string
) {
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const record of args.records) {
    const existing = await ctx.db
      .query("contentRecords")
      .withIndex("by_collection_record", (q) =>
        q.eq("collection", record.collection).eq("recordId", record.recordId)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("contentRecords", {
        ...record,
        updatedAt: Date.now(),
        updatedBy: actor,
      });
      inserted += 1;
    } else if (args.overwrite) {
      await ctx.db.patch(existing._id, {
        ...record,
        updatedAt: Date.now(),
        updatedBy: actor,
      });
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  // A seed touches statuses in bulk, so the counters are recomputed rather
  // than tracked per record - but only once, on the batch the caller marks as
  // the last, since the rebuild is itself a full read of the table.
  if (args.finalize) await rebuildCounters(ctx);

  return { inserted, updated, skipped };
}

/**
 * Imports records authored in code (lib/content/*) into the database.
 *
 * Idempotent by `(collection, recordId)`: re-running inserts what is missing
 * and leaves what is already there alone. That is what makes it safe to run
 * against a live deployment - an editor's changes are never overwritten by a
 * redeploy of the seed files.
 *
 * `overwrite` exists for the one case idempotency cannot serve: deliberately
 * resetting records back to what the source files say.
 */
export const seed = mutation({
  args: {
    records: v.array(seedRecordValidator),
    overwrite: v.optional(v.boolean()),
    /** Set on the final batch, to rebuild the dashboard counters once. */
    finalize: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const editor = await requireRole(ctx, "admin");
    return applySeed(ctx, args, editor.name);
  },
});

/**
 * The same import, without the Clerk check.
 *
 * An `internalMutation` is not reachable from any client - only from the
 * Convex CLI and from other Convex functions - so this is the seeding path for
 * a deployment nobody has signed into yet, and for scripted use:
 *
 *   npx convex run content:seedInternal '{"records": [...], "overwrite": true}'
 *
 * The public `seed` above stays admin-only: it is what the button on the
 * dashboard calls, and that one does arrive from a browser.
 */
export const seedInternal = internalMutation({
  args: {
    records: v.array(seedRecordValidator),
    overwrite: v.optional(v.boolean()),
    finalize: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => applySeed(ctx, args, "seed script"),
});

/**
 * Per-collection counts, without the Clerk check, for verifying a seed from
 * the CLI. Reads the counter rows the seed rebuilds rather than the records.
 */
export const countsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("contentCounters").collect();
    return rows
      .map((row) => ({
        collection: row.collection,
        draft: row.draft,
        review: row.review,
        published: row.published,
        archived: row.archived,
      }))
      .sort((a, b) => a.collection.localeCompare(b.collection));
  },
});

/**
 * Whether any content exists yet, so the admin dashboard can offer to seed an
 * empty deployment instead of rendering twenty-two empty collections.
 */
export const isSeeded = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, "viewer");
    const first = await ctx.db.query("contentRecords").first();
    return first !== null;
  },
});
