"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { cn } from "cn";

export interface Facet {
  /** Key into an item's `tags`. */
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface FacetItem {
  id: string;
  /** One value per facet id. An item with no value for a facet never matches it. */
  tags: Record<string, string[]>;
  /** Free-text matched against the query, joined server-side. */
  text: string;
  /** Pre-rendered on the server: the card keeps its server-component cost. */
  node: ReactNode;
}

interface FacetGridProps {
  items: FacetItem[];
  facets: Facet[];
  label: string;
  placeholder: string;
  className?: string;
  emptyTitle?: string;
  emptyBody?: string;
}

const ALL = "all";

/**
 * Multi-facet filtering that keeps its cards on the server.
 *
 * `FilterGrid` handles the single-axis hubs. The directory filters on six axes
 * at once (spec section 36), so this component exists alongside it rather than
 * complicating the simpler one. Both take server-rendered nodes and decide only
 * which of them are shown, so no card code ships as client JS.
 *
 * A facet an item has no value for simply does not match that facet — the item
 * disappears when the facet is used, rather than matching everything, which is
 * the behaviour a reader filtering by state actually expects.
 */
export function FacetGrid({
  items,
  facets,
  label,
  placeholder,
  className,
  emptyTitle = "No listing matched",
  emptyBody = "Try clearing one filter at a time — the combination is usually narrower than it looks.",
}: FacetGridProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const inputId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (q.length > 0 && !item.text.toLowerCase().includes(q)) return false;
      return Object.entries(selected).every(([facetId, value]) => {
        if (value === ALL) return true;
        return (item.tags[facetId] ?? []).includes(value);
      });
    });
  }, [items, query, selected]);

  const activeCount =
    Object.values(selected).filter((value) => value !== ALL).length +
    (query.length > 0 ? 1 : 0);

  return (
    <div>
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

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facets.map((facet) => (
          <div key={facet.id}>
            <label
              htmlFor={`${inputId}-${facet.id}`}
              className="text-eyebrow block text-muted-foreground"
            >
              {facet.label}
            </label>
            <select
              id={`${inputId}-${facet.id}`}
              value={selected[facet.id] ?? ALL}
              onChange={(event) =>
                setSelected((current) => ({
                  ...current,
                  [facet.id]: event.target.value,
                }))
              }
              className="mt-2 h-11 w-full rounded-xl border border-hairline bg-card px-3 text-[0.88rem] font-semibold text-foreground outline-none transition-colors focus-visible:border-primary/60"
            >
              <option value={ALL}>Any {facet.label.toLowerCase()}</option>
              {facet.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p
          aria-live="polite"
          className="text-[0.8rem] font-semibold text-muted-foreground"
        >
          Showing {visible.length} of {items.length}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelected({});
            }}
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-foreground"
          >
            <X className="size-3.5 text-brand-ink" />
            <span className="link-underline">
              Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
            </span>
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
