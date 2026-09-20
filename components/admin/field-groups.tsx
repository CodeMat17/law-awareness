"use client";

import type { FieldDefinition } from "@/lib/cms/collections";
import { Field } from "./record-fields";

/**
 * A record's fields, drawn as sections rather than one long column.
 *
 * The admin renders whatever the registry declares, and some collections
 * declare a lot: a case carries twenty-odd fields, a media item nineteen. As
 * one stack they read as an undifferentiated wall, and the fields that decide
 * where a record actually appears - a video's Format, a topic's area - sit
 * somewhere in the middle of it with nothing to mark them out.
 *
 * Grouping is declared per field (`group` in the registry) rather than
 * inferred, and the order is the order fields are declared in. Ungrouped
 * fields lead the form: that is a record's identity - its title, its slug
 * source - and it belongs above everything else.
 *
 * Shared by the create and edit forms so a field cannot appear in one section
 * on one screen and another on the other.
 */

export interface FieldGroup {
  /** Undefined for the leading, ungrouped fields. */
  heading?: string;
  fields: FieldDefinition[];
}

/**
 * Splits fields into their declared groups, preserving declaration order.
 *
 * A group is opened by the first field that names it and every later field
 * naming the same group joins it, so a registry entry can be read top to
 * bottom as the form it produces.
 */
export function groupFields(fields: FieldDefinition[]): FieldGroup[] {
  const groups: FieldGroup[] = [];

  for (const field of fields) {
    const existing = groups.find((group) => group.heading === field.group);
    if (existing) {
      existing.fields.push(field);
      continue;
    }
    groups.push({ heading: field.group, fields: [field] });
  }

  return groups;
}

export function FieldGroups({
  fields,
  valueFor,
}: {
  fields: FieldDefinition[];
  /** The stored value of a field, or "" on a create form. */
  valueFor: (field: FieldDefinition) => string;
}) {
  const groups = groupFields(fields);

  return (
    <div className="space-y-7">
      {groups.map((group, index) => (
        <section key={group.heading ?? `__lead-${index}`} className="space-y-5">
          {group.heading && (
            <h3 className="text-caption border-b border-hairline pb-2.5 text-brand-ink">
              {group.heading}
            </h3>
          )}
          {group.fields.map((field) => (
            <Field
              key={field.name}
              field={field}
              defaultValue={valueFor(field)}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
