"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Headphones, Play, Radio } from "lucide-react";
import { cinematic, ease } from "@/lib/motion";
import { HeadlineSwash, HeroGrain } from "./hero-backdrop";
import { HeroEmblems } from "./hero-emblems";
import type { PlatformStat } from "@/lib/content/types";

/** What the hero's screen shows - derived from the schedule, never invented. */
export interface HeroScreen {
  /** `live` only when a session is genuinely on air. */
  status: "live" | "scheduled" | "latest";
  title: string;
  href: string;
  series?: string;
  /** Human label for when it airs, e.g. "Thu 12 Nov, 18:00". */
  when?: string;
  kind: "video" | "podcast" | "live";
}

export interface HeroUpNext {
  id: string;
  title: string;
  href: string;
  /** e.g. "Live · Thu 12 Nov" or "Video · 24 min". */
  label: string;
}

interface HeroSectionProps {
  stats: PlatformStat[];
  screen?: HeroScreen;
  upNext: HeroUpNext[];
}

/**
 * The front page of a television channel: large editorial type set against a
 * field of law emblems, and a screen showing what is on air - or what is next -
 * with the running order beneath it.
 */
export function HeroSection({ stats, screen, upNext }: HeroSectionProps) {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { ...cinematic, delay },
        };

  return (
    <section className="relative isolate overflow-clip">
      <HeroBackdrop />

      <div className="rail relative grid grid-cols-1 gap-12 pt-8 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5"
          >
            <Radio className="size-3.5 text-brand-ink" />
            <span className="text-eyebrow text-brand-ink">
              Law Awareness TV
            </span>
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="text-5xl sm:text-6xl md:text-7xl font-black mt-4 text-foreground"
          >
            Know The Law
            <br />
            <span className="relative inline-block">
              <span className="text-brand-ink">And Be Free</span>
              <HeadlineSwash className="absolute -bottom-1 left-0 h-2.5 w-full sm:-bottom-1.5 sm:h-3" />
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="text-body-lg mt-4 max-w-xl text-muted-foreground"
          >
            Courtroom news, new laws, the police and your rights, and the rules
            for doing business — Nigerian law on TV, explained so everyone can
            follow.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="/live"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.95rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-4 fill-current" />
              Watch Live
            </Link>
            <Link
              href="/programmes"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-hairline bg-card px-6 text-[0.95rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              Browse Programmes
            </Link>
            <Link
              href="/know-the-law/your-rights"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl px-6 text-[0.95rem] font-extrabold text-foreground transition-colors hover:bg-muted sm:px-4"
            >
              <span className="link-underline">Know Your Rights</span>
              <ArrowRight className="size-4 text-brand-ink" />
            </Link>
          </motion.div>

          {/* <motion.dl
            {...rise(0.32)}
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-hairline pt-8 sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <div key={stat.id}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-[1.6rem] leading-none font-extrabold tracking-tight text-brand-ink">
                    {stat.value}
                  </span>
                  <span className="mt-2 block text-[0.82rem] font-bold text-foreground">
                    {stat.label}
                  </span>
                  <span className="mt-1 block text-[0.75rem] leading-snug text-muted-foreground">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            ))}
          </motion.dl> */}
        </div>

        <HeroScreenPanel
          screen={screen}
          upNext={upNext}
          reduce={Boolean(reduce)}
        />
      </div>
    </section>
  );
}

/**
 * Layered backdrop, back to front: tonal ground, key light, cool counterweight,
 * the law emblems, film grain, vignette, then a fade into the page.
 *
 * The order matters — the grain sits above the gradients so it breaks up the
 * soft colour, but below the vignette so the corners still fall away cleanly.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* 1. Tonal ground. The section is never flat colour — it runs from a
             cool deep tone at the lower left to a warm lit corner at the upper
             right, which is what gives the surface somewhere to travel. */}
      <div className="absolute inset-0 [background:linear-gradient(148deg,color-mix(in_oklch,var(--forest),transparent_94%)_0%,transparent_38%,color-mix(in_oklch,var(--brand),transparent_92%)_100%)] dark:[background:linear-gradient(148deg,color-mix(in_oklch,black,transparent_45%)_0%,transparent_42%,color-mix(in_oklch,var(--brand),transparent_86%)_100%)]" />

      {/* 2. The key light, upper right, behind the emblems. */}
      <div className="absolute -top-56 right-[-14%] size-[52rem] rounded-full bg-primary/18 blur-[150px] dark:bg-primary/22" />

      {/* 3. A cool counterweight at the lower left, so the warmth reads as
             directional light rather than an overall tint. */}
      <div className="absolute -bottom-64 -left-32 size-[40rem] rounded-full bg-forest/12 blur-[150px] dark:bg-forest/35" />

      {/* 4. The law emblems — scales, gavel, landmark, scroll, seal — composed
             at watermark strength behind the content. */}
      <HeroEmblems />

      {/* 5. Film grain. The detail that stops the large soft gradients above
             from looking like flat digital colour. */}
      <HeroGrain className="absolute inset-0 size-full opacity-[0.055] mix-blend-overlay dark:opacity-[0.07]" />

      {/* 6. Deep vignette, lifting the centre of the composition forward. */}
      <div className="absolute inset-0 [background:radial-gradient(120%_88%_at_52%_36%,transparent_28%,color-mix(in_oklch,var(--foreground),transparent_86%)_100%)] dark:[background:radial-gradient(120%_88%_at_52%_36%,transparent_24%,color-mix(in_oklch,black,transparent_48%)_100%)]" />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}


const screenBadge: Record<HeroScreen["status"], string> = {
  live: "On air now",
  scheduled: "Up next",
  latest: "New episode",
};

/**
 * The channel's screen: one large 16:9 frame showing the programme on air (or
 * the next one, or the newest episode when nothing is scheduled), with the
 * running order beneath it. The pulsing dot is reserved for a session that is
 * genuinely live.
 */
function HeroScreenPanel({
  screen,
  upNext,
  reduce,
}: {
  screen?: HeroScreen;
  upNext: HeroUpNext[];
  reduce: boolean;
}) {
  const Glyph = screen?.kind === "podcast" ? Headphones : Play;
  const isLive = screen?.status === "live";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease, delay: 0.2 }}
      className="relative mx-auto w-full max-w-xl lg:max-w-none"
    >
      <div className="rounded-[1.6rem] border border-hairline bg-card/75 p-2.5 shadow-2xl shadow-foreground/15 ring-1 ring-foreground/5 ring-inset backdrop-blur-xl">
        {/* The screen */}
        <Link
          href={screen?.href ?? "/watch"}
          className="group relative block aspect-video overflow-hidden rounded-[1.1rem] bg-forest text-forest-foreground"
        >
          <div
            aria-hidden
            className="absolute -top-24 -right-16 size-80 rounded-full bg-primary/30 blur-[90px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 [background:radial-gradient(90%_80%_at_50%_40%,transparent_40%,rgb(0_0_0/0.45)_100%)]"
          />

          {/* Top bar: status and the channel mark */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 sm:p-5">
            <span
              className={
                isLive
                  ? "inline-flex items-center gap-2 rounded-full bg-live px-2.5 py-1 text-[0.7rem] font-extrabold tracking-wide text-live-foreground uppercase"
                  : "inline-flex items-center gap-2 rounded-full bg-forest-foreground/15 px-2.5 py-1 text-[0.7rem] font-extrabold tracking-wide text-forest-foreground uppercase"
              }
            >
              {isLive && (
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full rounded-full bg-live-foreground opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-live-foreground" />
                </span>
              )}
              {screen ? screenBadge[screen.status] : "Law Awareness TV"}
            </span>
            <span className="text-[0.68rem] font-extrabold tracking-[0.18em] text-forest-foreground/70 uppercase">
              Law Awareness TV
            </span>
          </div>

          {/* Play */}
          <span
            aria-hidden
            className="absolute top-1/2 left-1/2 inline-flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-black/30 transition-transform duration-300 group-hover:scale-105 sm:size-20"
          >
            <Glyph className="size-6 translate-x-px sm:size-7" />
          </span>

          {/* Lower third */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4 pt-10 sm:p-5 sm:pt-12">
            {screen?.series && (
              <p className="text-[0.7rem] font-extrabold tracking-wide text-primary uppercase">
                {screen.series}
              </p>
            )}
            <p className="mt-1 line-clamp-2 text-[1rem] leading-snug font-extrabold sm:text-[1.15rem]">
              {screen?.title ?? "Nigerian law, on screen every week"}
            </p>
            {screen?.when && (
              <p className="mt-1 text-[0.75rem] font-semibold text-forest-foreground/75">
                {screen.when}
              </p>
            )}
          </div>
        </Link>

        {/* Running order */}
        {upNext.length > 0 && (
          <div className="px-2 pt-4 pb-1.5">
            <p className="text-eyebrow px-1 text-muted-foreground">Coming up</p>
            <ul className="mt-2 divide-y divide-hairline">
              {upNext.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-1 py-2.5 transition-colors hover:bg-muted/60"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.88rem] font-bold text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] font-semibold text-muted-foreground">
                        {item.label}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-brand-ink transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
