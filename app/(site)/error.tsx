"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

/**
 * Error boundary for the public site. Never surfaces stack traces or internal
 * detail to the reader.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Client-side reporting hook. Deliberately does not log message contents.
    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="rail flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-eyebrow text-brand-ink">Something went wrong</p>
      <h1 className="text-h1 mt-4 max-w-xl text-foreground">
        We could not load this page
      </h1>
      <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        The problem is on our side, not yours. Try again, or head back to the
        library while we sort it out.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCcw className="size-4" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairline bg-card px-6 text-[0.92rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
        >
          Back to home
          <ArrowRight className="size-4" />
        </Link>
      </div>
      {error.digest && (
        <p className="mt-6 text-[0.75rem] text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
