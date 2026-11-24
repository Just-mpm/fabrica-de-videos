/* O painel Studio de um app.
   Nove opções desenhadas em grade, o décimo espaço vazio e — fora da grade —
   o tile de site que só aparece quando alguém escreve no chat.

   Por que uma peça: esta grade é o argumento do vídeo. Ela volta três vezes
   (o gancho, a revelação e o fecho) e precisa ser exatamente a mesma nas três,
   com o mesmo desenho de ícone, o mesmo espaçamento e o mesmo buraco.

   A lupa (`lupa`) percorre as linhas da grade como um olhar: cada passada é
   uma reta, e a última termina no espaço vazio. */

import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "estudio",
  funcao:
    "painel Studio em grade: nove tiles desenhados, o vazio de décimo lugar, a lupa que procura e o tile de site fora da grade",
  usa:
    "w, x, y, acesos (índices ou 'todos'), t {acesos, site, vazio}, apagado, vazio, site, rotulo, escala, lupa {at, dur}, at, anim",
  naoFaz:
    "mais de nove opções; o site nunca entra na grade — ele é o que não existe no painel",
};

const I = (body) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const GLIFOS = {
  audio: I('<path d="M3.4 12v0"/><path d="M6.6 8.6v6.8M9.8 5.6v12.8M13 9.4v5.2M16.2 4.6v14.8M19.4 8.2v7.6M22 11v2"/>'),
  slides: I('<rect x="2.8" y="5" width="18.4" height="12" rx="2"/><path d="M7 9.6h5M7 12.6h3.4"/><path d="M15.4 13.4l2.6-1.8-2.6-1.8z"/>'),
  video: I('<rect x="2.6" y="7.4" width="14" height="9.6" rx="2"/><path d="M16.6 11.4l4.8-2.6v7.2l-4.8-2.6z"/>'),
  mapa: I('<circle cx="12" cy="4.6" r="2.1"/><circle cx="4.8" cy="18.4" r="2.1"/><circle cx="19.2" cy="18.4" r="2.1"/><path d="M10.8 6.6l-4.4 9.8M13.2 6.6l4.4 9.8M6.9 18.4h10.2"/>'),
  relatorio: I('<path d="M5.6 2.8h8.2l4.6 4.6v13.8H5.6z"/><path d="M13.6 3v4.8h4.8"/><path d="M8.6 12h6.8M8.6 15.4h6.8M8.6 18.4h4"/>'),
  cards: I('<rect x="6.6" y="3.2" width="12.6" height="12.6" rx="2.2"/><path d="M16.6 18.4H7.2a2.4 2.4 0 01-2.4-2.4V7.4"/><path d="M10.4 7.4h5M10.4 10.4h3.4"/>'),
  quiz: I('<path d="M20.2 12.4c0 3.8-3.6 6.8-8.1 6.8-1 0-1.9-.1-2.8-.4L4.8 20.2l1.1-3.4a6.5 6.5 0 01-1.7-4.4c0-3.8 3.6-6.8 8.1-6.8s7.9 3 7.9 6.8z"/><path d="M9.9 10.2c.2-1 1-1.6 2.1-1.6 1.2 0 2.1.8 2.1 1.8 0 1.4-1.7 1.5-1.9 2.8"/><path d="M12.1 16.2h.1"/>'),
  infografico: I('<path d="M12 3.4a8.6 8.6 0 108.6 8.6H12z"/><path d="M14.6 2.6a8.6 8.6 0 016.8 6.8h-6.8z"/>'),
  tabela: I('<rect x="2.8" y="4.6" width="18.4" height="14.8" rx="2"/><path d="M2.8 9.6h18.4M2.8 14.6h18.4M9.4 4.6v14.8"/>'),
  site: I('<rect x="2.6" y="4.4" width="18.8" height="15.2" rx="2.4"/><path d="M2.6 9h18.8"/><circle cx="5.6" cy="6.7" r=".55"/><circle cx="7.8" cy="6.7" r=".55"/><path d="M6 13.2h6.4M6 16h4"/>'),
};

/* A ordem é a da narração: áudio, slides, vídeo, mapa mental, relatório,
   flashcards, quiz, infográfico, tabela de dados. */
const OPCOES = [
  { nome: "áudio", icone: "audio" },
  { nome: "slides", icone: "slides" },
  { nome: "vídeo", icone: "video" },
  { nome: "mapa mental", icone: "mapa" },
  { nome: "relatório", icone: "relatorio" },
  { nome: "flashcards", icone: "cards" },
  { nome: "quiz", icone: "quiz" },
  { nome: "infográfico", icone: "infografico" },
  { nome: "tabela", icone: "tabela" },
];

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

const LUPA = `<svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="42" cy="40" r="26" fill="rgba(var(--cyan-rgb),.10)" stroke="var(--cyan)" stroke-width="4.5"/>
  <path d="M28 28a16 16 0 018-8" stroke="rgba(var(--ink-rgb),.75)" stroke-width="3.4"/>
  <path d="M62 60l22 22" stroke="var(--cyan)" stroke-width="9" stroke-linecap="round"/>
  <path d="M62 60l22 22" stroke="rgba(var(--bg-rgb),.9)" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
</svg>`;

export function montar(p = {}) {
  const {
    w = 1180,
    acesos = [],
    apagado = false,
    vazio = false,
    site = null,
    rotulo = "studio",
    escala = 1,
    at = 0.2,
    anim = "fade",
    t = {},
    lupa = null,
  } = p;

  const pad = Math.round(w * 0.026);
  const gap = Math.round(w * 0.015);
  const colW = (w - pad * 2 - gap * 3) / 4;
  const tileH = Math.round(colW * 0.66);
  const raio = Math.round(w * 0.014);
  const icone = Math.round(colW * 0.19);
  const fonte = Math.max(14, Math.round(colW * 0.072 * escala));
  const cabecalho = Math.round(w * 0.03);

  const aviso = acesos === "todos" ? OPCOES.map((_, i) => i) : Array.isArray(acesos) ? acesos : [];
  const tempos = Array.isArray(t.acesos) ? t.acesos : [];
  const baseAceso = num(t.acesos);

  const tile = (o, i) => {
    const lit = aviso.includes(i);
    const quando = tempos[i] ?? (baseAceso == null ? null : baseAceso + i * 0.12);
    const brilho = lit && quando != null
      ? `<div class="es-on" data-at="${quando}" data-anim="fade" data-dur="0.45">
           <div class="es-ic" style="width:${icone}px;height:${icone}px" data-layout-ignore>${GLIFOS[o.icone]}</div>
           <div class="es-nome es-nome-on" data-layout-ignore>${o.nome}</div>
         </div>`
      : lit
        ? `<div class="es-on es-on-fixo" data-layout-ignore>
             <div class="es-ic" style="width:${icone}px;height:${icone}px" data-layout-ignore>${GLIFOS[o.icone]}</div>
             <div class="es-nome es-nome-on" data-layout-ignore>${o.nome}</div>
           </div>`
        : "";

    return `<div class="es-tile" style="width:${colW.toFixed(1)}px;height:${tileH}px;border-radius:${raio}px">
      <div class="es-ic es-ic-off" style="width:${icone}px;height:${icone}px">${GLIFOS[o.icone]}</div>
      <div class="es-nome" style="font-size:${fonte}px">${o.nome}</div>
      ${brilho}
    </div>`;
  };

  /* o décimo lugar: existe como espaço, não como opção */
  const quandoVazio = num(t.vazio);
  const slot = `<div class="es-slot" style="width:${colW.toFixed(1)}px;height:${tileH}px;border-radius:${raio}px;${
    vazio ? "" : "opacity:.55"
  }" ${quandoVazio != null ? `data-at="${quandoVazio}" data-anim="pop"` : ""}>
      <div class="es-slot-pulso" ${quandoVazio != null ? `data-at2="${(quandoVazio + 0.5).toFixed(2)}" data-anim2="pulso"` : ""}>
        <div class="es-slot-q" style="font-size:${Math.round(tileH * 0.34)}px" data-layout-ignore>?</div>
        <div class="es-slot-txt" style="font-size:${Math.max(12, Math.round(fonte * 0.8))}px" data-layout-ignore>espaço vazio</div>
      </div>
    </div>`;

  /* o tile que não está no painel: nasce fora da grade, em verde-limão */
  const quandoSite = num(t.site);
  const siteHtml = site
    ? `<div class="es-site" style="width:${Math.round(colW * 0.92)}px;height:${Math.round(tileH * 0.92)}px;border-radius:${raio}px" ${
        quandoSite != null
          ? `data-at="${quandoSite}" data-anim="pop" data-at2="${(quandoSite + 0.45).toFixed(2)}" data-anim2="flutua"`
          : ""
      }>
        <div class="es-ic es-ic-site" style="width:${Math.round(icone * 1.05)}px;height:${Math.round(icone * 1.05)}px">${GLIFOS.site}</div>
        <div class="es-nome es-nome-site" style="font-size:${fonte}px">site</div>
        <div class="es-sem-botao" style="font-size:${Math.max(11, Math.round(fonte * 0.72))}px" data-layout-ignore>sem botão</div>
      </div>`
    : "";

  /* A lupa: uma reta por linha da grade. A última termina no espaço vazio
     (décima célula = linha 3, coluna 2). Ela entra e sai em cada passada —
     o que se vê é o olhar indo e voltando. */
  let lupaHtml = "";
  if (lupa) {
    const conf = lupa === true ? {} : lupa;
    const q0 = num(conf.at) ?? 0.8;
    const dur = num(conf.dur) ?? 1.1;
    const tam = Math.round(colW * 0.52);
    const passoX = colW + gap;
    const passoY = tileH + gap;
    const centro = (col, row) => ({ x: col * passoX + colW / 2, y: row * passoY + tileH / 2 });
    const alvo = centro(1, 2);
    const passadas = [
      { de: { x: -tam * 0.6, y: centro(0, 0).y }, ate: centro(3, 0) },
      { de: centro(3, 1), ate: centro(0, 1) },
      { de: { x: -tam * 0.6, y: alvo.y }, ate: alvo },
    ];
    lupaHtml = `<div class="es-varrer">${passadas
      .map((ps, i) => {
        const ini = q0 + i * dur;
        const meio = ini + dur * 0.82;
        return `<div style="position:absolute;left:0;top:0;width:${tam}px;height:${tam}px;opacity:0"
          data-at="${ini.toFixed(2)}" data-anim="fade" data-dur="0.3"
          data-at2="${meio.toFixed(2)}" data-anim2="fadeOut" data-dur2="0.28">
          <div class="es-lupa" style="width:${tam}px;height:${tam}px"
            data-at="${ini.toFixed(2)}" data-anim="varre" data-dur="${dur.toFixed(2)}"
            data-de="${ps.de.x.toFixed(1)}" data-yde="${(ps.de.y - tam / 2).toFixed(1)}"
            data-to="${ps.ate.x.toFixed(1)}" data-yto="${(ps.ate.y - tam / 2).toFixed(1)}">${LUPA}</div>
        </div>`;
      })
      .join("")}</div>`;
  }

  const corpo = `<div class="es-painel${apagado ? " es-apagado" : ""}" style="width:${px(w)};padding:${pad}px;border-radius:${Math.round(w * 0.024)}px;gap:${gap}px">
      ${rotulo ? `<div class="es-rotulo" style="font-size:${Math.round(cabecalho * 0.62)}px">${rotulo}</div>` : ""}
      <div class="es-grade" style="grid-template-columns:repeat(4,${colW.toFixed(1)}px);grid-auto-rows:${tileH}px;gap:${gap}px">
        ${OPCOES.map(tile).join("")}
        ${slot}
        ${lupaHtml}
      </div>
      ${siteHtml}
    </div>`;

  return {
    css: `
    .es-painel{position:relative;display:flex;flex-direction:column;background:linear-gradient(165deg,rgba(var(--panel-2-rgb),.55),rgba(var(--bg-2-rgb),.92));border:1.5px solid rgba(var(--line-rgb),.28);box-shadow:inset 0 1px 0 rgba(var(--ink-rgb),.10),0 30px 70px rgba(var(--shadow-rgb),.55);backdrop-filter:blur(2px)}
    .es-painel.es-apagado{filter:saturate(.22) brightness(.78)}
    .es-rotulo{font-family:var(--body);font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:var(--ink-dim);margin:-4px 2px 4px}
    .es-grade{position:relative;display:grid}
    .es-tile{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(var(--panel-rgb),.42);border:1.5px solid rgba(var(--line-rgb),.16);color:var(--ink-dim);overflow:hidden}
    .es-ic{display:block;flex:0 0 auto}
    .es-ic-off{opacity:.62;color:var(--ink-dim)}
    .es-nome{font-family:var(--body);font-weight:700;letter-spacing:.01em;line-height:1;color:var(--ink-dim);white-space:nowrap}
    .es-on{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:linear-gradient(160deg,rgba(var(--cyan-rgb),.16),rgba(var(--panel-2-rgb),.55));border:1.5px solid rgba(var(--cyan-rgb),.55);border-radius:inherit;box-shadow:inset 0 0 26px rgba(var(--cyan-rgb),.12),0 0 26px rgba(var(--cyan-rgb),.16);color:var(--cyan)}
    .es-on .es-ic{filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.55))}
    .es-nome-on{color:var(--cyan)}
    .es-on-fixo{opacity:1}
    .es-slot{border-radius:var(--r-md);border:2px dashed rgba(var(--cyan-rgb),.45);display:flex;align-items:center;justify-content:center;background:rgba(var(--cyan-rgb),.03)}
    .es-slot-pulso{display:flex;flex-direction:column;align-items:center;gap:4px}
    .es-slot-q{font-family:var(--display);font-weight:800;line-height:1;color:rgba(var(--cyan-rgb),.5)}
    .es-slot-txt{font-family:var(--mono);letter-spacing:.14em;text-transform:uppercase;color:rgba(var(--cyan-rgb),.45);white-space:nowrap}
    .es-varrer{position:absolute;inset:0;pointer-events:none;z-index:3}
    .es-lupa{position:absolute;color:var(--cyan);filter:drop-shadow(0 0 22px rgba(var(--cyan-rgb),.55))}
    .es-site{position:absolute;right:-4%;bottom:-11%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:linear-gradient(160deg,rgba(var(--lime-rgb),.22),rgba(var(--lime-rgb),.08));border:2px solid var(--lime);border-radius:var(--r-md);box-shadow:0 0 34px rgba(var(--lime-rgb),.35),inset 0 0 22px rgba(var(--lime-rgb),.10);color:var(--lime);transform:rotate(-4deg);z-index:4}
    .es-ic-site{filter:drop-shadow(0 0 10px rgba(var(--lime-rgb),.5))}
    .es-nome-site{color:var(--lime);font-weight:800;text-transform:uppercase;letter-spacing:.12em}
    .es-sem-botao{font-family:var(--mono);letter-spacing:.14em;text-transform:uppercase;color:rgba(var(--lime-rgb),.85);white-space:nowrap}
    `,
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${corpo}</div>`),
  };
}
