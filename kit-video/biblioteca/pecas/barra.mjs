import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "barra",
  funcao: "barra de comparação com rótulo e valor: quanto cada opção ocupa",
  usa: "rotulo, valor, max, sufixo, w, h, cor, x, y, at, anim",
  naoFaz: "valor sem escala; barra decorativa",
};

export function montar(p = {}) {
  const {
    rotulo = "",
    valor = 0,
    max = 100,
    sufixo = "%",
    w = 780,
    h = 16,
    cor = "var(--cyan)",
    at = 0.4,
    anim = "fade",
  } = p;

  const pct = Math.max(0, Math.min(100, (valor / max) * 100));

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};display:flex;align-items:center;gap:22px" ${entrada(p, { anim, at })}>
        <div style="width:250px;flex:0 0 auto;font-family:var(--body);font-weight:600;font-size:28px;color:var(--ink)">${rotulo}</div>
        <div style="flex:1;height:${px(h)};border-radius:999px;background:rgba(var(--line-rgb),.12);overflow:hidden">
          <div style="width:${pct}%;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--blue),${cor});box-shadow:0 0 20px rgba(var(--cyan-rgb),.5);transform-origin:left center" data-at="${(at + 0.1).toFixed(2)}" data-anim="growX" data-dur="0.9"></div>
        </div>
        <div style="width:130px;flex:0 0 auto;text-align:right;font-family:var(--mono);font-weight:600;font-size:30px;color:${cor}" data-at="${(at + 0.1).toFixed(2)}" data-anim="count" data-to="${valor}" data-dur="0.9">0</div>
        <div data-layout-ignore style="width:20px;flex:0 0 auto;font-family:var(--mono);font-size:24px;color:var(--ink-dim)">${sufixo}</div>
      </div>`,
    ),
  };
}
