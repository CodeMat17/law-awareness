"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Radio, ShieldCheck } from "lucide-react";
import { cinematic, ease } from "@/lib/motion";
import { HeadlineSwash, HeroGrain } from "./hero-backdrop";
import { HeroEmblems } from "./hero-emblems";
import type { PlatformStat } from "@/lib/content/types";

interface HeroSectionProps {
  stats: PlatformStat[];
  liveTitle?: string;
  /** Whether that session is actually on air, rather than merely scheduled. */
  liveOnAir?: boolean;
}

/**
 * The front page of a national knowledge platform: large editorial type set
 * against a field of law emblems, deep vignetting for depth, and layered
 * translucent panels that hint at the library beneath.
 */
export function HeroSection({
  stats,
  liveTitle,
  liveOnAir = false,
}: HeroSectionProps) {
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

      <div className="rail relative grid gap-12 pt-8 pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16">
        <div className="min-w-0 max-w-2xl">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5"
          >
            <ShieldCheck className="size-3.5 text-brand-ink" />
            <span className="text-eyebrow text-brand-ink">
              Nigerian legal education & awareness
            </span>
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="text-5xl sm:text-6xl md:text-7xl font-black mt-4 text-foreground"
          >
            Know the Law.
            <br />
            Know Your Rights.
            <br />
            <span className="relative inline-block">
              <span className="text-brand-ink">Protect What Matters.</span>
              <HeadlineSwash className="absolute -bottom-1 left-0 h-2.5 w-full sm:-bottom-1.5 sm:h-3" />
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="text-body-lg mt-4 max-w-xl text-muted-foreground"
          >
            Understand Nigerian law, protect yourself, protect your business,
            and know when professional legal help may be necessary.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <Link
              href="/know-the-law"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[0.95rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explore the Law
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/legal-help/problem"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-hairline bg-card px-6 text-[0.95rem] font-extrabold text-foreground transition-colors hover:border-primary/45"
            >
              I Have a Legal Problem
            </Link>
            <Link
              href="/business"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-xl px-6 text-[0.95rem] font-extrabold text-foreground transition-colors hover:bg-muted sm:px-4"
            >
              <span className="link-underline">Protect My Business</span>
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

        <HeroCards
          liveTitle={liveTitle}
          liveOnAir={liveOnAir}
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

interface HeroCardsProps {
  liveTitle?: string;
  liveOnAir?: boolean;
  reduce: boolean;
}

/**
 * Floating information cards. They preview what the platform actually holds:
 * a constitutional right, a live session, and a business risk signal.
 */
function HeroCards({ liveTitle, liveOnAir, reduce }: HeroCardsProps) {
  const float = (offset: number, duration: number) =>
    reduce
      ? {}
      : {
          animate: { y: [0, offset, 0] },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease, delay: 0.2 }}
      className="relative mx-auto w-full max-w-md lg:max-w-none"
    >
      <div className="relative space-y-4">
        <motion.article
          {...float(-9, 7)}
          className="rounded-2xl border border-hairline bg-card/85 p-5 shadow-2xl shadow-foreground/12 ring-1 ring-foreground/5 ring-inset backdrop-blur-xl sm:p-6 lg:-translate-x-6"
        >
          <p className="text-eyebrow text-brand-ink">
            Constitution 1999 · Chapter IV
          </p>
          <h2 className="text-h3 mt-3 text-foreground">
            Every person is entitled to their personal liberty
          </h2>
          <p className="mt-2.5 text-[0.86rem] leading-relaxed text-muted-foreground">
            Section 35 sets out when a person may be deprived of liberty, and
            what must happen next. We explain it in plain language, and say
            clearly where the official text ends and our explanation begins.
          </p>
          <Link
            href="/constitution/chapter-iv"
            className="mt-4 inline-flex items-center gap-1.5 text-[0.84rem] font-bold text-foreground"
          >
            <span className="link-underline">
              Read the plain-language guide
            </span>
            <ArrowRight className="size-3.5 text-brand-ink" />
          </Link>
        </motion.article>

        <div className="grid gap-4 sm:grid-cols-2">
          <motion.article
            {...float(7, 6)}
            className="rounded-2xl border border-hairline bg-forest/92 p-5 text-forest-foreground shadow-xl shadow-foreground/12 ring-1 ring-forest-foreground/10 ring-inset backdrop-blur-xl lg:translate-y-3"
          >
            <p className="flex items-center gap-2">
              {/* The pulsing dot is reserved for a session actually on air. */}
              {liveOnAir ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full rounded-full bg-live opacity-75 motion-safe:animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-live" />
                </span>
              ) : (
                <span
                  aria-hidden
                  className="inline-flex size-2 rounded-full bg-primary"
                />
              )}
              <span className="text-eyebrow text-forest-foreground/80">
                {liveOnAir ? "Live now" : "Live sessions"}
              </span>
            </p>
            <p className="mt-3 text-[0.92rem] leading-snug font-bold">
              {liveTitle ?? "Know Your Rights, explained live"}
            </p>
            <Link
              href="/live"
              className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-primary"
            >
              <Radio className="size-3.5" />
              {liveOnAir ? "Join the session" : "See the schedule"}
            </Link>
          </motion.article>

          <motion.article
            {...float(-6, 8)}
            className="rounded-2xl border border-hairline bg-card/85 p-5 shadow-lg shadow-foreground/8 ring-1 ring-foreground/5 ring-inset backdrop-blur-xl lg:translate-x-4"
          >
            <p className="text-eyebrow text-muted-foreground">
              Business signal
            </p>
            <p className="mt-3 text-[0.92rem] leading-snug font-bold text-foreground">
              Does the Data Protection Act 2023 apply to your company?
            </p>
            <Link
              href="/business/health-check"
              className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-brand-ink"
            >
              Run the health check
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.article>
        </div>
      </div>
    </motion.div>
  );
}
