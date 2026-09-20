/**
 * Writes the whole seed out as JSON batches for `npx convex run` to post.
 *
 * The seeding path the admin uses is a server action behind Clerk (see
 * lib/cms/seed-action.ts), which a script cannot reach: there is no browser and
 * therefore no session. This builds the identical payload - `buildSeed()` is
 * the same function that action calls - and leaves it on disk for the CLI to
 * send to `content:seedInternal`, which is the same import without the Clerk
 * check.
 *
 * That makes it the way to seed a deployment nobody has signed into yet, which
 * is every fresh deployment: the admin's own Seed button needs an admin, and an
 * empty database has no users table to make one from.
 *
 *   npx jiti scripts/emit-seed.ts <outDir>
 *   for f in <outDir>/batch-*.json; do npx convex run content:seedInternal "$(cat $f)"; done
 *
 * Batches because a Convex mutation is one transaction with a bounded size, and
 * the full seed is several thousand rows. `finalize` is set on the last batch
 * only: it rebuilds the dashboard counters, which is a full read of the table.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildSeed } from "@/lib/cms/repository";
import { collections } from "@/lib/cms/collections";

/**
 * Batches are sized in bytes, not records.
 *
 * `npx convex run` takes its arguments on the command line, and a command line
 * is bounded - around 32KB on Windows. Records here range from a one-line
 * ticker headline to a law entry with a dozen provisions, so a fixed count
 * either wastes calls on the small collections or overflows on the large ones.
 * 20KB leaves room for the function name and the flags around it.
 */
const MAX_BATCH_BYTES = 20_000;

const outDir = process.argv[2];
if (!outDir) {
  console.error("usage: npx jiti scripts/emit-seed.ts <outDir>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

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
    // Source-file order becomes the initial sort position, so the first thing
    // an editor sees matches the sequence the site renders in.
    order: index,
  }))
);

// A Convex validator rejects an optional field that is present and undefined,
// so the keys are dropped rather than sent as null.
const clean = records.map((record) =>
  Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined)
  )
);

const groups: (typeof clean)[] = [];
let current: typeof clean = [];
let currentBytes = 0;
for (const record of clean) {
  const size = JSON.stringify(record).length;
  if (current.length > 0 && currentBytes + size > MAX_BATCH_BYTES) {
    groups.push(current);
    current = [];
    currentBytes = 0;
  }
  current.push(record);
  currentBytes += size;
}
if (current.length > 0) groups.push(current);

groups.forEach((group, index) => {
  writeFileSync(
    join(outDir, `batch-${String(index).padStart(3, "0")}.json`),
    JSON.stringify({
      records: group,
      overwrite: true,
      // Only the last batch rebuilds the dashboard counters: that rebuild is a
      // full read of the table, and doing it per batch would repeat the
      // largest read in the application forty times.
      finalize: index === groups.length - 1,
    })
  );
});
const batches = groups.length;

const byCollection = new Map<string, number>();
for (const record of clean) {
  const key = String(record.collection);
  byCollection.set(key, (byCollection.get(key) ?? 0) + 1);
}

console.log(`${clean.length} records in ${batches} batches`);
for (const [collection, count] of [...byCollection].sort()) {
  console.log(`  ${collection.padEnd(24)} ${count}`);
}
