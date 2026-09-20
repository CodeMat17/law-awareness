"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Check, CircleAlert, Trash2 } from "lucide-react";
import { cn } from "cn";
import {
  deleteRecord,
  transitionRecord,
  type ActionResult,
} from "@/lib/cms/actions";
import { workflowOptions } from "@/lib/cms/collections";
import type { WorkflowStatus } from "@/lib/content/types";

interface WorkflowControlsProps {
  collectionId: string;
  recordId: string;
  status: WorkflowStatus;
  canPublish: boolean;
  canDelete: boolean;
}

/**
 * Workflow transitions and deletion. Publishing and archiving require an
 * editor; deletion requires an admin — enforced again on the server.
 */
export function WorkflowControls({
  collectionId,
  recordId,
  status,
  canPublish,
  canDelete,
}: WorkflowControlsProps) {
  const [result, transitionAction] = useActionState<
    ActionResult | null,
    FormData
  >(transitionRecord, null);
  const [deleteResult, deleteAction] = useActionState<
    ActionResult | null,
    FormData
  >(deleteRecord, null);
  const [confirming, setConfirming] = useState(false);

  return (
    <section className="rounded-2xl border border-hairline bg-card p-5">
      <h2 className="text-caption text-foreground">Workflow</h2>
      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
        Only published records are visible to readers.
      </p>

      <div className="mt-4 space-y-2">
        {workflowOptions.map((option) => {
          const isCurrent = option.value === status;
          const restricted =
            (option.value === "published" || option.value === "archived") &&
            !canPublish;

          return (
            <form key={option.value} action={transitionAction}>
              <input type="hidden" name="__collection" value={collectionId} />
              <input type="hidden" name="__id" value={recordId} />
              <input type="hidden" name="status" value={option.value} />
              <TransitionButton
                label={option.label}
                isCurrent={isCurrent}
                disabled={isCurrent || restricted}
              />
            </form>
          );
        })}
      </div>

      {result && (
        <p
          role="status"
          className={cn(
            "mt-4 flex items-center gap-2 text-[0.8rem] font-semibold",
            result.ok ? "text-brand-ink" : "text-destructive"
          )}
        >
          {result.ok ? (
            <Check className="size-3.5" />
          ) : (
            <CircleAlert className="size-3.5" />
          )}
          {result.message}
        </p>
      )}

      {canDelete && (
        <div className="mt-6 border-t border-hairline pt-5">
          {confirming ? (
            <form action={deleteAction} className="space-y-3">
              <input type="hidden" name="__collection" value={collectionId} />
              <input type="hidden" name="__id" value={recordId} />
              <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
                This permanently removes the record. Legal content history
                should be archived rather than deleted wherever possible.
              </p>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-lg bg-destructive/12 px-3.5 text-[0.8rem] font-extrabold text-destructive transition-colors hover:bg-destructive/20"
                >
                  Delete permanently
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="inline-flex h-9 items-center rounded-lg px-3.5 text-[0.8rem] font-bold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-1.5 text-[0.8rem] font-bold text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Delete record
            </button>
          )}
          {deleteResult && !deleteResult.ok && (
            <p role="status" className="mt-3 text-[0.8rem] text-destructive">
              {deleteResult.message}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function TransitionButton({
  label,
  isCurrent,
  disabled,
}: {
  label: string;
  isCurrent: boolean;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-current={isCurrent ? "true" : undefined}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-[0.85rem] font-bold transition-colors",
        isCurrent
          ? "border-primary bg-primary/15 text-brand-ink"
          : "border-hairline bg-background text-foreground hover:border-primary/45",
        disabled && !isCurrent && "cursor-not-allowed opacity-45"
      )}
    >
      {label}
      {isCurrent && <Check className="size-3.5" />}
    </button>
  );
}
