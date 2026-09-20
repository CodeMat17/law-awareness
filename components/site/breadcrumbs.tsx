import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "cn";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Breadcrumb trail for every page below the top level. Semantic `nav` + `ol`,
 * with the current page marked rather than linked.
 */
export function Breadcrumbs({
  trail,
  className,
}: {
  trail: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.78rem] font-semibold text-muted-foreground">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {crumb.href && !last ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className={cn(last && "text-foreground")}
                  aria-current={last ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              )}
              {!last && (
                <ChevronRight aria-hidden className="size-3.5 opacity-60" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
