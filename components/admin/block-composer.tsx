"use client";

import { useActionState, useCallback, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { savePageBlocks, type ActionResult } from "@/lib/cms/actions";
import {
  blockDefinitions,
  getBlock,
  type BlockDefinition,
  type BlockFieldDefinition,
  type PageBlock,
} from "@/lib/cms/blocks";
import { IconButton, RowsField } from "./rows-field";

/**
 * The page composer: add, reorder, edit and remove the blocks that make up a
 * page.
 *
 * State lives here rather than in the DOM because blocks are ordered and
 * nested, and a reorder has to move a whole subtree of values with it -
 * something uncontrolled inputs cannot do without re-keying the entire form
 * and losing what the editor has typed. On submit the whole list is serialised
 * into one hidden field; lib/cms/actions.ts re-derives it against the block
 * registry, so nothing here is trusted.
 *
 * Editing a block is deliberately plain: every field is a labelled input, and
 * the reordering controls are buttons rather than drag handles. A drag surface
 * would be unusable by keyboard, and this is a tool people have to be able to
 * work in all day.
 */

/** Matches the record forms, which size the same controls for a dense form. */
const controlClass = "h-11 w-full rounded-xl text-[0.9rem]";
const areaClass = "min-h-24 w-full resize-y rounded-xl text-[0.9rem] leading-relaxed";

interface BlockComposerProps {
  collectionId: string;
  recordId: string;
  blocks: PageBlock[];
  canEdit: boolean;
  /**
   * Block types this page may use. Platform documents take policy sections
   * only, because they render through the numbered reading layout where a card
   * grid would have nowhere to go.
   */
  allowed?: string[];
}

let counter = 0;

/** A key unique within this editing session, so React never reuses a row. */
function newKey(type: string): string {
  counter += 1;
  return `${type}-${Date.now().toString(36)}-${counter}`;
}

function emptyBlock(definition: BlockDefinition): PageBlock {
  const data: Record<string, string> = {};
  for (const field of definition.fields) {
    // A select with no value posts its first option anyway, so start it there
    // rather than letting the stored value disagree with what is displayed.
    data[field.name] =
      field.kind === "select" ? (field.options?.[0]?.value ?? "") : "";
  }
  return { key: newKey(definition.type), type: definition.type, data };
}

export function BlockComposer({
  collectionId,
  recordId,
  blocks: initial,
  canEdit,
  allowed,
}: BlockComposerProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initial);
  const [result, formAction] = useActionState<ActionResult | null, FormData>(
    savePageBlocks,
    null
  );

  const palette = useMemo(
    () =>
      blockDefinitions.filter(
        (definition) => !allowed || allowed.includes(definition.type)
      ),
    [allowed]
  );

  const setData = useCallback(
    (index: number, name: string, value: string) => {
      setBlocks((current) =>
        current.map((block, position) =>
          position === index
            ? { ...block, data: { ...block.data, [name]: value } }
            : block
        )
      );
    },
    []
  );

  const move = useCallback((index: number, delta: number) => {
    setBlocks((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setBlocks((current) => current.filter((_, position) => position !== index));
  }, []);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-hairline bg-card p-5 sm:p-7"
    >
      <input type="hidden" name="__collection" value={collectionId} />
      <input type="hidden" name="__id" value={recordId} />
      <input type="hidden" name="__blocks" value={JSON.stringify(blocks)} />

      <header className="flex flex-col gap-2 border-b border-hairline pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[0.95rem] font-bold text-foreground">
            Page content
          </h2>
          <p className="mt-1 text-[0.8rem] text-muted-foreground">
            The sections of this page, in the order they appear on it.
          </p>
        </div>
        <p className="shrink-0 text-[0.78rem] font-bold text-muted-foreground">
          {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
        </p>
      </header>

      <fieldset disabled={!canEdit} className="mt-5 space-y-4">
        <legend className="sr-only">Content blocks</legend>

        {blocks.length === 0 && (
          <p className="rounded-xl border border-dashed border-hairline px-4 py-10 text-center text-[0.85rem] text-muted-foreground">
            This page has no content yet. Add a block below.
          </p>
        )}

        {blocks.map((block, index) => (
          <BlockCard
            key={block.key}
            block={block}
            index={index}
            total={blocks.length}
            onChange={setData}
            onMove={move}
            onRemove={remove}
          />
        ))}
      </fieldset>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="text-[0.82rem] font-bold text-foreground">Add a block</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {palette.map((definition) => (
            <button
              key={definition.type}
              type="button"
              disabled={!canEdit}
              title={definition.description}
              onClick={() =>
                setBlocks((current) => [...current, emptyBlock(definition)])
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-background px-3.5 py-2 text-[0.8rem] font-bold text-foreground transition-colors hover:border-primary/45 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-3.5 text-brand-ink" />
              {definition.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-hairline pt-5">
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
            Your role does not permit editing this page.
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
      className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-6 text-[0.88rem] font-extrabold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {pending ? "Saving…" : "Save page content"}
    </button>
  );
}

function BlockCard({
  block,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  block: PageBlock;
  index: number;
  total: number;
  onChange: (index: number, name: string, value: string) => void;
  onMove: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
}) {
  const definition = getBlock(block.type);

  // A block whose type is no longer registered still has to be visible and
  // removable - silently dropping it would delete an editor's content without
  // ever telling them it was there.
  if (!definition) {
    return (
      <article className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
        <p className="text-[0.85rem] font-bold text-foreground">
          Unknown block type “{block.type}”
        </p>
        <p className="mt-1 text-[0.78rem] text-muted-foreground">
          This block is not in the current registry and will be dropped when the
          page is saved.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-hairline bg-background p-4 sm:p-5">
      <header className="flex items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="min-w-0">
          <p className="text-[0.86rem] font-bold text-foreground">
            {definition.label}
          </p>
          <p className="mt-0.5 truncate text-[0.76rem] text-muted-foreground">
            {block.data.heading || definition.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton
            label={`Move ${definition.label} up`}
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
          >
            <ChevronUp className="size-4" />
          </IconButton>
          <IconButton
            label={`Move ${definition.label} down`}
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
          >
            <ChevronDown className="size-4" />
          </IconButton>
          <IconButton
            label={`Remove ${definition.label}`}
            onClick={() => onRemove(index)}
            tone="destructive"
          >
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </header>

      <div className="mt-4 space-y-4">
        {definition.fields.map((field) => (
          <BlockField
            key={field.name}
            field={field}
            blockKey={block.key}
            value={block.data[field.name] ?? ""}
            onChange={(value) => onChange(index, field.name, value)}
          />
        ))}
      </div>
    </article>
  );
}

function BlockField({
  field,
  blockKey,
  value,
  onChange,
}: {
  field: BlockFieldDefinition;
  blockKey: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `${blockKey}-${field.name}`;
  const describedBy = field.help ? `${id}-help` : undefined;

  return (
    <div>
      <Label
        htmlFor={field.kind === "items" ? undefined : id}
        className="text-[0.8rem] font-bold text-foreground"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 text-brand-ink" aria-hidden>
            *
          </span>
        )}
      </Label>

      <div className="mt-2">
        {field.kind === "items" ? (
          <RowsField
            columns={field.itemFields ?? []}
            value={value}
            onChange={onChange}
          />
        ) : field.kind === "textarea" ? (
          <Textarea
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-describedby={describedBy}
            rows={4}
            className={areaClass}
          />
        ) : field.kind === "select" ? (
          <Select
            value={value}
            onValueChange={(next) => onChange(String(next ?? ""))}
            items={field.options ?? []}
          >
            <SelectTrigger
              id={id}
              aria-describedby={describedBy}
              className={controlClass}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={id}
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-describedby={describedBy}
            className={controlClass}
          />
        )}
      </div>

      {field.help && (
        <p
          id={describedBy}
          className="mt-1.5 text-[0.75rem] text-muted-foreground"
        >
          {field.help}
        </p>
      )}
    </div>
  );
}
