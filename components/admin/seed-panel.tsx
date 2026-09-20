"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Check, CircleAlert, Database, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import { seedContent, type SeedResult } from "@/lib/cms/seed-action";

/**
 * Loads the content authored in lib/content/* into Convex.
 *
 * Shown on the dashboard only when it is actually needed: either the database
 * is empty, or the CMS has no database behind it at all. Once a deployment has
 * content, an "import everything" button sitting permanently on the dashboard
 * is an invitation to an accident.
 */
export function SeedPanel({
  persistent,
  seeded,
  canSeed,
}: {
  /** Whether a Convex deployment is configured at all. */
  persistent: boolean;
  /** Whether that deployment already holds content. */
  seeded: boolean;
  canSeed: boolean;
}) {
  const [result, formAction] = useActionState<SeedResult | null, FormData>(
    seedContent,
    null
  );

  if (!persistent) {
    return (
      <section className="rounded-2xl border border-destructive/35 bg-destructive/5 p-5">
        <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-foreground">
          <TriangleAlert className="size-4 text-destructive" />
          Edits will not be saved
        </h2>
        <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
          No Convex deployment is configured for this environment, so the CMS is
          running against an in-memory copy of the content files. You can look
          around, but anything you change is lost when the server restarts, and
          nothing reaches the public site. Set{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[0.78rem]">
            NEXT_PUBLIC_CONVEX_URL
          </code>{" "}
          to connect it.
        </p>
      </section>
    );
  }

  if (seeded) return null;

  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/8 p-5">
      <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-foreground">
        <Database className="size-4 text-brand-ink" />
        This deployment has no content yet
      </h2>
      <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">
        Import the starting content from the repository. Existing records are
        never touched, so this is safe to run again later to pick up content
        types added since.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-center gap-4">
        <SeedButton disabled={!canSeed} />
        {result && (
          <p
            role="status"
            className={cn(
              "flex items-center gap-2 text-[0.83rem] font-semibold",
              result.ok ? "text-brand-ink" : "text-destructive"
            )}
          >
            {result.ok ? (
              <Check className="size-4" />
            ) : (
              <CircleAlert className="size-4" />
            )}
            {result.message}
          </p>
        )}
        {!canSeed && (
          <p className="text-[0.83rem] text-muted-foreground">
            Importing content requires the admin role.
          </p>
        )}
      </form>
    </section>
  );
}

function SeedButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Importing…" : "Import starting content"}
    </button>
  );
}
