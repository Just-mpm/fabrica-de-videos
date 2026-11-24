/* MEDIDAS DA CENA — o que as peças informam ao build.

   Uma peça posicionada sabe onde está e quanto mede; o compilador não, porque
   só recebe HTML. Aqui a peça deixa a medida anotada e o build confere depois
   do `montar()` da cena: dois textos que ocupam a mesma faixa viram aviso com
   nome e segundo, em vez de virarem surpresa no render.

   A largura do texto não é chute: `larguras.json` guarda o avanço real de cada
   letra, medido na fonte de verdade por `ferramentas/medir-fonte.mjs`. */

import { readFileSync } from "node:fs";

const LARGURAS = (() => {
  try {
    return JSON.parse(readFileSync(new URL("./larguras.json", import.meta.url), "utf8"));
  } catch {
    throw new Error(
      "biblioteca/larguras.json não existe — rode `node ferramentas\\medir-fonte.mjs` (mede a fonte no Chrome)",
    );
  }
})();

/* largura de uma linha, em px: soma do avanço de cada letra. `espacamentoEm`
   é o letter-spacing da classe (display −0,025 em; body −0,006 em…). */
export function larguraDe(texto, tom = "display", tamanho = 82, espacamentoEm = 0) {
  const mapa = LARGURAS[tom] ?? LARGURAS.body;
  const s = String(texto);
  let em = 0;
  for (const c of s) em += mapa[c] ?? 0.8; // letra fora do mapa: supõe larga
  return (em + espacamentoEm * s.length) * tamanho;
}

/* entrelinha de cada tom, em múltiplos do corpo */
export const LINHA_TOM = { body: 1.38, lead: 1.3, mono: 1.5, small: 1.35 };

let atual = [];

export function registrarCaixa(caixa) {
  atual.push(caixa);
}

export function caixasDaCena() {
  const lista = atual;
  atual = [];
  return lista;
}
