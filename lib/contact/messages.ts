/**
 * The contact inbox.
 *
 * Mirrors the Ask a Question queue in `lib/legal-help/questions.ts`: the store
 * is process-local and hangs off `globalThis` so hot reload does not lose it.
 * Messages do not survive a restart, and the form says so rather than implying
 * a durability that does not exist yet. When Convex lands this becomes a table
 * and only the functions below change.
 *
 * Nothing here is ever publicly readable, and nothing here is ever published.
 */

export interface ContactMessage {
  /** Short reference the sender can quote. */
  reference: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  receivedAt: string;
}

const globalStore = globalThis as unknown as {
  __lawContactInbox?: ContactMessage[];
};

function inbox(): ContactMessage[] {
  if (!globalStore.__lawContactInbox) globalStore.__lawContactInbox = [];
  return globalStore.__lawContactInbox;
}

/** Reference the sender can quote. Not a secret, and not an identifier for them. */
function makeReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const salt = Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0");
  return `LC-${stamp}${salt}`;
}

export function enqueueMessage(input: {
  name: string;
  email: string;
  reason: string;
  message: string;
}): ContactMessage {
  const entry: ContactMessage = {
    reference: makeReference(),
    name: input.name,
    email: input.email,
    reason: input.reason,
    message: input.message,
    receivedAt: new Date().toISOString(),
  };
  inbox().unshift(entry);
  return entry;
}

/** Everything waiting to be answered. Read by the admin, never by a public page. */
export function pendingMessages(): ContactMessage[] {
  return [...inbox()];
}

/** How many are waiting, for the admin dashboard. */
export function pendingMessageCount(): number {
  return inbox().length;
}
