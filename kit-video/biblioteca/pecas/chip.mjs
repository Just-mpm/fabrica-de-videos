import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "chip",
  funcao: "pílula curta: estado, categoria, versão, atalho, nome de ferramenta",
  usa: "texto, estilo (cyan|solid|dashed|violet|amber), tamanho, icone, x, y, at, anim",
  naoFaz: "frase com mais de 4 palavras; para argumento use texto",
};

const ESTILOS = ["padrao", "cyan", "solid", "dashed", "violet", "amber"];

export function montar(p = {}) {
  const {
    texto = "",
    estilo = "padrao",
    tamanho = 26,
    icone = null,
    anim = "pop",
    at = 0.2,
    maiusculas = false,
  } = p;

  if (!ESTILOS.includes(estilo)) {
    throw new Error(`chip: estilo "${estilo}" não existe — use: ${ESTILOS.join(", ")}`);
  }

  const classe = estilo === "padrao" ? "chip" : `chip ${estilo}`;
  const estiloTexto = [`font-size:${px(tamanho)}`];
  if (maiusculas) estiloTexto.push("text-transform:uppercase", "letter-spacing:0.12em");

  const corpo = `<span class="${classe}" style="${estiloTexto.join(";")}" data-layout-ignore ${entrada(p, { anim, at })}>
    ${icone ? `<span style="display:inline-flex;width:${Math.round(tamanho * 0.8)}px;height:${Math.round(tamanho * 0.8)}px;color:currentColor">${icone}</span>` : ""}
    <span>${texto}</span>
  </span>`;

  return { html: envolver(p, corpo) };
}
