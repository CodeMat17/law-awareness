"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Clock, Search, X } from "lucide-react";
import { cn } from "cn";
import type { SearchDocument, SearchType } from "@/lib/content/types";

const RECENT_KEY = "lawtv:recent-searches";
const MAX_RECENT = 6;

const EMPTY_RECENT = "[]";
const RECENT_EVENT = "lawtv:recent-changed";

/** Cached so `useSyncExternalStore` sees a stable snapshot between writes. */
let recentSnapshot = EMPTY_RECENT;

function readRecent(): string {
  try {
    const stored = window.localStorage.getItem(RECENT_KEY) ?? EMPTY_RECENT;
    if (stored !== recentSnapshot) recentSnapshot = stored;
  } catch {
    // Private windows and blocked storage simply have no recent searches.
    recentSnapshot = EMPTY_RECENT;
  }
  return recentSnapshot;
}

function subscribeToRecent(onChange: () => void): () => void {
  window.addEventListener(RECENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(RECENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function updateRecent(next: string[]): void {
  try {
    if (next.length === 0) window.localStorage.removeItem(RECENT_KEY);
    else window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: recent searches simply do not persist.
  }
  window.dispatchEvent(new Event(RECENT_EVENT));
}

function writeRecent(term: string): void {
  let current: string[] = [];
  try {
    current = JSON.parse(readRecent()) as string[];
  } catch {
    current = [];
  }
  updateRecent(
    [
      term,
      ...current.filter((item) => item.toLowerCase() !== term.toLowerCase()),
    ].slice(0, MAX_RECENT)
  );
}

const typeLabels: Record<SearchType, string> = {
  law: "Laws",
  right: "Rights",
  safety: "Stay Safe",
  guide: "Business",
  article: "Law & Society",
  media: "Watch & Listen",
  term: "Glossary",
  quiz: "Quizzes",
  resource: "Resources",
  compliance: "Compliance",
  contract: "Contracts",
  industry: "Industries",
  briefing: "For CEOs",
  update: "Regulatory Watch",
  problem: "Legal Help",
  question: "Q&A",
  lawyer: "Directory",
  case: "Case law",
  section: "Constitution",
};

interface SearchResultsProps {
  documents: SearchDocument[];
  suggestions: string[];
  initialQuery: string;
}

/**
 * The full search experience: filters, highlighting and recent searches.
 *
 * Filtering runs over the index the server built, so results and the header
 * overlay can never disagree. When the library outgrows a shipped index this
 * component keeps its props and the filtering moves behind a route handler.
 */
export function SearchResults({
  documents,
  suggestions,
  initialQuery,
}: SearchResultsProps) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchType | "all">("all");

  // Recent searches live in localStorage, which is an external store: reading
  // it through useSyncExternalStore keeps the server render and the hydrated
  // render consistent without a setState-in-effect cascade.
  const storedRecent = useSyncExternalStore(
    subscribeToRecent,
    readRecent,
    () => EMPTY_RECENT
  );
  const recent = useMemo<string[]>(() => {
    try {
      return JSON.parse(storedRecent) as string[];
    } catch {
      return [];
    }
  }, [storedRecent]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 3) return;
    const timer = window.setTimeout(() => writeRecent(term), 900);
    return () => window.clearTimeout(timer);
  }, [query]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return [];
    return documents.filter((document) => {
      const haystack = [
        document.title,
        document.summary,
        document.group,
        ...document.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [documents, query]);

  const counts = useMemo(() => {
    const map = new Map<SearchType, number>();
    for (const match of matches) {
      map.set(match.type, (map.get(match.type) ?? 0) + 1);
    }
    return map;
  }, [matches]);

  const visible =
    type === "all" ? matches : matches.filter((match) => match.type === type);

  const availableTypes = (Object.keys(typeLabels) as SearchType[]).filter(
    (key) => (counts.get(key) ?? 0) > 0
  );

  const searching = query.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <label htmlFor="site-search" className="sr-only">
          Search Law Awareness TV
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="site-search"
          type="search"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search laws, rights, guides, media and plain language…"
          className="h-14 w-full rounded-2xl border border-hairline bg-card pr-5 pl-13 text-[1rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary/60"
        />
      </div>

      {searching && availableTypes.length > 1 && (
        <div
          className="no-scrollbar -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1"
          role="group"
          aria-label="Filter results by section"
        >
          <FilterChip
            active={type === "all"}
            onClick={() => setType("all")}
            label={`Everything (${matches.length})`}
          />
          {availableTypes.map((key) => (
            <FilterChip
              key={key}
              active={type === key}
              onClick={() => setType(key)}
              label={`${typeLabels[key]} (${counts.get(key)})`}
            />
          ))}
        </div>
      )}

      {searching ? (
        <div className="mt-8">
          <p aria-live="polite" className="text-[0.82rem] font-semibold text-muted-foreground">
            {visible.length === 0
              ? `Nothing matched “${query.trim()}”`
              : `${visible.length} ${visible.length === 1 ? "result" : "results"} for “${query.trim()}”`}
          </p>

          {visible.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {visible.map((document) => (
                <li key={document.id}>
                  <Link
                    href={document.href}
                    className="group flex gap-4 rounded-2xl border border-hairline bg-card p-5 transition-colors hover:border-primary/45"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="text-eyebrow block text-muted-foreground">
                        {document.group}
                      </span>
                      <span className="mt-2 block text-[1.02rem] leading-snug font-extrabold text-foreground">
                        <Highlight text={document.title} query={query} />
                      </span>
                      <span className="mt-2 block text-[0.88rem] leading-relaxed text-muted-foreground">
                        <Highlight text={document.summary} query={query} />
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-hairline bg-surface p-8 text-center sm:p-12">
              <p className="text-h4 text-foreground">
                Try a situation rather than a statute
              </p>
              <p className="mx-auto mt-2.5 max-w-md text-[0.9rem] leading-relaxed text-muted-foreground">
                Most people arrive with something that happened, not a section
                number. “Police stopped me”, “my landlord”, “hiring staff”.
              </p>
              <Link
                href="/legal-help/problem"
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-5 text-[0.88rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
              >
                Describe your problem instead
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {recent.length > 0 && (
            <div>
              <p className="text-eyebrow flex items-center gap-2 text-muted-foreground">
                <Clock className="size-3.5" />
                Recent searches
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="rounded-full border border-hairline bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
                  >
                    {term}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => updateRecent([])}
                  className="inline-flex items-center gap-1.5 px-2 py-2 text-[0.82rem] font-bold text-foreground"
                >
                  <X className="size-3.5 text-brand-ink" />
                  <span className="link-underline">Clear</span>
                </button>
              </div>
            </div>
          )}
          <div>
            <p className="text-eyebrow text-muted-foreground">
              Suggested searches
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="rounded-full border border-hairline bg-card px-3.5 py-2 text-[0.82rem] font-semibold text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-[0.8rem] font-bold transition-colors",
        active
          ? "border-primary/50 bg-primary/15 text-brand-ink"
          : "border-hairline bg-card text-muted-foreground hover:border-primary/35 hover:text-foreground"
      )}
    >
      {label}
    </button>
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
      <mark className="rounded-sm bg-primary/25 text-foreground">
        {text.slice(index, index + q.length)}
      </mark>
      {text.slice(index + q.length)}
    </>
  );
}
