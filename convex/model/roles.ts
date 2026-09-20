import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export type Role = "viewer" | "author" | "editor" | "admin";

/** Role hierarchy, lowest to highest. */
const rank: Record<Role, number> = {
  viewer: 0,
  author: 1,
  editor: 2,
  admin: 3,
};

export function satisfies(role: Role | undefined, minimum: Role): boolean {
  if (!role) return false;
  return rank[role] >= rank[minimum];
}

/**
 * The signed-in user's row, or null when the request carries no valid Clerk
 * token or the user has never been stored. Never throws - callers that require
 * a user use `requireRole` instead.
 */
export async function currentUser(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_clerk_user_id", (q) =>
      q.eq("clerkUserId", identity.subject)
    )
    .unique();
}

/**
 * Guard for every privileged query, mutation and action. Throws rather than
 * returning null so that a forgotten check fails closed: an un-guarded call
 * path surfaces as an error, not as silent access.
 *
 * This runs on the Convex server, where the caller cannot influence it. The
 * checks in the Next.js layer are for redirects and rendering only - this is
 * the one that actually protects data.
 */
export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  minimum: Role
): Promise<Doc<"users">> {
  const user = await currentUser(ctx);
  if (!user) throw new Error("Not authenticated");
  if (!satisfies(user.role, minimum)) {
    throw new Error(`Requires the ${minimum} role or higher`);
  }
  return user;
}
