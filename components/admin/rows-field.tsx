"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  parseRows,
  serialiseRows,
  type RowColumn,
  type RowValue,
} from "@/lib/cms/rows";

/**
 * The editor for a repeating field: a page block's `items`, a collection
 * field's `rows`.
 *
 * One component for both. It began inside the block composer, which was the
 * only place structured content could be edited at all; lifting it out is what
 * let every collection have steps, clauses and version histories an editor can
 * actually write, instead of content the site rendered from files nobody in
 * the CMS could reach.
 *
 * The stored value is JSON and never shown. Rows are parsed on the way in and
 * re-serialised on every keystroke, so the caller only ever handles a string
 * and the editor only ever sees labelled inputs.
 *
 * Reordering is buttons rather than drag handles, deliberately: a drag surface
 * cannot be used from a keyboard, and this is a tool people work in all day.
 */

const controlClass = "h-11 w-full rounded-xl text-[0.9rem]";
const areaClass =
  "min-h-24 w-full resize-y rounded-xl text-[0.9rem] leading-relaxed";

export function RowsField({
  columns,
  value,
  onChange,
  addLabel = "Add entry",
  disabled,
}: {
  columns: readonly RowColumn[];
  value: string;
  onChange: (next: string) => void;
  /** Names what a row is, e.g. "Add a step". Falls back to "Add entry". */
  addLabel?: string;
  disabled?: boolean;
}) {
  const rows = parseRows(value);
  const write = (next: RowValue[]) => onChange(serialiseRows(next));

  const setCell = (index: number, column: string, next: string) =>
    write(
      rows.map((row, position) =>
        position === index ? { ...row, [column]: next } : row
      )
    );

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    write(next);
  };

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <p className="rounded-lg border border-dashed border-hairline px-4 py-6 text-center text-[0.8rem] text-muted-foreground">
          Nothing here yet. This section is left off the page until it has
          something in it.
        </p>
      )}

      {rows.map((row, index) => (
        <div
          key={index}
          className="rounded-lg border border-hairline bg-card p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.72rem] font-bold text-muted-foreground">
              {index + 1}
            </p>
            <div className="flex items-center gap-1">
              <IconButton
                label={`Move entry ${index + 1} up`}
                disabled={disabled || index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronUp className="size-3.5" />
              </IconButton>
              <IconButton
                label={`Move entry ${index + 1} down`}
                disabled={disabled || index === rows.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronDown className="size-3.5" />
              </IconButton>
              <IconButton
                label={`Remove entry ${index + 1}`}
                tone="destructive"
                disabled={disabled}
                onClick={() =>
                  write(rows.filter((_, position) => position !== index))
                }
              >
                <Trash2 className="size-3.5" />
              </IconButton>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {columns.map((column) => (
              <div key={column.name}>
                <Label className="text-[0.72rem] font-bold text-muted-foreground">
                  {column.label}
                </Label>
                {column.multiline ? (
                  <Textarea
                    rows={3}
                    disabled={disabled}
                    value={row[column.name] ?? ""}
                    onChange={(event) =>
                      setCell(index, column.name, event.target.value)
                    }
                    className={cn(areaClass, "mt-1")}
                  />
                ) : (
                  <Input
                    type="text"
                    disabled={disabled}
                    value={row[column.name] ?? ""}
                    onChange={(event) =>
                      setCell(index, column.name, event.target.value)
                    }
                    className={cn(controlClass, "mt-1")}
                  />
                )}
                {column.help && (
                  <p className="mt-1 text-[0.72rem] text-muted-foreground">
                    {column.help}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          write([
            ...rows,
            Object.fromEntries(columns.map((column) => [column.name, ""])),
          ])
        }
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-hairline px-3 py-2 text-[0.78rem] font-bold text-muted-foreground transition-colors hover:border-primary/45 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "destructive";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg border border-hairline text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35",
        tone === "destructive" &&
          "hover:border-destructive/45 hover:text-destructive"
      )}
    >
      {children}
    </button>
  );
}
