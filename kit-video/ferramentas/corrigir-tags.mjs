/* acrescenta y: 140 nas tags soltas da montagem (sem y/top),
   para não caírem no fluxo e colarem no topo do quadro. */
import fs from "node:fs";

const arquivo = process.argv[2];
if (!arquivo) {
  console.error("uso: node ferramentas\\corrigir-tags.mjs montagem\\<slug>.mjs");
  process.exit(1);
}
let texto = fs.readFileSync(arquivo, "utf8");
let n = 0;

texto = texto
  .split("\n")
  .map((linha) => {
    if (!linha.includes('tipo: "tag"')) return linha;
    if (/\by:|top:/.test(linha)) return linha;
    n += 1;
    return linha.replace(/,\s*at:/, ", y: 140, at:");
  })
  .join("\n");

fs.writeFileSync(arquivo, texto);
console.log(`tags corrigidas: ${n}`);
