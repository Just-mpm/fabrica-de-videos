/* Gera a lista de capítulos do YouTube a partir do index.html compilado.
   Cada capítulo é uma cena escolhida; o tempo vem do data-start dela.

   Edite CHAPTERS com as cenas deste vídeo: o id da cena (s01, s02…) e o
   título que aparece no YouTube. A primeira linha não precisa ser 0:00 —
   o YouTube usa o primeiro capítulo como início.

   uso: node ferramentas\capitulos.mjs */
import fs from "node:fs";

const CHAPTERS = [
  ["s01", "Abertura"],
  ["s02", "A ideia"],
  ["s03", "Como funciona"],
  ["s04", "O exemplo"],
  ["s05", "O fechamento"],
];

const html = fs.readFileSync("index.html", "utf8");
const cenas = new Map();
const re = /id="(s\d+)"[\s\S]{0,400}?data-start="([\d.]+)"[\s\S]{0,140}?data-duration="([\d.]+)"/g;
let m;
while ((m = re.exec(html))) cenas.set(m[1], { inicio: +m[2], dur: +m[3] });

const hhmmss = (t) => {
  const mm = Math.floor(t / 60);
  const ss = Math.floor(t % 60);
  return `${mm}:${String(ss).padStart(2, "0")}`;
};

const linhas = [];
let anterior = -1;
let fim = 0;
for (const [id, titulo] of CHAPTERS) {
  const c = cenas.get(id);
  if (!c) {
    console.log(`! cena ${id} não existe no build`);
    continue;
  }
  const inicio = Math.floor(c.inicio);
  /* o primeiro capítulo é sempre 0:00 — não tem anterior para comparar */
  if (anterior >= 0 && inicio - anterior < 10)
    console.log(`! capítulo "${titulo}" tem menos de 10 s`);
  if (inicio <= anterior) console.log(`! capítulo "${titulo}" fora de ordem`);
  anterior = inicio;
  linhas.push(`${hhmmss(inicio)} ${titulo}`);
  fim = Math.max(fim, c.inicio + c.dur);
}

const ultima = [...cenas.values()].at(-1);
console.log(linhas.join("\n"));
console.log(`\nfilme: ${hhmmss(ultima.inicio + ultima.dur)} · ${CHAPTERS.length} capítulos`);
