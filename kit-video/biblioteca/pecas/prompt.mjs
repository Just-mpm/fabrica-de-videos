import { icons } from "../markup.mjs";
import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "prompt",
  funcao: "a caixa de pedido: o que a pessoa escreve para a IA — com digitação, cursor e botão de enviar",
  usa: "texto, dica, rotulo, icone, w, h, enviar, status, at, anim, x, y",
  naoFaz: "duas caixas na mesma cena; para conversa use chat",
};

export function montar(p = {}) {
  const {
    texto = "",
    dica = "descreva o que você precisa…",
    rotulo = "prompt",
    icone = "spark",
    w = 880,
    h = 116,
    enviar = true,
    status = null,
    at = 0.4,
    anim = "rise",
    cor = "var(--cyan)",
  } = p;

  const digitando = texto.length > 0;
  const dur = Math.min(2.6, 0.048 * texto.length + 0.45);

  const corpo = `
    <div style="display:flex;align-items:center;gap:20px;width:100%;height:100%">
      <div style="width:54px;height:54px;flex:0 0 auto;display:grid;place-items:center;border-radius:14px;background:rgba(var(--cyan-rgb),.10);border:1px solid rgba(var(--cyan-rgb),.28);color:${cor}">
        <div style="width:28px;height:28px">${icons[icone] ?? icons.spark}</div>
      </div>
      <div style="flex:1;min-width:0;font-family:var(--mono);font-size:28px;color:${digitando ? "var(--ink)" : "var(--ink-dim)"};white-space:nowrap;overflow:hidden">
        ${digitando
          ? `<span data-at="${(at + 0.35).toFixed(2)}" data-anim="maquina" data-dur="${dur.toFixed(2)}">${texto}</span>`
          : dica}
      </div>
      ${enviar
        ? `<div style="width:58px;height:58px;flex:0 0 auto;border-radius:50%;background:${cor};color:var(--on-accent);display:grid;place-items:center;box-shadow:0 0 26px rgba(var(--cyan-rgb),.45)" data-at="${(at + 0.2).toFixed(2)}" data-anim="pop">
             <div style="width:26px;height:26px;transform:translateX(1px)">${icons.arrow}</div>
           </div>`
        : ""}
    </div>`;

  const etiqueta = rotulo
    ? `<div data-layout-ignore style="position:absolute;left:26px;top:-13px;padding:0 10px;background:var(--bg);font-family:var(--mono);font-weight:600;font-size:17px;letter-spacing:.2em;text-transform:uppercase;color:${cor}">${rotulo}</div>`
    : "";

  const linhaStatus = status
    ? `<div data-layout-ignore style="margin-top:18px;display:flex;align-items:center;gap:10px;font-family:var(--mono);font-size:20px;color:var(--green)" data-at="${(at + dur + 0.45).toFixed(2)}" data-anim="fade">
         <span style="width:16px;height:16px;display:inline-block">${icons.check}</span>${status}
       </div>`
    : "";

  const caixa = `
    <div style="position:relative">
      ${etiqueta}
      <div class="glass-cyan" style="width:${px(w)};height:${px(h)};display:flex;align-items:center;padding:0 26px;box-shadow:0 0 60px rgba(var(--cyan-rgb),.10),inset 0 1px 0 rgba(var(--ink-rgb),.14)">
        ${corpo}
      </div>
      ${linhaStatus}
    </div>`;

  return {
    html: envolver(p, `<div ${entrada(p, { anim, at })}>${caixa}</div>`),
  };
}
