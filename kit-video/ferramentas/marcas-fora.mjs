/* acha marcação que nunca aparece — ou que aparece e morre.

   Três sintomas que passam pelo `check` sem aviso:
   1. `data-at` maior que a duração da cena — a palavra está no filme, mas
      depois do corte, e o elemento simplesmente não entra;
   2. `data-at="palavra"` não resolvido — acontece quando a âncora por palavra
      é escrita dentro de peça composta (`linha`, `cartao`, `picos`): o build
      só resolve `at` no nível de cima da lista de peças;
   3. elemento que entra nos últimos 1,2 s da cena — o corte cai em cima dele e
      o que era para ser lido vira piscada (foi o "um gatilho" do
      <slug>, ancorado na última palavra da frase).

   uso: node ferramentas\marcas-fora.mjs   (precisa de um build feito) */
import fs from "node:fs";
import path from "node:path";

const index = fs.readFileSync("index.html", "utf8");

const duracoes = new Map();
for (const m of index.matchAll(
  /data-composition-src="([^"]+)"[\s\S]{0,400}?data-duration="([\d.]+)"/g,
)) {
  duracoes.set(path.basename(m[1]), Number(m[2]));
}

const arquivos = fs
  .readdirSync("compositions")
  .filter((f) => /^s\d+\.html$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

let total = 0;
for (const f of arquivos) {
  const dur = duracoes.get(f);
  const html = fs.readFileSync(path.join("compositions", f), "utf8");
  const ats = [...html.matchAll(/data-at2?="([^"]+)"/g)].map((m) => m[1]);
  const fora = ats.filter((v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n > dur - 0.03 || n < -0.03 : false;
  });
  const texto = ats.filter((v) => !Number.isFinite(Number(v)));
  /* entra e morre no corte: menos de 1,2 s em tela não dá leitura — é o que
     fez "um gatilho" piscar atrás do rabisco numa cena de 7 s. */
  const tardio = ats.filter((v) => {
    const n = Number(v);
    return Number.isFinite(n) && n > dur - 1.2 && n <= dur - 0.03;
  });
  if (fora.length) {
    total += fora.length;
    console.log(`${f} (dur ${dur.toFixed(1)}s): fora → ${[...new Set(fora)].join(", ")}`);
  }
  if (tardio.length) {
    total += tardio.length;
    console.log(`${f} (dur ${dur.toFixed(1)}s): entra e corta logo → ${[...new Set(tardio)].join(", ")}`);
  }
  if (texto.length) {
    total += texto.length;
    console.log(`${f}: âncora não resolvida → ${[...new Set(texto)].join(", ")}`);
  }
}
console.log(total ? `\n${total} problema(s)` : "\nnenhuma marcação perdida");
