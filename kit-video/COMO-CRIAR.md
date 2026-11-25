# COMO-CRIAR.md — criar peça nova

## 0. A regra que decide tudo: objeto é imagem, movimento é SVG

Vale para toda peça, antes de qualquer outra pergunta.

> **Se o desenho poderia ser recortado e colado num storyboard como figura, ele é IMAGEM.
> Se ele precisa se mover, medir, contar ou apontar, ele é SVG.**

A linguagem dos desenhos do kit é render 3D suave: formas arredondadas, volume,
gradiente e brilho ciano de assinatura, na paleta da marca — sem contorno escuro.
A imagem gerada acerta o desenho; o SVG acerta o movimento.

### O que é imagem (Exemplos)

| Coisa | Exemplos |
| --- | --- |
| **Aparelho** | celular, notebook, monitor, headset, microfone, câmera, console, roteador |
| **Pessoa** | o personagem do canal, retrato, mão, silhueta com roupa |
| **Cenário** | sala, escritório, mesa, bancada, fachada |
| **Objeto nomeável** | xícara, caderno, lâmpada, caixa, chave, robô de brinquedo |
| **Captura de tela** | print de app, interface real, resultado de ferramenta |

### O que é SVG (Exemplos)

- **Traço e linha:** raio, seta, conexão entre nós, sublinhado, moldura de HUD.
- **Geometria e medida:** anel de progresso, barra, eixo, grade, marcador, número.
- **Sinal:** ondas de áudio, pulsos, varredura, scanline, feixe de luz, halo.
- **Tipografia** inteira, inclusive as palavras animadas.

### As duas armadilhas

1. **Imagem não anima.** Nunca gire, estique, encolha nem "abra" o PNG: o aparelho
   girando deforma o traço e o olho vê o erro. O movimento é SVG desenhado por cima.
2. **Estado diferente é outra imagem.** Celular ligado × desligado, tela cheia ×
   vazia: **gere duas imagens** e faça a troca com `data-anim="fade"` (uma entra com
   `data-at`, a outra sai com `data-at2` + `data-anim2="fadeOut"`). Duas imagens no
   mesmo lugar com as duas visíveis deixam dois desenhos fantasma.

---

## 0b. Texto: a quebra de linha é sua, não do navegador

Um título não quebra linha sozinho. A frase quebra **onde você declara cada linha**:

```js
{ tipo: "titulo", texto: "título de exemplo", y: 226, tamanho: 150 }          // uma linha
{ tipo: "titulo", linhas: ["título de", "exemplo"], y: 226, tamanho: 150 }  // duas linhas
{ tipo: "titulo", linhas: ["vem em", "conversa"], y: 190, tamanho: 84 }
```

**Regra única: quebre com `linhas: []`.** Um item é uma linha, e o tamanho do
array é a altura do bloco. Título de uma linha só também pode ir em `texto`,
mas `linhas: ["frase"]` vale igual e mantém uma regra só.

Cada item vira um bloco fechado (`white-space: nowrap`), então a altura do
título é exatamente `linhas × tamanho × line-height` — e o build sabe disso.

---

## 0c. Piso de leitura: 28 px e tempo de tela

Duas regras do `check` pegam texto que "cabe" mas não se lê:

| Regra | O que é | Como resolver |
| --- | --- | --- |
| Tipo mínimo | texto de leitura abaixo de **28 px** não é lido no celular | aumente o tamanho; se for **textura** (valor de eixo, marca d'água, número de escala), marque `data-layout-ignore` |
| Tempo de linha | **0,5 s** de acomodação + **0,3 s por palavra** | entre antes, segure mais, ou encurte a frase |

Marcar `data-layout-ignore` não é esconder o problema: é dizer ao check que aquilo
é escala, não leitura. A `nota` já avisa no build quando entra tarde demais para
a duração da cena — o aviso `[leitura]` calcula o tempo que falta.

---

## 0d. Texto: a primeira letra sobe sozinha

Toda frase de tela começa com maiúscula, e quem garante isso é o build, não a
montagem. `montarPeca` (`biblioteca/pecas/index.mjs`) passa cada peça por
`caixaDeProsa` (`biblioteca/prosa.mjs`) antes de desenhar:

```js
{ tipo: "texto", texto: "sem código, sem manual" }  →  "Sem código, sem manual"
{ tipo: "tag",   texto: "o começo de tudo" }        →  "O começo de tudo"  (o CSS já põe em caixa alta)
```

O que ela não toca, e por quê:

| Caso | Fica como está | Motivo |
| --- | --- | --- |
| já começa com maiúscula, número ou símbolo | `IA sem mistério`, `4 tokens` | não há o que corrigir |
| fragmento de código | `montar(pagina)`, `--flag`, `arquivo.py`, `#tag` | identificador não é frase |
| peças `codigo` e `terminal` | isentas por tipo | o conteúdo é literal |

Se a minúscula for intencional (slogan, assinatura que nasce minúscula), a peça
pede caixa livre:

```js
{ tipo: "texto", texto: "seu slogan aqui", caixa: "livre" }
```

`caixa: "livre"` (ou `semMaiuscula: true`) vale para a peça inteira, inclusive
as peças dentro dela. A peça `fim` também corrige os próprios defaults com
`prosa()` — eles não passam por `montarPeca`.

**Ao criar uma peça nova:** não capitalize o texto à mão. Desenhe com o texto
como veio e garanta que a chave da frase esteja na lista de `biblioteca/prosa.mjs`
(`PROSA`, para frases soltas, e `LISTAS`, para listas de frases): `texto`,
`titulo`, `sub`, `rotulo`, `legenda`, `nota`, `mensagem`, `promessa`,
`frase`... Se a peça der outro nome à frase, acrescente a chave lá — é assim que
a peça nasce certa em vez de precisar de remendo depois. O contrário também
existe: quando uma chave de frase guarda *outra coisa* (nome de desenho, id),
declare a exceção em `LITERAIS_POR_PECA` — é o caso de `aparelhos.itens`, que
guarda `tv`, `fone`.

Quem mede texto (`registrarCaixa` em `biblioteca/medidas.mjs`) mede o texto
**já corrigido**, porque a correção acontece antes de `montar`. Nunca meça antes
de passar pela regra, senão a largura registrada fica menor que a real.

---

## 1. Antes de criar:

1. Abra `biblioteca/CATALOGO.md` e leia o **contrato** das peças candidatas (não só o nome).
2. Se a peça serve, use. Se serve "mais ou menos", veja se o que falta é um desenho novo.
3. **Crie** quando:
   - o roteiro pede uma ação/objeto que nenhuma peça desenha, ou
   - o desenho é forma da linguagem do canal e voltará em outros vídeos, ou
   - a peça existente não aceita o que a fala precisa (outro formato, outro conteúdo, outro gesto).

**O que não existe se cria. O que existe se compõe.**

Criar cedo é mais barato: uma peça custa 60–120 linhas e vale em todo vídeo; o mesmo desenho
refeito à mão sai diferente a cada vez.

---

## 2. Criar uma peça

Arquivo: `biblioteca/pecas/<nome>.mjs`

### Se a peça precisa de imagem

1. **Gere a imagem.** `generate_image` (MCP `images-audio`) com
   `transparent_background: true`, descrevendo o objeto já no estilo do kit —
   render 3D suave, formas arredondadas, gradiente e brilho, na paleta da marca
   (os 5 tokens de `assets/film.css`: `--navy`, `--blue`, `--cyan`, `--lime`,
   `--ice`), sem contorno escuro,
   **sem letra e sem o que vai animar**
   (peça "sem a tela acesa", "sem as ondas"). Salve em `assets/desenhos/<nome>.png`.

   **Se o PNG voltar com xadrez pintado** (um "fundo transparente" desenhado, sem
   canal alpha), gere a mesma imagem em **fundo branco chapado** e rode
   `remove_background` (modo auto, tolerância ~10). Confira com `analyze_images`:
   arquivo bom tem canal alpha. É o desvio mais comum do `transparent_background`.
2. **Prepare o arquivo:** `py -3 ferramentas\recortar-desenhos.py` — recorta a
   margem transparente (para `w` ser a largura do desenho) e reduz para 900 px.
3. **Meça o desenho:** a camada de animação é posicionada por fração da imagem
   (a tela do celular está em `(0.31, 0.22)` da largura, tamanho `0.38`).
   Meça com um script curto no PIL — `py -3 -c "from PIL import Image; ..."` —
   em vez de olhar e chutar.
4. **Monte a peça:** `<img>` com `width:100%` e, por cima, um `<svg>` com
   `viewBox` em milésimos da largura (`0 0 1000 <altura>`) — assim as medidas do
   passo 3 entram direto, sem conversão.
5. **Veja antes do filme:** `node ferramentas\prancha-html.mjs` fotografa uma
   página com o PNG sobre o fundo do filme, no tamanho em que ele vai aparecer.
   Precisa do Chrome instalado; se ele estiver fora do lugar comum, defina
   `$env:CHROME = "caminho\do\chrome.exe"` antes de rodar.

#### Ícone não vira adesivo: use máscara

Ícone de traço precisa aceitar `cor` como os outros. O PNG entra como **máscara**
(e o alpha vira o desenho), não como imagem:

```css
background: currentColor;
mask-image: url(assets/desenhos/meu-icone.png);
mask-size: contain; mask-repeat: no-repeat; mask-position: center;
```

#### Regras

- **Imagem não anima.** Nada de girar/esticar o PNG: se o beat é movimento, o
  movimento é SVG desenhado por cima (ou outro desenho).
- **A imagem entra sem fundo.** Peça sempre `transparent_background: true`; fundo
  chapado obriga a recorte e sujeira de borda. Se voltar xadrez pintado, gere em
  branco chapado e recorte com `remove_background` — nunca use o xadrez.
- **Logo e pose não precisam ser gigantes.** Exporte até 512 px: na tela a logo
  tem 84 px e a pose no máximo ~900 px. Arquivo grande só deixa o projeto pesado.

### Esqueleto

```js
import { caixa, entrada, envolver, posicionada, px } from "./base.mjs";

export const contrato = {
  nome: "minha-peca",
  funcao: "o que ela resolve em uma frase",
  usa: "texto, cor, x, y, at, anim",
  naoFaz: "o que ela não deve fazer",
};

export function montar(p = {}) {
  const { texto = "", cor = "var(--ink)", anim = "fade", at = 0.2 } = p;

  const estilo = [];
  if (posicionada(p)) estilo.push("position:absolute", caixa(p));
  estilo.push(`color:${cor}`);

  return {
    html: `<div style="${estilo.join(";")}" ${entrada(p, { at, anim })}>${texto}</div>`,
  };
}
```

### Os quatro helpers

| Helper | Para que |
| --- | --- |
| `caixa(p)` | `x/y/w/h/left/top/right/bottom` → `left:...px;top:...px;...` |
| `posicionada(p)` | diz se a peça recebeu posição |
| `envolver(p, html)` | embrulha em `div` absoluto **só** se houver posição |
| `entrada(p, defaults)` | monta `data-at`, `data-anim`, `data-dur`, `data-at2`… respeitando `at: null` |

`entrada` é obrigatório no elemento animado. Ele preserva `at: null` (sem animação) e só usa o default quando a chave não veio.

### CSS da peça

Peça que precisa de classe (porque o desenho tem muitos elementos) devolve `css` junto com `html`:

```js
return {
  css: `
  .minha-peca{position:relative}
  .minha-peca-linha{border-bottom:2px solid rgba(var(--cyan-rgb),.35)}`,
  html: posicionada(p) ? envolver(p, corpo) : corpo,
};
```

### Registrar

Em `biblioteca/pecas/index.mjs`:

```js
import * as minhaPeca from "./minha-peca.mjs";

export const PECAS = {
  // ...
  "minha-peca": minhaPeca,
};
```

O `CATALOGO.md` passa a listá-la no próximo build. Não edite o catálogo à mão.
