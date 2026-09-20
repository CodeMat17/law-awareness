"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, CircleAlert } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { createRecord, type ActionResult } from "@/lib/cms/actions";
import type { FieldDefinition } from "@/lib/cms/collections";
import { FieldGroups } from "./field-groups";

interface RecordCreatorProps {
  collectionId: string;
  singular: string;
  fields: FieldDefinition[];
  /** Whether this editor may publish, which decides if the shortcut shows. */
  canPublish: boolean;
}

/**
 * Generic create form, rendered from the same field definitions as the edit
 * form.
 *
 * Fields marked `derivedFrom` in the registry are not rendered. The slug and
 * the series slug are made from the title and the series name on the server,
 * which is both fewer things to type and one fewer way to be wrong: a slug
 * cannot drift from the title it names, and a series reference cannot point at
 * a series that does not exist.
 *
 * A successful create stays here and empties the form for the next record,
 * rather than opening the one just made. Content is written in runs, and a
 * navigation between every item makes a batch of twenty into forty screens.
 * The result carries a link to the new record for the times it is wanted.
 */
export function RecordCreator({
  collectionId,
  singular,
  fields,
  canPublish,
}: RecordCreatorProps) {
  /**
   * Bumped on every successful create to re-key the controls below.
   *
   * A `form.reset()` would clear the plain inputs and leave the rest: the
   * select, the date picker and the upload field each hold their value in
   * React state, and resetting the DOM does not reach it. Remounting the
   * subtree clears both in one move, and the browser's own reset behaviour
   * stops mattering.
   */
  const [generation, setGeneration] = useState(0);

  // The bump happens in the action rather than in an effect watching the
  // result: the action is where the create actually finished, so the form
  // clears once per submission instead of once per render that happens to see
  // a successful result sitting on screen.
  const [result, formAction] = useActionState<ActionResult | null, FormData>(
    async (previous, formData) => {
      const next = await createRecord(previous, formData);
      if (next.ok) setGeneration((current) => current + 1);
      return next;
    },
    null
  );

  // Locked fields are omitted here as well as on the edit form: a value that
  // may never be changed is not one to be typed either, and the collections
  // that carry them are fixed sets that reach this form at all.
  const visible = fields.filter(
    (field) => !field.derivedFrom && !field.locked
  );

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-hairline bg-card p-5 sm:p-7"
    >
      <input type="hidden" name="__collection" value={collectionId} />

      <div key={generation}>
        <fieldset>
          <legend className="sr-only">New {singular.toLowerCase()}</legend>
          <FieldGroups fields={visible} valueFor={() => ""} />
        </fieldset>

        {canPublish && (
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-muted/40 p-4">
            <input
              type="checkbox"
              name="__publish"
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <span className="text-[0.84rem] leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">
                Publish straight away
              </span>
              <br />
              Skips draft and review. Leave this unticked to save a draft and
              publish it later from the record&rsquo;s own page.
            </span>
          </label>
        )}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
        <SubmitButton singular={singular} />
        <AnimatePresence mode="wait">
          {result && (
            <motion.p
              key={`${generation}-${result.message}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className={cn(
                "flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.83rem] font-semibold",
                result.ok ? "text-brand-ink" : "text-destructive"
              )}
            >
              {result.ok ? (
                <Check className="size-4" />
              ) : (
                <CircleAlert className="size-4" />
              )}
              {result.message}
              {result.ok && result.href && (
                <Link
                  href={result.href}
                  className="link-underline inline-flex items-center gap-1 text-foreground"
                >
                  Open it
                  <ArrowUpRight className="size-3.5" />
                </Link>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}

function SubmitButton({ singular }: { singular: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-xl px-6 text-[0.88rem] font-extrabold sm:w-auto"
    >
      {pending ? "Creating…" : `Create ${singular.toLowerCase()}`}
    </Button>
  );
}
