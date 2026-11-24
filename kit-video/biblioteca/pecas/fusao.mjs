/* Documento e aplicativo convergindo.
   A folha é papel (clara, com dobra); o app é painel (escuro, com abas).
   A linha que separa os dois é o argumento: ela não é apagada por um corte,
   ela desbota — e o que fica é uma folha com botão e um painel com margem. */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "fusao",
  funcao: "folha de papel e painel de app lado a lado; o divisor desbota, a folha ganha botão e o painel ganha texto",
  usa: "esquerda {rotulo, titulo}, direita {rotulo, titulo}, t {divisor, apaga, botao, margem}, w, h, x, y, at, anim",
  naoFaz: "mais de dois painéis; animar o que está dentro da folha antes do divisor desbotar",
};

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function montar(p = {}) {
  const {
    esquerda = { rotulo: "documento", titulo: "você lê" },
    direita = { rotulo: "aplicativo", titulo: "você usa" },
    t = {},
    w = 1460,
    h = 520,
    at = 0.3,
    anim = "rise",
  } = p;

  const s = w / 1460;
  const pxv = (v) => Math.round(v * s);
  const qDiv = num(t.divisor);
  const qApaga = num(t.apaga);
  const qBotao = num(t.botao);
  const qMargem = num(t.margem);

  const linhas = [96, 88, 92, 62, 84];
  const linhasApp = [100, 92, 84, 96, 60];

  const metade = (w - pxv(180)) / 2;
  const qAprox = qApaga;

  const corpo = `<div class="fu-quadro" style="width:${px(w)};height:${px(h)}">
      <div class="fu-painel fu-papel" style="width:${metade}px;height:${px(h)}"
        ${qAprox != null ? `data-at="${qAprox}" data-anim="varre" data-de="0" data-yde="0" data-to="${Math.round(pxv(78))}" data-yto="0" data-dur="1.3"` : ""}>
        <div class="fu-aba fu-aba-papel" style="font-size:${pxv(15)}px">${esquerda.rotulo}</div>
        <div class="fu-folha">
          <div class="fu-dobra"></div>
          ${linhas
            .map(
              (l, i) => `<div class="fu-linha" style="width:${l}%;${i === 0 ? "height:14px;opacity:.7" : ""}"></div>`,
            )
            .join("")}
          ${qBotao != null
            ? `<div class="fu-botao" data-at="${qBotao}" data-anim="pop" data-dur="0.45">
                 <span class="fu-botao-pt"></span>abrir
               </div>`
            : ""}
        </div>
        <div class="fu-pe fu-pe-papel" style="font-size:${pxv(17)}px">${esquerda.titulo}</div>
      </div>

      <div class="fu-divisor" style="left:${(w / 2).toFixed(1)}px"
        ${qDiv != null ? `data-at="${qDiv}" data-anim="draw" data-dur="0.8"` : ""}
        ${qApaga != null ? `data-at2="${qApaga}" data-anim2="fadeOut" data-dur2="0.9"` : ""}></div>
      <div class="fu-x" style="left:${(w / 2).toFixed(1)}px;top:${pxv(46)}px"
        ${qDiv != null ? `data-at="${(qDiv + 0.4).toFixed(2)}" data-anim="fade"` : ""}
        ${qApaga != null ? `data-at2="${(qApaga + 0.3).toFixed(2)}" data-anim2="fadeOut" data-dur2="0.7"` : ""}>×</div>

      <div class="fu-painel fu-app" style="left:${(w - metade).toFixed(0)}px;width:${metade}px;height:${px(h)}"
        ${qAprox != null ? `data-at="${qAprox}" data-anim="varre" data-de="0" data-yde="0" data-to="${-Math.round(pxv(78))}" data-yto="0" data-dur="1.3"` : ""}>
        <div class="fu-barra">
          <span class="fu-bola"></span><span class="fu-bola"></span><span class="fu-bola"></span>
          <span class="fu-url" style="font-size:${pxv(14)}px">app</span>
        </div>
        <div class="fu-abas" style="font-size:${pxv(15)}px">
          <span class="fu-aba-on">painel</span><span>lista</span><span>ajustes</span>
        </div>
        <div class="fu-app-corpo">
          <div class="fu-graf">
            ${[52, 74, 44, 88].map((a) => `<span style="height:${a}%"></span>`).join("")}
          </div>
          <div class="fu-texto">
            ${linhasApp
              .map(
                (l, i) => `<div class="fu-linha-app" style="width:${l}%" ${
                  qMargem != null
                    ? `data-at="${(qMargem + i * 0.12).toFixed(2)}" data-anim="growX" data-dur="0.45"`
                    : 'data-nada="1"'
                }></div>`,
              )
              .join("")}
          </div>
        </div>
        <div class="fu-pe" style="font-size:${pxv(17)}px">${direita.titulo}</div>
      </div>
    </div>`;

  return {
    css: `
    .fu-quadro{position:relative}
    .fu-painel{position:absolute;top:0;display:flex;flex-direction:column;border-radius:${pxv(22)}px}
    .fu-papel{background:linear-gradient(170deg,rgba(var(--ink-rgb),.97),rgba(var(--ink-soft-rgb),.92));box-shadow:0 ${pxv(18)}px ${pxv(44)}px rgba(var(--shadow-rgb),.5),inset 0 1px 0 rgba(var(--ink-rgb),.9)}
    .fu-folha{position:relative;flex:1;margin:${pxv(22)}px ${pxv(26)}px ${pxv(10)}px;padding:${pxv(26)}px ${pxv(26)}px;border-radius:${pxv(10)}px;background:rgba(var(--ink-rgb),.72);display:flex;flex-direction:column;gap:${pxv(14)}px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(var(--bg-rgb),.06)}
    .fu-dobra{position:absolute;right:0;top:0;width:${pxv(42)}px;height:${pxv(42)}px;background:linear-gradient(225deg,rgba(var(--ink-soft-rgb),.95) 0 50%,rgba(var(--ink-rgb),0) 50%);border-left:1px solid rgba(var(--bg-rgb),.06)}
    .fu-linha{height:${pxv(10)}px;border-radius:999px;background:rgba(var(--bg-rgb),.22)}
    .fu-aba{align-self:flex-start;margin:${pxv(18)}px ${pxv(26)}px 0;padding:${pxv(5)}px ${pxv(12)}px;border-radius:999px;font-family:var(--mono);letter-spacing:.16em;text-transform:uppercase}
    .fu-aba-papel{color:var(--bg);background:rgba(var(--bg-rgb),.08)}
    .fu-pe{margin:0 ${pxv(26)}px ${pxv(18)}px;font-family:var(--body);font-weight:700;color:rgba(var(--ink-rgb),.62)}
    .fu-pe-papel{color:rgba(var(--bg-rgb),.8)}
    .fu-botao{margin-top:auto;align-self:flex-start;display:inline-flex;align-items:center;gap:${pxv(10)}px;padding:${pxv(11)}px ${pxv(24)}px;border-radius:999px;background:var(--cyan);color:var(--on-accent);font-family:var(--body);font-weight:800;font-size:${pxv(19)}px;box-shadow:0 ${pxv(8)}px ${pxv(20)}px rgba(var(--cyan-rgb),.45)}
    .fu-botao-pt{width:${pxv(10)}px;height:${pxv(10)}px;border-radius:50%;background:var(--on-accent);opacity:.7}
    .fu-divisor{position:absolute;top:${pxv(20)}px;bottom:${pxv(20)}px;width:0;border-left:2px dashed rgba(var(--cyan-rgb),.55);transform:translateX(-1px)}
    .fu-x{position:absolute;transform:translate(-50%,-50%);font-family:var(--display);font-weight:800;font-size:${pxv(26)}px;color:var(--cyan);background:var(--bg);padding:${pxv(2)}px ${pxv(10)}px;border-radius:${pxv(10)}px}
    .fu-app{background:linear-gradient(170deg,rgba(var(--panel-2-rgb),.96),rgba(var(--bg-2-rgb),.98));border:1.5px solid rgba(var(--line-rgb),.32);box-shadow:0 ${pxv(18)}px ${pxv(44)}px rgba(var(--shadow-rgb),.55),inset 0 1px 0 rgba(var(--ink-rgb),.12)}
    .fu-barra{display:flex;align-items:center;gap:${pxv(7)}px;padding:${pxv(14)}px ${pxv(18)}px;border-bottom:1px solid rgba(var(--line-rgb),.16)}
    .fu-bola{width:${pxv(9)}px;height:${pxv(9)}px;border-radius:50%;background:rgba(var(--line-rgb),.45)}
    .fu-url{margin-left:${pxv(12)}px;font-family:var(--mono);color:var(--ink-soft)}
    .fu-abas{display:flex;gap:${pxv(16)}px;padding:${pxv(12)}px ${pxv(20)}px;font-family:var(--body);font-weight:700;color:var(--ink-soft)}
    .fu-aba-on{color:var(--cyan)}
    .fu-app-corpo{flex:1;display:flex;gap:${pxv(18)}px;padding:${pxv(18)}px ${pxv(20)}px;min-height:0}
    .fu-graf{flex:0 0 ${pxv(210)}px;display:flex;align-items:flex-end;gap:${pxv(12)}px;padding:${pxv(12)}px;border-radius:${pxv(14)}px;background:rgba(var(--bg-2-rgb),.55);border:1px solid rgba(var(--line-rgb),.16)}
    .fu-graf span{flex:1;border-radius:${pxv(6)}px ${pxv(6)}px 2px 2px;background:linear-gradient(180deg,var(--cyan),rgba(var(--cyan-rgb),.2))}
    .fu-texto{flex:1;display:flex;flex-direction:column;gap:${pxv(12)}px;justify-content:center}
    .fu-linha-app{height:${pxv(9)}px;border-radius:999px;background:rgba(var(--ink-rgb),.28);transform-origin:left center}
    `,
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${corpo}</div>`),
  };
}
