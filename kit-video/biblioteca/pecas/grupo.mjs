import { entrada, caixa, posicionada, px } from "./base.mjs";
import { htmlDePecas } from "./index.mjs";

export const contrato = {
  nome: "grupo",
  funcao: "empilha peças na vertical, com espaço entre elas",
  usa: "pecas, x, y, w, gap, alinhar, at, anim",
  naoFaz: "grupo com posição própria dentro de outro grupo (use o fluxo)",
};

export function montar(p = {}) {
  const {
    pecas = [],
    gap = 24,
    alinhar = "flex-start",
    anim = null,
    at = null,
    largura = null,
  } = p;

  const estilo = ["display:flex", "flex-direction:column", `gap:${px(gap)}`];
  if (posicionada(p)) estilo.push("position:absolute", caixa(p));
  if (largura != null) estilo.push(`width:${px(largura)}`);
  estilo.push(`align-items:${alinhar}`);

  return {
    html: `<div style="${estilo.join(";")}" ${entrada(p, { at, anim })}>${htmlDePecas(pecas)}</div>`,
  };
}
