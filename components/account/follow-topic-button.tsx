"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BellRing, Loader2 } from "lucide-react";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { cn } from "cn";
import { api } from "@/convex/_generated/api";

/**
 * Follow a topic for law-change alerts (spec sections 23 and 62).
 *
 * `topic` is an `AlertTopic` slug from the content layer. Following is the
 * only thing this control does — it does not subscribe anyone to email, which
 * is a separate switch in notification preferences and is off by default.
 */
export function FollowTopicButton({
  topic,
  label,
  className,
}: {
  topic: string;
  label: string;
  className?: string;
}) {
  return (
    <>
      <Authenticated>
        <FollowToggle topic={topic} label={label} className={className} />
      </Authenticated>
      <Unauthenticated>
        <SignedOutFollow label={label} className={className} />
      </Unauthenticated>
    </>
  );
}

const base =
  "inline-flex h-10 items-center gap-2 rounded-xl border border-hairline bg-card px-4 text-[0.83rem] font-extrabold transition-colors";

function FollowToggle({
  topic,
  label,
  className,
}: {
  topic: string;
  label: string;
  className?: string;
}) {
  const followed = useQuery(api.library.listFollowedTopics);
  const toggle = useMutation(api.library.toggleTopicFollow);
  const [pending, setPending] = useState(false);

  const loading = followed === undefined;
  const following = followed?.includes(topic) ?? false;

  return (
    <button
      type="button"
      disabled={loading || pending}
      aria-pressed={following}
      onClick={async () => {
        setPending(true);
        try {
          await toggle({ topic });
        } finally {
          setPending(false);
        }
      }}
      className={cn(
        base,
        following
          ? "border-primary/45 bg-primary/10 text-brand-ink"
          : "text-foreground hover:border-primary/45",
        (loading || pending) && "opacity-70",
        className
      )}
    >
      {pending || loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : following ? (
        <BellRing className="size-4" />
      ) : (
        <Bell className="size-4" />
      )}
      {following ? `Following ${label}` : `Follow ${label}`}
    </button>
  );
}

function SignedOutFollow({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <Link
      href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`}
      className={cn(base, "text-foreground hover:border-primary/45", className)}
    >
      <Bell className="size-4" />
      Sign in to follow {label}
    </Link>
  );
}
