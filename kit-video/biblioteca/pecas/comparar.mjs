import { icons } from "../markup.mjs";
import { entrada, envolver, px } from "./base.mjs";
import { htmlDePecas } from "./index.mjs";

export const contrato = {
  nome: "comparar",
  funcao: "dois painéis lado a lado (antes/depois, com IA/sem IA) com uma seta no meio",
  usa: "esquerda {rotulo,titulo,texto,pecas}, direita {…}, destaque (direita|esquerda), w, h, gap, x, y, at, anim",
  naoFaz: "mais de dois lados; para três opções use passos ou cartões",
};

function painel(lado, { ciano = false } = {}) {
  const {
    rotulo = "",
    titulo = "",
    texto = "",
    pecas = [],
  } = lado || {};

  const cor = ciano ? "var(--cyan)" : "var(--ink-dim)";
  const classe = ciano ? "glass-cyan" : "glass-soft";

  const conteudo = pecas.length
    ? htmlDePecas(pecas)
    : `${titulo ? `<div class="t-display" style="font-size:52px;line-height:1.02;color:${ciano ? "var(--ink)" : "var(--ink-soft)"}">${titulo}</div>` : ""}
       ${texto ? `<div style="font-family:var(--body);font-size:28px;line-height:1.35;color:var(--ink-soft);margin-top:10px">${texto}</div>` : ""}`;

  return `<div class="${classe}" style="flex:1;min-width:0;padding:32px 34px;display:flex;flex-direction:column;gap:10px">
      <div data-layout-ignore style="display:flex;align-items:center;gap:10px;font-family:var(--body);font-weight:800;font-size:18px;letter-spacing:.16em;text-transform:uppercase;color:${cor}">
        <span style="width:8px;height:8px;border-radius:50%;background:${cor};box-shadow:0 0 10px ${cor}"></span>${rotulo}
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:10px;justify-content:center;min-height:0">${conteudo}</div>
    </div>`;
}

export function montar(p = {}) {
  const {
    esquerda = {},
    direita = {},
    w = 1500,
    h = null,
    gap = 22,
    destaque = "direita",
    at = 0.4,
    anim = "fade",
  } = p;

  const meio = `<div style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:64px">
      <div style="width:52px;height:52px;border-radius:50%;border:1px solid rgba(var(--cyan-rgb),.45);background:rgba(var(--bg-2-rgb),.9);display:grid;place-items:center;color:var(--cyan);box-shadow:0 0 26px rgba(var(--cyan-rgb),.2)" data-at="${(at + 0.55).toFixed(2)}" data-anim="pop">
        <div style="width:24px;height:24px">${icons.arrow}</div>
      </div>
    </div>`;

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};display:flex;align-items:stretch;gap:${px(gap)}${h ? `;height:${px(h)}` : ""}" ${entrada(p, { anim, at })}>
        <div style="flex:1;display:flex" data-at="${at}" data-anim="slideL">${painel(esquerda)}</div>
        ${meio}
        <div style="flex:1;display:flex" data-at="${(at + 0.25).toFixed(2)}" data-anim="slideR">${painel(direita, { ciano: destaque !== "esquerda" })}</div>
      </div>`,
    ),
  };
}
