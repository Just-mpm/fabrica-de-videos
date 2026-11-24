/* quantas peças de cada cena usam `at` numérico (que NÃO se reancora sozinho)
   e quantas usam palavra — é o mapa de risco para mexer na duração das cenas.
   uso: $env:FALA=...; node ferramentas\numeros.mjs montagem\arquivo.mjs */
import path from "node:path";
import { pathToFileURL } from "node:url";

const arq = process.argv[2];
const m = (await import(pathToFileURL(path.resolve(arq)).href)).default;
const cenas = m.cenas ?? m;

const contar = (p, acc) => {
  if (p.at !== undefined) {
    if (typeof p.at === "number") acc.num += 1;
    else acc.pal += 1;
  }
  for (const f of p.pecas ?? []) contar(f, acc);
  return acc;
};

let t = 0;
let totalNum = 0;
let totalPal = 0;
cenas.forEach((c, i) => {
  const acc = { num: 0, pal: 0 };
  (c.valores?.pecas ?? []).forEach((p) => contar(p, acc));
  totalNum += acc.num;
  totalPal += acc.pal;
  const id = `s${String(i + 1).padStart(2, "0")}`;
  console.log(`${id} ${t.toFixed(2)}-${(t + c.dur).toFixed(2)}  num ${acc.num}  palavra ${acc.pal}`);
  t += c.dur;
});
console.log(`\ntotal: ${totalNum} numéricos · ${totalPal} por palavra`);
