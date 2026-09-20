import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { roleValidator } from "./schema";
import { currentUser, requireRole, satisfies, type Role } from "./model/roles";

/**
 * Emails that are granted `admin` the first time they sign in, read from the
 * Convex deployment's own environment (`npx convex env set
 * CMS_BOOTSTRAP_ADMIN_EMAILS "you@example.com"`). Without this there is no way
 * to create the first admin, because granting a role already requires one.
 *
 * It applies only at row-creation time. Removing an address here does not
 * revoke anything, and re-adding one does not re-grant it to an existing user
 * - so it cannot be used to quietly escalate an account that an admin has
 * already demoted.
 */
function bootstrapRoleFor(email: string): Role | undefined {
  const configured = process.env.CMS_BOOTSTRAP_ADMIN_EMAILS;
  if (!configured) return undefined;

  const allowed = configured
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.toLowerCase()) ? "admin" : undefined;
}

/**
 * Upserts the signed-in Clerk user into `users`. Called by the client on every
 * sign-in (see components/convex-client-provider.tsx), which keeps name, email
 * and avatar fresh without needing a webhook endpoint.
 *
 * It never writes `role`, except for the bootstrap case on first insert -
 * signing in must not be able to change your own privileges.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const email = identity.email ?? "";
    // Clerk populates `name` only when the instance collects one, so fall
    // back through the parts, then the email, before giving up.
    const fullName = [identity.givenName, identity.familyName]
      .filter(Boolean)
      .join(" ");
    const name = identity.name || fullName || email || "Unnamed user";

    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", identity.subject)
      )
      .unique();

    if (existing) {
      // Profile fields only. `role` is untouched.
      if (
        existing.email !== email ||
        existing.name !== name ||
        existing.imageUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(existing._id, {
          email,
          name,
          imageUrl: identity.pictureUrl,
        });
      }
      return existing._id;
    }

    const bootstrap = bootstrapRoleFor(email);

    return await ctx.db.insert("users", {
      clerkUserId: identity.subject,
      email,
      name,
      imageUrl: identity.pictureUrl,
      role: bootstrap,
      roleGrantedBy: bootstrap ? "bootstrap" : undefined,
      roleGrantedAt: bootstrap ? Date.now() : undefined,
    });
  },
});

/**
 * The signed-in user, or null. Returns null rather than throwing so that the
 * unauthenticated case is an ordinary render, not an error boundary.
 */
export const current = query({
  args: {},
  handler: async (ctx) => {
    const user = await currentUser(ctx);
    if (!user) return null;

    return {
      id: user.clerkUserId,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role ?? null,
    };
  },
});

/** Everyone who has signed in, for the admin's user-management screen. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, "admin");

    const users = await ctx.db.query("users").collect();
    return users.map((user) => ({
      id: user._id,
      clerkUserId: user.clerkUserId,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role ?? null,
      createdAt: user._creationTime,
    }));
  },
});

/**
 * Grants, changes or revokes a role. Admin-only, and deliberately refuses two
 * things that would otherwise be easy ways to lock the CMS out of itself:
 * demoting yourself, and removing the last remaining admin.
 */
export const setRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(roleValidator, v.null()),
  },
  handler: async (ctx, { userId, role }) => {
    const actor = await requireRole(ctx, "admin");

    const target = await ctx.db.get(userId);
    if (!target) throw new Error("No such user");

    if (target._id === actor._id && !satisfies(role ?? undefined, "admin")) {
      throw new Error("You cannot remove your own admin role");
    }

    if (target.role === "admin" && role !== "admin") {
      const admins = await ctx.db
        .query("users")
        .withIndex("by_role", (q) => q.eq("role", "admin"))
        .collect();
      if (admins.length <= 1) {
        throw new Error("The last admin cannot be demoted");
      }
    }

    await ctx.db.patch(userId, {
      role: role ?? undefined,
      roleGrantedBy: role ? actor.clerkUserId : undefined,
      roleGrantedAt: role ? Date.now() : undefined,
    });
  },
});
