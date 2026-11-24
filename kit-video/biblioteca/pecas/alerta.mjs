import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "alerta",
  funcao: "faixa de aviso com ícone: cuidado, erro comum, dica de segurança",
  usa: "texto, titulo, tom (cuidado|erro|dica), w, x, y, at, anim",
  naoFaz: "mais de duas linhas de texto; o alerta é um recado, não um parágrafo",
};

const TIPOS = {
  cuidado: { cor: "var(--amber)", icone: "alert", fundo: "rgba(var(--amber-rgb),.10)", borda: "rgba(var(--amber-rgb),.42)" },
  erro: { cor: "var(--red)", icone: "close", fundo: "rgba(var(--red-rgb),.10)", borda: "rgba(var(--red-rgb),.42)" },
  dica: { cor: "var(--cyan)", icone: "bulb", fundo: "rgba(var(--cyan-rgb),.09)", borda: "rgba(var(--cyan-rgb),.40)" },
};

export function montar(p = {}) {
  const {
    texto = "",
    titulo = null,
    tom = "cuidado",
    w = 1100,
    at = 0.4,
    anim = "slideL",
  } = p;

  if (!texto) throw new Error("alerta: informe `texto`");
  const t = TIPOS[tom];
  if (!t) throw new Error(`alerta: tom "${tom}" não existe — use: ${Object.keys(TIPOS).join(", ")}`);

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};display:flex;align-items:center;gap:22px;padding:24px 28px;border-radius:var(--r-md);background:${t.fundo};border:1px solid ${t.borda};border-left:4px solid ${t.cor}" ${entrada(p, { anim, at })}>
        <div style="width:52px;height:52px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;border:1.5px solid ${t.cor};color:${t.cor};background:rgba(var(--bg-2-rgb),.5)">
          <div style="width:26px;height:26px">${icons[t.icone]}</div>
        </div>
        <div style="min-width:0">
          ${titulo ? `<div style="font-family:var(--body);font-weight:700;font-size:28px;line-height:1.2;color:${t.cor}">${titulo}</div>` : ""}
          <div style="font-family:var(--body);font-size:30px;line-height:1.3;color:var(--ink)">${texto}</div>
        </div>
      </div>`,
    ),
  };
}
