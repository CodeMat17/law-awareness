import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * The four CMS roles, lowest to highest privilege. Kept in sync with
 * `EditorRole` in lib/cms/auth.ts - that module is the only consumer.
 */
export const roleValidator = v.union(
  v.literal("viewer"),
  v.literal("author"),
  v.literal("editor"),
  v.literal("admin")
);

/**
 * Membership roles inside an organization (Phase 6, spec section 43). These are
 * deliberately separate from `roleValidator`: CMS privilege and organization
 * membership are different things, and conflating them would let an
 * organization owner reach editorial tooling.
 */
export const orgRoleValidator = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("member")
);

/**
 * What a saved item points at. Mirrors `SearchType` in lib/content/types.ts,
 * but stored as a plain string rather than a union so that adding a content
 * type does not require a schema migration for every existing bookmark.
 */
const savedItem = {
  /** Content kind, e.g. "law", "case", "media". */
  kind: v.string(),
  title: v.string(),
  summary: v.string(),
  /** Section label shown on the card, e.g. "Case law · Supreme Court". */
  group: v.string(),
  /** Canonical route. Also the identity of the target - see `by_owner_href`. */
  href: v.string(),
};

/**
 * Editorial workflow state, mirroring `WorkflowStatus` in lib/content/types.ts.
 * Only `published` records are ever returned to the public site.
 */
export const workflowValidator = v.union(
  v.literal("draft"),
  v.literal("review"),
  v.literal("published"),
  v.literal("archived")
);

/** Credibility metadata, mirroring `ReviewStatus` in lib/content/types.ts. */
export const reviewValidator = v.union(
  v.literal("educational"),
  v.literal("reviewed"),
  v.literal("updated"),
  v.literal("archived")
);

/**
 * One content block on an editable page. `type` names an entry in the block
 * registry (lib/cms/blocks.ts) and `data` carries that block's own fields.
 *
 * `data` is a loose record rather than a per-type union because the registry -
 * not the database - is the authority on a block's shape. Adding a block type
 * must not require a schema migration, and a block whose type has been retired
 * must still round-trip through the editor rather than failing validation.
 */
const pageBlock = v.object({
  key: v.string(),
  type: v.string(),
  data: v.record(v.string(), v.string()),
});

export default defineSchema({
  /* ------------------------------------------------------------------------ */
  /* Editorial content - the CMS                                               */
  /* ------------------------------------------------------------------------ */

  /**
   * Every editable record on the site, across all collections, in one table.
   *
   * One table rather than twenty-two is a deliberate match for the admin UI,
   * which is generic: it renders lists and forms from the collection registry
   * in lib/cms/collections.ts rather than from bespoke screens. Per-collection
   * tables would force a schema migration and a new set of Convex functions
   * every time an editor needs a new content type - exactly the cost the
   * generic admin was built to avoid.
   *
   * The price is that `fields` is untyped at the database boundary. That is
   * paid back in lib/cms/actions.ts, which validates every field against the
   * registry on write, and in lib/content/repository.ts, which maps records
   * back onto the typed domain objects the site renders. The database stores
   * editorial state; the application owns the shape.
   */
  contentRecords: defineTable({
    /** A `CollectionId` from lib/cms/collections.ts. */
    collection: v.string(),
    /**
     * The stable, human-authored id carried over from the seed data (e.g.
     * "ticker-1"). Distinct from the Convex `_id` so that seeding is
     * idempotent, and so that hrefs and cross-references inside content
     * survive a re-seed.
     */
    recordId: v.string(),
    title: v.string(),
    subtitle: v.optional(v.string()),
    status: workflowValidator,
    review: v.optional(reviewValidator),
    reviewedBy: v.optional(v.string()),
    lastReviewed: v.optional(v.string()),
    /** Public route, when the record has one. */
    publicHref: v.optional(v.string()),
    /** Collection-specific values, keyed by field name. */
    fields: v.record(v.string(), v.string()),
    /**
     * Ordered content blocks. Present only for block-composed collections
     * (currently `pages`); every other collection leaves this unset.
     */
    blocks: v.optional(v.array(pageBlock)),
    /**
     * Sort position within the collection. Seeded from the order of the source
     * arrays so the site renders content in the sequence an editor sees in the
     * admin list.
     */
    order: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    // The public site reads whole collections filtered to published.
    .index("by_collection", ["collection"])
    .index("by_collection_status", ["collection", "status"])
    // Seeding, editing and public detail routes all resolve by stable id.
    .index("by_collection_record", ["collection", "recordId"])
    // Resolves a single page by its route without reading the collection.
    // Rendering one CMS page must not cost the bytes of every other one.
    .index("by_collection_href", ["collection", "publicHref"])
    // Feeds the review queue on the admin dashboard, across all collections.
    // Ordered by `updatedAt` so the queue is a bounded `take` rather than a
    // scan of every unpublished record followed by a sort in memory.
    .index("by_status_updated", ["status", "updatedAt"]),

  /**
   * Per-collection record counts, one row per collection.
   *
   * The dashboard needs four numbers per collection and nothing else. Deriving
   * them by reading `contentRecords` makes every dashboard load pay the bytes
   * of the entire content library - the largest single read in the
   * application, repeated for every editor on every visit. The mutations in
   * convex/content.ts maintain these rows instead, so the dashboard reads at
   * most one small row per collection.
   *
   * They are a derived cache and are treated as one: `recountCollections`
   * rebuilds them from the records at any time, and `collectionCounts` counts
   * directly while no counter row exists at all, so a deployment that predates
   * this table still reports the truth.
   */
  contentCounters: defineTable({
    collection: v.string(),
    draft: v.number(),
    review: v.number(),
    published: v.number(),
    archived: v.number(),
  }).index("by_collection", ["collection"]),

  /**
   * Audit trail for editorial changes. Append-only, and deliberately not
   * derived from `contentRecords` - a deleted record must still leave a trace
   * of who deleted it, which a derived history could not show.
   */
  contentActivity: defineTable({
    collection: v.string(),
    recordId: v.string(),
    title: v.string(),
    action: v.string(),
    actor: v.string(),
    at: v.number(),
  }).index("by_at", ["at"]),

  /**
   * One row per Clerk user who has ever signed in. Authentication is Clerk's;
   * this table exists purely to carry authorization - the `role` field.
   *
   * `role` is deliberately optional rather than defaulting to "viewer": a user
   * with no row, and a user whose row has no role, are the same thing (no CMS
   * access), and that keeps granting access an explicit act by an admin rather
   * than something that happens by signing up.
   */
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    role: v.optional(roleValidator),
    // Audit trail for role changes, so a privilege grant is never anonymous.
    roleGrantedBy: v.optional(v.string()),
    roleGrantedAt: v.optional(v.number()),
  })
    // Every authenticated request looks a user up by Clerk subject, so this
    // index is on the hot path for the whole CMS.
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_role", ["role"]),

  /* ------------------------------------------------------------------------ */
  /* User and business accounts - Phase 6                                      */
  /* ------------------------------------------------------------------------ */

  /**
   * Saved articles, laws, cases, videos and podcasts (spec section 42).
   *
   * `ownerId` is always the Clerk subject of the person who saved it, even for
   * an organization bookmark - so a shared resource still records who shared
   * it. `orgId` present means the item is shared with that organization;
   * absent means it is private to the person.
   *
   * The card fields are denormalised on purpose. A bookmark must keep working
   * when the underlying content is unpublished or renamed, and resolving every
   * saved item against the content repository on every render would make the
   * account page cost grow with the length of the library.
   */
  bookmarks: defineTable({
    ownerId: v.string(),
    orgId: v.optional(v.id("organizations")),
    ...savedItem,
    /** The reader's own note, if they added one. */
    note: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    // Saving is idempotent: the same route is looked up before it is inserted.
    .index("by_owner_href", ["ownerId", "href"])
    .index("by_org", ["orgId"]),

  /**
   * Followed topics, feeding law-change alerts (spec sections 23 and 62).
   * `topic` is an `AlertTopic` slug from the content layer.
   */
  topicFollows: defineTable({
    ownerId: v.string(),
    orgId: v.optional(v.id("organizations")),
    topic: v.string(),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_topic", ["ownerId", "topic"])
    .index("by_org", ["orgId"]),

  /**
   * Notification preferences (spec section 62: "users must control
   * notification preferences").
   *
   * There is no row until a user changes something. Absence means the
   * defaults, and the defaults are defined once in convex/model/preferences.ts
   * rather than being written into every new row.
   */
  notificationPrefs: defineTable({
    ownerId: v.string(),
    /** Delivery channels the user has turned on. */
    channels: v.object({
      inApp: v.boolean(),
      email: v.boolean(),
    }),
    /** Per-category switches, keyed by notification category. */
    categories: v.object({
      breakingUpdates: v.boolean(),
      regulatoryAlerts: v.boolean(),
      followedTopics: v.boolean(),
      newVideo: v.boolean(),
      newPodcast: v.boolean(),
      liveReminders: v.boolean(),
      businessAlerts: v.boolean(),
      newsletter: v.boolean(),
    }),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  /**
   * Which notifications a person has already seen.
   *
   * The feed itself is derived on the server from followed topics and
   * published content, so there is no table of notification rows to go stale.
   * Only the read state needs storing, and it is stored by the notification's
   * stable id.
   */
  notificationReads: defineTable({
    ownerId: v.string(),
    notificationId: v.string(),
    readAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_notification", ["ownerId", "notificationId"]),

  /**
   * Quiz history and learning progress (spec section 42). One row per attempt,
   * never overwritten - a later worse score does not erase an earlier one.
   */
  quizAttempts: defineTable({
    ownerId: v.string(),
    quizSlug: v.string(),
    quizTitle: v.string(),
    score: v.number(),
    total: v.number(),
    completedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_quiz", ["ownerId", "quizSlug"]),

  /**
   * Organization accounts (spec section 43).
   *
   * `plan` records which of the architected tiers the organization is on. No
   * payment is taken anywhere in this codebase - spec section 44 says not to
   * implement payments unless explicitly required - so the field describes
   * capability, not billing.
   */
  organizations: defineTable({
    name: v.string(),
    /** URL-safe identity, unique. Checked on insert. */
    slug: v.string(),
    industry: v.string(),
    size: v.string(),
    plan: v.union(
      v.literal("free"),
      v.literal("business"),
      v.literal("enterprise")
    ),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_creator", ["createdBy"]),

  /**
   * Team members. Membership is what grants access to an organization's saved
   * resources and followed topics - there is no public read path to either,
   * which is what spec section 43 means by not exposing private organization
   * data.
   */
  orgMembers: defineTable({
    orgId: v.id("organizations"),
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    role: orgRoleValidator,
    addedBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["clerkUserId"])
    .index("by_org_user", ["orgId", "clerkUserId"]),
});
