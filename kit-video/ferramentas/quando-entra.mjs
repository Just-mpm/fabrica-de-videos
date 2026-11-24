/* Lista, para uma cena, quando cada elemento entra em tempo absoluto e
   quais palavras são faladas naquele instante — para decidir se o corte
   está no lugar certo. */
import fs from "node:fs";

const html = fs.readFileSync("index.html", "utf8");
const cenas = [...html.matchAll(/id="(s\d+)"[\s\S]*?data-start="([\d.]+)"[\s\S]*?data-duration="([\d.]+)"/g)].map(
  (m) => ({ id: m[1], start: +m[2], dur: +m[3] }),
);
const fala = JSON.parse(fs.readFileSync(process.env.FALA || "montagem/fala.json", "utf8"));

const alvo = process.argv.slice(2);

for (const id of alvo) {
  const i = cenas.findIndex((c) => c.id === id);
  if (i < 0) {
    console.log(`${id}: não existe`);
    continue;
  }
  const c = cenas[i];
  const p = cenas[i - 1];
  const h = fs.readFileSync(`compositions/${id}.html`, "utf8");
  const ats = [...new Set([...h.matchAll(/data-at="([\d.]+)"/g)].map((m) => +m[1]))].sort((a, b) => a - b);
  const abs = ats.slice(0, 3).map((a) => +(c.start + a).toFixed(2));

  console.log(
    `${id} ${c.start}–${(c.start + c.dur).toFixed(2)} (dur ${c.dur})` +
      (p ? ` · anterior ${p.id} ${p.start}–${(p.start + p.dur).toFixed(2)}` : " · primeira cena"),
  );
  for (const t of abs) {
    const palavras = fala
      .filter((w) => Math.abs(w.start - t) < 1.1)
      .map((w) => `${w.text}@${w.start.toFixed(2)}`)
      .join(" ");
    console.log(`   entra ${t}s  →  ${palavras || "(silêncio)"}`);
  }
  console.log("");
}
