/**
 * Repeating rows: the CMS's one representation of structured content.
 *
 * A `fields` value is a string (convex/schema.ts commits to that, so a new
 * content shape never costs a schema migration), and `list` already covers the
 * flat case - one item per line. What it cannot carry is content with parts: a
 * step that is a title *and* a body, a clause that is a name, a purpose and
 * what to check. Those were the shapes the CMS had no answer for, so the site
 * rendered them from the seed files and an editor could not touch them.
 *
 * Rows are that answer. The value is JSON at rest and a list of labelled
 * inputs in the admin; the JSON never reaches an editor. This is the same
 * encoding the page block composer has always used for its `items` fields -
 * promoted out of that one component so every collection can use it, rather
 * than reimplemented beside it.
 *
 * The columns a row may carry are declared on the field, and `normaliseRows`
 * is the boundary: whatever arrives from a form is rebuilt against that
 * declaration, so a stored row can only ever hold columns the registry knows
 * about.
 */

/** One row. Keys are column names; every value is a string. */
export interface RowValue {
  [column: string]: string;
}

export interface RowColumn {
  name: string;
  label: string;
  /** Renders as a textarea rather than a single-line input. */
  multiline?: boolean;
  help?: string;
}

/**
 * Reads a stored value back into rows.
 *
 * Never throws and never returns a partial parse. A field whose value is not
 * an array of objects - hand-edited, or written by an older shape of the
 * registry - reads as no rows rather than as something the editor would have
 * to repair before the form would render.
 */
export function parseRows(value: string | undefined): RowValue[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RowValue =>
        typeof entry === "object" && entry !== null && !Array.isArray(entry)
    );
  } catch {
    return [];
  }
}

export function serialiseRows(rows: RowValue[]): string {
  return JSON.stringify(rows);
}

/**
 * Rebuilds rows against the columns a field declares.
 *
 * Runs on the write path, so what is stored is what the registry describes:
 * unknown columns are dropped, missing ones become empty strings, and every
 * value is trimmed. A row with nothing in any column is dropped entirely -
 * that is an editor who pressed "add" once too often, not a blank entry the
 * site should render.
 */
export function normaliseRows(
  columns: readonly RowColumn[],
  value: string | undefined
): RowValue[] {
  return parseRows(value)
    .map((row) => {
      const next: RowValue = {};
      for (const column of columns) {
        next[column.name] = (row[column.name] ?? "").trim();
      }
      return next;
    })
    .filter((row) => Object.values(row).some((entry) => entry.length > 0));
}

/**
 * Splits a multiline row column into paragraphs on blank lines.
 *
 * The read-path counterpart to a `multiline` column: editors type prose, not
 * markup, so a blank line is the only structural signal the value carries.
 * Shared with the block renderer, which has always read prose this way.
 */
export function paragraphs(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}
