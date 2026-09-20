"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Heart, X } from "lucide-react";
import { cn } from "cn";
import type { NavGroup } from "@/lib/content/types";
import { ThemeToggle } from "./theme-toggle";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  groups: NavGroup[];
}

/**
 * Full-screen mobile navigation. Sections expand in place so the reader never
 * loses their position, and the panel traps scroll while open.
 */
export function MobileMenu({ open, onClose, groups }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-100 flex flex-col bg-background lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-hairline px-5">
            <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
              <Image
                src="/logo-2.webp"
                alt="Law Awareness TV"
                width={931}
                height={268}
                className="h-7 w-auto rounded object-contain invert dark:invert-0"
              />
            
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex size-9 items-center justify-center rounded-full border border-hairline bg-card text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            <ul className="space-y-1">
              {groups.map((group, index) => {
                const isOpen = expanded === group.label;
                return (
                  <motion.li
                    key={group.label}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduce ? 0 : 0.04 + index * 0.035,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-hairline/70 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <Link
                        href={group.href}
                        onClick={onClose}
                        className="flex-1 py-3.5 text-h4 text-foreground"
                      >
                        {group.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : group.label)}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${group.label}`}
                        className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          {group.links.map((link) => (
                            <li key={`${group.label}-${link.href}-${link.label}`}>
                              <Link
                                href={link.href}
                                onClick={onClose}
                                className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-muted"
                              >
                                <span className="block text-[0.92rem] font-semibold text-foreground">
                                  {link.label}
                                </span>
                                {link.description && (
                                  <span className="text-caption text-muted-foreground">
                                    {link.description}
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                          <li className="h-2" />
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="shrink-0 space-y-3 border-t border-hairline bg-surface px-5 py-4">
            <Link
              href="/ask"
              onClick={onClose}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[0.95rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Ask a Legal Question
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/donate"
              onClick={onClose}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/45 text-[0.9rem] font-extrabold text-brand-ink transition-colors hover:bg-primary/10"
            >
              <Heart className="size-4" />
              Donate
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/business"
                onClick={onClose}
                className="flex h-11 items-center justify-center rounded-xl border border-hairline bg-card text-[0.88rem] font-bold text-foreground transition-colors hover:border-primary/45"
              >
                Business
              </Link>
              <Link
                href="/live"
                onClick={onClose}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-hairline bg-card text-[0.88rem] font-bold text-foreground transition-colors hover:border-primary/45"
              >
                <span className="size-1.5 rounded-full bg-live" aria-hidden />
                Live
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
