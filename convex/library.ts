import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import {
  defaultPreferences,
  optionalOwner,
  requireOwner,
  type NotificationPreferences,
} from "./model/preferences";

/**
 * The reader's own library (Phase 6, spec sections 42 and 62): saved items,
 * followed topics and notification preferences.
 *
 * Every function keys on the caller's Clerk subject, taken from the request
 * token. No function accepts an owner id as an argument, so there is no shape
 * of call that reads or writes somebody else's library.
 */

const savedItemArgs = {
  kind: v.string(),
  title: v.string(),
  summary: v.string(),
  group: v.string(),
  href: v.string(),
};

/* -------------------------------------------------------------------------- */
/* Bookmarks                                                                   */
/* -------------------------------------------------------------------------- */

function toBookmark(row: Doc<"bookmarks">) {
  return {
    id: row._id,
    kind: row.kind,
    title: row.title,
    summary: row.summary,
    group: row.group,
    href: row.href,
    note: row.note ?? null,
    createdAt: row.createdAt,
  };
}

/** Everything the signed-in reader has saved, newest first. */
export const listBookmarks = query({
  args: {},
  handler: async (ctx) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return [];

    const rows = await ctx.db
      .query("bookmarks")
      .withIndex("by_owner", (q) => q.eq("ownerId", owner))
      .collect();

    return rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(toBookmark);
  },
});

/**
 * Whether one route is already saved. Used by the save button, which renders
 * for signed-out readers too - hence `false` rather than an error.
 */
export const isSaved = query({
  args: { href: v.string() },
  handler: async (ctx, { href }) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return false;

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_owner_href", (q) =>
        q.eq("ownerId", owner).eq("href", href)
      )
      .unique();

    return existing !== null;
  },
});

/**
 * Saves an item, or removes it if it is already saved.
 *
 * One mutation rather than a save/unsave pair, because the button is a toggle
 * and splitting it would let the two states disagree after a double click.
 * Returns the resulting state so the client does not have to guess.
 */
export const toggleBookmark = mutation({
  args: savedItemArgs,
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx);

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_owner_href", (q) =>
        q.eq("ownerId", owner).eq("href", args.href)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { saved: false };
    }

    await ctx.db.insert("bookmarks", {
      ownerId: owner,
      kind: args.kind,
      title: args.title,
      summary: args.summary,
      group: args.group,
      href: args.href,
      createdAt: Date.now(),
    });
    return { saved: true };
  },
});

export const removeBookmark = mutation({
  args: { id: v.id("bookmarks") },
  handler: async (ctx, { id }) => {
    const owner = await requireOwner(ctx);
    const row = await ctx.db.get(id);
    // Silently succeed on an already-deleted row; refuse someone else's.
    if (!row) return;
    if (row.ownerId !== owner) throw new Error("Not your bookmark");
    await ctx.db.delete(id);
  },
});

/** Attaches or clears the reader's own note on a saved item. */
export const setBookmarkNote = mutation({
  args: { id: v.id("bookmarks"), note: v.string() },
  handler: async (ctx, { id, note }) => {
    const owner = await requireOwner(ctx);
    const row = await ctx.db.get(id);
    if (!row) throw new Error("No such bookmark");
    if (row.ownerId !== owner) throw new Error("Not your bookmark");

    const trimmed = note.trim();
    await ctx.db.patch(id, { note: trimmed.length > 0 ? trimmed : undefined });
  },
});

/* -------------------------------------------------------------------------- */
/* Followed topics                                                             */
/* -------------------------------------------------------------------------- */

/** The topic slugs the signed-in reader follows. */
export const listFollowedTopics = query({
  args: {},
  handler: async (ctx) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return [];

    const rows = await ctx.db
      .query("topicFollows")
      .withIndex("by_owner", (q) => q.eq("ownerId", owner))
      .collect();

    return rows.map((row) => row.topic);
  },
});

export const toggleTopicFollow = mutation({
  args: { topic: v.string() },
  handler: async (ctx, { topic }) => {
    const owner = await requireOwner(ctx);

    const existing = await ctx.db
      .query("topicFollows")
      .withIndex("by_owner_topic", (q) =>
        q.eq("ownerId", owner).eq("topic", topic)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { following: false };
    }

    await ctx.db.insert("topicFollows", {
      ownerId: owner,
      topic,
      createdAt: Date.now(),
    });
    return { following: true };
  },
});

/* -------------------------------------------------------------------------- */
/* Notification preferences and read state                                     */
/* -------------------------------------------------------------------------- */

/**
 * The reader's preferences, falling back to the defaults where no row exists
 * or where a category was added after the row was written. Merging rather than
 * replacing means shipping a new notification category never silently turns
 * itself on for people who had already saved preferences - it arrives at its
 * declared default.
 */
export const getNotificationPreferences = query({
  args: {},
  handler: async (ctx): Promise<NotificationPreferences> => {
    const owner = await optionalOwner(ctx);
    if (!owner) return defaultPreferences;

    const row = await ctx.db
      .query("notificationPrefs")
      .withIndex("by_owner", (q) => q.eq("ownerId", owner))
      .unique();

    if (!row) return defaultPreferences;

    return {
      channels: { ...defaultPreferences.channels, ...row.channels },
      categories: { ...defaultPreferences.categories, ...row.categories },
    };
  },
});

export const setNotificationPreferences = mutation({
  args: {
    channels: v.object({ inApp: v.boolean(), email: v.boolean() }),
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
  },
  handler: async (ctx, { channels, categories }) => {
    const owner = await requireOwner(ctx);

    const existing = await ctx.db
      .query("notificationPrefs")
      .withIndex("by_owner", (q) => q.eq("ownerId", owner))
      .unique();

    const patch = { channels, categories, updatedAt: Date.now() };

    if (existing) await ctx.db.patch(existing._id, patch);
    else await ctx.db.insert("notificationPrefs", { ownerId: owner, ...patch });
  },
});

/** Notification ids the reader has already seen. */
export const listReadNotifications = query({
  args: {},
  handler: async (ctx) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return [];

    const rows = await ctx.db
      .query("notificationReads")
      .withIndex("by_owner", (q) => q.eq("ownerId", owner))
      .collect();

    return rows.map((row) => row.notificationId);
  },
});

/**
 * Marks notifications read. Takes a list rather than one id so that "mark all
 * read" is a single round trip, and skips ids already recorded so the table
 * cannot accumulate duplicates.
 */
export const markNotificationsRead = mutation({
  args: { notificationIds: v.array(v.string()) },
  handler: async (ctx, { notificationIds }) => {
    const owner = await requireOwner(ctx);

    for (const notificationId of notificationIds) {
      const existing = await ctx.db
        .query("notificationReads")
        .withIndex("by_owner_notification", (q) =>
          q.eq("ownerId", owner).eq("notificationId", notificationId)
        )
        .unique();
      if (existing) continue;

      await ctx.db.insert("notificationReads", {
        ownerId: owner,
        notificationId,
        readAt: Date.now(),
      });
    }
  },
});
