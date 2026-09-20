"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cn } from "cn";

export interface FilterItem {
  id: string;
  /** Value matched against the selected filter. */
  tag: string;
  /** Free-text matched against the query, joined server-side. */
  text: string;
  /** Pre-rendered on the server: the card keeps its server-component cost. */
  node: ReactNode;
}

interface FilterGridProps {
  items: FilterItem[];
  filters: { value: string; label: string }[];
  placeholder: string;
  label: string;
  className?: string;
  /** Rendered when nothing matches. */
  emptyTitle?: string;
  emptyBody?: string;
}

/**
 * Hub filtering that keeps its cards on the server.
 *
 * The parent renders each card as a server component and hands it over as
 * `node`; this component only decides which of them are shown. Filtering is
 * client-side and instant, and nothing about the card ships as client JS.
 */
export function FilterGrid({
  items,
  filters,
  placeholder,
  label,
  className,
  emptyTitle = "Nothing matched",
  emptyBody = "Try a broader word, or clear the filter to see everything.",
}: FilterGridProps) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const inputId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (item) =>
        (tag === "all" || item.tag === tag) &&
        (q.length === 0 || item.text.toLowerCase().includes(q))
    );
  }, [items, query, tag]);

  const clearable = query.length > 0 || tag !== "all";

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="h-12 w-full rounded-xl border border-hairline bg-card pr-4 pl-11 text-[0.92rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60"
          />
        </div>

        {filters.length > 1 && (
          <div
            className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            role="group"
            aria-label="Filter by category"
          >
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setTag(filter.value)}
                aria-pressed={tag === filter.value}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-2 text-[0.8rem] font-bold transition-colors",
                  tag === filter.value
                    ? "border-primary/50 bg-primary/15 text-brand-ink"
                    : "border-hairline bg-card text-muted-foreground hover:border-primary/35 hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p aria-live="polite" className="text-[0.8rem] font-semibold text-muted-foreground">
          Showing {visible.length} of {items.length}
        </p>
        {clearable && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTag("all");
            }}
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-foreground"
          >
            <X className="size-3.5 text-brand-ink" />
            <span className="link-underline">Clear</span>
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <div className={cn("mt-5 grid gap-4", className)}>
          {visible.map((item) => (
            <div key={item.id} className="flex">
              {item.node}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-hairline bg-surface p-8 text-center sm:p-12">
          <p className="text-h4 text-foreground">{emptyTitle}</p>
          <p className="mx-auto mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
            {emptyBody}
          </p>
        </div>
      )}
    </div>
  );
}
