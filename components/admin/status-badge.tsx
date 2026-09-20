import { cn } from "cn";
import type { WorkflowStatus } from "@/lib/content/types";

const styles: Record<WorkflowStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  review: "bg-primary/18 text-brand-ink",
  published: "bg-chart-2/18 text-foreground",
  archived: "bg-muted text-muted-foreground line-through",
};

const labels: Record<WorkflowStatus, string> = {
  draft: "Draft",
  review: "In review",
  published: "Published",
  archived: "Archived",
};

/** Workflow state. Shape and text carry the meaning, never colour alone. */
export function StatusBadge({
  status,
  className,
}: {
  status: WorkflowStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[0.68rem] font-extrabold tracking-wide uppercase",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
