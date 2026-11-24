import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "cursor",
  funcao: "o ponteiro do mouse entrando e clicando num ponto (com onda de clique)",
  usa: "x, y, tamanho, cor, clicar, at, at2, anim",
  naoFaz: "trilha longa pelo quadro; o cursor entra no ponto e clica",
};

export function montar(p = {}) {
  const {
    tamanho = 40,
    cor = "var(--ice)",
    clicar = true,
    at = 0.6,
    at2 = null,
    anim = "slideR",
  } = p;

  const quandoClique = at2 ?? at + 0.55;

  const seta = `<svg viewBox="0 0 24 24" width="${tamanho}" height="${tamanho}" class="cursor-arrow">
    <path d="M4.5 2.6l15 8.6-7.1 1.5-3 6.9z" fill="${cor}" stroke="var(--on-accent)" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;

  const anel = clicar
    ? `<div style="position:absolute;left:${-26}px;top:${-26}px;width:64px;height:64px" data-at="${quandoClique}" data-anim="onda" data-dur="0.6">
         <div class="cursor-ring" style="width:100%;height:100%;opacity:.9"></div>
       </div>`
    : "";

  return {
    html: envolver(
      p,
      `<div style="position:relative;width:${px(tamanho)};height:${px(tamanho)}" ${entrada(p, { anim, at })}>
        ${seta}${anel}
      </div>`,
    ),
  };
}
