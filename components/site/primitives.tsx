import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { cn } from "cn";
import { Icon } from "@/lib/icons";
import type {
  EditorialMeta,
  ReviewStatus,
  SourceReference as SourceRef,
} from "@/lib/content/types";

/* -------------------------------------------------------------------------- */
/* Section furniture                                                           */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  align?: "start" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="text-eyebrow flex items-center gap-2 text-brand-ink">
          <span
            aria-hidden
            className="inline-block h-px w-6 bg-primary"
          />
          {eyebrow}
        </p>
        <h2 className="text-h2 mt-3.5 text-foreground">{title}</h2>
        {description && (
          <p className="mt-3 text-[0.98rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-[0.88rem] font-bold text-foreground"
        >
          <span className="link-underline">{action.label}</span>
          <ArrowRight className="size-4 text-brand-ink transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/** Full-width section wrapper that keeps vertical rhythm consistent. */
export function Section({
  children,
  className,
  id,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "surface" | "forest";
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-20 lg:py-28",
        // A section never widens the document: decorative glows and wide grids
        // are clipped here rather than becoming a horizontal scrollbar.
        "overflow-x-clip",
        tone === "surface" && "bg-surface",
        tone === "forest" && "bg-forest text-forest-foreground",
        className
      )}
    >
      <div className="rail">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Credibility                                                                 */
/* -------------------------------------------------------------------------- */

const reviewCopy: Record<ReviewStatus, { label: string; className: string }> = {
  educational: {
    label: "Educational",
    className: "bg-muted text-muted-foreground",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-primary/18 text-brand-ink",
  },
  updated: {
    label: "Updated",
    className: "bg-chart-3/18 text-foreground",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground line-through",
  },
};

/**
 * Credibility badge. `reviewed` is only ever rendered when the content record
 * genuinely carries a human reviewer - never inferred.
 */
export function ReviewBadge({
  meta,
  className,
}: {
  meta: EditorialMeta;
  className?: string;
}) {
  const status = reviewCopy[meta.review];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold tracking-wide uppercase",
        status.className,
        className
      )}
      title={
        meta.reviewedBy
          ? `Reviewed by ${meta.reviewedBy} on ${meta.lastReviewed}`
          : `Last reviewed ${meta.lastReviewed}`
      }
    >
      {status.label}
    </span>
  );
}

export function SourceReference({
  source,
  className,
}: {
  source: SourceRef;
  className?: string;
}) {
  const content = (
    <>
      <span className="font-semibold text-foreground">{source.label}</span>
      {source.citation && (
        <span className="text-muted-foreground"> — {source.citation}</span>
      )}
    </>
  );

  return (
    <p
      className={cn(
        "flex items-start gap-2 text-[0.78rem] leading-snug",
        className
      )}
    >
      <span className="text-eyebrow mt-0.5 shrink-0 text-muted-foreground">
        Source
      </span>
      {source.url ? (
        <Link
          href={source.url}
          className="inline-flex items-start gap-1 link-underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
          <ExternalLink className="mt-0.5 size-3 shrink-0" />
        </Link>
      ) : (
        <span>{content}</span>
      )}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Small parts                                                                 */
/* -------------------------------------------------------------------------- */

export function Pill({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "muted" | "brand" | "live" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-extrabold tracking-wide uppercase",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "brand" && "bg-primary/18 text-brand-ink",
        tone === "live" && "bg-live text-live-foreground",
        tone === "outline" && "border border-hairline text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
}

export function IconBadge({
  name,
  className,
  tone = "brand",
}: {
  name: string;
  className?: string;
  tone?: "brand" | "surface";
}) {
  return (
    <span
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
        tone === "brand" && "bg-primary/15 text-brand-ink",
        tone === "surface" && "bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon name={name} className="size-[1.15rem]" strokeWidth={1.9} />
    </span>
  );
}
