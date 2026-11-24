/* mostra a cena pedida da montagem: peças de cima com o `at` resolvido e o
   segundo absoluto em que cada uma entra — para julgar os avisos de
   "entra e corta" e conferir se a âncora caiu na palavra certa.
   uso: node ferramentas\cena.mjs montagem\demo-livre.mjs s2 s4 ...
        $env:FALA="montagem/fala-<slug>.json"  (padrão: montagem/fala.json) */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [arq, ...alvos] = process.argv.slice(2);
const m = (await import(pathToFileURL(path.resolve(arq)).href)).default;
const cenas = m.cenas ?? m;

const fala = JSON.parse(fs.readFileSync(process.env.FALA || "montagem/fala.json", "utf8"));
const normal = (t) =>
  String(t)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?…;:"“”'’()\-–—]/g, "");
const ocorrencias = {};
for (const w of fala) {
  const k = normal(w.text);
  ocorrencias[k] = (ocorrencias[k] || 0) + 1;
}

/* resolve "palavra#n" como o build: primeira ocorrência cujo início casa */
function ancora(chave) {
  const [palavra, n] = String(chave).split("#");
  const alvo = normal(palavra);
  const quer = n ? Number(n) : 1;
  let visto = 0;
  for (const w of fala) {
    const k = normal(w.text);
    if (k === alvo || k.startsWith(alvo)) {
      visto += 1;
      if (visto === quer) return w.start;
    }
  }
  return null;
}

let t = 0;
const inicio = {};
cenas.forEach((c, i) => {
  inicio[`s${String(i + 1).padStart(2, "0")}`] = t;
  t += c.dur;
});

const mostra = (peca, base, dur, prefixo = "") => {
  const at = peca.at;
  let linha = `${prefixo}${peca.tipo}`;
  if (peca.texto) linha += ` "${String(peca.texto).slice(0, 30)}"`;
  if (peca.nome) linha += ` ${peca.nome}`;
  if (typeof at === "number") linha += ` @${(base + at).toFixed(2)} (rel ${at})`;
  else if (typeof at === "string") {
    const abs = ancora(at);
    linha +=
      abs === null
        ? ` @${at}  <-- NÃO ACHOU`
        : ` @${abs.toFixed(2)} (rel ${(abs - base).toFixed(2)}) [${at}]${
            abs - base > dur - 0.03 ? "  <-- FORA DA CENA" : ""
          }`;
  }
  console.log(linha);
  for (const filho of peca.pecas ?? []) mostra(filho, base, dur, `${prefixo}  `);
};

for (const alvo of alvos) {
  const i = Number(alvo.replace("s", "")) - 1;
  const c = cenas[i];
  console.log(`\n===== ${alvo} · início ${inicio[alvo].toFixed(2)} · dur ${c.dur} =====`);
  (c.valores?.pecas ?? []).forEach((p) => mostra(p, inicio[alvo], c.dur));
}
