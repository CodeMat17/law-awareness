"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  FileCheck,
  Gavel,
  Handshake,
  Landmark,
  Scale,
  Scroll,
  ShieldCheck,
  Stamp,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";

/**
 * The hero's law-emblem background.
 *
 * Composed rather than tiled: a scales-of-justice emblem anchors the right
 * side, a civic landmark sits deeper in the field, and a scatter of smaller
 * instruments fills the space between them at varied scale, rotation and
 * weight. All kept small enough to stay texture rather than illustration.
 *
 * The rules that keep this from looking like clip-art:
 *  - Nothing repeats on a grid, and no two glyphs share a size.
 *  - Opacity stays low (3%–9%), so they read as watermark, never as content.
 *  - Everything is stroked from theme tokens, so it inverts with the theme.
 *  - A mask fades the whole layer out behind the headline.
 */

interface Emblem {
  icon: LucideIcon;
  /** Percentage position within the hero. */
  left: string;
  top: string;
  size: number;
  rotate: number;
  /** Tailwind text colour class — drives the stroke. */
  tone: string;
  strokeWidth: number;
  /** Float distance in px; 0 holds it still. */
  drift: number;
  duration: number;
  delay: number;
}

const EMBLEMS: Emblem[] = [
  // The anchor: a scales watermark behind the cards.
  {
    icon: Scale,
    left: "70%",
    top: "14%",
    size: 272,
    rotate: -8,
    tone: "text-brand-ink/[0.07] dark:text-brand-ink/[0.09]",
    strokeWidth: 1.1,
    drift: -9,
    duration: 13,
    delay: 0,
  },
  // A civic counterweight, deeper in the field.
  {
    icon: Landmark,
    left: "46%",
    top: "52%",
    size: 176,
    rotate: 5,
    tone: "text-foreground/[0.045] dark:text-foreground/[0.06]",
    strokeWidth: 1.1,
    drift: 7,
    duration: 16,
    delay: 0.15,
  },
  // Mid-scale instruments.
  {
    icon: Gavel,
    left: "86%",
    top: "62%",
    size: 88,
    rotate: -16,
    tone: "text-brand-ink/[0.13] dark:text-brand-ink/[0.16]",
    strokeWidth: 1,
    drift: -9,
    duration: 9,
    delay: 0.3,
  },
  {
    icon: Scroll,
    left: "55%",
    top: "16%",
    size: 70,
    rotate: 11,
    tone: "text-foreground/[0.08] dark:text-foreground/[0.1]",
    strokeWidth: 1,
    drift: 8,
    duration: 11,
    delay: 0.4,
  },
  {
    icon: ShieldCheck,
    left: "93%",
    top: "18%",
    size: 62,
    rotate: 7,
    tone: "text-brand-ink/[0.12] dark:text-brand-ink/[0.15]",
    strokeWidth: 1.1,
    drift: -7,
    duration: 10,
    delay: 0.5,
  },
  {
    icon: BookOpen,
    left: "72%",
    top: "80%",
    size: 78,
    rotate: -6,
    tone: "text-foreground/[0.07] dark:text-foreground/[0.09]",
    strokeWidth: 1,
    drift: 9,
    duration: 12,
    delay: 0.6,
  },
  // Small punctuation.
  {
    icon: Stamp,
    left: "49%",
    top: "76%",
    size: 48,
    rotate: 14,
    tone: "text-brand-ink/[0.11] dark:text-brand-ink/[0.14]",
    strokeWidth: 1.2,
    drift: -6,
    duration: 8,
    delay: 0.7,
  },
  {
    icon: FileCheck,
    left: "96%",
    top: "42%",
    size: 52,
    rotate: -10,
    tone: "text-foreground/[0.075] dark:text-foreground/[0.095]",
    strokeWidth: 1.2,
    drift: 6,
    duration: 9.5,
    delay: 0.8,
  },
  {
    icon: Handshake,
    left: "61%",
    top: "92%",
    size: 56,
    rotate: 4,
    tone: "text-foreground/[0.06] dark:text-foreground/[0.08]",
    strokeWidth: 1.1,
    drift: -7,
    duration: 10.5,
    delay: 0.9,
  },
];

export function HeroEmblems({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 overflow-hidden",
        // Holds the emblems clear of the headline on the left, and lets the
        // field dissolve at the bottom into the page.
        "[mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.25)_26%,black_52%,black_100%)]",
        className
      )}
    >
      {EMBLEMS.map((emblem, index) => {
        const Glyph = emblem.icon;
        return (
          <motion.div
            key={`${emblem.left}-${emblem.top}`}
            className={cn("absolute", emblem.tone)}
            style={{
              left: emblem.left,
              top: emblem.top,
              // Centre each glyph on its anchor point.
              translate: "-50% -50%",
            }}
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: [0, emblem.drift, 0] }
            }
            transition={
              reduce
                ? undefined
                : {
                    opacity: { duration: 1.2, delay: 0.35 + index * 0.07 },
                    scale: { duration: 1.4, delay: 0.35 + index * 0.07 },
                    y: {
                      duration: emblem.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: emblem.delay,
                    },
                  }
            }
          >
            <Glyph
              style={{
                width: emblem.size,
                height: emblem.size,
                rotate: `${emblem.rotate}deg`,
              }}
              strokeWidth={emblem.strokeWidth}
              absoluteStrokeWidth
            />
          </motion.div>
        );
      })}
    </div>
  );
}
