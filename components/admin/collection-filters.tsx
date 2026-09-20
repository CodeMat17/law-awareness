"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkflowStatus } from "@/lib/content/types";

const STATUSES: { value: WorkflowStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

interface CollectionFiltersProps {
  collectionId: string;
  status: WorkflowStatus | "all";
  query: string;
}

/** Status chips and search, kept in the URL so views are shareable. */
export function CollectionFilters({
  collectionId,
  status,
  query,
}: CollectionFiltersProps) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  const push = (nextStatus: string, nextQuery: string) => {
    const params = new URLSearchParams();
    if (nextStatus !== "all") params.set("status", nextStatus);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    const qs = params.toString();
    router.push(`/admin/${collectionId}${qs ? `?${qs}` : ""}`);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    push(status, value);
  };

  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2">
        {STATUSES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => push(option.value, value)}
            aria-pressed={status === option.value}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[0.8rem] font-bold transition-colors",
              status === option.value
                ? "border-primary bg-primary/15 text-brand-ink"
                : "border-hairline bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="relative sm:w-72">
        <Label htmlFor="cms-search" className="sr-only">
          Search records
        </Label>
        <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="cms-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search records"
          className="h-10 w-full rounded-full bg-card pr-4 pl-9 text-[0.85rem]"
        />
      </form>
    </div>
  );
}
