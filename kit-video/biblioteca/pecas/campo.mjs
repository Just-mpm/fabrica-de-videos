import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "campo",
  funcao: "barra de entrada de mensagem: o lugar onde a pessoa ainda vai escrever",
  usa: "texto, w, tamanho, icone, tom, x, y, at, anim",
  naoFaz: "texto longo (é um placeholder de uma linha); para a conversa já escrita use chat",
};

export function montar(p = {}) {
  const {
    texto = "escreva uma mensagem",
    w = 320,
    tamanho = 20,
    icone = "send",
    tom = "cyan",
    at = 0.4,
    anim = "rise",
  } = p;

  if (!texto) throw new Error("campo: informe `texto` (o placeholder)");
  const cor = tom === "cyan" ? "var(--cyan)" : "var(--ink-dim)";
  const botao = Math.round(tamanho * 1.95);
  const iconeT = Math.round(tamanho * 0.95);
  const padY = Math.round(tamanho * 0.34);
  const padX = Math.round(tamanho * 0.78);

  return {
    html: envolver(
      p,
      `<div style="display:flex;align-items:center;gap:${px(Math.round(tamanho * 0.5))};width:${px(w)};padding:${px(padY)} ${px(padX)} ${px(padY)} ${px(Math.round(tamanho * 1.05))};border-radius:999px;background:rgba(var(--panel-rgb),.92);border:1px solid var(--line);box-shadow:inset 0 1px 0 rgba(var(--ink-rgb),.10)" ${entrada(p, { at, anim })}>
        <div data-layout-ignore style="flex:1;min-width:0;font-family:var(--body);font-size:${px(tamanho)};line-height:1.2;color:var(--ink-dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${texto}</div>
        <div style="width:${px(botao)};height:${px(botao)};flex:0 0 auto;border-radius:50%;display:grid;place-items:center;color:${cor};background:rgba(var(--cyan-rgb),.13);border:1px solid rgba(var(--cyan-rgb),.42)">
          <div style="width:${px(iconeT)};height:${px(iconeT)}">${icons[icone] ?? icons.send}</div>
        </div>
      </div>`,
    ),
  };
}
