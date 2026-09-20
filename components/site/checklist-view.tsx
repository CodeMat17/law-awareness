"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "cn";
import type { ChecklistItem } from "@/lib/content/types";

/**
 * Stored progress is read through `useSyncExternalStore` rather than copied
 * into state in an effect: `localStorage` is external state, the server has no
 * view of it, and this is the hook that models exactly that — the server and
 * the first client render both see "nothing ticked", and the stored value
 * arrives on subscription without a second source of truth to keep in step.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** Returns the raw stored string; equal strings compare equal, so this is stable. */
function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private window, cleared site data, or storage blocked entirely.
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Progress simply is not remembered in this browser.
  }
  for (const listener of listeners) listener();
}

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * A checklist the reader can actually work through.
 *
 * Progress is kept in the reader's own browser under a key scoped to the
 * checklist slug — it never reaches us, and it is not a record of anything.
 * Storage is wrapped because a private window, cleared site data or a browser
 * set to block storage makes every access throw, and a checklist that cannot
 * remember ticks must still render and still tick.
 */
export function ChecklistView({
  slug,
  items,
}: {
  slug: string;
  items: ChecklistItem[];
}) {
  const storageKey = `law-checklist:${slug}`;
  const raw = useSyncExternalStore(
    subscribe,
    useCallback(() => readRaw(storageKey), [storageKey]),
    () => null
  );
  const ticked = useMemo(() => parseIds(raw), [raw]);

  const toggle = useCallback(
    (id: string) => {
      const current = parseIds(readRaw(storageKey));
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      writeRaw(storageKey, JSON.stringify(next));
    },
    [storageKey]
  );

  const clear = useCallback(
    () => writeRaw(storageKey, "[]"),
    [storageKey]
  );

  const groups = items.reduce<{ group: string; items: ChecklistItem[] }[]>(
    (accumulator, item) => {
      const last = accumulator.at(-1);
      if (last && last.group === item.group) last.items.push(item);
      else accumulator.push({ group: item.group, items: [item] });
      return accumulator;
    },
    []
  );

  const done = items.filter((item) => ticked.includes(item.id)).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-hairline bg-card p-5">
        <div>
          <p className="text-eyebrow text-brand-ink">Your progress</p>
          <p className="mt-1.5 text-[0.9rem] font-bold text-foreground">
            {done} of {items.length} worked through
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          disabled={done === 0}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-hairline bg-background px-4 text-[0.83rem] font-extrabold text-foreground transition-colors hover:border-primary/45 disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" />
          Clear ticks
        </button>
      </div>
      <p className="mt-3 text-[0.78rem] leading-relaxed text-muted-foreground">
        Ticks are kept in this browser only. They are not sent to us, they are
        not visible to anyone else, and they are not a record of advice.
      </p>

      <div className="mt-8 space-y-10">
        {groups.map((group) => (
          <section key={group.group}>
            <h2 className="text-eyebrow flex items-center gap-2 text-brand-ink">
              <span aria-hidden className="inline-block h-px w-6 bg-primary" />
              {group.group}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => {
                const checked = ticked.includes(item.id);
                return (
                  <li key={item.id}>
                    <label
                      className={cn(
                        "flex cursor-pointer gap-3.5 rounded-xl border p-4 transition-colors sm:p-5",
                        checked
                          ? "border-primary/40 bg-primary/8"
                          : "border-hairline bg-card hover:border-primary/30"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(item.id)}
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                      />
                      <span className="min-w-0">
                        <span
                          className={cn(
                            "block text-[0.93rem] font-extrabold text-foreground",
                            checked && "line-through decoration-primary/50"
                          )}
                        >
                          {item.label}
                        </span>
                        <span className="mt-1.5 block text-[0.86rem] leading-relaxed text-muted-foreground">
                          {item.detail}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
