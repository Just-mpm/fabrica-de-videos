/* O card de produto: a etiqueta trocando.
   O ícone é desenho (assets/desenhos/icone-caderno.png); o resto é interface.
   A peça conta uma coisa só — o nome mudou, o produto e o endereço não. */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "produto",
  funcao: "card do app: ícone desenhado, nome antigo riscado, nome novo e a barra de endereço que continua igual",
  usa: "w, de, para, data, url, t {risca, novo, url}, x, y, at, anim",
  naoFaz: "duas trocas de nome no mesmo card; texto longo no lugar do nome",
};

const CADEADO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.4"/><path d="M8.2 10.4V7.8a3.8 3.8 0 017.6 0v2.6"/></svg>`;

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function montar(p = {}) {
  const {
    w = 880,
    de = "App Antigo",
    para = "App Novo",
    data = "01 · jan · 2026",
    url = "exemplo.com.br",
    t = {},
    at = 0.3,
    anim = "rise",
    src = "assets/desenhos/icone-caderno.png",
  } = p;

  const s = w / 880;
  const pxv = (v) => Math.round(v * s);
  const qRisca = num(t.risca);
  const qNovo = num(t.novo);
  const qUrl = num(t.url);

  const riscado = qRisca != null
    ? `<svg class="pr-risco" viewBox="0 0 300 40" preserveAspectRatio="none"><path d="M2 27 C 60 20, 140 16, 298 12" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" data-at="${qRisca}" data-anim="draw" data-dur="0.55"/></svg>`
    : "";

  const corpo = `<div class="pr-card" style="width:${px(w)};padding:${pxv(34)} ${pxv(38)};border-radius:${pxv(28)}px;gap:${pxv(26)}px">
      <div class="pr-icone" style="width:${pxv(132)}px;height:${pxv(132)}px"
        data-at="${Math.max(0, at - 0.1).toFixed(2)}" data-anim="vira" data-de="-68" data-rot="0" data-dur="1.25">
        <img src="${src}" alt="" style="width:100%;height:100%;object-fit:contain;display:block"/>
      </div>
      <div class="pr-texto">
        <div class="pr-topo">
          <span class="pr-rotulo" style="font-size:${pxv(15)}px">nome do produto</span>
          <span class="pr-data" style="font-size:${pxv(15)}px">${data}</span>
        </div>
        <div class="pr-antigo" style="font-size:${pxv(30)}px">${de}${riscado}</div>
        <div class="pr-nome" style="font-size:${pxv(52)}px"
          ${qNovo != null ? `data-at="${qNovo}" data-anim="blurIn" data-dur="0.75"` : ""}>${para}</div>
        <div class="pr-url" style="font-size:${pxv(19)}px" ${qUrl != null ? `data-at="${qUrl}" data-anim="fade" data-dur="0.5"` : ""}>
          <span class="pr-cadeado">${CADEADO}</span>
          <span class="pr-end"><span>${url}</span><span class="pr-sublinhado" ${qUrl != null ? `data-at="${(qUrl + 0.35).toFixed(2)}" data-anim="growX" data-dur="0.6"` : ""}></span></span>
          <span class="pr-mesmo" style="font-size:${pxv(14)}px" data-layout-ignore>mesmo endereço</span>
        </div>
      </div>
    </div>`;

  return {
    css: `
    .pr-card{position:relative;display:flex;align-items:center;gap:${pxv(30)}px;background:linear-gradient(150deg,rgba(var(--panel-2-rgb),.72),rgba(var(--panel-rgb),.96));border:1.5px solid rgba(var(--line-rgb),.34);border-radius:${pxv(28)}px;box-shadow:inset 0 1px 0 rgba(var(--ink-rgb),.12),0 ${pxv(26)}px ${pxv(60)}px rgba(var(--shadow-rgb),.55)}
    .pr-icone{flex:0 0 auto;filter:drop-shadow(0 ${pxv(10)}px ${pxv(24)}px rgba(var(--cyan-rgb),.45))}
    .pr-texto{flex:1;min-width:0;display:flex;flex-direction:column;gap:${pxv(4)}px}
    .pr-topo{display:flex;align-items:baseline;justify-content:space-between;gap:${pxv(16)}px;margin-bottom:${pxv(8)}px}
    .pr-rotulo{font-family:var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--ink-dim)}
    .pr-data{font-family:var(--mono);color:var(--cyan)}
    .pr-antigo{position:relative;display:inline-block;align-self:flex-start;font-family:var(--mono);color:var(--ink-dim);line-height:1.1}
    .pr-risco{position:absolute;left:-2%;top:6%;width:104%;height:88%;overflow:visible}
    .pr-risco path{stroke:var(--cyan);stroke-width:3.2;fill:none;stroke-linecap:round}
    .pr-nome{font-family:var(--display);font-weight:800;letter-spacing:-.02em;line-height:1.05;color:var(--ink)}
    .pr-url{position:relative;display:inline-flex;align-items:center;gap:${pxv(10)}px;align-self:flex-start;margin-top:${pxv(14)}px;padding:${pxv(9)}px ${pxv(16)}px;border-radius:999px;background:rgba(var(--bg-2-rgb),.75);border:1px solid rgba(var(--line-rgb),.28);font-family:var(--mono);color:var(--ink-soft)}
    .pr-cadeado{width:${pxv(15)}px;height:${pxv(15)}px;display:inline-block;color:var(--lime)}
    .pr-sublinhado{position:absolute;left:0;bottom:-4px;height:2px;width:100%;background:var(--cyan);border-radius:2px;transform-origin:left center;box-shadow:0 0 10px rgba(var(--cyan-rgb),.7)}
    .pr-end{position:relative;display:inline-block}
    .pr-mesmo{margin-left:${pxv(6)}px;font-family:var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--lime)}
    `,
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${corpo}</div>`),
  };
}
