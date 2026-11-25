/*
 * Tells the live site that Convex content changed outside the admin, so every
 * public page rebuilds on its next visit. Run it after editing data in the
 * Convex dashboard; push-seed.mjs runs it after a seed.
 *
 *   node scripts/revalidate.mjs
 *
 * Needs SITE_URL (e.g. https://your-site.netlify.app) and REVALIDATE_SECRET,
 * from the environment or .env.local.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function fromEnvFile(key) {
  const file = join(root, ".env.local");
  if (!existsSync(file)) return undefined;
  const line = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .find((l) => l.startsWith(`${key}=`));
  return line?.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}

export async function revalidateSite() {
  const site = process.env.SITE_URL ?? fromEnvFile("SITE_URL");
  const secret = process.env.REVALIDATE_SECRET ?? fromEnvFile("REVALIDATE_SECRET");
  if (!site || !secret) {
    console.warn("Skipped site refresh: set SITE_URL and REVALIDATE_SECRET.");
    return false;
  }
  const res = await fetch(new URL("/api/revalidate", site), {
    method: "POST",
    headers: { authorization: `Bearer ${secret}` },
  });
  if (!res.ok) {
    console.error(`Site refresh failed: ${res.status} ${res.statusText}`);
    return false;
  }
  console.log("Site refreshed: every page rebuilds on its next visit.");
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = (await revalidateSite()) ? 0 : 1;
}
