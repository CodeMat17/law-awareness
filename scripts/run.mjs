/*
 * Runs a TypeScript script in this project with the "@/..." path alias mapped.
 *
 * jiti compiles the TypeScript for us but does not read tsconfig `paths`, and
 * anything reaching into lib/ uses that alias at every level - so it is mapped
 * once here rather than relative-imported at a dozen call sites.
 *
 *   node scripts/run.mjs scripts/emit-seed.ts <args...>
 */
import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [target, ...rest] = process.argv.slice(2);
if (!target) {
  console.error("usage: node scripts/run.mjs <script.ts> [args...]");
  process.exit(1);
}

const jiti = createJiti(fileURLToPath(import.meta.url), {
  alias: { "@": root },
  interopDefault: true,
});

process.argv = [process.argv[0], resolve(root, target), ...rest];
await jiti.import(resolve(root, target));
