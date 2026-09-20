import { cache } from "react";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * Authentication and authorization seam for the CMS.
 *
 * The split is deliberate: Clerk answers "who is this?", Convex answers "what
 * may they do?". A Clerk session on its own grants nothing - the role is a row
 * in Convex that an admin has to write. That means a user signing up on the
 * public site can never reach the CMS by signing up alone.
 *
 * Everything below is for redirects and rendering. It is not the security
 * boundary: a determined client can call Convex directly, so the checks that
 * actually protect data are the `requireRole` guards inside the Convex
 * functions (convex/model/roles.ts), which run on Convex's servers.
 */

export type EditorRole = "viewer" | "author" | "editor" | "admin";

export interface Editor {
  id: string;
  name: string;
  email: string;
  role: EditorRole;
}

/** Role hierarchy, lowest to highest. Mirrors convex/model/roles.ts. */
const rank: Record<EditorRole, number> = {
  viewer: 0,
  author: 1,
  editor: 2,
  admin: 3,
};

/**
 * Why a request may not render the CMS, so callers can tell the two cases
 * apart: an anonymous visitor should be sent to sign in, while a signed-in
 * user without a role should be told they have no access rather than being
 * bounced through a sign-in flow that would not help them.
 */
export type EditorSession =
  | { status: "anonymous" }
  | { status: "no-role"; name: string; email: string }
  | { status: "authorised"; editor: Editor };

/**
 * Resolved once per request. Both the admin layout and the page beneath it ask
 * for the session, and `cache` collapses that into a single Convex round trip.
 */
export const getEditorSession = cache(async (): Promise<EditorSession> => {
  const { userId, getToken } = await auth();
  if (!userId) return { status: "anonymous" };

  // The token is minted from the Clerk JWT template named "convex", which is
  // what convex/auth.config.ts is configured to trust.
  const token = await getToken({ template: "convex" });
  if (!token) return { status: "anonymous" };

  const user = await fetchQuery(api.users.current, {}, { token });

  // Signed in, but the `users.store` mutation has not landed yet - treat it as
  // anonymous so the UI does not flash a misleading "no access" message on the
  // very first sign-in.
  if (!user) return { status: "anonymous" };

  if (!user.role) {
    return { status: "no-role", name: user.name, email: user.email };
  }

  return {
    status: "authorised",
    editor: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
});

export async function getCurrentEditor(): Promise<Editor | null> {
  const session = await getEditorSession();
  return session.status === "authorised" ? session.editor : null;
}

export function canPerform(editor: Editor | null, minimum: EditorRole): boolean {
  if (!editor) return false;
  return rank[editor.role] >= rank[minimum];
}

/**
 * Guard for server actions and admin pages. Throws rather than returning null
 * so a missed check fails closed.
 */
export async function requireRole(minimum: EditorRole): Promise<Editor> {
  const editor = await getCurrentEditor();
  if (!canPerform(editor, minimum) || !editor) {
    throw new Error("Not authorised");
  }
  return editor;
}

/** True when a real authentication provider is configured. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_CONVEX_URL
  );
}
