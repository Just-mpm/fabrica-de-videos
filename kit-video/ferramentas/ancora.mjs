/* qual "#n" corresponde à ocorrência que está perto de um tempo — para quando
   a palavra aparece várias vezes no filme e você quer a do beat certo.

   uso: node ferramentas\ancora.mjs som 12.4 demo 11.9
        $env:FALA="montagem/fala-<slug>.json"; node ferramentas\ancora.mjs ... */
import fs from "node:fs";

const fala = JSON.parse(fs.readFileSync(process.env.FALA || "montagem/fala.json", "utf8"));
const normal = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,!?…;:"“”'’()\-–—]/g, "");
const mapa = fala.map((w) => ({ chave: normal(w.text), tempo: w.start }));

const a = process.argv.slice(2);
for (let i = 0; i < a.length; i += 2) {
  const chave = normal(a[i]);
  const alvo = Number(a[i + 1]);
  const achados = mapa.filter((w) => w.chave === chave || w.chave.startsWith(chave));
  const idx = achados.findIndex((w) => Math.abs(w.tempo - alvo) < 0.06);
  console.log(
    `${a[i]} @${alvo} → ${idx < 0 ? "NÃO ACHADO" : `"${a[i]}#${idx + 1}"`}  (total ${achados.length})`,
  );
}
