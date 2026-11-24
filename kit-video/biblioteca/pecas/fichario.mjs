/* O fichário: a caixa-arquivo aberta.
   O desenho é imagem (assets/desenhos/fichario.png); o que se move é desenhado
   por cima — os cartões que entram, a redoma de vidro e o globo apagado.

   A mesma caixa abriga dois argumentos clássicos: "a resposta usa só o que
   está aqui dentro" (a redoma) e, mais tarde, "o que fica nos fundos" (a porta
   lateral — outro desenho, outra peça). */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "fichario",
  funcao: "a caixa-arquivo aberta: recebe cartões de fonte, ganha redoma e placa, e mostra o globo apagado lá fora",
  usa: "w, x, y, cartoes [{nome, icone, at}], domo {at, placa}, globo {at, texto}, at, anim",
  naoFaz: "animar o PNG (nada de girar/esticar); a redoma é SVG, os cartões são desenho",
};

const R = 676 / 900; // altura / largura do arquivo

const IC = (body) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const GLIFO = {
  pdf: IC('<path d="M6 2.8h7.6L19 8.4v12.8H6z"/><path d="M13.4 3v5.4H19"/><path d="M8.8 13h2M8.8 16.4h6"/>'),
  artigo: IC('<path d="M4.4 4.6h11.2v14.8H4.4z"/><path d="M15.6 7.4h4v12H15.6"/><path d="M7 8.4h6M7 11.6h6M7 14.8h4"/>'),
  caderno: IC('<path d="M6.6 3.4h11v17.2h-11z"/><path d="M9.4 3.4v17.2"/><path d="M11.6 8h3.4M11.6 11.6h3.4"/>'),
  planilha: IC('<rect x="3.4" y="4.4" width="17.2" height="15.2" rx="1.6"/><path d="M3.4 9.2h17.2M3.4 14h17.2M9.6 4.4v15.2M14.8 4.4v15.2"/>'),
};

/* esfera de pontos: o mundo lá fora, apagado */
function globo(cx, cy, raio, op) {
  let pts = "";
  for (let lat = -70; lat <= 70; lat += 15) {
    const la = (lat * Math.PI) / 180;
    const n = Math.max(6, Math.round(22 * Math.cos(la)));
    for (let i = 0; i < n; i += 1) {
      const lon = (i / n) * Math.PI * 2;
      const x3 = Math.cos(la) * Math.sin(lon);
      const y3 = Math.sin(la);
      const z3 = Math.cos(la) * Math.cos(lon);
      const frente = (z3 + 1) / 2;
      pts += `<circle cx="${(cx + raio * x3).toFixed(1)}" cy="${(cy - raio * y3).toFixed(1)}" r="${(1.1 + 2.1 * frente).toFixed(1)}" fill="var(--ink-dim)" opacity="${((0.12 + 0.32 * frente) * op).toFixed(3)}"/>`;
    }
  }
  return `<circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="var(--ink-dim)" stroke-width="1.2" opacity="${0.28 * op}"/>${pts}`;
}

export function montar(p = {}) {
  const {
    src = "assets/desenhos/fichario.png",
    w = 820,
    cartoes = [],
    domo = null,
    globo: globoConf = null,
    at = 0.3,
    anim = "rise",
  } = p;

  const h = Math.round(w * R);
  const s = w / 820;
  const pxv = (v) => Math.round(v * s);

  /* Os cartões são documentos entrando na boca da caixa: caem em leque,
     encaixam entre as pastas e ficam lá. Quem cobre tudo depois é a redoma. */
  const LUGAR = [
    { x: 23.5, y: 30.5, rot: -4 },
    { x: 51.5, y: 31.5, rot: 3 },
    { x: 24.5, y: 37.5, rot: -2 },
    { x: 51.5, y: 38.5, rot: 4 },
  ];

  const cards = (cartoes || [])
    .map((c, i) => {
      const q = typeof c.at === "number" ? c.at : null;
      const lugar = LUGAR[i % LUGAR.length];
      return `<div class="fi-cartao" style="left:${lugar.x}%;top:${lugar.y}%;width:26%;transform:rotate(${lugar.rot}deg)"
        ${q != null ? `data-at="${q}" data-anim="drop" data-dur="0.5"` : ""}>
        <span class="fi-cartao-ic">${GLIFO[c.icone] ?? GLIFO.artigo}</span>
        <span class="fi-cartao-nome">${c.nome}</span>
      </div>`;
    })
    .join("");

  const qDomo = typeof domo?.at === "number" ? domo.at : null;
  const redoma = domo
    ? `<div class="fi-domo" ${qDomo != null ? `data-at="${qDomo}" data-anim="drop" data-dur="0.75"` : ""}>
        <svg viewBox="0 0 900 420" width="100%" height="100%" style="overflow:visible" fill="none">
          <defs>
            <linearGradient id="vidro${qDomo ?? "x"}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--cyan)" stop-opacity=".26"/>
              <stop offset="45%" stop-color="var(--cyan)" stop-opacity=".07"/>
              <stop offset="82%" stop-color="var(--cyan)" stop-opacity=".04"/>
              <stop offset="100%" stop-color="var(--cyan)" stop-opacity=".22"/>
            </linearGradient>
            <radialGradient id="base${qDomo ?? "x"}" cx=".5" cy=".5" r=".5">
              <stop offset="55%" stop-color="var(--cyan)" stop-opacity=".30"/>
              <stop offset="100%" stop-color="var(--cyan)" stop-opacity=".02"/>
            </radialGradient>
          </defs>
          <ellipse cx="450" cy="404" rx="440" ry="34" fill="url(#base${qDomo ?? "x"})"/>
          <path d="M40 402 C40 150 220 16 450 16 C680 16 860 150 860 402 Z" fill="url(#vidro${qDomo ?? "x"})"/>
          <path d="M40 402 C40 150 220 16 450 16 C680 16 860 150 860 402" stroke="rgba(var(--cyan-rgb),.85)" stroke-width="5" stroke-linecap="round"/>
          <path d="M120 352 C150 170 300 68 450 58" stroke="rgba(var(--ink-rgb),.9)" stroke-width="7" stroke-linecap="round" opacity=".55"/>
          <path d="M300 118 C250 148 214 190 194 236" stroke="rgba(var(--ink-rgb),.6)" stroke-width="4" stroke-linecap="round"/>
          <path d="M690 300 C712 250 736 214 764 190" stroke="rgba(var(--cyan-rgb),.7)" stroke-width="4" stroke-linecap="round" opacity=".7"/>
          <ellipse cx="450" cy="404" rx="430" ry="26" stroke="rgba(var(--cyan-rgb),.75)" stroke-width="5"/>
        </svg>
      </div>`
    : "";

  const placa = domo?.placa
    ? `<div class="fi-placa" ${qDomo != null ? `data-at="${(qDomo + 0.5).toFixed(2)}" data-anim="pop" data-dur="0.4"` : ""}>${domo.placa}</div>`
    : "";

  const qGlobo = typeof globoConf?.at === "number" ? globoConf.at : null;
  const globoHtml = globoConf
    ? `<div class="fi-globo" ${qGlobo != null ? `data-at="${qGlobo}" data-anim="fade" data-dur="0.6"` : ""}>
        <svg viewBox="0 0 160 160" width="100%" height="100%">${globo(80, 80, 62, 1)}</svg>
        <div class="fi-globo-x">${globoConf.texto ?? "sem sinal"}</div>
      </div>`
    : "";

  return {
    css: `
    .fi-caixa{position:relative}
    .fi-cartao{position:absolute;display:flex;align-items:center;gap:${pxv(7)}px;padding:${pxv(8)}px ${pxv(10)}px;border-radius:${pxv(10)}px;background:linear-gradient(160deg,rgba(var(--panel-2-rgb),.98),rgba(var(--panel-rgb),1));border:1.5px solid rgba(var(--line-rgb),.45);box-shadow:0 ${pxv(10)}px ${pxv(22)}px rgba(var(--shadow-rgb),.5);z-index:3}
    .fi-cartao-ic{width:${pxv(22)}px;height:${pxv(22)}px;color:var(--cyan);flex:0 0 auto}
    .fi-cartao-nome{font-family:var(--mono);font-size:${pxv(20)}px;letter-spacing:.02em;color:var(--ink);white-space:nowrap}
    .fi-domo{position:absolute;left:3%;top:1%;width:94%;height:47%;pointer-events:none;z-index:5}
    .fi-placa{position:absolute;left:50%;bottom:-4%;transform:translateX(-50%);padding:${pxv(8)}px ${pxv(16)}px;border-radius:999px;background:rgba(var(--bg-2-rgb),.95);border:1.5px solid rgba(var(--cyan-rgb),.6);box-shadow:0 0 26px rgba(var(--cyan-rgb),.25);font-family:var(--body);font-weight:700;font-size:${pxv(17)}px;color:var(--cyan);white-space:nowrap;z-index:5}
    .fi-globo{position:absolute;right:-16%;top:2%;width:30%;opacity:.8}
    .fi-globo-x{position:absolute;left:50%;bottom:-6%;transform:translateX(-50%);font-family:var(--mono);font-size:${pxv(13)}px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-dim);white-space:nowrap;border:1px solid rgba(var(--line-rgb),.35);border-radius:999px;padding:${pxv(3)}px ${pxv(9)}px}
    `,
    html: envolver(
      p,
      `<div class="fi-caixa" style="width:${px(w)};height:${px(h)}" ${entrada(p, { anim, at })}>
        <img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;display:block;filter:drop-shadow(0 ${pxv(24)}px ${pxv(46)}px rgba(var(--shadow-rgb),.55))"/>
        ${cards}${redoma}${placa}${globoHtml}
      </div>`,
    ),
  };
}
