/* mostra todas as ocorrências de uma palavra no fala.json,
   com tempo e índice (#n) — para escolher a âncora certa. */
import fs from "node:fs";

const fala = JSON.parse(fs.readFileSync(process.env.FALA || "montagem/fala.json", "utf8"));
const normal = (t) =>
  t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,!?…;:"“”'’()\-–—]/g, "");

const alvos = process.argv.slice(2);
for (const alvo of alvos) {
  const chave = normal(alvo);
  const achados = fala.filter((w) => normal(w.text).startsWith(chave));
  console.log(
    `${alvo} → ${achados
      .map((w, i) => `#${i + 1}@${w.start.toFixed(2)}`)
      .slice(0, 14)
      .join("  ")}`,
  );
}
