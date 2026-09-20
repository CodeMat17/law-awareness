"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "cn";
import type { TickerItem, TickerTone } from "@/lib/content/types";

/** Pixels per second. Deliberately unhurried - a news terminal, not a ticker. */
const SPEED = 42;

/**
 * The stripe sits on `bg-forest` in both themes, so badge colours are keyed to
 * that surface rather than to the page background.
 */
const toneStyles: Record<TickerTone, string> = {
  update: "bg-primary/10 text-primary",
  alert: "bg-live/25 text-forest-foreground",
  live: "bg-live text-live-foreground",
  business: "bg-forest-foreground/15 text-forest-foreground",
  notice: "bg-forest-foreground/10 text-forest-foreground/85",
};

interface UpdateTickerProps {
  items: TickerItem[];
}

/**
 * Breaking-updates stripe that sits above the main navigation.
 *
 * Motion runs on a single motion value driven by an animation frame, so the
 * loop is seamless and pausing is instant. It pauses on hover, on keyboard
 * focus, when the tab is hidden, and entirely under `prefers-reduced-motion`
 * (where it becomes a horizontally scrollable strip instead).
 */
export function UpdateTicker({ items }: UpdateTickerProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const running = !reduce && !paused && !manuallyPaused && !tabHidden;

  useAnimationFrame((_, delta) => {
    if (!running) return;
    const track = trackRef.current;
    if (!track) return;
    // The track holds the list twice; one half is a full loop.
    const half = track.scrollWidth / 2;
    if (half <= 0) return;
    const next = x.get() - (SPEED * delta) / 1000;
    x.set(next <= -half ? next + half : next);
  });

  const togglePause = useCallback(() => setManuallyPaused((p) => !p), []);

  if (items.length === 0) return null;

  const isPaused = manuallyPaused || paused;

  return (
    <aside
      aria-label="Breaking legal updates"
      className="border-b border-hairline bg-forest text-forest-foreground"
    >
      <div className="flex h-10 items-center gap-3 pl-3 sm:pl-5">
        <span className="hidden shrink-0 items-center gap-2 sm:flex">
          <span className="relative flex size-2">
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full bg-primary opacity-70",
                running && "motion-safe:animate-ping"
              )}
            />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="text-eyebrow text-forest-foreground/75">
            Updates
          </span>
        </span>

        <div
          className={cn(
            "relative min-w-0 flex-1 overflow-hidden",
            !reduce && "mask-fade-x",
            reduce && "overflow-x-auto no-scrollbar"
          )}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <motion.div
            ref={trackRef}
            style={reduce ? undefined : { x }}
            className="flex w-max items-center"
          >
            <TickerRow items={items} />
            {!reduce && <TickerRow items={items} ariaHidden />}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={togglePause}
          className="mr-2 hidden shrink-0 items-center justify-center rounded-full p-1.5 text-forest-foreground/70 transition-colors hover:bg-forest-foreground/10 hover:text-forest-foreground sm:inline-flex"
          aria-pressed={isPaused}
          aria-label={isPaused ? "Resume updates" : "Pause updates"}
        >
          {isPaused ? (
            <Play className="size-3.5" />
          ) : (
            <Pause className="size-3.5" />
          )}
        </button>
      </div>
    </aside>
  );
}

function TickerRow({
  items,
  ariaHidden = false,
}: {
  items: TickerItem[];
  ariaHidden?: boolean;
}) {
  return (
    <ul
      className="flex items-center"
      // The duplicated row exists only to close the visual loop, so it is
      // hidden from assistive tech and removed from the tab order.
      aria-hidden={ariaHidden || undefined}
      inert={ariaHidden || undefined}
    >
      {items.map((item) => (
        <li key={item.id} className="flex shrink-0 items-center">
          <Link
            href={item.href}
            tabIndex={ariaHidden ? -1 : undefined}
            className="group flex items-center gap-2.5 rounded-md px-3 py-1 outline-offset-2 transition-colors hover:bg-forest-foreground/8"
          >
            <span
              className={cn(
                // Matches the status pills elsewhere. This is the smallest
                // type a visitor meets, and it is in motion, so it does not
                // go below them.
                "rounded-full px-2 py-0.5 text-[0.68rem] font-extrabold tracking-[0.12em] uppercase",
                toneStyles[item.tone]
              )}
            >
              {item.label}
            </span>
            <span className="text-[0.82rem] font-medium whitespace-nowrap text-forest-foreground/90 transition-colors group-hover:text-forest-foreground">
              {item.headline}
            </span>
          </Link>
          <span
            aria-hidden
            className="mx-1 h-3 w-px shrink-0 bg-forest-foreground/25"
          />
        </li>
      ))}
    </ul>
  );
}
