import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderConsolidatedReport } from "../lib/consolidate.mjs";

const inputDirectory = resolve(process.argv[2] || "guardian-report");
const clientName = process.argv[3];
const outputPath = resolve(
  process.argv[4] || `${inputDirectory}/informe-consolidado.html`
);

if (!clientName) {
  throw new Error(
    'Uso: npm run consolidate -- "carpeta-json" "Nombre del cliente" ["salida.html"]'
  );
}

const files = (await readdir(inputDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => entry.name);

if (!files.length) {
  throw new Error(`No hay diagnósticos JSON en ${inputDirectory}`);
}

const reports = await Promise.all(
  files.map(async (file) =>
    JSON.parse((await readFile(resolve(inputDirectory, file), "utf8")).replace(/^\uFEFF/, ""))
  )
);

await writeFile(
  outputPath,
  renderConsolidatedReport(reports, clientName),
  "utf8"
);

console.log(`Informe consolidado: ${outputPath}`);
console.log("Revisar las cinco prioridades antes de entregarlo al cliente.");
