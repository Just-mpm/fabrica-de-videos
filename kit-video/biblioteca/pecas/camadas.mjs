import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "camadas",
  funcao: "rede em camadas: colunas de nós ligados de ponta a ponta, a profundidade do modelo",
  usa: "camadas [4,6,6,3], rotulos, w, h, cor, x, y, at, anim",
  naoFaz: "mais de 5 camadas ou 8 nós por camada; para um grafo solto use rede",
};

export function montar(p = {}) {
  const {
    camadas = [4, 6, 6, 3],
    rotulos = [],
    w = 900,
    h = 520,
    cor = "var(--cyan)",
    at = 0.4,
    anim = "fade",
  } = p;

  if (camadas.length < 2) throw new Error("camadas: informe ao menos 2 camadas — camadas: [4, 6, 3]");
  if (camadas.length > 5) throw new Error("camadas: no máximo 5 camadas");
  if (camadas.some((n) => n < 2 || n > 8)) throw new Error("camadas: cada camada tem de 2 a 8 nós");

  const L = camadas.length;
  const xs = camadas.map((_, l) => 80 + (l * (w - 160)) / (L - 1));
  const nos = camadas.map((n, l) => {
    const passo = Math.min(74, (h - 130) / Math.max(n - 1, 1));
    return Array.from({ length: n }, (_, i) => ({
      x: xs[l],
      y: h / 2 + (i - (n - 1) / 2) * passo,
    }));
  });

  const ligacoes = [];
  for (let l = 0; l < L - 1; l += 1) {
    nos[l].forEach((a) => {
      nos[l + 1].forEach((b) => {
        ligacoes.push(
          `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${cor}" stroke-width="1.2" opacity=".16" data-at="${(at + l * 0.24).toFixed(2)}" data-anim="fade" data-dur="0.5"/>`,
        );
      });
    });
  }

  const bolinhas = nos
    .map((coluna, l) =>
      coluna
        .map((n, i) => {
          const ultima = l === L - 1;
          const primeira = l === 0;
          return `<g data-at="${(at + 0.2 + l * 0.24 + i * 0.04).toFixed(2)}" data-anim="pop" data-dur="0.34">
            ${ultima ? `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="16" fill="${cor}" opacity=".16"/>` : ""}
            <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="8.5" fill="${ultima ? cor : primeira ? "rgba(var(--cyan-rgb),.22)" : "var(--panel)"}" stroke="${cor}" stroke-width="2" opacity="${primeira ? ".8" : "1"}"${ultima ? ` style="filter:drop-shadow(0 0 12px rgba(var(--cyan-rgb),.75))"` : ""}/>
          </g>`;
        })
        .join(""),
    )
    .join("");

  const etiquetas = rotulos
    .map((r, l) =>
      r && xs[l] != null
        ? `<text x="${xs[l].toFixed(1)}" y="${h - 16}" text-anchor="middle" font-family="JetBrains Mono" font-size="20" data-layout-ignore fill="var(--ink-dim)" letter-spacing="2">${r}</text>`
        : "",
    )
    .join("");

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};height:${px(h)}" ${entrada(p, { anim, at: 0.15 })}>
        <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">${ligacoes.join("")}${bolinhas}${etiquetas}</svg>
      </div>`,
    ),
  };
}
