/* lista as cenas do filme com o "peso visual": quais têm personagem,
   ilustração, TV ou só texto. Serve para achar cena de slide. */
const mod = await import("../montagem/" + (process.argv[2] || "demo-livre") + ".mjs");
const film = mod.default;

const TEM_MUNDO = new Set(["figura", "imagem", "icone", "cartao", "janela", "rede", "token", "medidor", "terminal", "chat", "prompt", "onda", "comparar", "passos", "barra", "numero", "fundo"]);

let t = 0;
const linhas = [];
for (const [i, c] of film.cenas.entries()) {
  const v = c.valores || {};
  const tipos = new Set();
  const anda = (p) => {
    if (!p || typeof p !== "object") return;
    if (Array.isArray(p)) return p.forEach(anda);
    if (p.tipo) tipos.add(p.tipo);
    ["pecas", "itens", "passos", "eventos", "pares", "blocos", "linhas"].forEach((k) => anda(p[k]));
  };
  anda(v.pecas);
  anda(v.blocos);
  anda(v.itens);
  anda(v.linhas);
  ["imagem", "tela", "figura", "icone"].forEach((k) => v[k] && tipos.add(k));

  const mundo = [...tipos].filter((x) => TEM_MUNDO.has(x));
  const texto = [...tipos].filter((x) => !TEM_MUNDO.has(x));
  linhas.push({
    n: i + 1,
    bloco: c.bloco,
    inicio: +t.toFixed(1),
    dur: c.dur,
    mundo: mundo.join(",") || "—",
    texto: texto.join(","),
  });
  t += c.dur;
}

console.log("nº  bloco        início  dur   mundo            texto");
for (const l of linhas) {
  const vazio = l.mundo === "—" && l.bloco === "livre" ? "  ← SEM MUNDO" : "";
  console.log(
    `${String(l.n).padStart(2)}  ${l.bloco.padEnd(12)} ${String(l.inicio).padStart(6)} ${String(l.dur).padStart(5)}   ${l.mundo.padEnd(16)} ${l.texto}${vazio}`,
  );
}
