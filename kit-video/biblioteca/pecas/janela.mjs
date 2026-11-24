import { entrada, envolver, px } from "./base.mjs";
import { htmlDePecas } from "./index.mjs";

export const contrato = {
  nome: "janela",
  funcao: "janela de navegador/programa: barra com endereço e uma área de conteúdo que aceita peças",
  usa: "url, titulo, pecas|html, w, h, pad, fundo, x, y, at, anim",
  naoFaz: "conteúdo interativo; a área é só o palco — quem anima são as peças de dentro",
};

export function montar(p = {}) {
  const {
    url = "exemplo.com.br",
    titulo = null,
    pecas = [],
    html = null,
    w = 900,
    h = 520,
    pad = 34,
    fundo = "rgba(var(--panel-rgb),.92)",
    at = 0.3,
    anim = "rise",
  } = p;

  const conteudo = html != null ? html : htmlDePecas(pecas);

  return {
    html: envolver(
      p,
      `<div class="glass" style="width:${px(w)};height:${px(h)};display:flex;flex-direction:column;overflow:hidden" ${entrada(p, { anim, at })}>
        <div style="display:flex;align-items:center;gap:14px;padding:16px 22px;border-bottom:1px solid var(--line);background:rgba(var(--panel-rgb),.7);flex:0 0 auto">
          ${["var(--red)", "var(--amber)", "var(--lime)"].map((c) => `<span style="width:11px;height:11px;border-radius:50%;background:${c};opacity:.8"></span>`).join("")}
          <div data-layout-ignore style="margin-left:10px;flex:1;height:34px;border-radius:999px;background:rgba(var(--line-rgb),.08);border:1px solid var(--line);display:flex;align-items:center;padding:0 18px;font-family:var(--mono);font-size:18px;color:var(--ink-dim)">${url}</div>
          ${titulo ? `<span data-layout-ignore style="font-family:var(--body);font-weight:800;font-size:17px;letter-spacing:.12em;text-transform:uppercase;color:var(--cyan)">${titulo}</span>` : ""}
        </div>
        <div style="flex:1;min-height:0;padding:${px(pad)};background:${fundo};overflow:hidden;display:flex;flex-direction:column;gap:16px">${conteudo}</div>
      </div>`,
    ),
  };
}
