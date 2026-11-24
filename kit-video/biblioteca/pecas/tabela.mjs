import { entrada, envolver, px } from "./base.mjs";
import { icons } from "../markup.mjs";

export const contrato = {
  nome: "tabela",
  funcao: "tabela de comparação: ferramentas, planos ou opções com uma coluna em destaque",
  usa: "colunas, linhas, destaque, w, legenda, x, y, at, anim",
  naoFaz: "mais de 5 linhas e 4 colunas; célula longa (é tabela, não parágrafo)",
};

/* célula aceita texto, número, booleano (vira ✓/✗) ou { texto, cor } */
function celula(valor, { cabecalho = false, destaque = false, primeira = false, at = 0, borda = false }) {
  const cor = destaque ? "var(--cyan)" : primeira ? "var(--ink)" : "var(--ink-soft)";
  const peso = primeira ? 600 : 500;
  const fundo = destaque ? "background:rgba(var(--cyan-rgb),.055);" : "";
  const topo = borda ? "border-top:1px solid rgba(var(--line-rgb),.12);" : "";
  const alinha = primeira || cabecalho ? "left" : "center";

  if (cabecalho) {
    return `<div data-layout-ignore style="padding:6px 16px 18px;${fundo}${topo}font-family:var(--body);font-weight:800;font-size:20px;letter-spacing:.12em;text-transform:uppercase;color:${destaque ? "var(--cyan)" : "var(--ink-dim)"};text-align:${alinha}" data-at="${at}" data-anim="fade" data-dur="0.35">${valor ?? ""}</div>`;
  }

  let conteudo;
  if (valor === true || valor === false) {
    conteudo = `<div style="display:inline-flex;width:30px;height:30px;color:${valor ? "var(--green)" : "var(--red)"}">${valor ? icons.check : icons.close}</div>`;
  } else if (valor && typeof valor === "object") {
    conteudo = `<span style="color:${valor.cor ?? cor}">${valor.texto ?? ""}</span>`;
  } else {
    conteudo = `<span style="color:${cor}">${valor ?? ""}</span>`;
  }

  return `<div style="padding:19px 16px;${fundo}${topo}font-family:var(--body);font-weight:${peso};font-size:28px;line-height:1.2;text-align:${alinha}" data-at="${at}" data-anim="fade" data-dur="0.35">${conteudo}</div>`;
}

export function montar(p = {}) {
  const {
    colunas = [],
    linhas = [],
    destaque = null,
    w = 1200,
    legenda = null,
    at = 0.4,
    anim = "fade",
  } = p;

  if (!colunas.length || !linhas.length) {
    throw new Error("tabela: informe `colunas` e `linhas`");
  }
  if (linhas.length > 5) throw new Error("tabela: no máximo 5 linhas");
  if (colunas.length > 4) throw new Error("tabela: no máximo 4 colunas");

  const grade = `1.6fr repeat(${colunas.length - 1}, 1fr)`;

  const cabecalho = colunas
    .map((c, j) => celula(c, { cabecalho: true, destaque: j === destaque, at: (at - 0.15).toFixed(2) }))
    .join("");

  const corpo = linhas
    .map((linha, i) => {
      /* a linha pode ser só a lista de células, ou { at, celulas } para entrar
         na palavra em que aquele item é dito. */
      const temTempo = !Array.isArray(linha) && linha.at !== undefined;
      const celulas = Array.isArray(linha) ? linha : (linha.celulas ?? []);
      const bruto = temTempo ? linha.at : at + i * 0.16;
      const quando = typeof bruto === "number" ? bruto.toFixed(2) : bruto;
      return celulas
        .map((valor, j) =>
          celula(valor, {
            primeira: j === 0,
            destaque: j === destaque,
            borda: true,
            at: quando,
          }),
        )
        .join("");
    })
    .join("");

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};border-radius:var(--r-md);background:rgba(var(--panel-rgb),.72);border:1px solid var(--line);box-shadow:0 24px 60px rgba(var(--shadow-rgb),.45);padding:22px 12px 10px" ${entrada(p, { anim, at: 0.2 })}>
        <div style="display:grid;grid-template-columns:${grade};align-items:center">${cabecalho}${corpo}</div>
        ${legenda ? `<div data-layout-ignore style="padding:14px 16px 6px;font-family:var(--body);font-weight:600;font-size:20px;color:var(--ink-dim)">${legenda}</div>` : ""}
      </div>`,
    ),
  };
}
