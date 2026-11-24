import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "grafico",
  funcao: "linha ou área com eixo, grade e ponto final: evolução, adoção, preço no tempo",
  usa: "valores, rotulos, w, h, cor, area, sufixo, titulo, grade, x, y, at, anim",
  naoFaz: "mais de 12 pontos (vira ruído); duas séries na mesma peça (use duas peças)",
};

let seq = 0;

export function montar(p = {}) {
  const {
    valores = [],
    rotulos = [],
    w = 900,
    h = 420,
    cor = "var(--cyan)",
    area = true,
    sufixo = "",
    titulo = null,
    at = 0.5,
    anim = "fade",
    grade = true,
  } = p;

  if (valores.length < 3) throw new Error("grafico: informe ao menos 3 valores — valores: [..]");
  if (valores.length > 12) throw new Error("grafico: no máximo 12 pontos");

  const id = `graf-${++seq}`;
  /* com título, a área do gráfico começa mais abaixo para o texto não encostar */
  const topo = titulo ? 66 : 34;
  const base = h - (rotulos.length ? 52 : 26);
  const maximo = Math.max(...valores, 1) * 1.16;
  const passo = (w - 60) / (valores.length - 1);
  const pontos = valores.map((v, i) => [
    30 + i * passo,
    base - (v / maximo) * (base - topo),
  ]);

  const linha = pontos
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const fim = pontos.at(-1);
  const inicio = pontos[0];
  const areaPath = `${linha} L${fim[0].toFixed(1)} ${base} L${inicio[0].toFixed(1)} ${base} Z`;

  const linhasGrade = grade
    ? [0, 1, 2, 3]
        .map((k) => {
          const y = base - (k / 3) * (base - topo);
          return `<line x1="30" y1="${y.toFixed(1)}" x2="${w - 30}" y2="${y.toFixed(1)}" stroke="rgba(var(--line-rgb),.10)" stroke-width="1"/>`;
        })
        .join("")
    : "";

  const marcas = pontos
    .map(([x, y], i) => {
      const ultimo = i === pontos.length - 1;
      return `<g data-at="${(at + 0.75 + i * 0.06).toFixed(2)}" data-anim="pop" data-dur="0.34">
        ${ultimo ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="18" fill="${cor}" opacity=".16"/>` : ""}
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${ultimo ? 8 : 5}" fill="${ultimo ? cor : "var(--panel)"}" stroke="${cor}" stroke-width="2.2"${ultimo ? ` style="filter:drop-shadow(0 0 12px rgba(var(--cyan-rgb),.8))"` : ""}/>
      </g>`;
    })
    .join("");

  const etiquetas = rotulos.length
    ? pontos
        .map(([x], i) =>
          rotulos[i]
            ? `<text x="${x.toFixed(1)}" y="${(base + 34).toFixed(1)}" text-anchor="middle" font-family="JetBrains Mono" font-size="20" data-layout-ignore fill="var(--ink-dim)">${rotulos[i]}</text>`
            : "",
        )
        .join("")
    : "";

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};height:${px(h)}" ${entrada(p, { anim, at: 0.15 })}>
        <svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">
          <defs>
            <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--cyan)" stop-opacity=".26"/>
              <stop offset="100%" stop-color="var(--cyan)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          ${titulo ? `<text x="30" y="36" font-family="JetBrains Mono" font-size="28" letter-spacing="1.2" fill="var(--ink-dim)">${titulo}</text>` : ""}
          ${linhasGrade}
          <line x1="30" y1="${base}" x2="${w - 30}" y2="${base}" stroke="rgba(var(--line-rgb),.34)" stroke-width="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${(at + 0.1).toFixed(2)}" data-anim="draw" data-dur="0.8"/>
          ${area ? `<path d="${areaPath}" fill="url(#${id})" data-at="${(at + 1.0).toFixed(2)}" data-anim="fade" data-dur="0.8"/>` : ""}
          <path d="${linha}" stroke="${cor}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${(at + 0.25).toFixed(2)}" data-anim="draw" data-dur="1.2" style="filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.55))"/>
          ${marcas}
          ${etiquetas}
          <text x="${(fim[0] + 14).toFixed(1)}" y="${(fim[1] - 18).toFixed(1)}" text-anchor="${fim[0] > w - 130 ? "end" : "start"}" font-family="Montserrat" font-weight="700" font-size="34" fill="var(--ink)" data-at="${(at + 1.15).toFixed(2)}" data-anim="fade" data-dur="0.4">${valores.at(-1)}${sufixo}</text>
        </svg>
      </div>`,
    ),
  };
}
