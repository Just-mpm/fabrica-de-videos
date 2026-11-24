import { wd } from "../markup.mjs";
import { entrada, caixa, envolver, pintar, px } from "./base.mjs";
import { registrarCaixa, larguraDe } from "../medidas.mjs";

export const contrato = {
  nome: "titulo",
  funcao: "a frase grande (display): título de cena, palavra-chave, conclusão",
  usa: "texto (frase de uma linha), linhas (um item por linha — é assim que se quebra), tamanho, cor, caixa, glow, marcar, marcaNa, destaques, anim, at, x, y, w, contorno",
  naoFaz:
    "parágrafo longo; título é para 2–6 palavras. Deixar a frase quebrar sozinha dentro de `w` — a altura do bloco vira imprevisível. Quebre com `linhas: []` (um item por linha): cada linha é um bloco fechado e o build sabe a altura exata. `\\n` dentro de `texto` é erro.",
};

/* traço de luz preso ao texto.
   `marcar: "circulo"` fecha a palavra num traço oval; `"sublinhado"` passa uma
   linha de luz sob ela; `"risco"` corta o meio. Tudo é preso à caixa da palavra,
   então acerta em qualquer tamanho — e o traço é desenhado pela animação
   `sublinha` (um path só, com pathLength=1). O som do gesto entra sozinho. */
function marcarTexto(texto, p) {
  const forma = ["circulo", "risco", "sublinhado"].includes(p.marcar) ? p.marcar : "circulo";
  const cor = p.marcaCor ?? "var(--cyan)";
  const grossura = p.marcaGrossura ?? 5;
  const at = p.marcaAt ?? p.at ?? 0;
  const dur = p.marcaDur ?? 0.6;
  const som = p.marcaSom === false
    ? "0"
    : p.marcaSom ?? (forma === "risco" ? "assets/sfx/leve.wav" : "assets/sfx/caneta.wav");
  const vol = p.marcaVol ?? (forma === "risco" ? 0.1 : 0.14);
  const somAttrs = ` data-marca-som="${som}" data-marca-vol="${vol}"`;
  const comum = `fill="none" stroke="${cor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${grossura}" vector-effect="non-scaling-stroke" data-at="${at}" data-anim="sublinha" data-dur="${dur}"${somAttrs}`;

  if (forma === "circulo") {
    const folgaX = p.marcaFolgaX ?? Math.round((p.tamanho ?? 88) * 0.2);
    const folgaY = p.marcaFolgaY ?? Math.round((p.tamanho ?? 88) * 0.16);
    return `<span style="position:relative;display:inline-block">${texto}<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;left:${-folgaX}px;top:${-folgaY}px;width:calc(100% + ${folgaX * 2}px);height:calc(100% + ${folgaY * 2}px);overflow:visible;pointer-events:none;transform:rotate(-1.4deg);filter:drop-shadow(0 0 10px rgba(var(--cyan-rgb),.45))"><path d="M50 3 C 88 3 98 22 97 50 C 96 80 80 97 50 97 C 20 97 3 80 3 50 C 3 22 16 3 50 3" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" ${comum}/></svg></span>`;
  }

  if (forma === "risco") {
    return `<span style="position:relative;display:inline-block">${texto}<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;left:-3%;top:26%;width:106%;height:34%;overflow:visible;pointer-events:none"><path d="M2 62 C 26 48 72 56 98 40" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" ${comum}/></svg></span>`;
  }

  return `<span style="position:relative;display:inline-block">${texto}<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;left:-1%;bottom:-14%;width:102%;height:22%;overflow:visible;pointer-events:none;filter:drop-shadow(0 0 12px rgba(var(--cyan-rgb),.5))"><path d="M1 60 C 24 34 62 78 99 44" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" ${comum}/></svg></span>`;
}

export function montar(p = {}) {
  const {
    texto = "",
    tamanho = 88,
    cor = null,
    como = "p",
    glow = false,
    caixa: caixaTexto = "upper",
    destaques = [],
    anim = "words",
    mt = null,
    largura = null,
    alinhamento = null,
    lineHeight = null,
    classe = "",
    html = null,
    contorno = null,
    palavras = null,
    espacamento = null,
  } = p;

  /* As linhas são declaradas, não adivinhadas: `linhas: ["título de", "exemplo"]`.
     Cada item gera um bloco fechado, então nunca quebra sozinho e a altura é
     `linhas × tamanho × line-height`. Título de uma linha pode ir em `texto`;
     `\n` dentro de `texto` é erro — a quebra se declara em `linhas`. */
  if (html == null && String(texto).includes("\n")) {
    throw new Error(
      'titulo: quebre a frase com `linhas: ["...", "..."]` (um item por linha) — "\\n" dentro de `texto` não é aceito',
    );
  }
  const linhas = Array.isArray(p.linhas) && p.linhas.length
    ? p.linhas.map((l) => String(l))
    : [String(texto).trim()];
  const varias = linhas.length > 1 && html == null;

  const comPalavras = palavras ?? anim === "words";
  const corpoDeLinha = (linha) => (comPalavras ? wd(linha) : pintar(linha, destaques));

  const baseHtml = html != null ? html : varias ? null : corpoDeLinha(linhas[0] ?? "");
  const corpoBase = !varias && p.marcar ? marcarTexto(baseHtml, p) : baseHtml;

  const estilo = [`font-size:${px(tamanho)}`, `line-height:${lineHeight ?? 0.92}`];
  if (cor) estilo.push(`color:${cor}`);
  if (mt != null) estilo.push(`margin-top:${px(mt)}`);
  if (largura != null) estilo.push(`width:${px(largura)}`);
  if (alinhamento) estilo.push(`text-align:${alinhamento}`);
  if (contorno != null) estilo.push(`-webkit-text-stroke:${px(contorno)} currentColor`, "-webkit-text-fill-color:transparent");
  if (espacamento != null) estilo.push(`letter-spacing:${espacamento}`);
  if (p.estiloExtra) estilo.push(p.estiloExtra);

  /* a classe t-display força maiúsculas; `caixa: "normal"` devolve a caixa
     original da frase (nomes próprios, siglas, uma palavra em inglês) */
  const classeCaixa = caixaTexto === "normal" ? " caixa-normal" : "";
  const classes = `t-display${glow ? " glow" : ""}${classeCaixa}${classe ? ` ${classe}` : ""}`;

  const htmlDaPeca = varias
    ? (() => {
        const estiloLinha = [
          `font-size:${px(tamanho)}`,
          `line-height:${lineHeight ?? 0.92}`,
          "white-space:nowrap",
        ];
        if (cor) estiloLinha.push(`color:${cor}`);
        if (alinhamento) estiloLinha.push(`text-align:${alinhamento}`);
        if (contorno != null) estiloLinha.push(`-webkit-text-stroke:${px(contorno)} currentColor`, "-webkit-text-fill-color:transparent");
        if (espacamento != null) estiloLinha.push(`letter-spacing:${espacamento}`);
        if (p.estiloExtra) estiloLinha.push(p.estiloExtra);
        const escolhida = p.marcar ? (p.marcaNa ?? linhas.length - 1) : -1;
        const blocos = linhas
          .map((linha, i) => {
            const dentro = i === escolhida ? marcarTexto(corpoDeLinha(linha), p) : corpoDeLinha(linha);
            return `<${como} class="${classes}" style="${estiloLinha.join(";")}">${dentro}</${como}>`;
          })
          .join("");
        const estiloBloco = mt != null ? ` style="margin-top:${px(mt)}"` : "";
        return `<div class="t-linhas"${estiloBloco} ${entrada(p, { anim })}>${blocos}</div>`;
      })()
    : `<${como} class="${classes}" style="${estilo.join(";")}" ${entrada(p, { anim })}>${corpoBase}</${como}>`;

  const posX = p.left ?? p.x;
  const posY = p.top ?? p.y;
  if (posX != null && posY != null) {
    const medida = varias ? linhas : [linhas[0] ?? ""];
    const espEm = espacamento == null ? -0.025 : Number(String(espacamento).replace("em", "")) || 0;
    const larguraTexto = Math.max(
      ...medida.map((l) => larguraDe(l.toUpperCase(), "display", Number(tamanho), espEm)),
    );
    registrarCaixa({
      peca: "titulo",
      texto: (varias ? linhas.join(" ") : (linhas[0] ?? "")).slice(0, 80),
      x: Number(posX),
      y: Number(posY),
      w: p.w != null ? Number(p.w) : null,
      tamanho: Number(tamanho),
      lh: Number(lineHeight ?? 0.92),
      linhas: varias ? linhas.length : 0,
      larguraTexto,
      at: typeof p.at === "number" ? p.at : 0,
      at2: typeof p.at2 === "number" ? p.at2 : null,
    });
  }

  return { html: envolver(p, htmlDaPeca), css: `.caixa-normal{text-transform:none}` };
}
