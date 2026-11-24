/* lista as cenas do build com início/fim absolutos — para achar "que cena é esse segundo".
   uso: node ferramentas\cenas-tempo.mjs [até]   */
import fs from "node:fs";

const limite = Number(process.argv[2] ?? 9999);
const t = fs.readFileSync("index.html", "utf8");
const re =
  /data-composition-src="compositions\/(s\d+)\.html"[\s\S]{0,300}?data-start="([\d.]+)"[\s\S]{0,200}?data-duration="([\d.]+)"/g;
let m;
while ((m = re.exec(t))) {
  const s = Number(m[2]);
  const d = Number(m[3]);
  if (s < limite) console.log(`${m[1]}  ${s.toFixed(2)} → ${(s + d).toFixed(2)}  (dur ${d.toFixed(2)})`);
}
