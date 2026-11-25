/* Caixa das frases: todo texto de tela começa com maiúscula.

   Esquecer a primeira maiúscula é o erro mais chato do kit: não quebra o
   build, não aparece no check, e só é visto quando alguém assiste ao vídeo.
   Aqui ele é corrigido sozinho, num ponto só — `montarPeca`
   (biblioteca/pecas/index.mjs) passa TODA peça por `caixaDeProsa` antes de
   desenhar, inclusive as peças dentro de cartão, linha e grupo.

     "as peças que montam"  → "As peças que montam"
     "IA sem mistério"      → "IA sem mistério"    (já começa com maiúscula)
     "4 tokens"             → "4 tokens"           (não começa com letra)
     "montar(pagina)"       → "montar(pagina)"     (é código, não é frase)

   O que ele nunca toca:
   - fragmento de código: `montar(pagina)`, `--flag`, `arquivo.py`, `#tag`;
   - peça de código por natureza: `codigo`, `terminal`;
   - peça que pede caixa livre: `{ caixa: "livre" }` (ou `semMaiuscula: true`).

   Fluxo: montagem → caixaDeProsa → peça.render (medida e desenho com a caixa
   final). Por isso nada vaza de largura: a peça mede o texto já corrigido.
*/

/* Não é frase: identificador, chamada, caminho, flag, comando, hashtag. */
const NAO_E_FRASE =
  /^\s*[#$@][\w-]|^\s*[\w./-]+\s*\(|=>|:=|--[a-z]|\b[\w-]+\.[a-z]{2,4}\b|;\s*$/;

const LETRA = /[\p{L}]/u;
const MINUSCULA = /[\p{Ll}]/u;

/* índice da primeira letra visível, pulando tags HTML (a peça pode receber
   texto já pintado com <span> ou com as palavras embrulhadas por `wd`) */
function indiceDaPrimeiraLetra(texto) {
  for (let i = 0; i < texto.length; i += 1) {
    const c = texto[i];
    if (c === "<") {
      const fecha = texto.indexOf(">", i);
      if (fecha !== -1) {
        i = fecha;
        continue;
      }
    }
    if (LETRA.test(c)) return i;
    if (/[0-9]/.test(c)) return -1; // número antes de letra: não é frase
  }
  return -1;
}

/* Sobe a primeira letra minúscula da string. Idempotente: rodar duas vezes
   não muda mais nada — é o que permite a peça aplicar a regra de novo nos
   seus próprios defaults sem medo. */
export function primeiraMaiuscula(texto) {
  if (typeof texto !== "string" || texto === "") return texto;
  if (NAO_E_FRASE.test(texto)) return texto;
  const i = indiceDaPrimeiraLetra(texto);
  if (i < 0) return texto;
  const c = texto[i];
  if (!MINUSCULA.test(c)) return texto; // já é maiúscula, ou letra sem caixa
  return texto.slice(0, i) + c.toLocaleUpperCase("pt-BR") + texto.slice(i + 1);
}

/* chaves que são frase (o resto do objeto — caminho, cor, tempo, tom — fica) */
const PROSA = new Set([
  "texto",
  "titulo",
  "subtitulo",
  "sub",
  "promessa",
  "inscrever",
  "rotulo",
  "etiqueta",
  "etiquetaRem",
  "legenda",
  "descricao",
  "resumo",
  "frase",
  "nota",
  "mensagem",
  "autor",
  "contato",
  "status",
  "label",
  "cabecalho",
  "celulas",
  "itens",
  "fala",
  "pergunta",
  "resposta",
  "aviso",
  "dica",
  "rotuloA",
  "rotuloB",
]);

/* listas de frases (uma por item) */
const LISTAS = new Set([
  "linhas",
  "mensagens",
  "eventos",
  "passos",
  "colunas",
  "pecas",
  "grupo",
  "cartoes",
  "fichas",
]);

/* peças cujo conteúdo é literal: código não tem maiúscula de frase */
const ISENTAS = new Set(["codigo", "terminal"]);

/* peças em que uma chave de frase guarda outra coisa (nome de desenho, id):
   `aparelhos` recebe `itens: ["tv", "fone"]`, e "Fone" não é aparelho */
const LITERAIS_POR_PECA = {
  aparelhos: ["itens"],
};

const ehProsa = (chave) => PROSA.has(chave) || LISTAS.has(chave);

function andar(valor, chave) {
  if (typeof valor === "string") return ehProsa(chave) ? primeiraMaiuscula(valor) : valor;

  if (Array.isArray(valor)) {
    const prosa = ehProsa(chave);
    return valor.map((v) =>
      typeof v === "string" ? (prosa ? primeiraMaiuscula(v) : v) : andar(v, chave),
    );
  }

  if (valor && typeof valor === "object") {
    if (ISENTAS.has(valor.tipo)) return valor;
    const fora = LITERAIS_POR_PECA[valor.tipo] || [];
    const out = {};
    for (const [k, v] of Object.entries(valor)) {
      out[k] = fora.includes(k) ? v : andar(v, k);
    }
    return out;
  }

  return valor;
}

/* devolve uma cópia da peça com as frases corrigidas; nunca muda a original */
export function caixaDeProsa(tipo, props = {}) {
  if (!props || typeof props !== "object") return props;
  if (ISENTAS.has(tipo)) return props;
  if (props.caixa === "livre" || props.semMaiuscula === true) return props;
  return andar(props, "");
}

/* utilidade para peça que tem default próprio em minúscula */
export const prosa = (lista) => {
  const itens = Array.isArray(lista) ? lista : [lista];
  const saida = itens.map(primeiraMaiuscula);
  return Array.isArray(lista) ? saida : saida[0];
};
