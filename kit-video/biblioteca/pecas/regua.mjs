import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "regua",
  funcao: "linha de luz que cresce: separador, sublinhado de bloco, eixo",
  usa: "largura, espessura, cor, degradê (true), x, y, at, anim, dur",
  naoFaz: "desenhar caixa; para moldura use cartao",
};

export function montar(p = {}) {
  const {
    largura = 240,
    espessura = 2,
    cor = "var(--cyan)",
    degradê = true,
    anim = "growX",
    at = 0.2,
    dur = 0.6,
  } = p;

  const fundo = degradê
    ? `linear-gradient(90deg, ${cor}, rgba(var(--cyan-rgb),0))`
    : cor;

  return {
    html: envolver(
      p,
      `<div style="width:${px(largura)};height:${px(espessura)};background:${fundo};transform-origin:left center;box-shadow:0 0 14px rgba(var(--cyan-rgb),.35)" ${entrada(p, { anim, at, dur })}></div>`,
    ),
  };
}
