/* Acha cenas que passam tempo demais com quase nada no quadro.

   O `data-at` do primeiro elemento da cena é puxado para 0 pelo compilador,
   então o que interessa é a distância entre o 1º e o 2º elemento: se a tag
   entra sozinha e o resto só 1,5 s depois, o espectador vê papel vazio. */
import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const cenas = [...html.matchAll(/id="(s\d+)"[\s\S]*?data-start="([\d.]+)"[\s\S]*?data-duration="([\d.]+)"/g)].map(
  (m) => ({ id: m[1], start: +m[2], dur: +m[3] }),
);

const linhas = [];

for (const c of cenas) {
  const arq = `compositions/${c.id}.html`;
  if (!fs.existsSync(arq)) continue;
  const corpo = fs.readFileSync(arq, "utf8");
  const ats = [...corpo.matchAll(/data-at="([\d.]+)"/g)].map((m) => +m[1]);
  if (!ats.length) continue;
  const unicos = [...new Set(ats)].sort((a, b) => a - b);
  const vao = unicos.length > 1 ? unicos.find((v) => v > 0.01) : 0;
  const ultimo = unicos.at(-1);
  const cauda = c.dur - ultimo;
  linhas.push({ ...c, vao: +vao.toFixed(2), ultimo, cauda: +cauda.toFixed(2) });
}

const cabe = (s) => s.padEnd(8);

console.log("cena   início      dur   | 1º→2º   último   cauda");
for (const l of linhas.filter((l) => l.vao > 0.7 || l.cauda > 3.4)) {
  console.log(
    `${cabe(l.id)} ${String(l.start).padStart(7)} ${String(l.dur).padStart(7)} | ${String(l.vao).padStart(5)} ${String(l.ultimo).padStart(8)} ${String(l.cauda).padStart(7)}`,
  );
}
console.log(`\n${linhas.filter((l) => l.vao > 0.7).length} cena(s) com começo vazio · ${linhas.filter((l) => l.cauda > 3.4).length} com cauda longa`);
