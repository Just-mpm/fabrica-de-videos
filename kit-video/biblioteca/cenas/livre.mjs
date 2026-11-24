/* A cena do kit.
   Não existe cena pronta: toda cena é uma lista de peças posicionadas.
   O desenho mora em biblioteca/pecas/; aqui só se decide o que aparece,
   onde e em que segundo. */

import { htmlDePecas } from "../pecas/index.mjs";

export const contrato = {
  nome: "livre",
  funcao: "a cena: peças soltas sobre o fundo escuro, na posição que o autor escolher",
  duracao: "2,4–15 s",
  obrigatorios: ["pecas"],
  opcionais: ["moldura"],
  naoFaz: "HTML solto, peça que não existe, peça de texto sem x/y",
  observacao:
    "cada peça: { tipo, ...props }. O contrato de cada tipo está no CATALOGO.md. Sem x/y, o cartão/grupo/linha organiza; peça de texto solta precisa de x/y. `at` aceita número (segundos) ou palavra da fala.",
};

/* peças que se posicionam sozinhas a partir da margem quando não recebem x/y */
const PADRAO = { titulo: 140, texto: 140, tag: 140, nota: 140, numero: 140, regua: 140, figura: null };

/* margem segura por formato: 16:9 tem 1920 de largura, 9:16 tem 1080 */
const MARGEM = { "16:9": 140, "9:16": 96 };
const QUADRO = { "16:9": { w: 1920, h: 1080 }, "9:16": { w: 1080, h: 1920 } };

export function montar({ id, valores, formato = "16:9" }) {
  const { pecas = [], moldura = false } = valores;
  const margem = MARGEM[formato] ?? 140;
  const { w: W, h: H } = QUADRO[formato] ?? QUADRO["16:9"];

  if (!Array.isArray(pecas) || pecas.length === 0) {
    throw new Error(`livre "${id}": peças vazia — informe ao menos uma peça`);
  }

  const comMargem = pecas.map((p) => {
    const mod = PADRAO[p.tipo];
    if (mod != null && p.x == null && p.left == null && p.right == null) {
      return { ...p, x: margem };
    }
    return p;
  });

  for (const p of comMargem) {
    if (p.x != null && (p.x < -200 || p.x > W)) {
      console.log(`[livre] ${id}: peça "${p.tipo}" com x=${p.x} fora do quadro`);
    }
    if (p.y != null && (p.y < -200 || p.y > H)) {
      console.log(`[livre] ${id}: peça "${p.tipo}" com y=${p.y} fora do quadro`);
    }
  }

  return {
    body: `
  <div id="root" class="hf-scene" data-composition-id="${id}" data-width="${W}" data-height="${H}">
    ${moldura ? '<div class="moldura"></div>' : ""}
${htmlDePecas(comMargem)}
  </div>`,
  };
}
