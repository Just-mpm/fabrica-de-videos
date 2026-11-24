/* Confere as poses do personagem no filme: quantas figuras, quantas poses distintas,
   quais repetiram — e, para cada uma, o que a imagem realmente mostra e de onde
   ela veio. É o que impede escolher pelo nome.

   node ferramentas\poses-do-filme.mjs [nome-do-arquivo-sem-extensao] */
const nome = process.argv[2] || "demo-livre";
const mod = await import(`../montagem/${nome}.mjs`);
const { fichaPose } = await import("../biblioteca/personagem.mjs");
const film = mod.default;

const usos = [];
const contar = (p, cena) => {
  if (!p) return;
  if (Array.isArray(p)) return p.forEach((x) => contar(x, cena));
  if (typeof p !== "object") return;
  if (p.tipo === "figura" && p.pose) usos.push({ pose: p.pose, cena, altura: p.altura });
  for (const v of Object.values(p)) contar(v, cena);
};

for (const cena of film.cenas) {
  if (cena.valores?.pose) usos.push({ pose: cena.valores.pose, cena: cena.bloco, altura: cena.valores.altura });
  contar(cena.valores?.pecas, cena.bloco);
}

const porPose = new Map();
for (const u of usos) {
  const ficha = fichaPose(u.pose);
  const chave = ficha?.nome ?? u.pose;
  if (!porPose.has(chave)) porPose.set(chave, { ficha, n: 0, alturas: new Set() });
  const reg = porPose.get(chave);
  reg.n += 1;
  if (u.altura) reg.alturas.add(u.altura);
}

const origens = new Set();
for (const { ficha } of porPose.values()) {
  if (ficha?.de && ficha.de !== nome && !["kit", "correção"].includes(ficha.de)) origens.add(ficha.de);
}

console.log(`${usos.length} figura(s) · ${porPose.size} pose(s) distinta(s)`);
if (origens.size) console.log(`de outros vídeos: ${[...origens].join(", ")}`);
console.log("");

for (const [pose, { ficha, n, alturas }] of [...porPose.entries()].sort((a, b) => b[1].n - a[1].n)) {
  const marca = n > 1 ? `  ← repetida ${n}×` : "";
  const alt = alturas.size ? `  (altura ${[...alturas].join("/")})` : "";
  console.log(`${String(n).padStart(2)}× ${pose}${marca}${alt}`);
  if (!ficha) {
    console.log("     ! não está no fichário — pose sem ficha não tem como ser conferida");
    continue;
  }
  console.log(`     ve: ${ficha.ve}`);
  console.log(`     ${ficha.enquadramento} · nasceu em: ${ficha.de} · serve: ${ficha.serve.join(", ")}`);
}

const repetidas = [...porPose.values()].filter((r) => r.n > 1).length;
const semFicha = [...porPose.values()].filter((r) => !r.ficha).length;

if (repetidas) console.log(`\n! ${repetidas} pose(s) repetida(s) no mesmo filme — regra: nenhuma pose se repete`);
if (semFicha) console.log(`! ${semFicha} pose(s) fora do fichário`);
if (usos.length >= 15 && porPose.size < 10) {
  console.log("! piso de variedade: com 15+ figuras, use ao menos 10 poses distintas");
}
