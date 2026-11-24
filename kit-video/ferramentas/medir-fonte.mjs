/* MEDIR A FONTE — a largura real de cada letra, uma vez, para o build.

   O verificador de texto precisa saber quanto mede uma frase para adivinhar
   onde ela quebra. Contar "0,70 em por caractere" erra até 11%, e um palpite
   errado acusa cena correta.

   Aqui o Chrome mede o avanço de cada letra com a fonte de verdade e grava
   `biblioteca/larguras.json`. O build soma letra por letra — sem navegador.

   uso:  node ferramentas\medir-fonte.mjs     (depois de mexer em film.css ou
                                               nas fontes; o JSON é versionado)

   Rode da raiz do kit. */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { caminhoDoChrome } from "./chrome.mjs";

const CHROME = caminhoDoChrome();
const raiz = process.cwd();
const baseUrl = `file:///${raiz.replace(/\\/g, "/")}/`;

/* os caracteres que aparecem nos textos do canal, incluindo acentos pt-BR */
const CHARS = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
  ..." .,:;!?()-—–'\"…%/+=<>[]{}_#@&*",
  ..."ÁÉÍÓÚÂÊÔÃÕÇÀáéíóúâêôãõçà",
];

/* família, peso, estilo — como film.css define */
const FAMILIAS = {
  display: { family: "Montserrat", weight: 800, style: "normal" },
  body: { family: "Nunito", weight: 600, style: "normal" },
  bodyForte: { family: "Nunito", weight: 800, style: "normal" },
  mono: { family: "JetBrains Mono", weight: 400, style: "normal" },
  monoForte: { family: "JetBrains Mono", weight: 600, style: "normal" },
};

const script = `
(async () => {
  const pre = document.createElement('pre'); pre.id='__saida'; pre.style.display='none';
  document.body.appendChild(pre);
  const chars = ${JSON.stringify(CHARS)};
  const familias = ${JSON.stringify(FAMILIAS)};
  const corpo = 200;

  /* sem esperar a fonte, o canvas mede o fallback */
  for (const f of Object.values(familias)) {
    try { await document.fonts.load(f.style + ' ' + f.weight + ' 200px "' + f.family + '"'); } catch {}
  }
  await document.fonts.ready;

  const cv = document.createElement('canvas');
  const cx = cv.getContext('2d');
  const saida = {};
  for (const [nome, f] of Object.entries(familias)) {
    cx.font = f.style + ' ' + f.weight + ' ' + corpo + 'px "' + f.family + '"';
    const mapa = {};
    for (const c of chars) mapa[c] = +(cx.measureText(c).width / corpo).toFixed(4);
    saida[nome] = mapa;
  }
  /* confere que a fonte carregou: se a métrica for igual à do fallback,
     medimos a fonte errada */
  cx.font = '800 ' + corpo + 'px "Montserrat"';
  const a = cx.measureText('A').width;
  cx.font = corpo + 'px serif';
  const b = cx.measureText('A').width;
  saida.__ok = Math.abs(a - b) > 1;
  saida.__fonte = document.fonts.check('800 200px "Montserrat"');
  pre.textContent = JSON.stringify(saida);
})();`;

const html = `<!doctype html><meta charset="utf-8"><base href="${baseUrl}">
<link rel="stylesheet" href="assets/film.css">
<body><script>${script}</script></body>`;

const tmp = path.join(raiz, "work", "_medir-fonte.html");
fs.writeFileSync(tmp, html, "utf8");

const dom = execFileSync(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--virtual-time-budget=8000",
    `--user-data-dir=${path.join(raiz, "work", "_chrome-fonte")}`,
    "--dump-dom",
    `file:///${tmp.replace(/\\/g, "/")}`,
  ],
  { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 },
);

const bloco = dom.match(/<pre id="__saida"[^>]*>([\s\S]*?)<\/pre>/);
if (!bloco) {
  console.error("a página não mediu nada");
  process.exit(1);
}
const dados = JSON.parse(bloco[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
if (!dados.__ok) {
  console.error("a fonte não carregou no Chrome (medida igual ao fallback) — confira assets/fonts");
  process.exit(1);
}
delete dados.__ok;
delete dados.__fonte;

fs.writeFileSync("biblioteca/larguras.json", JSON.stringify(dados), "utf8");
const amostra = ["título de teste", "inteligência artificial", "o que é um prompt?"].map((t) => {
  const total = [...t.toUpperCase()].reduce((s, c) => s + (dados.display[c] ?? 0.8), 0);
  return `  ${t.padEnd(24)} ${Math.round(total * 96)}px a 96px`;
});
console.log("biblioteca/larguras.json gravado");
console.log(amostra.join("\n"));
