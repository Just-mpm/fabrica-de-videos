import { entrada, caixa, posicionada, px } from "./base.mjs";

export const contrato = {
  nome: "nota",
  funcao: "régua de luz curta + legenda pequena (rodapé de cena, fonte, assinatura)",
  usa: "texto, cor, larguraRegua, espessura, gap, x, y, at, anim",
  naoFaz: "duas linhas de texto; a nota é uma linha",
};

export function montar(p = {}) {
  const {
    texto = "",
    cor = "var(--cyan)",
    larguraRegua = 56,
    espessura = 2,
    gap = 16,
    anim = "fade",
    at = 0.25,
    alinhamento = null,
  } = p;

  const estilo = ["display:flex", "align-items:center", `gap:${px(gap)}`];
  if (posicionada(p)) estilo.push("position:absolute", caixa(p));
  if (alinhamento) estilo.push(`justify-content:${alinhamento}`);

  /* o build confere se a nota fica tempo suficiente em tela (piso de leitura);
     a contagem vai no HTML para não ter de adivinhar pelo texto depois. */
  const palavras = String(texto).trim() ? String(texto).trim().split(/\s+/).length : 0;
  const extras = `data-leitura="${palavras}"${p.extras ? ` ${p.extras}` : ""}`;

  return {
    html: `<div style="${estilo.join(";")}" ${entrada({ ...p, extras }, { at, anim })}>
      <div style="width:${px(larguraRegua)};height:${px(espessura)};background:${cor};box-shadow:0 0 12px ${cor};flex:0 0 auto"></div>
      <p class="small">${texto}</p>
    </div>`,
  };
}
