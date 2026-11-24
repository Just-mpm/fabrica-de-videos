/* imprime as palavras faladas dentro de uma janela de tempo, com o índice
   da ocorrência (#n) quando a palavra aparece mais de uma vez — é assim que
   você escolhe a âncora certa para um `at`.

   uso: node ferramentas\trecho.mjs 38.2 47.9 [início fim ...]
        $env:FALA="montagem/fala-<slug>.json"; node ferramentas\trecho.mjs ... */
import fs from "node:fs";

const fala = JSON.parse(fs.readFileSync(process.env.FALA || "montagem/fala.json", "utf8"));
const nums = process.argv.slice(2).map(Number);

const normal = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,!?…;:"“”'’()\-–—]/g, "");

const contagem = {};
const linhas = fala.map((w) => {
  const k = normal(w.text);
  contagem[k] = (contagem[k] || 0) + 1;
  return { ...w, k, occ: contagem[k] };
});

for (let i = 0; i < nums.length; i += 2) {
  const a = nums[i];
  const b = nums[i + 1];
  console.log(`\n===== ${a} → ${b} =====`);
  const dentro = linhas.filter((w) => w.start >= a - 0.4 && w.start <= b + 0.4);
  let linha = "";
  for (const w of dentro) {
    const marca = w.occ > 1 ? `#${w.occ}` : "";
    linha += `${w.text}[${w.start.toFixed(2)}${marca}] `;
    if (linha.length > 150) {
      console.log(linha);
      linha = "";
    }
  }
  if (linha) console.log(linha);
}
