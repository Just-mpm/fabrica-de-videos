/* Registro de peças: tudo que pode ser usado solto na cena `livre`.

   Cada peça é um módulo com:
     contrato  → o que ela é e o que aceita (vai para o CATALOGO.md)
     montar(p) → devolve { html, css? }

   O `css` que a peça devolve vale só para a cena onde ela foi montada: o
   compilador recolhe depois de montar cada cena (`cssDePecas`) e o injeta no
   `<style>` daquela composição. Assim uma peça com desenho próprio escreve
   classes em vez de repetir style inline.

   Documentação viva: o catálogo é gerado no build, não escrito à mão. */

import * as figura from "./figura.mjs";
import * as titulo from "./titulo.mjs";
import * as texto from "./texto.mjs";
import * as tag from "./tag.mjs";
import * as nota from "./nota.mjs";
import * as grupo from "./grupo.mjs";
import * as linha from "./linha.mjs";
import * as cartao from "./cartao.mjs";
import * as chip from "./chip.mjs";
import * as selo from "./selo.mjs";
import * as icone from "./icone.mjs";
import * as imagem from "./imagem.mjs";
import * as regua from "./regua.mjs";
import * as fundo from "./fundo.mjs";
import * as marcador from "./marcador.mjs";
import * as prompt from "./prompt.mjs";
import * as chat from "./chat.mjs";
import * as terminal from "./terminal.mjs";
import * as janela from "./janela.mjs";
import * as cursor from "./cursor.mjs";
import * as token from "./token.mjs";
import * as rede from "./rede.mjs";
import * as barra from "./barra.mjs";
import * as medidor from "./medidor.mjs";
import * as numero from "./numero.mjs";
import * as passos from "./passos.mjs";
import * as comparar from "./comparar.mjs";
import * as toast from "./toast.mjs";
import * as onda from "./onda.mjs";
import * as fluxo from "./fluxo.mjs";
import * as codigo from "./codigo.mjs";
import * as grafico from "./grafico.mjs";
import * as tabela from "./tabela.mjs";
import * as celular from "./celular.mjs";
import * as checklist from "./checklist.mjs";
import * as mitoVerdade from "./mito-verdade.mjs";
import * as linhaTempo from "./linha-tempo.mjs";
import * as camadas from "./camadas.mjs";
import * as alerta from "./alerta.mjs";
import * as fonte from "./fonte.mjs";
import * as campo from "./campo.mjs";
import * as modelo from "./modelo.mjs";
import * as ranking from "./ranking.mjs";
import * as captura from "./captura.mjs";
import * as estudio from "./estudio.mjs";
import * as artefato from "./artefato.mjs";
import * as fichario from "./fichario.mjs";
import * as sala from "./sala.mjs";
import * as produto from "./produto.mjs";
import * as barras from "./barras.mjs";
import * as fusao from "./fusao.mjs";
import * as mascara from "./mascara.mjs";
import * as fim from "./fim.mjs";

export const PECAS = {
  figura,
  titulo,
  texto,
  tag,
  nota,
  grupo,
  linha,
  cartao,
  chip,
  selo,
  icone,
  imagem,
  regua,
  fundo,
  marcador,
  prompt,
  chat,
  terminal,
  janela,
  cursor,
  token,
  rede,
  barra,
  medidor,
  numero,
  passos,
  comparar,
  toast,
  onda,
  fluxo,
  codigo,
  grafico,
  tabela,
  celular,
  checklist,
  "mito-verdade": mitoVerdade,
  "linha-tempo": linhaTempo,
  camadas,
  alerta,
  fonte,
  campo,
  modelo,
  ranking,
  captura,
  estudio,
  artefato,
  fichario,
  sala,
  produto,
  barras,
  fusao,
  mascara,
  fim,
};

/* CSS das peças, por cena: cada `montar` acrescenta aqui e o compilador
   esvazia ao terminar a cena. */
let cssPendente = new Map();

export function cssDePecas() {
  const saida = [...cssPendente.values()].join("\n");
  cssPendente = new Map();
  return saida;
}

export function montarPeca(tipo, props = {}) {
  const mod = PECAS[tipo];
  if (!mod) {
    throw new Error(
      `peça "${tipo}" não existe. Disponíveis: ${Object.keys(PECAS).join(", ")}`,
    );
  }
  const saida = mod.montar(props);
  if (!saida || typeof saida.html !== "string") {
    throw new Error(`peça "${tipo}" não devolveu html`);
  }
  if (saida.css) cssPendente.set(tipo, saida.css);
  return saida;
}

export function htmlDePecas(pecas = []) {
  return pecas.map((p) => montarPeca(p.tipo, p).html).join("\n");
}
