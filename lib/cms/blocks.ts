/**
 * Block registry for editable pages.
 *
 * The pages an editor composes - About, the platform documents, the marketing
 * surfaces - are not free-form HTML. They are an ordered list of typed blocks,
 * each rendered by a component that already exists in components/site. An
 * editor chooses blocks and fills in their fields; they never choose markup.
 *
 * That constraint is the point. Free-form rich text would let anyone flatten
 * the card grids into prose, break the type scale, or lose the Reveal
 * animations - and there would be no way to fix it centrally afterwards.
 * With blocks, a design change is a change to one renderer and every page that
 * uses it follows.
 *
 * `data` is a flat `Record<string, string>` at the database boundary (see the
 * `pageBlock` validator in convex/schema.ts). Repeating structures - a grid's
 * cards, a policy section's bullets - are carried as JSON in a single `items`
 * field, which is what `parseItems` and `serialiseItems` below exist for. A
 * flat record keeps blocks addable without a schema migration; the registry is
 * the only authority on what a block's fields mean.
 */

import { type RowColumn, type RowValue } from "./rows";

export type BlockFieldKind = "text" | "textarea" | "select" | "items";

export interface BlockFieldDefinition {
  name: string;
  label: string;
  kind: BlockFieldKind;
  options?: { value: string; label: string }[];
  help?: string;
  required?: boolean;
  /** Columns of an `items` field, in order. */
  itemFields?: RowColumn[];
}

export type BlockType =
  | "prose"
  | "cards"
  | "labels"
  | "cta"
  | "statement"
  | "policySection";

export interface BlockDefinition {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  fields: BlockFieldDefinition[];
}

/**
 * One entry in a repeating `items` field.
 *
 * An alias rather than a shape of its own. Two names for one thing is how the
 * block editor and the record editor would drift apart.
 */
export type BlockItem = RowValue;

/** A block as stored on a record and as rendered by the site. */
export interface PageBlock {
  /** Stable within the page, so React keys survive a reorder. */
  key: string;
  type: string;
  data: Record<string, string>;
}

/**
 * Section background, offered on every block that renders a full section.
 * Mirrors the `tone` prop on `Section` in components/site/primitives.tsx.
 */
const toneField: BlockFieldDefinition = {
  name: "tone",
  label: "Background",
  kind: "select",
  options: [
    { value: "default", label: "Default" },
    { value: "surface", label: "Surface" },
    { value: "forest", label: "Forest" },
  ],
  help: "Alternate between Default and Surface down a page so sections read as distinct bands.",
};

/** The heading trio shared by every section block. */
const headingFields: BlockFieldDefinition[] = [
  {
    name: "eyebrow",
    label: "Eyebrow",
    kind: "text",
    help: "Two or three words above the heading, e.g. 'What we cover'.",
  },
  { name: "heading", label: "Heading", kind: "text", required: true },
  { name: "description", label: "Standfirst", kind: "textarea" },
];

export const blockDefinitions: BlockDefinition[] = [
  {
    type: "prose",
    label: "Prose",
    description:
      "A heading and one or two columns of body copy. The workhorse for explanatory sections.",
    icon: "align-left",
    fields: [
      ...headingFields,
      {
        name: "bodyLeft",
        label: "Body",
        kind: "textarea",
        required: true,
        help: "Separate paragraphs with a blank line.",
      },
      {
        name: "bodyRight",
        label: "Second column",
        kind: "textarea",
        help: "Leave empty for a single full-width column.",
      },
      toneField,
    ],
  },
  {
    type: "cards",
    label: "Card grid",
    description:
      "A grid of titled cards. Used for coverage areas, principles, and anything that reads as a set.",
    icon: "layout-grid",
    fields: [
      ...headingFields,
      {
        name: "columns",
        label: "Columns",
        kind: "select",
        options: [
          { value: "2", label: "Two" },
          { value: "3", label: "Three" },
        ],
      },
      {
        name: "items",
        label: "Cards",
        kind: "items",
        itemFields: [
          { name: "title", label: "Title" },
          { name: "body", label: "Body", multiline: true },
        ],
      },
      toneField,
    ],
  },
  {
    type: "labels",
    label: "Label grid",
    description:
      "Like the card grid, but each card leads with a small eyebrow label rather than a heading. Used for the distribution model.",
    icon: "columns-3",
    fields: [
      ...headingFields,
      {
        name: "items",
        label: "Entries",
        kind: "items",
        itemFields: [
          { name: "title", label: "Label" },
          { name: "body", label: "Body", multiline: true },
        ],
      },
      toneField,
    ],
  },
  {
    type: "cta",
    label: "Call to action",
    description:
      "A bordered panel with a heading, a line of copy and up to two buttons.",
    icon: "arrow-right",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "heading", label: "Heading", kind: "text", required: true },
      { name: "body", label: "Body", kind: "textarea" },
      { name: "primaryLabel", label: "Primary button", kind: "text" },
      {
        name: "primaryHref",
        label: "Primary link",
        kind: "text",
        help: "A path on this site, e.g. /watch.",
      },
      { name: "secondaryLabel", label: "Secondary button", kind: "text" },
      { name: "secondaryHref", label: "Secondary link", kind: "text" },
      toneField,
    ],
  },
  {
    type: "statement",
    label: "Statement",
    description:
      "A single centred passage, for a mission statement or a closing thought.",
    icon: "quote",
    fields: [
      { name: "eyebrow", label: "Eyebrow", kind: "text" },
      { name: "body", label: "Statement", kind: "textarea", required: true },
      { name: "attribution", label: "Attribution", kind: "text" },
      toneField,
    ],
  },
  {
    type: "policySection",
    label: "Policy section",
    description:
      "A numbered section of a platform document: a heading, paragraphs, and an optional list of points.",
    icon: "scale",
    fields: [
      { name: "heading", label: "Heading", kind: "text", required: true },
      {
        name: "paragraphs",
        label: "Paragraphs",
        kind: "textarea",
        help: "Separate paragraphs with a blank line.",
      },
      {
        name: "items",
        label: "Points",
        kind: "items",
        itemFields: [
          { name: "term", label: "Term" },
          { name: "body", label: "Point", multiline: true },
        ],
        help: "A term is optional. With one, the point reads 'Term — body'.",
      },
    ],
  },
];

export function getBlock(type: string): BlockDefinition | undefined {
  return blockDefinitions.find((block) => block.type === type);
}

/* -------------------------------------------------------------------------- */
/* Repeating fields                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Re-exported under the names the block renderers already use.
 *
 * The implementations moved to ./rows.ts when repeating rows became a field
 * kind any collection can declare. Renaming every call site would have been a
 * change to the page renderers, which had nothing to do with it.
 */
export {
  parseRows as parseItems,
  serialiseRows as serialiseItems,
  paragraphs,
} from "./rows";
