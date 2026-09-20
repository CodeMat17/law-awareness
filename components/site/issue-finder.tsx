"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import type { IssueCategory } from "@/lib/content/types";

const STEPS = [
  "Tell us what happened",
  "Understand the law",
  "Know what to do",
  "Find resources",
  "Know when to get help",
];

interface IssueFinderProps {
  categories: IssueCategory[];
}

/**
 * "What do you need to know?" — the platform's front door for people who have
 * a situation rather than a legal vocabulary. Selecting a category reveals the
 * pathway rather than jumping the reader straight out of the page.
 */
export function IssueFinder({ categories }: IssueFinderProps) {
  const [selected, setSelected] = useState<IssueCategory | null>(null);
  const reduce = useReducedMotion();

  return (
    <div className="rounded-3xl border border-hairline bg-card p-5 sm:p-8 lg:p-10">
      <ol className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-2">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "text-[0.72rem] font-bold",
                index === 0 ? "text-brand-ink" : "text-muted-foreground"
              )}
            >
              {step}
            </span>
            {index < STEPS.length - 1 && (
              <ArrowRight
                aria-hidden
                className="size-3 shrink-0 text-muted-foreground/50"
              />
            )}
          </li>
        ))}
      </ol>

      <div
        role="group"
        aria-label="Choose the issue closest to your situation"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
      >
        {categories.map((category) => {
          const isSelected = selected?.slug === category.slug;
          return (
            <button
              key={category.slug}
              type="button"
              onClick={() =>
                setSelected(isSelected ? null : category)
              }
              aria-pressed={isSelected}
              className={cn(
                "group flex min-h-[5.5rem] min-w-0 flex-col items-start justify-between gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/12 shadow-sm"
                  : "border-hairline bg-surface hover:border-primary/40 hover:bg-card"
              )}
            >
              <Icon
                name={category.icon}
                className={cn(
                  "size-5 transition-colors",
                  isSelected ? "text-brand-ink" : "text-muted-foreground"
                )}
                strokeWidth={1.9}
              />
              <span className="text-[0.82rem] leading-tight font-bold text-foreground">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.slug}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/25 bg-primary/8 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div>
              <p className="text-eyebrow text-brand-ink">
                {selected.name}
              </p>
              <p className="mt-2 text-[0.98rem] font-bold text-foreground">
                {selected.blurb}
              </p>
              <p className="mt-1 text-[0.83rem] text-muted-foreground">
                Start with what the law says, then what it means in real life —
                and where to get qualified help if you need it.
              </p>
            </div>
            <Link
              href={selected.href}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="mt-6 text-[0.85rem] text-muted-foreground"
          >
            Pick the one closest to your situation — you can change it at any
            point.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
