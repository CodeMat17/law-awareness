"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { requireRole } from "./auth";
import { buildSeed } from "./repository";
import { collections } from "./collections";

/**
 * Loads the content authored in lib/content/* into Convex.
 *
 * A fresh deployment has an empty database and therefore an empty site. This
 * is how it gets its starting content, and how a collection added to the seed
 * files later gets imported without touching anything an editor has since
 * changed.
 *
 * Admin only, and idempotent: the Convex mutation matches on
 * `(collection, recordId)` and skips what already exists. `overwrite` is the
 * deliberate exception - it resets records back to the source files, which
 * discards editorial changes and is why it is never the default.
 *
 * Records go up in batches because a Convex mutation is a single transaction
 * with a bounded size, and the full seed is several thousand rows.
 */

const BATCH_SIZE = 200;

export interface SeedResult {
  ok: boolean;
  message: string;
}

export async function seedContent(
  _previous: SeedResult | null,
  formData: FormData
): Promise<SeedResult> {
  try {
    await requireRole("admin");

    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
      return {
        ok: false,
        message:
          "No Convex deployment is configured, so there is nothing to seed into.",
      };
    }

    const overwrite = formData.get("overwrite") === "on";
    const { getToken } = await auth();
    const token = await getToken({ template: "convex" });
    if (!token) return { ok: false, message: "Not authenticated." };

    const store = buildSeed();
    const records = collections.flatMap((definition) =>
      (store.get(definition.id) ?? []).map((record, index) => ({
        collection: definition.id,
        recordId: record.id,
        title: record.title,
        subtitle: record.subtitle,
        status: record.status,
        review: record.review,
        reviewedBy: record.reviewedBy,
        lastReviewed: record.lastReviewed,
        publicHref: record.publicHref,
        fields: record.fields,
        blocks: record.blocks,
        // Source-file order becomes the initial sort position, so the first
        // thing an editor sees matches the sequence the site renders in.
        order: index,
      }))
    );

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (let start = 0; start < records.length; start += BATCH_SIZE) {
      const result = await fetchMutation(
        api.content.seed,
        {
          records: records.slice(start, start + BATCH_SIZE),
          overwrite,
          // The dashboard counters are rebuilt once the last batch has landed,
          // not per batch: the rebuild reads the whole table.
          finalize: start + BATCH_SIZE >= records.length,
        },
        { token }
      );
      inserted += result.inserted;
      updated += result.updated;
      skipped += result.skipped;
    }

    // Content now exists where there was none, so every cached page is stale.
    revalidatePath("/", "layout");
    revalidatePath("/admin");

    return {
      ok: true,
      message: `Seeded: ${inserted} added, ${updated} overwritten, ${skipped} left alone.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not seed.",
    };
  }
}
