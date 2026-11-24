import { wd } from "../markup.mjs";
import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "tag",
  funcao: "rótulo pequeno em mono, com ponto de luz: contexto, categoria, 'parte 1', 'teste real'",
  usa: "texto, tamanho, cor, ponto, espacamento, x, y, at, anim",
  naoFaz: "frase inteira; a tag é etiqueta, não argumento",
};

export function montar(p = {}) {
  const {
    texto = "",
    tamanho = 28,
    cor = null,
    ponto = true,
    anim = "fade",
    at = 0.1,
    como = "p",
    alinhamento = null,
    espacamento = 0.2,
  } = p;

  const estilo = [`font-size:${px(tamanho)}`, `letter-spacing:${espacamento}em`];
  if (cor) estilo.push(`color:${cor}`);
  const corpo = String(texto).includes("<") ? texto : wd(texto);

  const linha = `<div style="display:flex;align-items:center;gap:14px${alinhamento ? `;justify-content:${alinhamento}` : ""}" ${entrada(p, { anim, at })}>
      ${ponto ? '<span class="dot"></span>' : ""}
      <${como} class="tag" style="${estilo.join(";")}">${corpo}</${como}>
    </div>`;

  return { html: envolver(p, linha) };
}
