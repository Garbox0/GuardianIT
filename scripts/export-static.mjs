import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const source = process.argv[2] || "http://127.0.0.1:3000/";
const output = resolve(process.argv[3] || ".deploy/guardian-site/public");
const response = await fetch(source);

if (!response.ok) {
  throw new Error(`No se pudo exportar ${source}: HTTP ${response.status}`);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(resolve(output, "index.html"), await response.text());
await cp("dist/client/_next", resolve(output, "_next"), { recursive: true });
console.log(output);
