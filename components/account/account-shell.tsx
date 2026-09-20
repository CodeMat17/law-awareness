"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { ArrowRight, Loader2, Lock } from "lucide-react";

/**
 * Gate for everything in the account area.
 *
 * The account routes are not protected in the proxy: they are readable pages
 * that happen to be empty without a session, and the real protection is in
 * Convex, where every query keys on the caller's own subject. This component
 * decides what to render, not what may be read.
 *
 * `AuthLoading` is handled explicitly. Without it, a signed-in reader sees the
 * sign-in prompt for a beat on every load, which reads as being signed out.
 */
export function RequireAccount({
  children,
  title,
  body,
}: {
  children: React.ReactNode;
  title: string;
  body: string;
}) {
  const pathname = usePathname();

  return (
    <>
      <AuthLoading>
        <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-card p-8 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-[0.9rem] font-semibold">
            Checking your session…
          </span>
        </div>
      </AuthLoading>

      <Unauthenticated>
        <div className="rounded-2xl border border-hairline bg-card p-8 sm:p-10">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/15 text-brand-ink">
            <Lock className="size-[1.15rem]" strokeWidth={1.9} />
          </span>
          <h2 className="text-h3 mt-5 text-foreground">{title}</h2>
          <p className="mt-3 max-w-2xl text-[0.92rem] leading-relaxed text-muted-foreground">
            {body}
          </p>
          <p className="mt-3 max-w-2xl text-[0.86rem] leading-relaxed text-muted-foreground">
            An account is optional. Everything this platform publishes is
            readable without one — an account only remembers what you have
            saved and what you have chosen to follow.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link
              href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign in
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/sign-up?redirect_url=${encodeURIComponent(pathname)}`}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-background px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              Create an account
            </Link>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>{children}</Authenticated>
    </>
  );
}
