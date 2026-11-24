/* ============================================================
   MONTAGEM — bancada das transições e dos overlays.

   Sete cenas curtas e cinco transições — todas as passagens menos a
   última — mais três overlays (carimbo duas vezes e rabisco), para julgar
   o desenho de cada passagem. Sem narração: o assunto é o movimento.
   ============================================================ */

import { efeito } from "../biblioteca/som.mjs";

export default {
  titulo: "Demo — transições",
  slug: "demo-transicoes",
  watermark: null,

  cenas: [
    {
      bloco: "livre",
      dur: 3,
      valores: {
        pecas: [
          { tipo: "tag", texto: "01 · tinta", x: 140, y: 150, at: null },
          { tipo: "titulo", linhas: ["a tinta", "empurra"], tamanho: 110, x: 140, y: 220, at: 0.3 },
          { tipo: "texto", texto: "bloco liso, fio de luz", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 560, at: 0.8 },
          { tipo: "nota", texto: "corte · 3,0 s", x: 140, bottom: 100, at: 1.2 },
        ],
      },
    },

    {
      bloco: "livre",
      dur: 3,
      valores: {
        pecas: [
          { tipo: "tag", texto: "02 · círculo", x: 140, y: 150, at: 0.1 },
          { tipo: "titulo", linhas: ["o pulso", "cresce"], tamanho: 110, x: 140, y: 220, at: 0.3 },
          { tipo: "texto", texto: "cresce, cobre, dissolve", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 560, at: 0.8 },
          { tipo: "nota", texto: "corte · 6,0 s", x: 140, bottom: 100, at: 1.2 },
        ],
      },
    },

    {
      bloco: "livre",
      dur: 3,
      valores: {
        pecas: [
          { tipo: "tag", texto: "03 · faixa", x: 140, y: 150, at: 0.1 },
          { tipo: "titulo", linhas: ["a diagonal", "corta"], tamanho: 110, x: 140, y: 220, at: 0.3 },
          { tipo: "texto", texto: "gradiente inclinado", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 560, at: 0.8 },
          { tipo: "nota", texto: "corte · 9,0 s", x: 140, bottom: 100, at: 1.2 },
        ],
      },
    },

    {
      bloco: "livre",
      dur: 3,
      valores: {
        pecas: [
          { tipo: "tag", texto: "04 · cortina", x: 140, y: 150, at: 0.1 },
          { tipo: "titulo", linhas: ["as persianas", "descem"], tamanho: 110, x: 140, y: 220, at: 0.3 },
          { tipo: "texto", texto: "seis bandas em sequência", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 560, at: 0.8 },
          { tipo: "nota", texto: "corte · 12,0 s", x: 140, bottom: 100, at: 1.2 },
        ],
      },
    },

    {
      bloco: "livre",
      dur: 3,
      valores: {
        pecas: [
          { tipo: "tag", texto: "05 · scan", x: 140, y: 150, at: 0.1 },
          { tipo: "titulo", linhas: ["a varredura", "desce"], tamanho: 110, x: 140, y: 220, at: 0.3 },
          { tipo: "texto", texto: "véu e linha de luz", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 560, at: 0.8 },
          { tipo: "nota", texto: "corte · 15,0 s", x: 140, bottom: 100, at: 1.2 },
        ],
      },
    },

    {
      bloco: "livre",
      dur: 3,
      valores: {
        pecas: [
          { tipo: "tag", texto: "06 · marca", x: 140, y: 150, at: 0.1 },
          { tipo: "titulo", texto: "e o carimbo bate", tamanho: 96, x: 140, y: 240, at: 0.3 },
          { tipo: "texto", texto: "o selo entra torto e assenta", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 430, at: 0.8 },
          { tipo: "regua", largura: 300, x: 140, y: 540, at: 1.2 },
        ],
      },
    },

    {
      bloco: "livre",
      dur: 3.4,
      valores: {
        pecas: [
          { tipo: "tag", texto: "07 · vira", x: 140, y: 150, at: 0.1 },
          { tipo: "titulo", linhas: ["a folha", "vira"], tamanho: 110, x: 140, y: 220, at: 0.3 },
          { tipo: "texto", texto: "giro no eixo y, com dobra", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 560, at: 0.8 },
          {
            tipo: "cartao",
            x: 1040,
            y: 250,
            w: 700,
            tom: "destaque",
            hud: true,
            anim: "vira",
            rot: 0,
            at: 0.6,
            dur: 1.3,
            pecas: [
              { tipo: "chip", texto: "perspective", estilo: "cyan", at: 1.0 },
              { tipo: "titulo", texto: "vira", tamanho: 96, at: 1.1 },
              { tipo: "texto", texto: "a página gira na lombada", tamanho: 28, cor: "var(--ink-soft)", at: 1.2 },
            ],
          },
        ],
      },
    },
  ],

  transicoes: [
    { nome: "tinta", em: 2.75, dur: 0.5 },
    { nome: "circulo", em: 5.75, dur: 0.5 },
    { nome: "faixa", em: 8.75, dur: 0.5 },
    { nome: "cortina", em: 11.75, dur: 0.55 },
    { nome: "scan", em: 14.75, dur: 0.5 },
  ],

  overlays: [
    { nome: "carimbo", em: 0.45, dur: 2.0, valores: { texto: "gostei", tom: "cyan", canto: "br", rot: -7 } },
    { nome: "rabisco", em: 6.3, dur: 1.8, valores: { forma: "caixa", caixa: { left: 122, top: 202, width: 700, height: 268 }, cor: "var(--cyan)", grossura: 7, rot: -1 } },
    { nome: "carimbo", em: 15.6, dur: 1.6, valores: { texto: "novo", tom: "amber", canto: "br", rot: 5 } },
  ],

  /* Trilha: o template não traz música. Coloque o seu arquivo em
     assets/audio/ e descomente.
  audio: [{ id: "trilha", src: "assets/audio/trilha.wav", start: 0, dur: 21.4, vol: 0.18, lane: 3 }],
  */


  sfx: [
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 2.77, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_downer_01.wav", 5.77, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 8.77, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_tecido_01.wav", 11.77, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 14.77, { alvo: -18 }),
    efeito("assets/sfx/thud.wav", 0.5, { alvo: -16 }),
    efeito("assets/sfx/caneta.wav", 6.4, { alvo: -18 }),
    efeito("assets/sfx/thud.wav", 15.65, { alvo: -16 }),
    efeito("assets/sfx/acervo/transicao_tecido_01.wav", 18.1, { alvo: -19 }),
  ],
};


