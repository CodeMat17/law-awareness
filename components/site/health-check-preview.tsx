"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/lib/icons";
import { viewportOnce } from "@/lib/motion";
import type { ComplianceArea } from "@/lib/content/types";

interface HealthCheckPreviewProps {
  areas: ComplianceArea[];
}

/**
 * Preview of the Business Legal Health Check. It shows the *areas* the
 * assessment covers, not a score - a readiness result only ever comes from a
 * user actually completing the assessment.
 */
export function HealthCheckPreview({ areas }: HealthCheckPreviewProps) {
  const reduce = useReducedMotion();

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
      <div>
        <p className="text-eyebrow text-brand-ink">Business legal health check</p>
        {/* The count is derived, never written down: a headline can't claim
            more areas than the assessment actually covers. */}
        <h2 className="text-h2 mt-3.5 text-foreground">
          {areas.length} areas decide whether a legal problem finds your business
        </h2>
        <p className="mt-4 text-[0.98rem] leading-relaxed text-muted-foreground">
          Answer a short set of questions about how your business actually
          operates. You get a readiness picture across each area, the topics
          worth understanding, and a clear signal about where a qualified
          professional should be involved.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {(["Strong", "Needs attention", "High attention"] as const).map(
            (band, index) => (
              <span
                key={band}
                className="inline-flex items-center gap-2 rounded-full border border-hairline bg-card px-3.5 py-2 text-[0.8rem] font-bold text-foreground"
              >
                <span
                  aria-hidden
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: `var(--chart-${index === 0 ? 2 : index === 1 ? 1 : 4})`,
                  }}
                />
                {band}
              </span>
            )
          )}
        </div>

        <Link
          href="/business/health-check"
          className="mt-8 inline-flex h-13 items-center gap-2 rounded-xl bg-primary px-6 text-[0.95rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Start the health check
          <ArrowRight className="size-4" />
        </Link>

      </div>

      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {areas.map((area, index) => {
          return (
            <motion.li
              key={area.id}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                delay: reduce ? 0 : index * 0.035,
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col gap-3 rounded-xl border border-hairline bg-card p-3.5"
            >
              <Icon
                name={area.icon}
                className="size-4.5 text-brand-ink"
                strokeWidth={1.9}
                aria-hidden
              />
              <span className="text-[0.8rem] leading-tight font-bold text-foreground">
                {area.name}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
