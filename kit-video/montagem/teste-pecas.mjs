/* Prancha viva das peças novas: uma cena por peça, para olhar antes de montar. */

export default {
  titulo: "teste de peças",
  slug: "teste-pecas",
  watermark: null,
  cenas: [
    {
      bloco: "livre",
      dur: 7,
      valores: {
        pecas: [
          { tipo: "tag", texto: "estudio · lupa", x: 100, y: 110, at: 0.1 },
          { tipo: "estudio", w: 980, x: 100, y: 190, at: 0.2, lupa: { at: 1.2, dur: 1.4 }, t: { vazio: 2.0 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "estudio · aceso + site", x: 100, y: 110, at: 0.1 },
          { tipo: "estudio", w: 980, x: 100, y: 190, at: 0.2, acesos: "todos", site: true, t: { site: 1.4 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "artefato generico", x: 100, y: 100, at: 0.1 },
          { tipo: "artefato", w: 880, x: 100, y: 170, at: 0.2, t: { abas: 0.4, grafico: 1.0, quiz: 1.8, check: 2.8 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "artefato revisao", x: 100, y: 100, at: 0.1 },
          { tipo: "artefato", variante: "revisao", w: 880, x: 100, y: 170, at: 0.2, t: { corpo: 0.5, quiz: 1.6, check: 2.4, progresso: 3.2 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "artefato dados", x: 100, y: 100, at: 0.1 },
          { tipo: "artefato", variante: "dados", w: 880, x: 100, y: 170, at: 0.2, t: { total: 0.4, meses: 1.4, categorias: 2.2, filtro: 3.2 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "artefato projeto", x: 100, y: 100, at: 0.1 },
          { tipo: "artefato", variante: "projeto", w: 880, x: 100, y: 170, at: 0.2, t: { colunas: 0.5, mover: 2.4 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 7,
      valores: {
        pecas: [
          { tipo: "tag", texto: "fichario", x: 100, y: 110, at: 0.1 },
          { tipo: "fichario", w: 640, x: 140, y: 300, at: 0.2, cartoes: [
            { nome: "artigo.pdf", icone: "pdf", at: 0.6 },
            { nome: "aula", icone: "caderno", at: 1.1 },
            { nome: "planilha", icone: "planilha", at: 1.6 },
            { nome: "paper", icone: "artigo", at: 2.1 },
          ], domo: { at: 3.2, placa: "responde só com o que está aqui" }, globo: { at: 4.0, texto: "sem sinal" } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 7,
      valores: {
        pecas: [
          { tipo: "tag", texto: "sala", x: 60, y: 100, at: 0.1 },
          { tipo: "sala", w: 620, x: 80, y: 380, at: 0.2, t: { luz: 0.6, porta: 0.4, ok: 4.0 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "produto", x: 100, y: 110, at: 0.1 },
          { tipo: "produto", w: 900, x: 100, y: 220, at: 0.2, t: { risca: 0.9, novo: 1.5, url: 2.6 } },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 6,
      valores: {
        pecas: [
          { tipo: "tag", texto: "barras", x: 100, y: 110, at: 0.1 },
          { tipo: "barras", w: 820, h: 520, x: 100, y: 200, at: 0.2, max: 60, fator: "3,1×", titulo: "terminal-bench 4.1", legenda: "percentual de tarefas resolvidas", itens: [
            { rotulo: "3.8 flash", valor: 18.2, cor: "var(--blue-l)" },
            { rotulo: "4 hydrogen", valor: 57, cor: "var(--cyan)" },
          ] },
        ],
      },
    },
    {
      bloco: "livre",
      dur: 7,
      valores: {
        pecas: [
          { tipo: "tag", texto: "fusao", x: 100, y: 110, at: 0.1 },
          { tipo: "fusao", w: 1460, x: 120, y: 260, at: 0.2, t: { divisor: 0.5, apaga: 2.2, botao: 3.2, margem: 4.2 } },
        ],
      },
    },
  ],
};
