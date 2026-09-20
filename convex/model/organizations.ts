import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";

export type OrgRole = "owner" | "admin" | "member";

/** Membership hierarchy, lowest to highest. */
const rank: Record<OrgRole, number> = {
  member: 0,
  admin: 1,
  owner: 2,
};

export function satisfiesOrgRole(role: OrgRole, minimum: OrgRole): boolean {
  return rank[role] >= rank[minimum];
}

/** A user's membership row for one organization, or null. */
export async function membershipOf(
  ctx: QueryCtx | MutationCtx,
  orgId: Id<"organizations">,
  clerkUserId: string
): Promise<Doc<"orgMembers"> | null> {
  return await ctx.db
    .query("orgMembers")
    .withIndex("by_org_user", (q) =>
      q.eq("orgId", orgId).eq("clerkUserId", clerkUserId)
    )
    .unique();
}

/**
 * Guard for every organization query and mutation.
 *
 * Throws rather than returning null, so a forgotten check fails closed. This
 * runs on the Convex server, where the caller cannot influence it - the checks
 * in the Next.js layer decide what to render, this one decides what may be
 * read and written.
 */
export async function assertMember(
  ctx: QueryCtx | MutationCtx,
  orgId: Id<"organizations">,
  clerkUserId: string,
  minimum: OrgRole = "member"
): Promise<Doc<"orgMembers">> {
  const member = await membershipOf(ctx, orgId, clerkUserId);
  if (!member) throw new Error("Not a member of this organization");
  if (!satisfiesOrgRole(member.role, minimum)) {
    throw new Error(`Requires the ${minimum} role in this organization`);
  }
  return member;
}

/**
 * URL-safe identity for an organization name. Collisions are resolved by the
 * caller, which appends a discriminator - this function only normalises.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
