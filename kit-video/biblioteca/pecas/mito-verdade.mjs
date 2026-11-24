import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "mito-verdade",
  funcao: "dois painéis opostos: o que se repete por aí (riscado) e o que é de fato",
  usa: "mito, verdade, rotuloMito, rotuloVerdade, w, gap, x, y, at, anim",
  naoFaz: "texto longo dos dois lados; cada lado é uma frase",
};

export function montar(p = {}) {
  const {
    mito = "",
    verdade = "",
    rotuloMito = "mito",
    rotuloVerdade = "verdade",
    w = 1400,
    gap = 26,
    at = 0.4,
    anim = "fade",
  } = p;

  if (!mito || !verdade) throw new Error("mito-verdade: informe `mito` e `verdade`");

  const rotulo = (texto, cor, icone) => `<div data-layout-ignore style="display:flex;align-items:center;gap:10px;font-family:var(--body);font-weight:800;font-size:20px;letter-spacing:.16em;text-transform:uppercase;color:${cor}">
      <span style="width:18px;height:18px;display:inline-flex">${icone}</span>${texto}
    </div>`;

  const ladoMito = `<div style="flex:1;min-width:0;padding:30px 32px;border-radius:var(--r-md);background:rgba(var(--red-rgb),.12);border:1px solid rgba(var(--red-rgb),.32)" data-at="${at}" data-anim="slideL">
      ${rotulo(rotuloMito, "var(--red)", icons.close)}
      <div style="position:relative;margin-top:16px">
        <div style="position:relative;display:inline-block;max-width:100%">
          <div style="font-family:var(--body);font-weight:600;font-size:36px;line-height:1.3;color:var(--ink-soft)">${mito}</div>
          <svg viewBox="0 0 300 60" preserveAspectRatio="none" style="position:absolute;left:-1.5%;top:4%;width:103%;height:92%;overflow:visible" fill="none" stroke="var(--red)" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke">
            <path d="M4 44 C 78 30, 196 36, 296 22" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${(at + 0.55).toFixed(2)}" data-anim="draw" data-dur="0.55"/>
          </svg>
        </div>
      </div>
    </div>`;

  const ladoVerdade = `<div style="flex:1;min-width:0;padding:30px 32px;border-radius:var(--r-md);background:rgba(var(--cyan-rgb),.07);border:1px solid rgba(var(--cyan-rgb),.45);box-shadow:0 0 60px rgba(var(--cyan-rgb),.10)" data-at="${(at + 0.45).toFixed(2)}" data-anim="slideR">
      ${rotulo(rotuloVerdade, "var(--cyan)", icons.check)}
      <div style="margin-top:16px;font-family:var(--body);font-weight:600;font-size:36px;line-height:1.3;color:var(--ink)">${verdade}</div>
    </div>`;

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};display:flex;align-items:stretch;gap:${px(gap)}" ${entrada(p, { anim, at: 0.15 })}>${ladoMito}${ladoVerdade}</div>`,
    ),
  };
}
