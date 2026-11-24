import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "fluxo",
  funcao: "caminho de nós ligados por setas que se desenham: entrada → modelo → saída",
  usa: "nos [{titulo, texto, icone}], destaque, w, x, y, at, anim",
  naoFaz: "mais de 4 nós numa faixa (acima disso use passos); ramificar o caminho",
};

/* Seta entre dois nós: o traço se desenha e a ponta aparece no fim.
   Sem `gap` entre os cartões — a seta é o espaçamento. */
function seta(at, cor) {
  return `<div style="flex:0 0 92px;display:grid;place-items:center;align-self:center">
      <svg viewBox="0 0 92 24" width="92" height="24" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round">
        <path d="M2 12H76" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${at.toFixed(2)}" data-anim="draw" data-dur="0.5"/>
        <path d="M68 5.6L78.4 12 68 18.4" data-at="${(at + 0.42).toFixed(2)}" data-anim="pop" data-dur="0.3"/>
      </svg>
    </div>`;
}

export function montar(p = {}) {
  const {
    nos = [],
    destaque = null,
    w = 1500,
    at = 0.4,
    anim = "fade",
    cor = "var(--cyan)",
  } = p;

  if (!nos.length) throw new Error("fluxo: informe ao menos um nó — nos: [{ titulo }]");
  if (nos.length > 4) throw new Error("fluxo: no máximo 4 nós — acima disso use passos");

  const partes = nos.map((n, i) => {
    const ativo = i === destaque;
    const borda = ativo ? "rgba(var(--cyan-rgb),.55)" : "rgba(var(--line-rgb),.16)";
    const fundo = ativo ? "rgba(var(--cyan-rgb),.10)" : "rgba(var(--panel-rgb),.72)";
    const icone = n.icone && icons[n.icone] ? icons[n.icone] : icons.spark;

    const cartao = `<div style="flex:1;min-width:0;padding:26px 24px;border-radius:var(--r-md);background:${fundo};border:1px solid ${borda};${ativo ? "box-shadow:0 0 46px rgba(var(--cyan-rgb),.18),inset 0 1px 0 rgba(var(--ink-rgb),.12);" : ""}display:flex;flex-direction:column;gap:14px" data-at="${(at + i * 0.34).toFixed(2)}" data-anim="rise">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:46px;height:46px;flex:0 0 auto;border-radius:12px;display:grid;place-items:center;background:${ativo ? "rgba(var(--cyan-rgb),.18)" : "rgba(var(--line-rgb),.08)"};border:1px solid ${borda};color:${ativo ? cor : "var(--ink-soft)"}">
            <div style="width:26px;height:26px">${icone}</div>
          </div>
          <div style="font-family:var(--body);font-weight:600;font-size:28px;line-height:1.15;color:${ativo ? "var(--ink)" : "var(--ink-soft)"}">${n.titulo ?? ""}</div>
        </div>
        ${n.texto ? `<div data-layout-ignore style="font-family:var(--body);font-size:24px;line-height:1.3;color:var(--ink-dim)">${n.texto}</div>` : ""}
      </div>`;

    const ligacao = i < nos.length - 1 ? seta(at + i * 0.34 + 0.5, cor) : "";
    return cartao + ligacao;
  });

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};display:flex;align-items:stretch" ${entrada(p, { anim, at: 0.15 })}>${partes.join("")}</div>`,
    ),
  };
}
