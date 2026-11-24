import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "terminal",
  funcao: "janela de terminal: comandos digitados e saídas aparecendo linha por linha",
  usa: "titulo, linhas [{texto, tipo:'cmd'|'out'|'ok'|'warn'|'info', at, digitar}], w, x, y, at, anim",
  naoFaz: "bloco de código longo; para isso use janela com texto",
};

const PREFIXO = {
  cmd: { marca: "$", cor: "var(--cyan)" },
  out: { marca: " ", cor: "var(--ink-soft)" },
  ok: { marca: "✓", cor: "var(--green)" },
  warn: { marca: "!", cor: "var(--amber)" },
  info: { marca: "›", cor: "var(--blue)" },
};

export function montar(p = {}) {
  const {
    titulo = "terminal",
    linhas = [],
    w = 780,
    at = 0.3,
    anim = "rise",
    fonte = 28,
  } = p;

  if (!linhas.length) throw new Error("terminal: informe ao menos uma linha");

  const corpo = linhas
    .map((l, i) => {
      const tipo = PREFIXO[l.tipo] ? l.tipo : "out";
      const { marca, cor } = PREFIXO[tipo];
      const quando = l.at ?? at + 0.5 + i * 0.55;
      const texto = l.digitar
        ? `<span data-at="${quando}" data-anim="maquina" data-dur="${Math.min(2.2, 0.05 * String(l.texto).length + 0.4).toFixed(2)}">${l.texto}</span>`
        : l.texto;
      return `<div style="display:flex;gap:14px;white-space:pre" ${l.digitar ? "" : `data-at="${quando}" data-anim="fade" data-dur="0.3"`}>
        <span style="color:${cor};opacity:${tipo === "out" ? 0.45 : 1};flex:0 0 18px">${marca}</span>
        <span style="color:${tipo === "out" ? "var(--ink-soft)" : tipo === "ok" ? "var(--green)" : "var(--ink)"}">${texto}</span>
      </div>`;
    })
    .join("");

  return {
    html: envolver(
      p,
      `<div class="glass" style="width:${px(w)};overflow:hidden" ${entrada(p, { anim, at })}>
        <div style="display:flex;align-items:center;gap:10px;padding:16px 22px;border-bottom:1px solid var(--line);background:rgba(var(--panel-rgb),.6)">
          ${["var(--red)", "var(--amber)", "var(--lime)"].map((c) => `<span style="width:11px;height:11px;border-radius:50%;background:${c};opacity:.8"></span>`).join("")}
          <span data-layout-ignore style="margin-left:12px;font-family:var(--mono);font-size:19px;letter-spacing:.08em;color:var(--ink-dim)">${titulo}</span>
        </div>
        <div style="padding:26px 28px;font-family:var(--mono);font-size:${px(fonte)};line-height:1.75">
          ${corpo}
        </div>
      </div>`,
    ),
  };
}
