/* A salinha nos fundos do fichário.
   O desenho é imagem (assets/desenhos/fichario-sala.png): a caixa de lado, a
   porta aberta, a mesa com monitor, a luminária e a janela com nuvem.
   O que se move é desenhado por cima: a luz que acende, o traço da porta, a
   bolha de execução com as tentativas de código e o ponto verde no monitor.

   O ciclo é tentativa e correção, não mágica: duas linhas erram (ficam
   vermelhas, tremem e são riscadas) e a terceira fecha em verde. */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "sala",
  funcao: "o fichário de lado com a porta aberta: acende a luz, desenha a porta, roda as tentativas de código e fecha em ok",
  usa: "w, x, y, tentar, n, linhas [{texto, erro}], rotulo, legenda, t {luz, porta, ok}, at, anim",
  naoFaz: "animar o PNG; escrever código legível por cima do monitor (a tela é pequena) — o código vive na bolha",
};

const R = 770 / 900;
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/* posição da tela do monitor dentro do desenho (medida no arquivo) */
const TELA = { x: 0.575, y: 0.656, w: 0.095, h: 0.081 };

export function montar(p = {}) {
  const {
    src = "assets/desenhos/fichario-sala.png",
    w = 760,
    tentar = 1.2,
    n = 3,
    linhas = null,
    rotulo = "sala de execução",
    legenda = null,
    t = {},
    at = 0.3,
    anim = "rise",
    bolha = true,
  } = p;

  const h = Math.round(w * R);
  const s = w / 760;
  const pxv = (v) => Math.round(v * s);

  const qLuz = num(t.luz) ?? at + 0.45;
  const qPorta = num(t.porta) ?? at + 0.15;

  const passos = linhas ?? [
    { texto: "montar(página)", erro: true },
    { texto: "quiz.corrigir()", erro: true },
    { texto: "publicar(página)", erro: false },
  ];
  const total = Math.min(n, passos.length) || passos.length;

  const tentativas = passos
    .slice(0, total)
    .map((l, i) => {
      const quando = +(tentar + i * 0.92).toFixed(2);
      const risco = l.erro ? +(quando + 0.55).toFixed(2) : null;
      return `<div class="sa-tent ${l.erro ? "sa-tent-erro" : "sa-tent-ok"}" data-at="${quando}" data-anim="drop" data-dur="0.42">
        <span class="sa-pt"></span>
        <span class="sa-cod">${l.texto}</span>
        <span class="sa-est">${l.erro ? "erro" : "ok"}</span>
        ${l.erro ? `<svg class="sa-risco" viewBox="0 0 200 24" preserveAspectRatio="none"><path d="M2 16 C 60 10, 130 8, 198 12" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${risco}" data-anim="draw" data-dur="0.4"/></svg>` : ""}
      </div>`;
    })
    .join("");

  const qOk = num(t.ok) ?? +(tentar + total * 0.92).toFixed(2);

  const corpo = `<div class="sa-caixa" style="width:${px(w)};height:${px(h)}">
      <img src="${src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;display:block;filter:drop-shadow(0 ${pxv(26)}px ${pxv(50)}px rgba(var(--shadow-rgb),.55))"/>

      <div class="sa-luz" style="left:${(0.5 * 100).toFixed(1)}%;top:${(0.56 * 100).toFixed(1)}%;width:${(0.33 * 100).toFixed(1)}%;height:${(0.4 * 100).toFixed(1)}%"
        data-at="${qLuz}" data-anim="fade" data-dur="0.9"></div>

      <svg class="sa-porta" viewBox="0 0 900 770" style="position:absolute;inset:0;width:100%;height:100%;overflow:visible" fill="none">
        <path d="M652 402 C 640 470 638 560 646 662 C 700 676 760 676 800 662 C 810 560 808 470 796 402 Z"
          stroke="var(--cyan)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"
          pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"
          data-at="${qPorta}" data-anim="draw" data-dur="1.0" style="filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.75))"/>
      </svg>
      <div class="sa-clique" style="left:${(86).toFixed(0)}%;top:${(48).toFixed(0)}%"
        data-at="${(qPorta + 0.85).toFixed(2)}" data-anim="pop" data-dur="0.35">clique</div>

      <div class="sa-led" style="left:${((TELA.x + TELA.w * 0.5) * 100).toFixed(1)}%;top:${((TELA.y + TELA.h * 0.5) * 100).toFixed(1)}%"
        data-at="${qOk}" data-anim="pop" data-dur="0.4"></div>

      ${bolha
        ? `<div class="sa-bolha" style="left:${(40).toFixed(0)}%;top:${(-40).toFixed(0)}%;width:${(62).toFixed(0)}%;gap:${pxv(9)}px;padding:${pxv(16)}px ${pxv(18)}px">
            <div class="sa-bolha-topo">
              <span class="sa-bolha-rot">${rotulo}</span>
              <span class="sa-bolha-n">${total} tentativas</span>
            </div>
            ${tentativas}
            <div class="sa-ligacao"></div>
          </div>`
        : ""}

      ${legenda ? `<div class="sa-legenda" style="font-size:${pxv(16)}px">${legenda}</div>` : ""}
    </div>`;

  return {
    css: `
    .sa-caixa{position:relative}
    .sa-luz{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(var(--amber-rgb),.55),rgba(var(--amber-rgb),.16) 55%,transparent 72%);filter:blur(6px);pointer-events:none}
    .sa-clique{position:absolute;transform:translate(-50%,-50%);padding:${pxv(5)}px ${pxv(12)}px;border-radius:999px;background:rgba(var(--bg-2-rgb),.95);border:1.5px solid rgba(var(--cyan-rgb),.7);font-family:var(--mono);font-size:${pxv(15)}px;letter-spacing:.14em;text-transform:uppercase;color:var(--cyan);white-space:nowrap;box-shadow:0 0 20px rgba(var(--cyan-rgb),.35);z-index:6}
    .sa-led{position:absolute;width:${pxv(22)}px;height:${pxv(22)}px;border-radius:50%;transform:translate(-50%,-50%);background:var(--lime);box-shadow:0 0 22px rgba(var(--lime-rgb),.95),0 0 44px rgba(var(--lime-rgb),.5);z-index:5}
    .sa-bolha{position:absolute;display:flex;flex-direction:column;border-radius:${pxv(20)}px;background:linear-gradient(160deg,rgba(var(--panel-rgb),.97),rgba(var(--bg-2-rgb),.97));border:1.5px solid rgba(var(--line-rgb),.36);box-shadow:0 ${pxv(18)}px ${pxv(44)}px rgba(var(--shadow-rgb),.6);z-index:7}
    .sa-bolha-topo{display:flex;align-items:baseline;justify-content:space-between;gap:${pxv(12)}px;padding-bottom:${pxv(2)}px}
    .sa-bolha-rot{font-family:var(--body);font-weight:800;font-size:${pxv(15)}px;letter-spacing:.16em;text-transform:uppercase;color:var(--ink-soft)}
    .sa-bolha-n{font-family:var(--mono);font-size:${pxv(12)}px;color:var(--ink-dim)}
    .sa-tent{position:relative;display:flex;align-items:center;gap:${pxv(9)}px;padding:${pxv(8)}px ${pxv(11)}px;border-radius:${pxv(10)}px;border:1px solid rgba(var(--line-rgb),.2);background:rgba(var(--panel-rgb),.45);overflow:hidden}
    .sa-pt{width:${pxv(8)}px;height:${pxv(8)}px;border-radius:50%;flex:0 0 auto}
    .sa-cod{flex:1;font-family:var(--mono);font-size:${pxv(17)}px;color:var(--ink);white-space:nowrap}
    .sa-est{font-family:var(--mono);font-size:${pxv(13)}px;letter-spacing:.1em;text-transform:uppercase}
    .sa-tent-erro{border-color:rgba(var(--red-rgb),.45);background:rgba(var(--red-rgb),.09)}
    .sa-tent-erro .sa-pt{background:var(--red);box-shadow:0 0 10px rgba(var(--red-rgb),.8)}
    .sa-tent-erro .sa-est{color:var(--red)}
    .sa-tent-ok{border-color:rgba(var(--lime-rgb),.5);background:rgba(var(--lime-rgb),.1)}
    .sa-tent-ok .sa-pt{background:var(--lime);box-shadow:0 0 10px rgba(var(--lime-rgb),.8)}
    .sa-tent-ok .sa-est{color:var(--lime)}
    .sa-risco{position:absolute;left:${pxv(10)}px;right:${pxv(46)}px;top:50%;height:${pxv(20)}px;transform:translateY(-50%)}
    .sa-risco path{stroke:rgba(var(--red-rgb),.95);stroke-width:2.6;fill:none;stroke-linecap:round}
    .sa-ligacao{position:absolute;left:${pxv(18)}px;bottom:${pxv(-16)}px;width:${pxv(2)}px;height:${pxv(16)}px;background:linear-gradient(rgba(var(--cyan-rgb),.7),transparent)}
    .sa-legenda{position:absolute;left:50%;bottom:${pxv(-34)}px;transform:translateX(-50%);font-family:var(--mono);letter-spacing:.1em;color:var(--ink-dim);white-space:nowrap}
    `,
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${corpo}</div>`),
  };
}
