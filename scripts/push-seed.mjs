/*
 * Posts the batches emit-seed.ts wrote to `content:seedInternal`.
 *
 * The Convex CLI takes its arguments on the command line, and going through
 * `npx` on Windows means cmd.exe re-parses them: JSON is quote-heavy, the
 * escaping roughly doubles the length, and batches that are comfortably inside
 * the limit on disk fail as "The command line is too long". Spawning the CLI's
 * own entry point with an argv array skips that shell round-trip entirely.
 *
 *   node scripts/push-seed.mjs <dir-of-batches>
 */
import { spawn } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "node_modules", "convex", "bin", "main.js");

const dir = process.argv[2];
if (!dir) {
  console.error("usage: node scripts/push-seed.mjs <dir-of-batches>");
  process.exit(1);
}

const batches = readdirSync(dir)
  .filter((name) => name.startsWith("batch-") && name.endsWith(".json"))
  .sort();

const run = (args) =>
  new Promise((done, fail) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => (code === 0 ? done(out) : fail(new Error(out))));
  });

const totals = { inserted: 0, updated: 0, skipped: 0 };

for (const [index, name] of batches.entries()) {
  const payload = readFileSync(join(dir, name), "utf8");
  const out = await run(["run", "content:seedInternal", payload]);
  const parsed = JSON.parse(out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1));
  for (const key of Object.keys(totals)) totals[key] += parsed[key] ?? 0;
  process.stdout.write(
    `\r${index + 1}/${batches.length} batches — ` +
      `${totals.inserted} added, ${totals.updated} overwritten, ${totals.skipped} left alone`
  );
}

process.stdout.write("\n");
