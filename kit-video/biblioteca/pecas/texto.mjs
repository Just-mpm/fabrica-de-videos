import { wd } from "../markup.mjs";
import { entrada, envolver, pintar, px } from "./base.mjs";
import { registrarCaixa, larguraDe, LINHA_TOM } from "../medidas.mjs";

export const contrato = {
  nome: "texto",
  funcao: "texto de apoio em quatro tons: body (corpo), lead (frase de destaque), mono (código/rótulo) e small (legenda)",
  usa: "texto, tom, tamanho, cor, destaques, anim, at, x, y, w, lineHeight, maiusculas, alinhamento",
  naoFaz: "texto de mais de 3 linhas no tom lead; para isso use cartao",
};

const CLASSE = { body: "t-body", lead: "t-lead", mono: "t-mono", small: "small" };
const TAMANHO = { body: 36, lead: 44, mono: 28, small: 28 };
const ESPACO = { body: -0.006, lead: -0.01, mono: 0.01, small: 0.005 };
/* tom do texto → conjunto de larguras medido na fonte (ferramentas/medir-fonte.mjs) */
const MAPA = { body: "body", lead: "bodyForte", mono: "mono", small: "body" };

export function montar(p = {}) {
  const {
    texto = "",
    tom = "body",
    tamanho = null,
    cor = null,
    destaques = [],
    anim = "words",
    mt = null,
    largura = null,
    alinhamento = null,
    lineHeight = null,
    classe = "",
    html = null,
    como = "p",
    espacamento = null,
    maiusculas = false,
    palavras = null,
  } = p;

  if (!CLASSE[tom]) {
    throw new Error(`texto: tom "${tom}" não existe — use: ${Object.keys(CLASSE).join(", ")}`);
  }

  const corpo = html != null
    ? html
    : pintar((palavras ?? anim === "words") ? wd(texto) : texto, destaques);

  const estilo = [`font-size:${px(tamanho ?? TAMANHO[tom])}`];
  if (cor) estilo.push(`color:${cor}`);
  if (mt != null) estilo.push(`margin-top:${px(mt)}`);
  if (largura != null) estilo.push(`width:${px(largura)}`);
  if (alinhamento) estilo.push(`text-align:${alinhamento}`);
  if (lineHeight != null) estilo.push(`line-height:${lineHeight}`);
  if (espacamento != null) estilo.push(`letter-spacing:${espacamento}`);
  if (maiusculas) estilo.push("text-transform:uppercase");
  if (p.estiloExtra) estilo.push(p.estiloExtra);

  const classes = [CLASSE[tom], classe].filter(Boolean).join(" ");

  const posX = p.left ?? p.x;
  const posY = p.top ?? p.y;
  if (posX != null && posY != null && html == null) {
    const corpoPx = Number(tamanho ?? TAMANHO[tom]);
    const espEm = espacamento != null ? Number(String(espacamento).replace("em", "")) || 0 : ESPACO[tom];
    registrarCaixa({
      peca: "texto",
      texto: texto.slice(0, 80),
      x: Number(posX),
      y: Number(posY),
      w: p.w != null ? Number(p.w) : null,
      tamanho: corpoPx,
      lh: Number(lineHeight ?? LINHA_TOM[tom] ?? 1.2),
      linhas: 0,
      larguraTexto: larguraDe(maiusculas ? texto.toUpperCase() : texto, MAPA[tom], corpoPx, espEm),
      at: typeof p.at === "number" ? p.at : 0,
      at2: typeof p.at2 === "number" ? p.at2 : null,
    });
  }

  return {
    html: envolver(p, `<${como} class="${classes}" style="${estilo.join(";")}" ${entrada(p, { anim })}>${corpo}</${como}>`),
  };
}
