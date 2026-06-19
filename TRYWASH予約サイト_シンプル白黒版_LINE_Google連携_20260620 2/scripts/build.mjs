import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const dist = join(root, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await mkdir(join(dist, ".openai"), { recursive: true });

const clientFiles = [
  "index.html",
  "yokosuka.html",
  "yokohama.html",
  "reserve.html",
  "admin.html",
  "reservation-board.html",
  "app.js",
  "admin.js",
  "reservation-board.js",
  "shared-api.js",
  "store-config.js",
  "vehicle-size-data.js",
  "runtime-config.js",
  "runtime-config.example.js",
  "styles.css",
  "assets",
  "staff-evaluation-system",
  "backend",
  "db",
];

for (const file of clientFiles) {
  await cp(join(root, file), join(client, file), { recursive: true });
}

await cp(join(root, "src/worker.js"), join(server, "index.js"));
await cp(join(root, ".openai/hosting.json"), join(dist, ".openai/hosting.json"));
