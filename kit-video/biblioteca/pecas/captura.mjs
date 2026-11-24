import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "captura",
  funcao:
    "print de tela em moldura de navegador, com aproximação numa região do print e destaques que acendem em ordem — a prova na tela",
  usa:
    "src, ratio, url, titulo, w, h, foco {x,y,w,h} (0–1 do print), destaques [{x,y,w,h,at,cor,rotulo}], legenda, x, y, at, anim",
  naoFaz:
    "animar o print (girar/esticar); usar como decoração sem que a fala esteja apontando para ele",
};

/* O print é a prova: entra inteiro, e a aproximação é feita por recorte, não
   por transformar a imagem. `foco` diz que pedaço do print deve preencher o
   palco; `destaques` marcam, em fração do que está visível, onde o olho deve ir. */
export function montar(p = {}) {
  const {
    src = "",
    ratio = 2.2,
    url = "exemplo.com.br",
    titulo = null,
    w = 1000,
    h = null,
    foco = null,
    destaques = [],
    veu = 0,
    legenda = null,
    at = 0.3,
    anim = "blurIn",
  } = p;

  if (!src) throw new Error("captura: falta `src`");
  if (!(ratio > 0)) throw new Error("captura: `ratio` (largura/altura do print) precisa ser > 0");

  const f = foco
    ? {
        x: Math.max(0, Math.min(1, foco.x ?? 0)),
        y: Math.max(0, Math.min(1, foco.y ?? 0)),
        w: Math.max(0.02, Math.min(1, foco.w ?? 1)),
        h: Math.max(0.02, Math.min(1, foco.h ?? 1)),
      }
    : { x: 0, y: 0, w: 1, h: 1 };

  const alturaPalco = h ?? Math.round((w / f.w / ratio) * f.h);
  const larguraImg = w / f.w;
  const alturaImg = larguraImg / ratio;

  const barra = `<div class="cap-barra">
      ${["var(--red)", "var(--amber)", "var(--lime)"].map((c) => `<span style="width:11px;height:11px;border-radius:50%;background:${c};opacity:.8"></span>`).join("")}
      <div class="cap-url" data-layout-ignore>${url}</div>
      ${titulo ? `<span class="cap-titulo" data-layout-ignore>${titulo}</span>` : ""}
    </div>`;

  const alfa = (cor, pct) => `color-mix(in srgb, ${cor} ${pct}%, transparent)`;

  const marcas = destaques
    .map((d, i) => {
      const quando = typeof d.at === "number" ? d.at : +(0.5 + i * 0.35).toFixed(2);
      const cor = d.cor ?? "var(--cyan)";
      const rotulo = d.rotulo
        ? `<div class="cap-rotulo" style="color:${cor};border-color:${alfa(cor, 55)}">${d.rotulo}</div>`
        : "";
      return `<div class="cap-marca" style="left:${(d.x * 100).toFixed(2)}%;top:${(d.y * 100).toFixed(2)}%;width:${(d.w * 100).toFixed(2)}%;height:${(d.h * 100).toFixed(2)}%;border-color:${cor};box-shadow:0 0 26px ${alfa(cor, 34)}, inset 0 0 22px ${alfa(cor, 14)}" data-at="${quando.toFixed(2)}" data-anim="pop" data-dur="0.4">
        ${rotulo}
      </div>`;
    })
    .join("");

  const corpo = `<div class="cap" style="width:${px(w)}" ${entrada(p, { anim, at })}>
      ${barra}
      <div class="cap-palco" style="height:${px(alturaPalco)}">
        <img class="cap-img" src="${src}" alt="" style="width:${larguraImg.toFixed(1)}px;height:${alturaImg.toFixed(1)}px;left:${(-f.x * larguraImg).toFixed(1)}px;top:${(-f.y * alturaImg).toFixed(1)}px${veu > 0 ? `;filter:brightness(${(1 - veu * 0.35).toFixed(2)}) saturate(.96)` : ""}" />
        ${veu > 0 ? `<div class="cap-veu" style="background:rgba(var(--bg-2-rgb),${(veu * 0.35).toFixed(2)})"></div>` : ""}
        ${marcas}
      </div>
      ${legenda ? `<div class="cap-legenda" data-layout-ignore>${legenda}</div>` : ""}
    </div>`;

  return {
    css: `
    .cap{border-radius:var(--r-md);overflow:hidden;border:1px solid var(--line-2);background:rgba(var(--panel-rgb),.94);box-shadow:0 30px 70px rgba(var(--shadow-rgb),.55)}
    .cap-barra{display:flex;align-items:center;gap:12px;padding:11px 18px;border-bottom:1px solid var(--line);background:rgba(var(--panel-rgb),.92)}
    .cap-url{flex:1;height:28px;margin-left:8px;border-radius:999px;background:rgba(var(--line-rgb),.08);border:1px solid var(--line);display:flex;align-items:center;padding:0 14px;font-family:var(--mono);font-size:16px;color:var(--ink-dim);white-space:nowrap;overflow:hidden}
    .cap-titulo{font-family:var(--body);font-weight:800;font-size:15px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan);white-space:nowrap}
    .cap-palco{position:relative;overflow:hidden;background:var(--bg-2)}
    .cap-img{position:absolute;display:block;max-width:none}
    .cap-veu{position:absolute;inset:0;pointer-events:none}
    .cap-marca{position:absolute;border:2px solid;border-radius:10px;pointer-events:none}
    .cap-rotulo{position:absolute;left:-2px;top:-34px;padding:2px 10px;border-radius:6px;border:1px solid;background:rgba(var(--bg-2-rgb),.92);font-family:var(--mono);font-size:17px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
    .cap-legenda{padding:10px 18px 12px;font-family:var(--body);font-weight:600;font-size:17px;letter-spacing:.02em;color:var(--ink-dim);border-top:1px solid var(--line)}
    `,
    html: envolver(p, corpo),
  };
}
