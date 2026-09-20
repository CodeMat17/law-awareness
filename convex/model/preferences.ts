import type { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Notification preferences, and the identity helper every account function
 * uses (Phase 6).
 */

export interface NotificationChannels {
  inApp: boolean;
  email: boolean;
}

export interface NotificationCategories {
  breakingUpdates: boolean;
  regulatoryAlerts: boolean;
  followedTopics: boolean;
  newVideo: boolean;
  newPodcast: boolean;
  liveReminders: boolean;
  businessAlerts: boolean;
  newsletter: boolean;
}

export interface NotificationPreferences {
  channels: NotificationChannels;
  categories: NotificationCategories;
}

/**
 * What a user gets before they have chosen anything.
 *
 * In-app is on and email is off. Email is a channel the user has to ask for:
 * signing in to read about the law is not consent to be mailed, and a platform
 * that opts people into mail by default trains them to distrust it.
 *
 * Newsletter is off for the same reason. Everything else is an in-app signal
 * about content the user has already chosen to follow.
 */
export const defaultPreferences: NotificationPreferences = {
  channels: { inApp: true, email: false },
  categories: {
    breakingUpdates: true,
    regulatoryAlerts: true,
    followedTopics: true,
    newVideo: true,
    newPodcast: true,
    liveReminders: true,
    businessAlerts: true,
    newsletter: false,
  },
};

/**
 * The Clerk subject of the caller.
 *
 * Every account function keys its rows on this value and never accepts an
 * owner id as an argument, so one signed-in user cannot read or write another
 * user's saved items by passing someone else's id.
 */
export async function requireOwner(
  ctx: QueryCtx | MutationCtx
): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");
  return identity.subject;
}

/** The caller's subject, or null when the request carries no session. */
export async function optionalOwner(
  ctx: QueryCtx | MutationCtx
): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject ?? null;
}
