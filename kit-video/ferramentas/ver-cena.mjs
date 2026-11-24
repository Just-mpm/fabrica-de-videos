/* Imprime a definição de cenas da montagem por número (1 = s01).
   uso: node ferramentas\ver-cena.mjs montagem\arquivo.mjs 11 24 */
import path from "node:path";
import { pathToFileURL } from "node:url";

const [arq, ...alvos] = process.argv.slice(2);
if (!arq) {
  console.error("uso: node ferramentas\\ver-cena.mjs montagem\\arquivo.mjs 11 24");
  process.exit(1);
}

const mod = await import(pathToFileURL(path.resolve(arq)).href);
const cenas = mod.default.cenas;

for (const n of alvos.map(Number)) {
  const c = cenas[n - 1];
  if (!c) {
    console.log(`--- s${String(n).padStart(2, "0")} não existe`);
    continue;
  }
  console.log(`--- s${String(n).padStart(2, "0")} · ${c.bloco} · ${c.dur}s`);
  console.log(JSON.stringify(c.valores, null, 2));
  console.log("");
}
