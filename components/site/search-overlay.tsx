"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { cn } from "cn";
import { overlay } from "@/lib/motion";

export interface SearchEntry {
  id: string;
  title: string;
  group: string;
  href: string;
}

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  entries: SearchEntry[];
  suggestions: string[];
}

/**
 * Polished search overlay. Client-side filtering over the indexed entries for
 * now; the same component accepts a server-backed result set later without a
 * change to its props shape.
 */
export function SearchOverlay({
  open,
  onClose,
  entries,
  suggestions,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focus = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(focus);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          entry.group.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [entries, query]);

  const showEmpty = query.trim().length > 0 && results.length === 0;

  return (
    // Resetting on exit rather than in an effect keeps the query alive through
    // the close animation and avoids a render cascade.
    <AnimatePresence onExitComplete={() => setQuery("")}>
      {open && (
        <motion.div
          variants={overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-100 flex justify-center bg-background/80 px-4 pt-[12vh] backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Search Law Awareness TV"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="h-fit w-full max-w-2xl overflow-hidden rounded-2xl border border-hairline bg-card shadow-2xl shadow-foreground/10"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Search laws, rights, business guides, cases, media…"
                aria-label="Search"
                className="h-14 w-full bg-transparent text-[0.95rem] text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length > 0 && (
                <ul className="space-y-0.5">
                  {results.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={entry.href}
                        onClick={onClose}
                        className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-[0.9rem] font-semibold text-foreground">
                            <Highlight text={entry.title} query={query} />
                          </span>
                          <span className="text-caption text-muted-foreground">
                            {entry.group}
                          </span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand-ink" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {showEmpty && (
                <div className="px-4 py-10 text-center">
                  <p className="text-[0.95rem] font-semibold text-foreground">
                    Nothing matched “{query.trim()}”
                  </p>
                  <p className="mx-auto mt-1.5 max-w-sm text-[0.85rem] text-muted-foreground">
                    Try a situation rather than a statute — “police stopped me”,
                    “my landlord”, “hiring staff”.
                  </p>
                  <Link
                    href="/legal-help/problem"
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-bold text-brand-ink link-underline"
                  >
                    Describe your problem instead
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              )}

              {query.trim().length === 0 && (
                <div className="p-3">
                  <p className="text-eyebrow px-1 pb-2.5 text-muted-foreground">
                    Suggested searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-[0.8rem] font-semibold text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-hairline bg-surface px-4 py-2.5">
              <Link
                href={
                  query.trim()
                    ? `/search?q=${encodeURIComponent(query.trim())}`
                    : "/search"
                }
                onClick={onClose}
                className="text-[0.72rem] font-bold text-brand-ink link-underline"
              >
                Full search, with filters
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Highlights the matched span without dangerously setting HTML. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const index = text.toLowerCase().indexOf(q.toLowerCase());
  if (q.length === 0 || index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className={cn("rounded-sm bg-primary/25 text-foreground")}>
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}
