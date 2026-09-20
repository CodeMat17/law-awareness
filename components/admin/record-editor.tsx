"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleAlert } from "lucide-react";
import { cn } from "cn";
import { saveRecord, type ActionResult } from "@/lib/cms/actions";
import type { FieldDefinition } from "@/lib/cms/collections";
import type { CmsRecord } from "@/lib/cms/repository";
import { FieldGroups } from "./field-groups";

interface RecordEditorProps {
  collectionId: string;
  fields: FieldDefinition[];
  record: CmsRecord;
  canEdit: boolean;
}

/** Generic edit form, rendered from the collection's field definitions. */
export function RecordEditor({
  collectionId,
  fields,
  record,
  canEdit,
}: RecordEditorProps) {
  const [result, formAction] = useActionState<ActionResult | null, FormData>(
    saveRecord,
    null
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-hairline bg-card p-5 sm:p-7"
    >
      <input type="hidden" name="__collection" value={collectionId} />
      <input type="hidden" name="__id" value={record.id} />

      <fieldset disabled={!canEdit}>
        <legend className="sr-only">Record fields</legend>
        {/* Derived fields are omitted here as well as on the create form. The
            slug is fixed at creation - it is the record's id, which cannot
            change - and the series slug is recomputed from the series name on
            save, so neither is something to type. */}
        <FieldGroups
          fields={fields.filter((field) => !field.derivedFrom)}
          valueFor={(field) => record.fields[field.name] ?? ""}
        />
      </fieldset>

      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
        <SubmitButton disabled={!canEdit} />
        <AnimatePresence mode="wait">
          {result && (
            <motion.p
              key={result.message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className={cn(
                "flex items-center gap-2 text-[0.83rem] font-semibold",
                result.ok ? "text-brand-ink" : "text-destructive"
              )}
            >
              {result.ok ? (
                <Check className="size-4" />
              ) : (
                <CircleAlert className="size-4" />
              )}
              {result.message}
            </motion.p>
          )}
        </AnimatePresence>
        {!canEdit && (
          <p className="text-[0.83rem] text-muted-foreground">
            Your role does not permit editing this record.
          </p>
        )}
      </div>
    </form>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 sm:w-auto text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}
