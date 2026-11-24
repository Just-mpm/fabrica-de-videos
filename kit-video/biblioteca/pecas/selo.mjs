import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "selo",
  funcao: "carimbo torto de luz: 'testado', 'beta', 'grátis', 'em 2026'",
  usa: "texto, cor, tamanho, rot, x, y, at, anim",
  naoFaz: "frase longa; o selo é uma ou duas palavras",
};

const CORES = { ciano: "var(--cyan)", ambar: "var(--amber)", violeta: "var(--violet)", verde: "var(--green)" };

export function montar(p = {}) {
  const {
    texto = "",
    cor = "var(--cyan)",
    tamanho = 30,
    rot = -6,
    anim = "slamRot",
    at = 0.6,
  } = p;

  const tinta = CORES[cor] ?? cor;

  return {
    html: envolver(
      p,
      `<div style="display:inline-block;transform:rotate(${rot}deg);border:2px solid ${tinta};border-radius:8px;padding:10px 22px 8px;color:${tinta};font-family:var(--display);font-weight:700;font-size:${px(tamanho)};letter-spacing:.14em;text-transform:uppercase;background:rgba(var(--bg-2-rgb),.6);box-shadow:0 0 30px rgba(var(--cyan-rgb),.18),inset 0 0 24px rgba(var(--cyan-rgb),.06)" ${entrada(p, { anim, at, rot })}>${texto}</div>`,
    ),
  };
}
