"use client";

import { useEffect, type ReactNode } from "react";
import { ConvexReactClient, useConvexAuth, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";

/**
 * One client for the whole app. Created at module scope rather than in the
 * component so that a re-render never tears down the websocket.
 */
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Mirrors the Clerk identity into Convex's `users` table once per sign-in.
 *
 * This is the alternative to a Clerk webhook: it needs no public endpoint and
 * no signing secret, and it runs with the user's own token, so it can only
 * ever write that user's own row. The cost is that a user appears in Convex on
 * first sign-in rather than at sign-up - which is exactly when we first need
 * them, since a role is required to reach the CMS anyway.
 */
/**
 * Once per browsing session, not once per page load.
 *
 * The mirror is a write, and a write that runs on every full page load of a
 * signed-in reader is the most frequently called function in the application
 * for no benefit - the second call in a session almost always patches nothing.
 * The trade is that a name or avatar changed in Clerk mid-session lands on the
 * reader's next session rather than their next navigation, which is the right
 * side of the bargain for data that is only ever shown back to them.
 *
 * `sessionStorage` can throw (private modes, blocked site data), so a failure
 * to read or write the marker falls back to storing - the mutation is
 * idempotent, and mirroring twice is better than never mirroring at all.
 */
const STORED_KEY = "law-aware:user-mirrored";

function alreadyMirrored(userId: string): boolean {
  try {
    return window.sessionStorage.getItem(STORED_KEY) === userId;
  } catch {
    return false;
  }
}

function markMirrored(userId: string): void {
  try {
    window.sessionStorage.setItem(STORED_KEY, userId);
  } catch {
    // Nothing to do: the next load mirrors again, which is harmless.
  }
}

function StoreUser() {
  const { isAuthenticated } = useConvexAuth();
  const { userId } = useAuth();
  const store = useMutation(api.users.store);

  useEffect(() => {
    // Keyed by the Clerk subject, so signing out and in as somebody else on
    // the same tab still mirrors the new identity.
    if (!isAuthenticated || !userId || alreadyMirrored(userId)) return;
    void store({}).then(
      () => markMirrored(userId),
      () => {}
    );
  }, [isAuthenticated, userId, store]);

  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <StoreUser />
      {children}
    </ConvexProviderWithClerk>
  );
}
