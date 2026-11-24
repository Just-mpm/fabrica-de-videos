import { entrada, caixa, posicionada, px } from "./base.mjs";
import { htmlDePecas } from "./index.mjs";

export const contrato = {
  nome: "cartao",
  funcao: "card azul arredondado que segura outras peças (ou HTML pronto); com `hud` ganha cantos de interface",
  usa: "pecas|html, tom (azul|destaque|escuro|vazio), hud, rotulo, x, y, w, h, pad, layout, gap, alinhar, justificar, borda, raio, sombra, at, anim",
  naoFaz: "cartão dentro de cartão; use grupo dentro do cartão. Com `h` fixo o conteúdo já centraliza no eixo vertical — só passe `justificar` para mudar isso",
};

const TONS = {
  azul: "glass",
  destaque: "glass-cyan",
  escuro: "glass-soft",
  vazio: "",
  // nomes da estética anterior: continuam aceitos para não quebrar montagem velha
  vidro: "glass",
  ciano: "glass-cyan",
};

export function montar(p = {}) {
  const {
    pecas = [],
    html = null,
    tom = "azul",
    hud = false,
    rotulo = null,
    pad = "38px 42px",
    layout = "coluna",
    gap = 0,
    alinhar = "flex-start",
    justificar = null,
    borda = null,
    raio = null,
    sombra = null,
    anim = "rise",
    at = 0.2,
    classe = "",
    estiloExtra = null,
  } = p;

  if (!(tom in TONS)) {
    throw new Error(`cartao: tom "${tom}" não existe — use: ${Object.keys(TONS).join(", ")}`);
  }

  const estilo = [
    posicionada(p) ? "position:absolute" : null,
    caixa(p),
    `padding:${pad}`,
    "display:flex",
    `flex-direction:${layout === "linha" ? "row" : "column"}`,
    `align-items:${alinhar}`,
    // cartão com altura fixa centraliza o conteúdo: sem isso, um cartão de 130px
    // com uma linha dentro deixa o texto colado no topo.
    `justify-content:${justificar ?? (p.h != null && layout !== "linha" ? "center" : "flex-start")}`,
    gap ? `gap:${px(gap)}` : null,
    borda != null ? `border-width:${px(borda)}` : null,
    raio != null ? `border-radius:${px(raio)}` : null,
    sombra === false ? "box-shadow:none" : typeof sombra === "string" ? `box-shadow:${sombra}` : null,
    estiloExtra,
  ].filter(Boolean);

  const conteudo = html != null ? html : htmlDePecas(pecas);
  const cantos = hud
    ? ["tl", "tr", "bl", "br"].map((c) => `<span class="hud-corner ${c}"></span>`).join("")
    : "";
  const etiqueta = rotulo
    ? `<div class="card-rotulo" data-layout-ignore>${rotulo}</div>`
    : "";

  return {
    css: `.card-rotulo{position:absolute;left:22px;top:-13px;padding:0 10px;background:var(--bg);font-family:var(--body);font-weight:800;font-size:18px;letter-spacing:.16em;text-transform:uppercase;color:var(--cyan);white-space:nowrap}`,
    html: `<div class="${TONS[tom]}${classe ? ` ${classe}` : ""}" style="${estilo.join(";")}" ${entrada(p, { anim, at })}>${cantos}${etiqueta}${conteudo}</div>`,
  };
}
