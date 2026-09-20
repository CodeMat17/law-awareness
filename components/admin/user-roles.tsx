"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const ROLES = [
  {
    value: "",
    label: "No access",
    help: "Signed in, but cannot open the CMS.",
  },
  { value: "viewer", label: "Viewer", help: "Can read everything in the CMS." },
  { value: "author", label: "Author", help: "Can create and edit drafts." },
  {
    value: "editor",
    label: "Editor",
    help: "Can review and publish.",
  },
  {
    value: "admin",
    label: "Admin",
    help: "Full access, including roles and deletion.",
  },
] as const;

/**
 * Role administration. The mutation is admin-guarded on the Convex side, so
 * this component is a convenience, not a control - a non-admin who reached it
 * would still be refused by the server.
 */
type CmsRole = "viewer" | "author" | "editor" | "admin";

/** Mirrors the shape returned by the `users.list` query in convex/users.ts. */
interface ManagedUser {
  id: Id<"users">;
  clerkUserId: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: CmsRole | null;
  createdAt: number;
}

export function UserRoles({ currentUserId }: { currentUserId: string }) {
  const users = useQuery(api.users.list) as ManagedUser[] | undefined;
  const setRole = useMutation(api.users.setRole);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  if (users === undefined) {
    return (
      <p className="text-[0.9rem] text-muted-foreground">Loading accounts…</p>
    );
  }

  async function update(userId: Id<"users">, value: string) {
    setSaving(userId);
    setError(null);
    try {
      await setRole({
        userId,
        role: value === "" ? null : (value as CmsRole),
      });
    } catch (cause) {
      // Convex surfaces the guard messages from users.setRole - the last-admin
      // and self-demotion refusals are worth showing verbatim.
      setError(
        cause instanceof Error
          ? cause.message.replace(/^.*Uncaught Error:\s*/, "").split("\n")[0]
          : "Could not change that role."
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="mt-8">
      {error && (
        <p className="mb-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-[0.85rem] font-semibold text-foreground">
          {error}
        </p>
      )}

      {/* A list of cards rather than a table: two columns of account + role
          do not survive a phone, and the select needs room to be tappable. */}
      <ul className="overflow-hidden rounded-xl border border-hairline bg-card text-[0.88rem]">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex flex-col gap-3 border-b border-hairline p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <p className="font-bold break-words text-foreground">
                {user.name}
                {user.clerkUserId === currentUserId && (
                  <span className="ml-2 text-[0.72rem] font-extrabold tracking-wider text-brand-ink uppercase">
                    You
                  </span>
                )}
              </p>
              <p className="text-[0.8rem] break-all text-muted-foreground">
                {user.email}
              </p>
            </div>
            <div className="shrink-0">
              <Select
                value={user.role ?? ""}
                disabled={saving === user.id}
                onValueChange={(next) => void update(user.id, String(next ?? ""))}
                items={ROLES}
              >
                <SelectTrigger
                  aria-label={`Role for ${user.name}`}
                  className="h-11 w-full rounded-lg bg-surface text-[0.85rem] font-bold sm:w-40"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-6 grid gap-2 text-[0.82rem] text-muted-foreground sm:grid-cols-2">
        {ROLES.map((role) => (
          <div key={role.value}>
            <dt className="inline font-bold text-foreground">{role.label}:</dt>{" "}
            <dd className="inline">{role.help}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
