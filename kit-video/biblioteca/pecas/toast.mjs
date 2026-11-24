import { icons } from "../markup.mjs";
import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "toast",
  funcao: "aviso curto que entra no canto: 'resposta pronta', 'download concluído'",
  usa: "titulo, texto, icone, cor, w, x, y, at, anim",
  naoFaz: "duas notificações empilhadas na mesma cena",
};

export function montar(p = {}) {
  const {
    titulo = "",
    texto = "",
    icone = "check",
    cor = "var(--green)",
    w = 380,
    at = 0.5,
    anim = "slideR",
  } = p;

  return {
    html: envolver(
      p,
      `<div class="glass" style="width:${px(w)};padding:20px 22px;display:flex;align-items:center;gap:16px" ${entrada(p, { anim, at })}>
        <div style="width:44px;height:44px;flex:0 0 auto;border-radius:12px;display:grid;place-items:center;color:${cor};background:rgba(var(--lime-rgb),.10);border:1px solid rgba(var(--lime-rgb),.32)">
          <div style="width:24px;height:24px">${icons[icone] ?? icons.check}</div>
        </div>
        <div style="min-width:0">
          <div style="font-family:var(--body);font-weight:600;font-size:28px;color:var(--ink)">${titulo}</div>
          ${texto ? `<div data-layout-ignore style="font-family:var(--body);font-size:22px;color:var(--ink-soft);margin-top:2px">${texto}</div>` : ""}
        </div>
      </div>`,
    ),
  };
}
