/* Máscara: a "cara" de ferramenta de resumo e o motor que trabalha por baixo.
   A folha de resumo fica opaca enquanto a narração fala da interface; quando a
   frase vira ("mas o motor por baixo já é outra coisa"), a folha vira vidro e
   o que estava escondido acende. Não é um corte: é a mesma coisa se revelando. */

import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "mascara",
  funcao: "cartão de resumo que se torna translúcido e revela o motor aceso por baixo",
  usa: "t {motor, sobe}, w, h, x, y, at, anim",
  naoFaz: "trocar o cartão por outro; a graça é o mesmo objeto deixando de esconder",
};

const CHIPS = [
  { icone: "code", rotulo: "escreve" },
  { icone: "play", rotulo: "executa" },
  { icone: "check", rotulo: "testa" },
  { icone: "refresh", rotulo: "corrige" },
  { icone: "send", rotulo: "publica" },
  { icone: "eye", rotulo: "confere" },
];

export function montar(p = {}) {
  const {
    w = 1200,
    h = 640,
    t = {},
    at = 0.4,
    anim = "rise",
  } = p;

  const qMotor = Number.isFinite(Number(t.motor)) ? Number(t.motor) : 0.9;
  const qSobe = Number.isFinite(Number(t.sobe)) ? Number(t.sobe) : 3.2;

  const circuitos = [
    "M0 120 H240 L300 60 H520",
    "M0 300 H180 L250 370 H470 L520 320 H700",
    "M0 470 H300 L360 410 H640",
    "M700 90 H900 L960 150 H1200",
    "M700 300 H860 L920 240 H1200",
    "M700 520 H980 L1040 460 H1200",
  ];

  const chips = CHIPS.map(
    (c, i) => `<div class="ma-chip" data-at="${(qMotor + 0.35 + i * 0.1).toFixed(2)}" data-anim="pop" data-dur="0.4">
        <span class="ma-icone">${icons[c.icone] ?? icons.spark}</span>
        <span class="ma-rot">${c.rotulo}</span>
      </div>`,
  ).join("");

  const html = `<div class="ma-quadro" style="width:${px(w)};height:${px(h)}" ${entrada(p, { anim, at })}>
      <div class="ma-motor">
        <svg class="ma-fios" viewBox="0 0 1200 640" preserveAspectRatio="none" fill="none">
          ${circuitos
            .map(
              (d, i) => `<path d="${d}" pathLength="1" stroke-dasharray="1 1.2" stroke-dashoffset="1.1"
                data-at="${(qMotor + i * 0.1).toFixed(2)}" data-anim="draw" data-dur="0.7"/>`,
            )
            .join("")}
        </svg>
        <div class="ma-grade">${chips}</div>
        <div class="ma-legenda" data-at="${(qSobe + 0.25).toFixed(2)}" data-anim="fade" data-dur="0.5">o motor por baixo</div>
      </div>

      <div class="ma-cara">
        <div class="ma-veu" data-at2="${qSobe.toFixed(2)}" data-anim2="transparenta" data-to="0.10" data-dur2="0.85"></div>
        <div class="ma-conteudo" data-at2="${(qSobe + 0.1).toFixed(2)}" data-anim2="fadeOut" data-dur2="0.7">
          <div class="ma-topo">
            <span class="ma-bola"></span><span class="ma-bola"></span><span class="ma-bola"></span>
            <span class="ma-url">resumo.txt</span>
            <span class="ma-selo">resumo</span>
          </div>
          <div class="ma-folha">
            <div class="ma-titulo">resumo do material</div>
            <div class="ma-linhas">
              ${[92, 84, 96, 71, 88, 54]
                .map((l) => `<div class="ma-linha" style="width:${l}%"></div>`)
                .join("")}
            </div>
            <div class="ma-pe">
              <span class="ma-etiqueta">ferramenta de resumo</span>
              <span class="ma-acao">copiar</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  return {
    css: `
    .ma-quadro{position:relative;border-radius:26px}
    .ma-motor{position:absolute;inset:0;border-radius:26px;overflow:hidden;
      background:linear-gradient(155deg,rgba(var(--panel-rgb),.96),rgba(var(--shadow-rgb),.98));
      border:1.5px solid rgba(var(--cyan-rgb),.38);
      box-shadow:inset 0 0 90px rgba(var(--cyan-rgb),.12),0 26px 70px rgba(var(--shadow-rgb),.55)}
    .ma-fios{position:absolute;inset:0;width:100%;height:100%;opacity:.75}
    .ma-fios path{stroke:rgba(var(--cyan-rgb),.55);stroke-width:2.4;stroke-linecap:round}
    .ma-grade{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);
      display:grid;grid-template-columns:repeat(3,190px);gap:16px}
    .ma-chip{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
      height:112px;border-radius:16px;border:1px solid rgba(var(--cyan-rgb),.34);
      background:linear-gradient(180deg,rgba(var(--cyan-rgb),.10),rgba(var(--cyan-rgb),.03));
      box-shadow:0 0 26px rgba(var(--cyan-rgb),.10),inset 0 1px 0 rgba(var(--ink-rgb),.10)}
    .ma-icone{width:32px;height:32px;color:var(--cyan);filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.7))}
    .ma-rot{font-family:var(--body);font-weight:700;font-size:26px;color:var(--ink)}
    .ma-legenda{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);
      font-family:var(--mono);font-size:20px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-dim)}
    .ma-cara{position:absolute;inset:0;border-radius:26px;overflow:hidden}
    .ma-veu{position:absolute;inset:0;border-radius:26px;
      background:linear-gradient(180deg,rgba(var(--panel-rgb),.99),rgba(var(--bg-2-rgb),.99));
      border:1.5px solid rgba(var(--line-rgb),.34);
      box-shadow:0 26px 70px rgba(var(--shadow-rgb),.55),inset 0 1px 0 rgba(var(--ink-rgb),.12)}
    .ma-conteudo{position:absolute;inset:0;display:flex;flex-direction:column}
    .ma-topo{display:flex;align-items:center;gap:9px;padding:18px 24px;border-bottom:1px solid rgba(var(--line-rgb),.18)}
    .ma-bola{width:11px;height:11px;border-radius:50%;background:rgba(var(--line-rgb),.5)}
    .ma-url{margin-left:12px;font-family:var(--mono);font-size:20px;color:var(--ink-dim)}
    .ma-selo{margin-left:auto;font-family:var(--mono);font-size:17px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-soft)}
    .ma-folha{flex:1;padding:40px 46px;display:flex;flex-direction:column;gap:22px}
    .ma-titulo{font-family:var(--display);font-weight:800;font-size:46px;letter-spacing:-.02em;color:var(--ink)}
    .ma-linhas{display:flex;flex-direction:column;gap:16px;margin-top:4px}
    .ma-linha{height:15px;border-radius:999px;background:rgba(var(--ink-rgb),.22)}
    .ma-pe{margin-top:auto;display:flex;align-items:center;justify-content:space-between;padding-top:20px}
    .ma-etiqueta{font-family:var(--mono);font-size:18px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim)}
    .ma-acao{font-family:var(--body);font-weight:700;font-size:22px;color:var(--ink-soft);
      border:1px solid rgba(var(--line-rgb),.32);border-radius:999px;padding:6px 16px}
    `,
    html: envolver(p, html),
  };
}
