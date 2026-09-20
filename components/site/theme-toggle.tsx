"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { cn } from "cn";

/** No client-side source of truth to subscribe to - the value never changes. */
const subscribeNever = () => () => {};

interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/dark switch. Renders a stable placeholder until mounted so the server
 * and client markup match and the header never shifts.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const reduce = useReducedMotion();

  // The resolved theme is only known on the client. Subscribing to a store
  // that reports false on the server and true afterwards gives a hydration-safe
  // "mounted" flag without a state update in an effect.
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );

  const isDark = resolvedTheme === "dark";

  const base = cn(
    "relative inline-flex size-9 items-center justify-center rounded-full border border-hairline bg-card text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40",
    className
  );

  if (!mounted) {
    return <span aria-hidden className={base} />;
  }

  return (
    <button
      type="button"
      className={base}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reduce ? false : { opacity: 0, rotate: -70, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, rotate: 70, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="size-[1.05rem]" />
          ) : (
            <Sun className="size-[1.05rem]" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
