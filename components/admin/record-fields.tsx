"use client";

import * as React from "react";
import { CalendarIcon, Lock } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldDefinition } from "@/lib/cms/collections";
import type { RowColumn } from "@/lib/cms/rows";
import { MediaUploadField } from "./media-upload-field";
import { RowsField } from "./rows-field";

/**
 * One form control, rendered from a field definition.
 *
 * Shared by the edit form and the create form so a collection's fields look
 * and behave the same whether a record is being made or changed - adding a
 * field to the registry has to reach both screens without touching either.
 *
 * Every control here is the design-system component rather than the browser's
 * own, so the admin renders identically across browsers and picks up the
 * site's theme. The one consequence worth knowing is that the select and the
 * date picker are not native form controls: each keeps its value in a hidden
 * input so the surrounding `<form>` still posts a plain string to the server
 * action, which is what the CMS stores.
 */

/** Controls are sized for a dense form, wider than the compact default. */
const controlClass = "h-11 w-full rounded-xl text-[0.9rem]";

interface FieldProps {
  field: FieldDefinition;
  defaultValue: string;
}

export function Field({ field, defaultValue }: FieldProps) {
  const id = `field-${field.name}`;
  const describedBy = field.help ? `${id}-help` : undefined;

  if (field.locked) return <LockedField field={field} value={defaultValue} />;

  return (
    <div>
      <Label
        htmlFor={field.kind === "rows" ? undefined : id}
        className="text-[0.82rem] font-bold text-foreground"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 text-brand-ink" aria-hidden>
            *
          </span>
        )}
      </Label>

      <div className="mt-2">
        <Control
          field={field}
          id={id}
          describedBy={describedBy}
          defaultValue={defaultValue}
        />
      </div>

      {field.help && (
        <p
          id={describedBy}
          className="mt-1.5 text-[0.76rem] text-muted-foreground"
        >
          {field.help}
        </p>
      )}
    </div>
  );
}

/**
 * A value the record carries but nobody edits.
 *
 * Shown rather than hidden, because an editor checking they have opened the
 * right page reads the address to confirm it - and a field that simply is not
 * there reads as a field somebody lost. There is no input and no form control,
 * so the value cannot be submitted at all: the server merges what the form
 * sends into what is stored, and what is not sent is left alone.
 */
function LockedField({
  field,
  value,
}: {
  field: FieldDefinition;
  value: string;
}) {
  const label = field.kind === "select" ? labelForOption(field, value) : value;

  return (
    <div>
      <p className="flex items-center gap-1.5 text-[0.82rem] font-bold text-foreground">
        {field.label}
        <Lock className="size-3 text-muted-foreground" aria-hidden />
        <span className="sr-only">(cannot be changed)</span>
      </p>
      <p className="mt-2 flex h-11 items-center rounded-xl border border-dashed border-hairline bg-muted/50 px-3.5 text-[0.9rem] font-semibold text-muted-foreground">
        {label || "—"}
      </p>
      {field.help && (
        <p className="mt-1.5 text-[0.76rem] text-muted-foreground">
          {field.help}
        </p>
      )}
    </div>
  );
}

/** The wording an editor was shown for a stored select value. */
function labelForOption(field: FieldDefinition, value: string) {
  return field.options?.find((option) => option.value === value)?.label ?? value;
}

function Control({
  field,
  id,
  describedBy,
  defaultValue,
}: FieldProps & { id: string; describedBy?: string }) {
  if (field.kind === "image" || field.kind === "video") {
    return (
      <MediaUploadField
        id={id}
        name={field.name}
        kind={field.kind}
        defaultValue={defaultValue}
        describedBy={describedBy}
      />
    );
  }

  if (field.kind === "rows") {
    return (
      <RowsControl
        name={field.name}
        defaultValue={defaultValue}
        columns={field.columns ?? []}
        addLabel={field.addLabel}
      />
    );
  }

  if (field.kind === "textarea" || field.kind === "list") {
    return (
      <Textarea
        id={id}
        name={field.name}
        defaultValue={defaultValue}
        required={field.required}
        aria-describedby={describedBy}
        rows={4}
        className="min-h-24 w-full resize-y rounded-xl text-[0.9rem] leading-relaxed"
      />
    );
  }

  if (field.kind === "select") {
    return (
      <SelectControl
        id={id}
        name={field.name}
        describedBy={describedBy}
        defaultValue={defaultValue}
        required={field.required}
        options={field.options ?? []}
      />
    );
  }

  if (field.kind === "date") {
    return (
      <DateControl
        id={id}
        name={field.name}
        describedBy={describedBy}
        defaultValue={defaultValue}
        required={field.required}
      />
    );
  }

  return (
    <Input
      id={id}
      name={field.name}
      type={field.kind === "number" ? "number" : "text"}
      inputMode={field.kind === "number" ? "numeric" : undefined}
      defaultValue={defaultValue}
      required={field.required}
      aria-describedby={describedBy}
      className={controlClass}
    />
  );
}

/**
 * A repeating field whose rows are mirrored into a hidden input as JSON.
 *
 * The same arrangement the select and the date picker use: the control is a
 * React one, and the surrounding `<form>` still posts a plain string, so the
 * server action reads rows exactly as it reads every other field.
 */
function RowsControl({
  name,
  defaultValue,
  columns,
  addLabel,
}: {
  name: string;
  defaultValue: string;
  columns: RowColumn[];
  addLabel?: string;
}) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <RowsField
        columns={columns}
        value={value}
        onChange={setValue}
        addLabel={addLabel}
      />
    </>
  );
}

/**
 * A select whose chosen value is mirrored into a hidden input.
 *
 * The first option is preselected when a record has no value yet, matching
 * what the native select did: every select in the registry is a closed list
 * with a sensible first entry, so there is no empty state to represent.
 */
function SelectControl({
  id,
  name,
  describedBy,
  defaultValue,
  required,
  options,
}: {
  id: string;
  name: string;
  describedBy?: string;
  defaultValue: string;
  required?: boolean;
  options: { value: string; label: string }[];
}) {
  const initial =
    options.find((option) => option.value === defaultValue)?.value ??
    options[0]?.value ??
    "";
  const [selected, setSelected] = React.useState(initial);

  return (
    <>
      <input type="hidden" name={name} value={selected} />
      <Select
        value={selected}
        onValueChange={(next) => setSelected(String(next ?? ""))}
        items={options}
      >
        <SelectTrigger
          id={id}
          aria-describedby={describedBy}
          aria-required={required}
          className={controlClass}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

/**
 * The earliest month the date picker offers.
 *
 * 1960 rather than something arbitrary: this CMS records the history of
 * Nigerian law, so instruments predating independence are content an editor
 * legitimately dates.
 */
const CALENDAR_START = new Date(1960, 0);

/** Dates are stored as `yyyy-mm-dd` strings, the format the CMS fields hold. */
function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Parses a stored `yyyy-mm-dd` value.
 *
 * Built from parts rather than `new Date(string)`, which reads a bare date as
 * UTC midnight and can land the picker on the previous day west of Greenwich.
 */
function fromIsoDate(value: string): Date | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3])
  );
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * A date picker with month and year chosen separately.
 *
 * `captionLayout="dropdown"` gives the calendar its own month and year menus,
 * so reaching a date years away is two choices rather than a long run of
 * clicks on the arrows - which matters here, where editors date judgments and
 * amendments decades back.
 */
function DateControl({
  id,
  name,
  describedBy,
  defaultValue,
  required,
}: {
  id: string;
  name: string;
  describedBy?: string;
  defaultValue: string;
  required?: boolean;
}) {
  const [date, setDate] = React.useState<Date | undefined>(() =>
    fromIsoDate(defaultValue)
  );
  const [open, setOpen] = React.useState(false);

  // Far enough ahead for a commencement date already on the calendar, without
  // offering a year no editor has a reason to pick.
  const endMonth = React.useMemo(
    () => new Date(new Date().getFullYear() + 5, 11),
    []
  );

  return (
    <>
      {/* Deliberately not `required`, for the same reason the upload field is
          not: a hidden invalid control makes the browser refuse to submit
          while having nothing to focus, so the editor gets a dead button and
          no message. The server action enforces required fields and can say
          which one is missing. */}
      <input type="hidden" name={name} value={date ? toIsoDate(date) : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              type="button"
              variant="outline"
              aria-describedby={describedBy}
              aria-required={required}
              className={cn(
                controlClass,
                "justify-start px-3.5 font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4 shrink-0" />
              {date
                ? date.toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Pick a date"}
            </Button>
          }
        />
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"
            startMonth={CALENDAR_START}
            endMonth={endMonth}
            onSelect={(next) => {
              setDate(next);
              setOpen(false);
            }}
          />
          {date && (
            <div className="border-t border-hairline p-2">
              <Button
                type="button"
                variant="ghost"
                className="w-full text-[0.8rem]"
                onClick={() => {
                  setDate(undefined);
                  setOpen(false);
                }}
              >
                Clear date
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
