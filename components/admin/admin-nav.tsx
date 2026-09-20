"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import { siteSections, type CollectionDefinition } from "@/lib/cms/collections";
import type { CollectionCounts } from "@/lib/cms/repository";

interface AdminNavProps {
  collections: CollectionDefinition[];
  counts: CollectionCounts[];
}

export function AdminNav({ collections, counts }: AdminNavProps) {
  const pathname = usePathname();
  const countFor = (id: string) =>
    counts.find((entry) => entry.collection === id);

  return (
    <nav aria-label="CMS sections" className="p-3">
      <Link
        href="/admin"
        aria-current={pathname === "/admin" ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.87rem] font-bold transition-colors",
          pathname === "/admin"
            ? "bg-primary/15 text-brand-ink"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <LayoutDashboard className="size-4" />
        Dashboard
      </Link>

      {/* Grouped by the part of the site each collection feeds, in the order
          the site's own menu runs. Twenty-two content types in one flat list
          is a list nobody reads: someone who wants to add a podcast episode
          looks for "Watch & Listen", not for the word "Media". */}
      {siteSections.map((section) => {
        const inSection = collections.filter(
          (collection) => collection.section === section.id
        );
        if (inSection.length === 0) return null;

        return (
          <div key={section.id}>
            <p className="text-eyebrow px-3 pt-5 pb-2 text-muted-foreground">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {inSection.map((collection) => {
                const href = `/admin/${collection.id}`;
                const active = pathname.startsWith(href);
                const summary = countFor(collection.id);
                const pending = (summary?.draft ?? 0) + (summary?.review ?? 0);

                return (
                  <li key={collection.id}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.87rem] font-bold transition-colors",
                        active
                          ? "bg-primary/15 text-brand-ink"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon
                        name={collection.icon}
                        className="size-4 shrink-0"
                        strokeWidth={1.9}
                      />
                      <span className="min-w-0 flex-1 truncate">
                        {collection.label}
                      </span>
                      {pending > 0 ? (
                        <span className="shrink-0 rounded-full bg-primary/20 px-1.5 py-0.5 text-[0.68rem] font-extrabold text-brand-ink">
                          {pending}
                        </span>
                      ) : (
                        <span className="shrink-0 text-[0.7rem] font-semibold text-muted-foreground">
                          {summary?.total ?? 0}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
