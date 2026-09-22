"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Menu, Search } from "lucide-react";
import { cn } from "cn";
import { sheet } from "@/lib/motion";
import type { NavGroup } from "@/lib/content/types";
import { MobileMenu } from "./mobile-menu";
import { SearchOverlay, type SearchEntry } from "./search-overlay";
import { ThemeToggle } from "./theme-toggle";

interface SiteHeaderProps {
  groups: NavGroup[];
  searchEntries: SearchEntry[];
  searchSuggestions: string[];
}

/**
 * Sticky primary navigation. Desktop reveals a section panel on hover/focus;
 * mobile keeps only logo, search, theme and menu so the header never crowds.
 */
export function SiteHeader({
  groups,
  searchEntries,
  searchSuggestions,
}: SiteHeaderProps) {
  const pathname = usePathname();
  // Navigation UI is reset when the route changes. Adjusting state during
  // render (rather than in an effect) is the supported pattern for syncing
  // state to a changed input, and avoids a second render pass.
  const [navState, setNavState] = useState<{
    pathname: string;
    openGroup: string | null;
    menuOpen: boolean;
  }>({ pathname, openGroup: null, menuOpen: false });

  if (navState.pathname !== pathname) {
    setNavState({ pathname, openGroup: null, menuOpen: false });
  }

  const { openGroup, menuOpen } = navState;
  const setOpenGroup = (group: string | null) =>
    setNavState((state) => ({ ...state, openGroup: group }));
  const setMenuOpen = (value: boolean) =>
    setNavState((state) => ({ ...state, menuOpen: value }));

  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cmd/Ctrl+K opens search from anywhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header
        className={cn(
          "border-b transition-colors duration-300",
          scrolled
            ? "border-hairline bg-background/85 backdrop-blur-xl"
            : "border-transparent bg-background"
        )}
        onMouseLeave={() => setOpenGroup(null)}
      >
        <div className="rail flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Law Awareness TV, home"
          >
            <Image
              src="/logo-2.webp"
              alt=""
              width={931}
              height={268}
              priority
              className="h-7 w-auto rounded object-contain invert dark:invert-0"
            />
          
          </Link>

          {/*
            Seven groups have to clear 1024px without wrapping, so the bar runs
            a compact tier at `lg` (tighter padding, smaller label) and only
            relaxes to full size at `xl`.
          */}
          <nav aria-label="Primary" className="hidden min-w-0 lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {groups.map((group) => {
                const active =
                  pathname === group.href || pathname.startsWith(`${group.href}/`);
                return (
                  <li key={group.label}>
                    <Link
                      href={group.href}
                      onMouseEnter={() => setOpenGroup(group.label)}
                      onFocus={() => setOpenGroup(group.label)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-[0.82rem] font-bold whitespace-nowrap transition-colors xl:px-3 xl:text-[0.86rem]",
                        active || openGroup === group.label
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {group.label}
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-primary xl:inset-x-3"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-hairline bg-card px-2.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground xl:px-3"
            >
              <Search className="size-4" />
              <span className="hidden text-[0.8rem] font-semibold xl:inline">
                Search
              </span>
              {/* <kbd className="hidden rounded border border-hairline bg-surface px-1.5 py-0.5 text-[0.65rem] font-bold text-muted-foreground xl:inline">
                ⌘K
              </kbd> */}
            </button>

            <ThemeToggle className="" />

            {/*
              The bar is already tight at `lg`, so Donate rides the action
              cluster rather than becoming an eighth group: icon-only at the
              compact tier, and labelled once `xl` has room for the word.
            */}
            <Link
              href="/donate"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-primary/45 px-2.5 text-[0.83rem] font-extrabold whitespace-nowrap text-brand-ink transition-colors hover:bg-primary/10 lg:inline-flex xl:px-3.5"
            >
              <Heart className="size-4" />
              <span className="hidden xl:inline">Donate</span>
              <span className="sr-only xl:hidden">Donate</span>
            </Link>

            <Link
              href="/ask"
              className="hidden h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-[0.83rem] font-extrabold whitespace-nowrap text-primary-foreground transition-opacity hover:opacity-90 lg:inline-flex xl:px-4"
            >
              <span className="xl:hidden">Ask a Question</span>
              <span className="hidden xl:inline">Ask a Legal Question</span>
           
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex size-9 items-center justify-center rounded-full border border-hairline bg-card text-foreground transition-colors hover:border-primary/40 lg:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>

        {/* Desktop section panel */}
        <AnimatePresence>
          {openGroup && (
            <motion.div
              variants={reduce ? undefined : sheet}
              initial={reduce ? { opacity: 0 } : "hidden"}
              animate={reduce ? { opacity: 1 } : "visible"}
              exit={reduce ? { opacity: 0 } : "exit"}
              className="absolute inset-x-0 top-full hidden border-b border-hairline bg-card/97 backdrop-blur-xl lg:block"
              onMouseLeave={() => setOpenGroup(null)}
            >
              <div className="rail py-6">
                {groups
                  .filter((group) => group.label === openGroup)
                  .map((group) => (
                    <div
                      key={group.label}
                      className="grid grid-cols-[minmax(0,1fr)_2.4fr] gap-10"
                    >
                      <div>
                        <p className="text-eyebrow text-brand-ink">
                          {group.label}
                        </p>
                        <Link
                          href={group.href}
                          className="mt-3 inline-flex items-center gap-1.5 text-[0.9rem] font-bold text-foreground link-underline"
                        >
                          Open the full section
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </div>
                      <ul className="grid grid-cols-3 gap-1">
                        {group.links.map((link) => (
                          <li key={`${link.href}-${link.label}`}>
                            <Link
                              href={link.href}
                              className="block rounded-lg p-3 transition-colors hover:bg-muted"
                            >
                              <span className="block text-[0.88rem] font-bold text-foreground">
                                {link.label}
                              </span>
                              {link.description && (
                                <span className="mt-0.5 block text-[0.78rem] leading-snug text-muted-foreground">
                                  {link.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        groups={groups}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={closeSearch}
        entries={searchEntries}
        suggestions={searchSuggestions}
      />
    </>
  );
}
