"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";

interface AdminShellProps {
  /** Sidebar contents - nav, identity and account links. */
  sidebar: ReactNode;
  children: ReactNode;
}

/**
 * The CMS is used from phones as often as desks, so below `lg` the sidebar is
 * a drawer behind a sticky bar rather than a column stacked above the page -
 * otherwise every screen starts with a full nav list to scroll past.
 */
export function AdminShell({ sidebar, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      {/* Mobile bar. Tall enough for comfortable thumb targets. */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-card px-4 lg:hidden">
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
          <Image
            src="/logo-2.webp"
            alt=""
            width={931}
            height={268}
            className="h-6 w-auto rounded-lg object-contain"
          />
          <span className="truncate text-[0.85rem] font-extrabold tracking-tight text-foreground">
            Editorial CMS
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open CMS menu"
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-full border border-hairline bg-surface text-muted-foreground transition-colors hover:text-foreground"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-90 bg-foreground/35 backdrop-blur-[2px]"
            />
            <motion.div
              initial={reduce ? { opacity: 0 } : { x: "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="CMS menu"
              className="fixed inset-y-0 left-0 z-100 flex w-[min(19rem,88vw)] flex-col overflow-y-auto overscroll-contain border-r border-hairline bg-card"
            >
              <div className="flex items-center justify-between gap-3 border-b border-hairline p-4">
                <span className="text-[0.85rem] font-extrabold tracking-tight text-foreground">
                  Editorial CMS
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close CMS menu"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-hairline bg-surface text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
              {/* Following any link inside the drawer dismisses it, so a
                  navigation never leaves the panel covering the page. */}
              <div
                className="flex flex-1 flex-col"
                onClick={(event) => {
                  if ((event.target as HTMLElement).closest("a")) setOpen(false);
                }}
              >
                {sidebar}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop column. */}
      <aside className="hidden shrink-0 border-hairline bg-card lg:flex lg:h-screen lg:w-72 lg:flex-col lg:overflow-y-auto lg:border-r">
        <div className="flex items-center justify-between gap-3 border-b border-hairline p-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <Image
              src="/logo-2.webp"
              alt=""
              width={931}
              height={268}
              className="h-6 w-auto rounded-lg object-contain"
            />
            <span className="text-[0.9rem] leading-[1.05] font-extrabold tracking-tight text-foreground">
              Editorial
              <span className="block text-[0.6rem] font-extrabold tracking-[0.2em] text-brand-ink">
                CMS
              </span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
        {sidebar}
      </aside>

      <div className="min-w-0 flex-1 lg:h-screen lg:overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
