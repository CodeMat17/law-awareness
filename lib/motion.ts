import type { Transition, Variants } from "framer-motion";

/**
 * One motion vocabulary for the whole product.
 *
 * Three speeds, per the spec: fast micro-interactions, medium content
 * transitions, slow cinematic hero moments. Components import from here rather
 * than inventing their own timings, so the interface feels like one product.
 *
 * Reduced motion is handled at the component level with `useReducedMotion()`
 * and globally in `globals.css`.
 */

export const ease = [0.22, 1, 0.36, 1] as const;

export const fast: Transition = { duration: 0.22, ease };
export const medium: Transition = { duration: 0.5, ease };
export const cinematic: Transition = { duration: 0.9, ease };

/** Standard section reveal: content rises a little as it enters the viewport. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: medium },
};

/** Hero-weight reveal - slower, longer travel. */
export const revealSlow: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: cinematic },
};

/** Parent for staggered lists and grids. */
export const stagger = (delayChildren = 0.05, staggerChildren = 0.07): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren, staggerChildren } },
});

/** Viewport config shared by every scroll-triggered section. */
export const viewportOnce = { once: true, amount: 0.25 } as const;

/** Overlay/backdrop fade used by the search overlay and mobile menu. */
export const overlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: fast },
  exit: { opacity: 0, transition: fast },
};

/** Sheet that slides down from the header. */
export const sheet: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease } },
};
