import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldOff } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { getEditorSession } from "@/lib/cms/auth";

export const metadata: Metadata = {
  title: "No access",
  robots: { index: false, follow: false },
};

/** Reflects the signed-in identity, so it can never be prerendered. */
export const dynamic = "force-dynamic";

/**
 * Where a signed-in user without a CMS role lands. Signing in is not the same
 * as being an editor, and this page exists to say so plainly rather than
 * showing a 404 that reads like a broken link, or bouncing the user back
 * through a sign-in flow that would return them here.
 */
export default async function NoAccessPage() {
  const session = await getEditorSession();
  const email = session.status === "no-role" ? session.email : null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center">
      <div
        aria-hidden
        className="bg-ledger mask-fade-b pointer-events-none absolute inset-x-0 top-0 h-96 opacity-40"
      />

      <ShieldOff className="relative size-8 text-brand-ink" />
      <p className="text-eyebrow relative mt-5 text-brand-ink">
        Access restricted
      </p>
      <h1 className="text-h1 relative mt-4 max-w-2xl text-foreground">
        You do not have access to the CMS
      </h1>
      <p className="relative mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground">
        Your account is signed in{email ? ` as ${email}` : ""}, but it has not
        been given an editorial role. Access to Law Awareness TV&rsquo;s
        editorial tools is granted by an administrator, one account at a time.
      </p>
      <p className="relative mt-3 max-w-md text-[0.85rem] leading-relaxed text-muted-foreground">
        If you believe this is a mistake, ask an administrator to grant your
        account a role, then reload this page.
      </p>

      <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 text-[0.92rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to home
          <ArrowRight className="size-4" />
        </Link>
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="inline-flex h-12 cursor-pointer items-center rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-bold text-foreground transition-colors hover:border-primary/45"
          >
            Sign out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
