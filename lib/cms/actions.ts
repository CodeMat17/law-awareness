"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { canPerform, requireRole } from "./auth";
import { getCms } from "./repository";
import {
  decodeList,
  encodeList,
  getCollection,
  titleFieldFor,
  type CollectionDefinition,
  type CollectionId,
} from "./collections";
import {
  indexRoutesFor,
  publicHrefFor,
  recordIdFrom,
  slugify,
} from "./public-href";
import { getBlock, type PageBlock } from "./blocks";
import { normaliseRows, serialiseRows } from "./rows";
import { contentTag } from "@/lib/content/convex-repository";
import { isCloudinaryUrl } from "@/lib/media/cloudinary";
import type { WorkflowStatus } from "@/lib/content/types";

/**
 * Server actions for the CMS.
 *
 * Every action is guarded by `requireRole` and validates its own input, so the
 * guarantees hold no matter what the client sends. When Convex lands, only the
 * repository call inside each action changes.
 */

export interface ActionResult {
  ok: boolean;
  message: string;
  /**
   * Where the record this action made can be opened, when it made one.
   *
   * Creating no longer navigates, so the link has to come back with the
   * result - otherwise an editor who has just made a record has no way to
   * reach it without going back through the list.
   */
  href?: string;
}

const WORKFLOW: WorkflowStatus[] = ["draft", "review", "published", "archived"];

/**
 * Revalidates everything an edit to one record can affect.
 *
 * The admin views are obvious. The public route is not: a record's own page is
 * only known from the record itself, and for the `pages` collection that is
 * exactly the point - editing About has to invalidate /about specifically, not
 * merely the admin screen it was edited on.
 */
function revalidateFor(
  collectionId: CollectionId,
  recordId: string,
  publicHref: string | undefined,
  fields: Record<string, string>
): void {
  revalidatePath(`/admin/${collectionId}`);
  revalidatePath(`/admin/${collectionId}/${recordId}`);
  revalidatePath("/admin");
  if (publicHref) revalidatePath(publicHref);
  // The hubs that list the record, which are separately cached pages: a
  // record's own route going stale is not the same event as the index above it
  // going stale, and only doing the first is how a published record ends up at
  // a working URL that nothing on the site links to.
  for (const route of indexRoutesFor(collectionId, fields)) {
    revalidatePath(route);
  }
  // The public read of this collection is cached by tag rather than by route,
  // because the ticker renders in the site layout and a route-based
  // invalidation would have to name every page on the site.
  //
  // `updateTag` rather than `revalidateTag`: this runs in a Server Action, and
  // an editor who has just pressed save must see their own change rather than
  // one more serving of the stale copy.
  updateTag(contentTag(collectionId));
}

function parseCollection(value: FormDataEntryValue | null): CollectionId {
  const id = typeof value === "string" ? value : "";
  const definition = getCollection(id);
  if (!definition) throw new Error("Unknown collection");
  return definition.id;
}

function parseId(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error("Missing record id");
  }
  return value;
}

/**
 * Reads the collection's declared fields out of a form, validating each one.
 *
 * Shared by save and create so a record made in the admin is held to exactly
 * the same rules as a record edited there - a second copy of this loop would
 * be a second, quietly diverging definition of what a valid record is.
 *
 * Returns either the field map or the message to show the editor.
 */
function collectFields(
  definition: CollectionDefinition,
  formData: FormData
): { fields: Record<string, string> } | { error: string } {
  const fields: Record<string, string> = {};

  for (const field of definition.fields) {
    const value = formData.get(field.name);
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (field.required && trimmed.length === 0) {
      return { error: `${field.label} is required.` };
    }
    if (field.kind === "number" && trimmed.length > 0) {
      if (!/^\d+$/.test(trimmed)) {
        return { error: `${field.label} must be a number.` };
      }
    }
    // An upload field is a plain string in the form, so nothing stops a
    // hand-made POST putting any URL in it. Only our own Cloudinary cloud is
    // accepted, so a CMS field can never become a way to embed a stranger's
    // file on the site.
    if (
      (field.kind === "image" || field.kind === "video") &&
      trimmed.length > 0 &&
      !isCloudinaryUrl(trimmed)
    ) {
      return {
        error: `${field.label} must be a file uploaded through this form.`,
      };
    }
    if (field.kind === "select" && field.options && trimmed.length > 0) {
      const allowed = field.options.some((option) => option.value === trimmed);
      if (!allowed) {
        return { error: `${field.label} has an invalid value.` };
      }
    }
    // A list is normalised on the way in - blank lines dropped, each item
    // trimmed - so the stored string is already what the site will render
    // and the read path never has to second-guess an editor's stray newline.
    if (field.kind === "list") {
      fields[field.name] = encodeList(decodeList(trimmed));
      continue;
    }

    // Rows arrive as JSON from the row editor and are rebuilt here against the
    // columns the registry declares: unknown columns dropped, missing ones
    // empty, wholly blank rows removed. The form is not trusted to have sent
    // the right shape, so a hand-made POST cannot put arbitrary keys into a
    // record's stored JSON.
    if (field.kind === "rows") {
      fields[field.name] = serialiseRows(
        normaliseRows(field.columns ?? [], trimmed)
      );
      continue;
    }

    fields[field.name] = trimmed;
  }

  // Guard the credibility claim: 'Reviewed' requires a named reviewer.
  if (fields.review === "reviewed" && !fields.reviewedBy) {
    return {
      error:
        "Mark a record as Reviewed only when you can name the person who reviewed it.",
    };
  }

  return { fields };
}

/** Saves the editable fields of a record. */
export async function saveRecord(
  _previous: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const editor = await requireRole("author");
    const collectionId = parseCollection(formData.get("__collection"));
    const recordId = parseId(formData.get("__id"));
    const definition = getCollection(collectionId);
    if (!definition) throw new Error("Unknown collection");

    const collected = collectFields(definition, formData);
    if ("error" in collected) return { ok: false, message: collected.error };
    const { fields } = collected;

    // Derived fields are not on the form, so they are recomputed here from the
    // sources that were. `slug` is the exception: it is the record's id, which
    // is fixed at creation, so re-deriving it from an edited title would leave
    // the stored slug disagreeing with the id and move a published page out
    // from under its links.
    for (const field of definition.fields) {
      if (!field.derivedFrom || field.name === "slug") continue;
      // Only when the source was actually part of this submission. Field maps
      // are merged rather than replaced, so deriving from an absent source
      // would quietly blank a reference the editor never touched.
      if (!(field.derivedFrom in fields)) continue;
      fields[field.name] = slugify(fields[field.derivedFrom]);
    }

    const record = await getCms().updateFields(
      collectionId,
      recordId,
      fields,
      editor.name
    );
    revalidateFor(collectionId, recordId, record.publicHref, record.fields);
    // A page whose path was changed has two stale routes: the one it used to
    // answer at, and the one it answers at now.
    if (fields.path && fields.path !== record.publicHref) {
      revalidatePath(fields.path);
    }
    return { ok: true, message: "Saved." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not save.",
    };
  }
}

/** Moves a record through the editorial workflow. */
export async function transitionRecord(
  _previous: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const status = formData.get("status");
    if (typeof status !== "string" || !WORKFLOW.includes(status as WorkflowStatus)) {
      return { ok: false, message: "Unknown workflow status." };
    }
    // Publishing and archiving are editor-level actions.
    const minimum = status === "published" || status === "archived" ? "editor" : "author";
    const editor = await requireRole(minimum);

    const collectionId = parseCollection(formData.get("__collection"));
    const recordId = parseId(formData.get("__id"));

    const record = await getCms().setStatus(
      collectionId,
      recordId,
      status as WorkflowStatus,
      editor.name
    );
    revalidateFor(collectionId, recordId, record.publicHref, record.fields);
    // Publishing or withdrawing also changes the navigation, the search index
    // and the listing pages - none of which live at the record's own route.
    revalidatePath("/", "layout");
    return { ok: true, message: `Moved to ${status}.` };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not update.",
    };
  }
}

/**
 * Saves the ordered blocks of a page.
 *
 * The composer posts the whole block list as JSON in one field rather than as
 * flat form fields. Blocks are nested and reorderable, and encoding that into
 * form field names would put the page's structure into strings that both sides
 * then have to agree on - the editor already holds the structure, so it sends
 * it whole.
 *
 * Everything that arrives is re-derived against the block registry: unknown
 * block types are dropped and unknown fields within a block are ignored. The
 * client cannot introduce a block type or a field that the renderer does not
 * know how to draw.
 */
export async function savePageBlocks(
  _previous: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const editor = await requireRole("author");
    const collectionId = parseCollection(formData.get("__collection"));
    const recordId = parseId(formData.get("__id"));

    const definition = getCollection(collectionId);
    if (!definition?.hasBlocks) {
      return { ok: false, message: "This collection does not use blocks." };
    }

    const raw = formData.get("__blocks");
    if (typeof raw !== "string") {
      return { ok: false, message: "No blocks were submitted." };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, message: "The blocks could not be read." };
    }
    if (!Array.isArray(parsed)) {
      return { ok: false, message: "The blocks could not be read." };
    }

    const blocks: PageBlock[] = [];
    for (const [index, entry] of parsed.entries()) {
      if (typeof entry !== "object" || entry === null) continue;
      const candidate = entry as Record<string, unknown>;
      const type = typeof candidate.type === "string" ? candidate.type : "";
      const blockDefinition = getBlock(type);
      if (!blockDefinition) continue;

      const source =
        typeof candidate.data === "object" && candidate.data !== null
          ? (candidate.data as Record<string, unknown>)
          : {};

      const data: Record<string, string> = {};
      for (const field of blockDefinition.fields) {
        const value = source[field.name];
        const text = typeof value === "string" ? value.trim() : "";
        if (field.required && text.length === 0) {
          return {
            ok: false,
            message: `${blockDefinition.label} block ${index + 1}: ${field.label} is required.`,
          };
        }
        data[field.name] = text;
      }

      blocks.push({
        key:
          typeof candidate.key === "string" && candidate.key
            ? candidate.key
            : `${type}-${index}`,
        type,
        data,
      });
    }

    const record = await getCms().updateBlocks(
      collectionId,
      recordId,
      blocks,
      editor.name
    );
    revalidateFor(collectionId, recordId, record.publicHref, record.fields);
    return { ok: true, message: "Blocks saved." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not save.",
    };
  }
}

/**
 * Finds a free slug, appending -2, -3 ... until one is unused.
 *
 * The editor no longer types the slug, so they have no way to resolve a
 * collision themselves - two guides legitimately called "Starting a business"
 * must both be creatable. The suffix is applied here rather than left to the
 * database so the record's public address is settled before it is written.
 */
async function uniqueSlug(
  collectionId: CollectionId,
  base: string
): Promise<string> {
  const cms = getCms();
  let candidate = base;

  // Bounded: an unbounded loop here would be a request that never returns if
  // `get` ever started answering wrongly.
  for (let suffix = 2; suffix <= 50; suffix += 1) {
    if (!(await cms.get(collectionId, candidate))) return candidate;
    candidate = `${base}-${suffix}`;
  }

  // Fifty records sharing a title is not a naming collision any more, so fall
  // back to something that cannot collide rather than failing the create.
  return `${base}-${Date.now()}`;
}

/**
 * Adds a record to a collection.
 *
 * The new record is a draft, always. Creating and publishing are kept as two
 * separate acts so that adding a video is never the same gesture as putting it
 * in front of readers - the workflow guarantee the rest of the CMS rests on.
 *
 * On success the editor is sent to the record's own page, where the workflow
 * controls and, on block-composed collections, the composer live.
 */
export async function createRecord(
  _previous: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const editor = await requireRole("author");
    const collectionId = parseCollection(formData.get("__collection"));
    const definition = getCollection(collectionId);
    if (!definition) throw new Error("Unknown collection");

    // Fixed collections have no create form, so this can only be a stale tab
    // or a hand-made POST. Either way the answer is the same one the UI gives.
    if (definition.fixed) {
      return {
        ok: false,
        message: `${definition.label} cannot be added to.`,
      };
    }

    const collected = collectFields(definition, formData);
    if ("error" in collected) return { ok: false, message: collected.error };
    const { fields } = collected;

    const titleFieldName = titleFieldFor(collectionId);

    // Derived fields are computed here and never read from the form. They are
    // not rendered at all, so nothing arrives for them anyway - but deriving
    // them server-side is what makes the guarantee real rather than a habit of
    // the UI, since a hand-made POST can carry any field it likes.
    for (const field of definition.fields) {
      if (!field.derivedFrom) continue;
      const source = fields[field.derivedFrom] ?? "";
      const derived = slugify(source);

      if (field.name === "slug") {
        // The record's own identity, so it has to exist and has to be unique.
        if (!derived) {
          const label =
            definition.fields.find((entry) => entry.name === field.derivedFrom)
              ?.label ?? "title";
          return {
            ok: false,
            message: `${label} must contain letters or numbers, because the web address is made from it.`,
          };
        }
        fields.slug = await uniqueSlug(collectionId, derived);
        continue;
      }

      // Everything else derived is a reference to another record, where an
      // empty source means "not attached" rather than an error - and where a
      // uniqueness suffix would be actively wrong, since matching an existing
      // record is the entire point.
      fields[field.name] = derived;
    }

    const recordId = recordIdFrom(collectionId, fields, titleFieldName);

    // Collections without a slug field derive their id from something else,
    // which can still collide - so the check stays for them.
    const existing = await getCms().get(collectionId, recordId);
    if (existing) {
      return {
        ok: false,
        message: `A ${definition.singular.toLowerCase()} with that name already exists.`,
      };
    }

    await getCms().create(collectionId, recordId, fields, editor.name);

    // "Publish now" is offered on the create form to whoever could publish the
    // record a moment later anyway, so it saves a round trip without widening
    // what anyone is allowed to do. The role is re-checked here rather than
    // trusted from the form: `create` needs only `author`, and an author who
    // ticked the box must still not be able to publish.
    if (
      formData.get("__publish") === "on" &&
      canPerform(editor, "editor")
    ) {
      await getCms().setStatus(collectionId, recordId, "published", editor.name);
      // Publishing here is the same event as publishing from the record's own
      // page, and needs the same reach: the navigation, the search index and
      // the listing pages are all cached above the record's own route.
      revalidatePath("/", "layout");
    }

    revalidateFor(
      collectionId,
      recordId,
      publicHrefFor(collectionId, fields),
      fields
    );

    // Creating deliberately stays on the form rather than opening the new
    // record. Content arrives in runs - a batch of glossary terms, a morning
    // of listings - and being thrown onto a record page after each one turns
    // that into a navigation for every single item. The form clears itself and
    // says where the record went instead, so the next one can just be typed.
    return {
      ok: true,
      message: `${definition.singular} created.`,
      href: `/admin/${collectionId}/${recordId}`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not create.",
    };
  }
}

/** Permanently removes a record. Admin only. */
export async function deleteRecord(
  _previous: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  let deletedFrom: CollectionId;
  try {
    const editor = await requireRole("admin");
    const collectionId = parseCollection(formData.get("__collection"));
    const recordId = parseId(formData.get("__id"));
    const definition = getCollection(collectionId);
    if (definition?.fixed) {
      return {
        ok: false,
        message: `${definition.label} are part of the site and cannot be deleted.`,
      };
    }
    // Read the record before it goes, so its public route can be revalidated
    // afterwards - once deleted there is nothing left to ask where it lived.
    const existing = await getCms().get(collectionId, recordId);
    await getCms().remove(collectionId, recordId, editor.name);
    revalidateFor(
      collectionId,
      recordId,
      existing?.publicHref,
      existing?.fields ?? {}
    );
    revalidatePath("/", "layout");
    deletedFrom = collectionId;
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not delete.",
    };
  }
  // The editor is still on the record's own page, which now has nothing to
  // render and 404s as soon as it revalidates. Send them back to the list.
  // redirect() throws a control-flow error, so it must sit outside the try.
  redirect(`/admin/${deletedFrom}`);
}
