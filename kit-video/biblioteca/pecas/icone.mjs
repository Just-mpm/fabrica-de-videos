import { icons } from "../markup.mjs";
import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "icone",
  funcao: "glifo de interface (spark, brain, chip, bot, chat, search, code…) em traço de luz",
  usa: "nome, tamanho, cor, fundo, raio, x, y, at, anim",
  naoFaz: "desenho de cena; objeto e personagem são imagem gerada",
};

export function montar(p = {}) {
  const {
    nome = "spark",
    tamanho = 56,
    cor = "var(--cyan)",
    fundo = false,
    raio = 14,
    anim = "pop",
    at = 0.2,
  } = p;

  const glifo = icons[nome];
  if (!glifo) {
    throw new Error(`icone: "${nome}" não existe — use: ${Object.keys(icons).join(", ")}`);
  }

  const glifoHtml = `<div style="width:${fundo ? Math.round(tamanho * 0.56) : tamanho}px;height:${fundo ? Math.round(tamanho * 0.56) : tamanho}px">${glifo}</div>`;

  const corpo = fundo
    ? `<div style="display:inline-flex;align-items:center;justify-content:center;width:${px(tamanho)};height:${px(tamanho)};border-radius:${px(raio)};background:rgba(var(--cyan-rgb),.10);border:1px solid rgba(var(--cyan-rgb),.30);color:${cor};box-shadow:inset 0 0 22px rgba(var(--cyan-rgb),.10)" ${entrada(p, { anim, at })}>${glifoHtml}</div>`
    : `<div style="display:inline-flex;width:${px(tamanho)};height:${px(tamanho)};color:${cor}" ${entrada(p, { anim, at })}>${glifo}</div>`;

  return { html: envolver(p, corpo) };
}
