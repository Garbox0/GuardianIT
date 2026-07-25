import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(".");
const target = resolve(".next");

if (dirname(target) !== root) {
  throw new Error("Refusing to clean outside the project root.");
}

await rm(target, { force: true, recursive: true });
