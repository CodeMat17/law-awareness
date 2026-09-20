"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { cn } from "cn";
import { api } from "@/convex/_generated/api";

export interface SaveTarget {
  /** Content kind, e.g. "law", "case", "media". */
  kind: string;
  title: string;
  summary: string;
  /** Section label shown on the saved card, e.g. "Case law · Supreme Court". */
  group: string;
  /** Canonical route. This is the identity of the saved item. */
  href: string;
}

/**
 * The save/bookmark interaction (spec sections 42 and 67).
 *
 * Rendered on content pages, which are server components — this is the only
 * part of them that ships as client JS, and it is deliberately small.
 *
 * A signed-out reader is not shown a button that does nothing. They are shown
 * where saving lives and offered the sign-in, which is the honest version of
 * the same affordance.
 */
export function SaveButton({
  target,
  className,
}: {
  target: SaveTarget;
  className?: string;
}) {
  return (
    <>
      <Authenticated>
        <SaveToggle target={target} className={className} />
      </Authenticated>
      <Unauthenticated>
        <SignedOutSave className={className} />
      </Unauthenticated>
    </>
  );
}

const base =
  "inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-4 text-[0.86rem] font-extrabold transition-colors";

function SaveToggle({
  target,
  className,
}: {
  target: SaveTarget;
  className?: string;
}) {
  const saved = useQuery(api.library.isSaved, { href: target.href });
  const toggle = useMutation(api.library.toggleBookmark);
  const [pending, setPending] = useState(false);

  // `undefined` is the first-load state. Rendering "Save" before the answer
  // arrives would flash the wrong label at anyone who has already saved it.
  const loading = saved === undefined;

  return (
    <button
      type="button"
      disabled={loading || pending}
      aria-pressed={saved === true}
      onClick={async () => {
        setPending(true);
        try {
          await toggle(target);
        } finally {
          setPending(false);
        }
      }}
      className={cn(
        base,
        saved
          ? "border-primary/45 bg-primary/10 text-brand-ink"
          : "text-foreground hover:border-primary/45",
        (loading || pending) && "opacity-70",
        className
      )}
    >
      {pending || loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : saved ? (
        <BookmarkCheck className="size-4" />
      ) : (
        <Bookmark className="size-4" />
      )}
      {saved ? "Saved" : "Save"}
    </button>
  );
}

function SignedOutSave({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
      className={cn(base, "text-foreground hover:border-primary/45", className)}
    >
      <Bookmark className="size-4" />
      Sign in to save
    </Link>
  );
}
