import { entrada, caixa, posicionada, px } from "./base.mjs";
import { htmlDePecas } from "./index.mjs";

export const contrato = {
  nome: "linha",
  funcao: "coloca peças lado a lado numa faixa (ícone + texto, chip + texto, botões)",
  usa: "pecas, x, y, w, gap, alinhar, justificar, at, anim",
  naoFaz: "quebrar linha sozinha; se não couber, diminua o conteúdo ou use grupo",
};

export function montar(p = {}) {
  const {
    pecas = [],
    gap = 20,
    alinhar = "center",
    justificar = "flex-start",
    anim = null,
    at = null,
    largura = null,
  } = p;

  const estilo = ["display:flex", "flex-direction:row", `gap:${px(gap)}`, `align-items:${alinhar}`, `justify-content:${justificar}`];
  if (posicionada(p)) estilo.push("position:absolute", caixa(p));
  if (largura != null) estilo.push(`width:${px(largura)}`);

  return {
    html: `<div style="${estilo.join(";")}" ${entrada(p, { at, anim })}>${htmlDePecas(pecas)}</div>`,
  };
}
