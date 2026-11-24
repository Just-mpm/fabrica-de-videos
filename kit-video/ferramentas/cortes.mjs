/* lê o index.html compilado e mostra, para cada corte, as palavras
   faladas perto dele — para conferir se a cena começa no respiro. */
import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
// FALA permite apontar para a fala de outro vídeo: FALA=montagem/fala-<slug>.json
const fala = JSON.parse(fs.readFileSync(process.env.FALA || "montagem/fala.json", "utf8"));

const cenas = [...html.matchAll(/id="(s\d+)"[\s\S]*?data-start="([\d.]+)"[\s\S]*?data-duration="([\d.]+)"/g)].map(
  (m) => ({ id: m[1], start: +m[2], dur: +m[3] }),
);

const perto = (t, janela = 0.9) =>
  fala
    .filter((w) => Math.abs(w.start - t) < janela)
    .map((w) => `${w.text}@${w.start.toFixed(2)}`)
    .join(" ");

console.log("id    início   dur    | antes do corte           | depois do corte");
for (const c of cenas) {
  const fim = +(c.start + c.dur).toFixed(2);
  const antes = fala.filter((w) => w.start < c.start).slice(-3).map((w) => `${w.text}@${w.start.toFixed(1)}`).join(" ");
  const depois = fala.filter((w) => w.start >= c.start).slice(0, 3).map((w) => `${w.text}@${w.start.toFixed(1)}`).join(" ");
  console.log(
    `${c.id} ${String(c.start).padStart(8)} ${String(c.dur).padStart(6)} → ${String(fim).padStart(7)} | ${antes.padEnd(38)} | ${depois}`,
  );
}
const total = cenas.at(-1).start + cenas.at(-1).dur;
console.log(`\ncena final termina em ${total.toFixed(2)}s · última palavra ${fala.at(-1).end.toFixed(2)}s`);
