import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { orgRoleValidator } from "./schema";
import { optionalOwner, requireOwner } from "./model/preferences";
import { assertMember, membershipOf, slugify } from "./model/organizations";

/**
 * Organization accounts (Phase 6, spec section 43).
 *
 * There is no public read path anywhere in this module. Every query resolves
 * the caller's membership first and returns nothing to a non-member, so
 * organization data - profile, team, shared resources, followed topics - is
 * never exposed publicly, which is what the spec requires.
 *
 * `plan` describes capability, not billing. Spec section 44 says not to
 * implement payments unless explicitly required, and nothing here takes one.
 */

/** The organizations the signed-in user belongs to, with their own role. */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return [];

    const memberships = await ctx.db
      .query("orgMembers")
      .withIndex("by_user", (q) => q.eq("clerkUserId", owner))
      .collect();

    const results = [];
    for (const membership of memberships) {
      const org = await ctx.db.get(membership.orgId);
      if (!org) continue;
      results.push({
        id: org._id,
        name: org.name,
        slug: org.slug,
        industry: org.industry,
        size: org.size,
        plan: org.plan,
        role: membership.role,
        createdAt: org.createdAt,
      });
    }
    return results.sort((a, b) => a.name.localeCompare(b.name));
  },
});

/** One organization, or null when the caller is not a member of it. */
export const get = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return null;

    const membership = await membershipOf(ctx, orgId, owner);
    if (!membership) return null;

    const org = await ctx.db.get(orgId);
    if (!org) return null;

    return {
      id: org._id,
      name: org.name,
      slug: org.slug,
      industry: org.industry,
      size: org.size,
      plan: org.plan,
      role: membership.role,
      createdAt: org.createdAt,
    };
  },
});

/** The team. Members only - a non-member gets an empty list, not an error. */
export const listMembers = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, { orgId }) => {
    const owner = await optionalOwner(ctx);
    if (!owner) return [];
    if (!(await membershipOf(ctx, orgId, owner))) return [];

    const members = await ctx.db
      .query("orgMembers")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .collect();

    return members
      .map((member) => ({
        id: member._id,
        clerkUserId: member.clerkUserId,
        name: member.name,
        email: member.email,
        role: member.role,
        createdAt: member.createdAt,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

/**
 * Creates an organization and makes the caller its owner in the same
 * mutation, so an organization can never exist with nobody able to administer
 * it.
 */
export const create = mutation({
  args: {
    name: v.string(),
    industry: v.string(),
    size: v.string(),
    plan: v.union(
      v.literal("free"),
      v.literal("business"),
      v.literal("enterprise")
    ),
  },
  handler: async (ctx, args) => {
    const owner = await requireOwner(ctx);
    const identity = await ctx.auth.getUserIdentity();

    const name = args.name.trim();
    if (name.length < 2) throw new Error("Give the organization a name");

    const base = slugify(name);
    if (!base) throw new Error("That name has no usable characters");

    // Resolve a collision by suffixing rather than failing: two real
    // organizations may legitimately share a name.
    let slug = base;
    let suffix = 2;
    while (
      await ctx.db
        .query("organizations")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      slug = `${base}-${suffix++}`;
    }

    const orgId = await ctx.db.insert("organizations", {
      name,
      slug,
      industry: args.industry,
      size: args.size,
      plan: args.plan,
      createdBy: owner,
      createdAt: Date.now(),
    });

    await ctx.db.insert("orgMembers", {
      orgId,
      clerkUserId: owner,
      email: identity?.email ?? "",
      name: identity?.name ?? identity?.email ?? "Owner",
      role: "owner",
      addedBy: owner,
      createdAt: Date.now(),
    });

    return orgId;
  },
});

/** Profile edits. Admins and owners. */
export const updateProfile = mutation({
  args: {
    orgId: v.id("organizations"),
    name: v.string(),
    industry: v.string(),
    size: v.string(),
    plan: v.union(
      v.literal("free"),
      v.literal("business"),
      v.literal("enterprise")
    ),
  },
  handler: async (ctx, { orgId, ...patch }) => {
    const owner = await requireOwner(ctx);
    await assertMember(ctx, orgId, owner, "admin");

    const name = patch.name.trim();
    if (name.length < 2) throw new Error("Give the organization a name");

    await ctx.db.patch(orgId, { ...patch, name });
  },
});

/**
 * Records a person as a member.
 *
 * This is a record of membership, not an invitation system: nothing here sends
 * mail or issues a token. The row is keyed on the Clerk user id, so it is
 * added once that person has an account and their id is known.
 */
export const addMember = mutation({
  args: {
    orgId: v.id("organizations"),
    clerkUserId: v.string(),
    name: v.string(),
    email: v.string(),
    role: orgRoleValidator,
  },
  handler: async (ctx, { orgId, clerkUserId, name, email, role }) => {
    const actor = await requireOwner(ctx);
    await assertMember(ctx, orgId, actor, "admin");

    // Only an owner can create another owner, so an admin cannot promote
    // themselves sideways into the role that could remove them.
    if (role === "owner") await assertMember(ctx, orgId, actor, "owner");

    const existing = await membershipOf(ctx, orgId, clerkUserId);
    if (existing) throw new Error("Already a member");

    await ctx.db.insert("orgMembers", {
      orgId,
      clerkUserId,
      name,
      email,
      role,
      addedBy: actor,
      createdAt: Date.now(),
    });
  },
});

/**
 * Changes or removes a membership. Refuses the two moves that would leave an
 * organization unadministrable: removing the last owner, and demoting one.
 */
export const setMemberRole = mutation({
  args: {
    memberId: v.id("orgMembers"),
    role: v.union(orgRoleValidator, v.null()),
  },
  handler: async (ctx, { memberId, role }) => {
    const actor = await requireOwner(ctx);

    const target = await ctx.db.get(memberId);
    if (!target) throw new Error("No such member");

    await assertMember(ctx, target.orgId, actor, "admin");
    if (role === "owner" || target.role === "owner") {
      await assertMember(ctx, target.orgId, actor, "owner");
    }

    if (target.role === "owner" && role !== "owner") {
      const members = await ctx.db
        .query("orgMembers")
        .withIndex("by_org", (q) => q.eq("orgId", target.orgId))
        .collect();
      const owners = members.filter((member) => member.role === "owner");
      if (owners.length <= 1) {
        throw new Error("The last owner cannot be removed or demoted");
      }
    }

    if (role === null) await ctx.db.delete(memberId);
    else await ctx.db.patch(memberId, { role });
  },
});
