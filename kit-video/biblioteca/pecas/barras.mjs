/* Duas barras verticais, na mesma régua.
   A honestidade é o argumento: as duas partem do mesmo zero, a escala é
   declarada e ninguém desenha uma barra "grande" para um número pequeno.

   Tudo é posicionado a partir da linha de base — a barra nasce para cima,
   o valor fica acima da coluna e o nome abaixo do eixo. */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "barras",
  funcao: "colunas verticais com valor no topo e escala declarada: comparar dois números sem mentir no tamanho",
  usa: "itens [{rotulo, valor, cor, at}], max, titulo, legenda, fator, tFator, w, h, x, y, at, anim",
  naoFaz: "cortar o eixo para inflar a diferença; mais de 4 colunas",
};

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function montar(p = {}) {
  const {
    itens = [],
    max = null,
    titulo = null,
    legenda = null,
    fator = null,
    tFator = null,
    w = 900,
    h = 520,
    at = 0.4,
    anim = "rise",
  } = p;

  if (!itens.length) throw new Error("barras: informe ao menos uma coluna");

  const topo = num(max) ?? Math.max(...itens.map((i) => i.valor)) * 1.08;
  const topoY = num(p.topo) ?? 104;
  const baseY = Math.round(h * 0.78);
  const areaH = baseY - topoY;
  const colW = Math.min(160, (w - 140) / itens.length - 60);
  const passo = (w - 140) / itens.length;
  const meio = (i) => 70 + passo * i + passo / 2;
  const base0 = at + 0.5;

  const colunas = itens
    .map((it, i) => {
      const cx = meio(i);
      const altura = Math.max(6, Math.round((it.valor / topo) * areaH));
      const quando = num(it.at) ?? +(base0 + i * 0.32).toFixed(2);
      const cor = it.cor ?? "var(--cyan)";
      return `<div class="ba-valor" style="left:${(cx - passo / 2).toFixed(1)}px;width:${passo.toFixed(1)}px;bottom:${h - baseY + altura + 12}px;color:${cor};font-size:${Math.round(colW * 0.34)}px"
          data-at="${(quando + 0.55).toFixed(2)}" data-anim="fade" data-dur="0.4">${it.valorTexto ?? String(it.valor).replace(".", ",")}%</div>
        <div class="ba-barra" style="left:${(cx - colW / 2).toFixed(1)}px;width:${colW.toFixed(1)}px;height:${altura}px;bottom:${h - baseY}px;--cor:${cor}"
          data-at="${quando}" data-anim="growY" data-dur="0.8"></div>
        <div class="ba-nome" style="left:${(cx - passo / 2).toFixed(1)}px;width:${passo.toFixed(1)}px;top:${baseY + 18}px">${it.rotulo ?? ""}</div>`;
    })
    .join("");

  /* a comparação entre as duas alturas, com o fator honesto */
  let compara = "";
  if (fator && itens.length === 2) {
    const alturaA = Math.round((itens[0].valor / topo) * areaH);
    const alturaB = Math.round((itens[1].valor / topo) * areaH);
    const x = meio(0) + colW / 2 + 26;
    const q = num(tFator) ?? base0 + 1.6;
    compara = `<div class="ba-fator" style="left:${x.toFixed(1)}px;top:${baseY - alturaB}px;height:${Math.abs(alturaB - alturaA)}px"
      data-at="${q}" data-anim="fade" data-dur="0.45">
      <span class="ba-fator-traco"></span>
      <span class="ba-fator-txt">${fator}</span>
    </div>`;
  }

  const corpo = `<div class="ba-quadro" style="width:${px(w)};height:${px(h)}">
      ${titulo ? `<div class="ba-titulo">${titulo}</div>` : ""}
      <div class="ba-eixo" style="top:${topoY}px;height:${areaH}px">
        ${[0, 0.25, 0.5, 0.75, 1]
          .map(
            (f) => `<div class="ba-grade" style="top:${((1 - f) * 100).toFixed(1)}%">
              <span data-layout-ignore>${Math.round(f * topo)}${f === 1 ? "%" : ""}</span>
            </div>`,
          )
          .join("")}
      </div>
      <div class="ba-base" style="top:${baseY}px"></div>
      ${colunas}${compara}
      ${legenda ? `<div class="ba-legenda">${legenda}</div>` : ""}
    </div>`;

  return {
    css: `
    .ba-quadro{position:relative;font-family:var(--body)}
    /* 28px é o piso de leitura do check: valor de eixo é escala, não leitura —
       por isso ele leva data-layout-ignore e pode ficar menor. */
    .ba-titulo{position:absolute;left:70px;top:14px;font-family:var(--mono);font-size:28px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-dim)}
    .ba-eixo{position:absolute;left:70px;right:70px}
    .ba-grade{position:absolute;left:0;right:0;border-top:1px dashed rgba(var(--line-rgb),.16)}
    .ba-grade span{position:absolute;left:-64px;top:-10px;width:52px;text-align:right;font-family:var(--mono);font-size:16px;color:var(--ink-dim);opacity:.8}
    .ba-base{position:absolute;left:70px;right:70px;height:2px;background:rgba(var(--line-rgb),.5);box-shadow:0 0 12px rgba(var(--line-rgb),.35)}
    .ba-barra{position:absolute;border-radius:10px 10px 2px 2px;transform-origin:center bottom;background:var(--cor);background-image:linear-gradient(180deg,rgba(var(--ink-rgb),.34),rgba(var(--ink-rgb),0) 38%,rgba(var(--shadow-rgb),.4));box-shadow:0 0 30px -4px var(--cor)}
    .ba-valor{position:absolute;text-align:center;font-family:var(--display);font-weight:800;line-height:1;letter-spacing:-.02em}
    .ba-nome{position:absolute;text-align:center;font-family:var(--mono);font-size:28px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-soft)}
    .ba-fator{position:absolute;width:0}
    .ba-fator-traco{position:absolute;left:0;top:0;bottom:0;border-left:2px dashed rgba(var(--lime-rgb),.7);box-shadow:0 0 14px rgba(var(--lime-rgb),.35)}
    .ba-fator-traco:before,.ba-fator-traco:after{content:"";position:absolute;left:-6px;width:14px;height:2px;background:rgba(var(--lime-rgb),.85)}
    .ba-fator-traco:before{top:0}
    .ba-fator-traco:after{bottom:0}
    .ba-fator-txt{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-family:var(--mono);font-size:28px;color:var(--lime);white-space:nowrap}
    .ba-legenda{position:absolute;left:70px;right:70px;bottom:2px;text-align:center;font-family:var(--mono);font-size:28px;letter-spacing:.04em;color:var(--ink-dim)}
    `,
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${corpo}</div>`),
  };
}
