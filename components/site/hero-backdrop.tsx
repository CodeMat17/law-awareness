"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Surface treatments for the hero.
 *
 * The backdrop is a lit surface carrying the law emblems (see
 * `hero-emblems.tsx`): a tonal ground, directional light, and a fine film grain
 * that stops the large soft gradients from reading as flat digital colour.
 *
 * Deliberately absent: grids, meshes, particle fields, arcs, rings.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Fine film grain over the whole hero.
 *
 * Generated with `feTurbulence` rather than an image asset, so it costs no
 * network request and scales to any viewport. Rendered once and static.
 */
export function HeroGrain({ className }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" className={className}>
      <filter id="hero-grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82"
          numOctaves={4}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain-filter)" />
    </svg>
  );
}

/**
 * Hand-drawn brass swash under the closing line of the headline. Draws once,
 * after the headline has settled. Part of the typography, not the backdrop.
 */
export function HeadlineSwash({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 320 12"
      preserveAspectRatio="none"
      className={className}
    >
      <motion.path
        d="M 2 8.5 C 62 3.2, 128 2.4, 190 5.4 S 288 9.4, 318 4.2"
        fill="none"
        stroke="var(--brand)"
        strokeWidth={2.4}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.1, ease: EASE, delay: 0.95 },
          opacity: { duration: 0.3, delay: 0.95 },
        }}
      />
    </svg>
  );
}
