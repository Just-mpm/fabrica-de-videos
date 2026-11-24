import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "rede",
  funcao: "rede de nós e conexões que se desenha: como um modelo liga informação",
  usa: "nos [{x,y,r,rotulo}], ligacoes [[i,j]], w, h, cor, x, y, at, anim",
  naoFaz: "mais de 12 nós; a leitura vira teia",
};

const NOS_PADRAO = [
  { x: 50, y: 12, r: 9 },
  { x: 14, y: 36, r: 7 },
  { x: 86, y: 36, r: 7 },
  { x: 28, y: 74, r: 8 },
  { x: 72, y: 74, r: 8 },
  { x: 50, y: 50, r: 15 },
  { x: 50, y: 92, r: 6 },
];

const LIGACOES_PADRAO = [
  [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 6],
  [1, 3], [2, 4], [3, 6], [4, 6], [0, 5],
];

export function montar(p = {}) {
  const {
    nos = NOS_PADRAO,
    ligacoes = LIGACOES_PADRAO,
    w = 760,
    h = 520,
    cor = "var(--cyan)",
    at = 0.4,
    anim = "fade",
  } = p;

  const pontos = nos.map((n) => ({
    x: (n.x / 100) * w,
    y: (n.y / 100) * h,
    r: n.r ?? 8,
    rotulo: n.rotulo ?? null,
  }));

  const tracos = ligacoes
    .map(([a, b], i) => {
      const A = pontos[a];
      const B = pontos[b];
      if (!A || !B) return "";
      return `<path d="M${A.x.toFixed(1)} ${A.y.toFixed(1)} L${B.x.toFixed(1)} ${B.y.toFixed(1)}" fill="none" stroke="${cor}" stroke-width="1.6" opacity=".55" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${(at + i * 0.07).toFixed(2)}" data-anim="draw" data-dur="0.7"/>`;
    })
    .join("");

  const bolinhas = pontos
    .map((n, i) => {
      const destaque = i === 5 || n.r >= 14;
      return `<g data-at="${(at + 0.25 + i * 0.08).toFixed(2)}" data-anim="pop" data-dur="0.4">
        <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r + 7}" fill="${cor}" opacity=".10"/>
        <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r}" fill="${destaque ? cor : "var(--panel)"}" stroke="${cor}" stroke-width="2" style="filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.7))"/>
        ${n.rotulo ? `<text x="${n.x.toFixed(1)}" y="${(n.y + n.r + 26).toFixed(1)}" text-anchor="middle" font-family="Nunito" font-size="22" data-layout-ignore fill="var(--ink-soft)">${n.rotulo}</text>` : ""}
      </g>`;
    })
    .join("");

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};height:${px(h)}" ${entrada(p, { anim, at: 0.15 })}>
        <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${tracos}${bolinhas}</svg>
      </div>`,
    ),
  };
}
