"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "cn";

/**
 * The account cluster in the header: the Clerk user button when signed in, a
 * sign-in link when not.
 */
export function AccountMenu({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Authenticated>
        <UserButton appearance={{ elements: { avatarBox: "size-8" } }} />
      </Authenticated>
      <Unauthenticated>
        <SignInLink />
      </Unauthenticated>
    </div>
  );
}

function SignInLink() {
  const pathname = usePathname();
  return (
    <Link
      href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
      aria-label="Sign in"
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-card px-2.5 text-[0.8rem] font-extrabold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground xl:px-3"
    >
      <UserRound className="size-4" />
      <span className="hidden xl:inline">Sign in</span>
    </Link>
  );
}
