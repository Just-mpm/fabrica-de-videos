# Catálogo da biblioteca

Gerado por `build/compilar.mjs` a cada build. Não editar à mão.

## A cena

O kit tem um bloco só. Tudo o que aparece na tela é peça.

| Bloco | Quando usar | Duração | Obrigatórios | Opcionais | Não faz |
| --- | --- | --- | --- | --- | --- |
| `livre` | a cena: peças soltas sobre o fundo escuro, na posição que o autor escolher | 2,4–15 s | pecas | moldura | HTML solto, peça que não existe, peça de texto sem x/y |

## Transições

| Nome | Efeito | Duração |
| --- | --- | --- |
| `scan` | varredura: uma linha de luz desce e um véu escuro cobre o corte | 0.5–0.7 s |
| `tinta` | faixa de cor chapada atravessa a tela cobrindo o corte, com fio de luz na frente | 0.45–0.6 s |
| `circulo` | pulso de luz cresce do centro, cobre o corte e dissolve | 0.45–0.6 s |
| `faixa` | faixa diagonal de luz atravessa a tela cobrindo o corte | 0.45–0.6 s |
| `cortina` | persianas horizontais cobrem a tela em faixas e dissolvem | 0.5–0.7 s |

## Overlays

| Nome | Efeito | Duração |
| --- | --- | --- |
| `barra-progresso` | orientar em vídeo longo: onde estamos dentro do bloco | 2–3 s (entra no começo da cena) |
| `canto` | moldura de interface: quatro cantos de HUD e um rótulo pequeno, entrando e saindo | 2–4 s |
| `marca` | logomarca discreta no canto, para identificar o canal sem competir com a cena | o vídeo inteiro (ou o trecho escolhido) |
| `carimbo` | selo que bate por cima da cena (reforço, alerta ou veredito) | 1,2–2 s |
| `rabisco` | marca à mão sobre um ponto da cena (círculo, retângulo arredondado ou seta), desenhada por cima | 1,2–2 s |
| `faisca` | as três risquinhas amarelas da marca: surpresa, ideia, 'uau' | 0,6–1,2 s |

## Peças (o desenho)

| Peça | Quando usar | Aceita | Não faz |
| --- | --- | --- | --- |
| `figura` | o personagem do canal recortado, em qualquer ponto do quadro | pose, lado, x, y, altura, largura, bottom, pad, at, anim | pose que não existe (o build falha e lista as válidas) |
| `titulo` | a frase grande (display): título de cena, palavra-chave, conclusão | texto (frase de uma linha), linhas (um item por linha — é assim que se quebra), tamanho, cor, caixa, glow, marcar, marcaNa, destaques, anim, at, x, y, w, contorno | parágrafo longo; título é para 2–6 palavras. Deixar a frase quebrar sozinha dentro de `w` — a altura do bloco vira imprevisível. Quebre com `linhas: []` (um item por linha): cada linha é um bloco fechado e o build sabe a altura exata. `\n` dentro de `texto` é erro. |
| `texto` | texto de apoio em quatro tons: body (corpo), lead (frase de destaque), mono (código/rótulo) e small (legenda) | texto, tom, tamanho, cor, destaques, anim, at, x, y, w, lineHeight, maiusculas, alinhamento | texto de mais de 3 linhas no tom lead; para isso use cartao |
| `tag` | rótulo pequeno em mono, com ponto de luz: contexto, categoria, 'parte 1', 'teste real' | texto, tamanho, cor, ponto, espacamento, x, y, at, anim | frase inteira; a tag é etiqueta, não argumento |
| `nota` | régua de luz curta + legenda pequena (rodapé de cena, fonte, assinatura) | texto, cor, larguraRegua, espessura, gap, x, y, at, anim | duas linhas de texto; a nota é uma linha |
| `grupo` | empilha peças na vertical, com espaço entre elas | pecas, x, y, w, gap, alinhar, at, anim | grupo com posição própria dentro de outro grupo (use o fluxo) |
| `linha` | coloca peças lado a lado numa faixa (ícone + texto, chip + texto, botões) | pecas, x, y, w, gap, alinhar, justificar, at, anim | quebrar linha sozinha; se não couber, diminua o conteúdo ou use grupo |
| `cartao` | card azul arredondado que segura outras peças (ou HTML pronto); com `hud` ganha cantos de interface | pecas|html, tom (azul|destaque|escuro|vazio), hud, rotulo, x, y, w, h, pad, layout, gap, alinhar, justificar, borda, raio, sombra, at, anim | cartão dentro de cartão; use grupo dentro do cartão. Com `h` fixo o conteúdo já centraliza no eixo vertical — só passe `justificar` para mudar isso |
| `chip` | pílula curta: estado, categoria, versão, atalho, nome de ferramenta | texto, estilo (cyan|solid|dashed|violet|amber), tamanho, icone, x, y, at, anim | frase com mais de 4 palavras; para argumento use texto |
| `selo` | carimbo torto de luz: 'testado', 'beta', 'grátis', 'em 2026' | texto, cor, tamanho, rot, x, y, at, anim | frase longa; o selo é uma ou duas palavras |
| `icone` | glifo de interface (spark, brain, chip, bot, chat, search, code…) em traço de luz | nome, tamanho, cor, fundo, raio, x, y, at, anim | desenho de cena; objeto e personagem são imagem gerada |
| `imagem` | imagem solta no quadro: logomarca, captura de tela, arte de outro vídeo | src, w, h, raio, borda, sombra, ajustar, x, y, at, anim | objeto do canal desenhado à mão (isso é peça própria com PNG em assets/desenhos) |
| `regua` | linha de luz que cresce: separador, sublinhado de bloco, eixo | largura, espessura, cor, degradê (true), x, y, at, anim, dur | desenhar caixa; para moldura use cartao |
| `fundo` | o mundo atrás da cena: ondas da marca, grade, aurora, globo pontilhado, circuito ou scanlines | qual (ondas|grade|aurora|globo|circuito|scan|vazio), opacidade, x, y, d, at | duas variantes na mesma cena; o fundo é um só e a cena se desenha por cima |
| `marcador` | traço à mão em volta de algo que já está na tela: círculo, retângulo arredondado ou seta | forma (circulo|caixa|seta), caixa {left,top,width,height}, cor, grossura, rot, fatias, at, dur | marcar sem saber a caixa do alvo — meça a peça e passe os números |
| `prompt` | a caixa de pedido: o que a pessoa escreve para a IA — com digitação, cursor e botão de enviar | texto, dica, rotulo, icone, w, h, enviar, status, at, anim, x, y | duas caixas na mesma cena; para conversa use chat |
| `chat` | conversa em balões: a pergunta da pessoa e a resposta da IA, na ordem em que são ditas | mensagens [{de:'voce'|'ia', texto, at, digitando}], largura, tamanho, avatar, textura, x, y, gap, at, anim | mensagem com `at` em palavra (a lista interna é resolvida só por número) |
| `terminal` | janela de terminal: comandos digitados e saídas aparecendo linha por linha | titulo, linhas [{texto, tipo:'cmd'|'out'|'ok'|'warn'|'info', at, digitar}], w, x, y, at, anim | bloco de código longo; para isso use janela com texto |
| `janela` | janela de navegador/programa: barra com endereço e uma área de conteúdo que aceita peças | url, titulo, pecas|html, w, h, pad, fundo, x, y, at, anim | conteúdo interativo; a área é só o palco — quem anima são as peças de dentro |
| `cursor` | o ponteiro do mouse entrando e clicando num ponto (com onda de clique) | x, y, tamanho, cor, clicar, at, at2, anim | trilha longa pelo quadro; o cursor entra no ponto e clica |
| `token` | o texto picado em pedaços, como a IA lê: cada pedaço acende em ordem | texto, tokens, tamanho, w, x, y, at, cor, legenda, contar | texto corrido; para ler uma frase use texto |
| `rede` | rede de nós e conexões que se desenha: como um modelo liga informação | nos [{x,y,r,rotulo}], ligacoes [[i,j]], w, h, cor, x, y, at, anim | mais de 12 nós; a leitura vira teia |
| `barra` | barra de comparação com rótulo e valor: quanto cada opção ocupa | rotulo, valor, max, sufixo, w, h, cor, x, y, at, anim | valor sem escala; barra decorativa |
| `medidor` | anel de progresso com número no centro: confiança, precisão, percentual | valor (0–100), rotulo, tamanho, cor, sufixo, x, y, at, anim | mais de um anel na mesma peça |
| `numero` | número grande que conta de 0 até o valor, com sufixo e rótulo | valor, sufixo, rotulo, tamanho, cor, contagem, pulsar, x, y, at | dois números na mesma peça; número sem unidade quando a unidade importa |
| `passos` | sequência numerada em cartões ligados por uma linha: passo 1, 2, 3 | passos [{titulo, texto}], ativo, w, gap, x, y, at, anim | mais de 5 passos numa faixa; a partir daí use lista vertical (grupo) |
| `comparar` | dois painéis lado a lado (antes/depois, com IA/sem IA) com uma seta no meio | esquerda {rotulo,titulo,texto,pecas}, direita {…}, destaque (direita|esquerda), w, h, gap, x, y, at, anim | mais de dois lados; para três opções use passos ou cartões |
| `toast` | aviso curto que entra no canto: 'resposta pronta', 'download concluído' | titulo, texto, icone, cor, w, x, y, at, anim | duas notificações empilhadas na mesma cena |
| `onda` | onda de áudio em barras: voz, música, som — o gesto de 'está ouvindo' | barras, w, h, cor, x, y, at, anim | onda que representa dado real; é textura de áudio, não gráfico |
| `fluxo` | caminho de nós ligados por setas que se desenham: entrada → modelo → saída | nos [{titulo, texto, icone}], destaque, w, x, y, at, anim | mais de 4 nós numa faixa (acima disso use passos); ramificar o caminho |
| `codigo` | bloco de código com realce de sintaxe, linha a linha, e saída opcional | linhas, titulo, linguagem, destaques, saida, w, fonte, x, y, at, anim | realce de linguagem exótica; cobre Python, JS e shell pelo vocabulário comum |
| `grafico` | linha ou área com eixo, grade e ponto final: evolução, adoção, preço no tempo | valores, rotulos, w, h, cor, area, sufixo, titulo, grade, x, y, at, anim | mais de 12 pontos (vira ruído); duas séries na mesma peça (use duas peças) |
| `tabela` | tabela de comparação: ferramentas, planos ou opções com uma coluna em destaque | colunas, linhas, destaque, w, legenda, x, y, at, anim | mais de 5 linhas e 4 colunas; célula longa (é tabela, não parágrafo) |
| `celular` | mockup de celular com a tela viva: a área interna aceita peças, como uma janela pequena | pecas|html, w, x, y, at, anim, sombra | tela com muito texto (a largura útil é ~300 px); para desktop use janela |
| `checklist` | lista de conferência: cada item ganha o traço do check em ordem | itens [{texto, ok, nota}], titulo, contador, w, x, y, at, anim | mais de 6 itens; para etapas numeradas use passos |
| `mito-verdade` | dois painéis opostos: o que se repete por aí (riscado) e o que é de fato | mito, verdade, rotuloMito, rotuloVerdade, w, gap, x, y, at, anim | texto longo dos dois lados; cada lado é uma frase |
| `linha-tempo` | eixo com marcos datados: história, versões, lançamentos em ordem | marcos [{data, titulo, texto, estado}], w, h, escala, estatico, at, anim | mais de 6 marcos; texto longo em cada marco |
| `camadas` | rede em camadas: colunas de nós ligados de ponta a ponta, a profundidade do modelo | camadas [4,6,6,3], rotulos, w, h, cor, x, y, at, anim | mais de 5 camadas ou 8 nós por camada; para um grafo solto use rede |
| `alerta` | faixa de aviso com ícone: cuidado, erro comum, dica de segurança | texto, titulo, tom (cuidado|erro|dica), w, x, y, at, anim | mais de duas linhas de texto; o alerta é um recado, não um parágrafo |
| `fonte` | citação com autor e veículo: dá lastro ao que está sendo dito | texto, autor, veiculo, ano, w, x, y, at, anim | citação longa (é uma frase); para números use numero ou grafico |
| `campo` | barra de entrada de mensagem: o lugar onde a pessoa ainda vai escrever | texto, w, tamanho, icone, tom, x, y, at, anim | texto longo (é um placeholder de uma linha); para a conversa já escrita use chat |
| `modelo` | o cartão de um modelo de IA: versão, nome, papel e estado — a peça de uma família (Gemini, GPT, Claude) | nome, versao, papel, cor, estado (normal|aceso|apagado|fantasma), icone, badge, nota, w, h, x, y, at, anim | dois modelos no mesmo cartão; parágrafo no papel (é uma linha de posicionamento, 2–4 palavras) |
| `ranking` | placar de comparação: uma linha por modelo, com barra e valor contando em ordem — quem está na frente fica evidente | linhas [{nome, valor, cor, nota, at}], max, unidade, w, destaque, legenda, titulo, x, y, at, anim | mais de 6 linhas; misturar unidades na mesma escala; barra sem limite (informe max) |
| `captura` | print de tela em moldura de navegador, com aproximação numa região do print e destaques que acendem em ordem — a prova na tela | src, ratio, url, titulo, w, h, foco {x,y,w,h} (0–1 do print), destaques [{x,y,w,h,at,cor,rotulo}], legenda, x, y, at, anim | animar o print (girar/esticar); usar como decoração sem que a fala esteja apontando para ele |
| `estudio` | painel Studio em grade: nove tiles desenhados, o vazio de décimo lugar, a lupa que procura e o tile de site fora da grade | w, x, y, acesos (índices ou 'todos'), t {acesos, site, vazio}, apagado, vazio, site, rotulo, escala, lupa {at, dur}, at, anim | mais de nove opções; o site nunca entra na grade — ele é o que não existe no painel |
| `artefato` | a página gerada: moldura de artefato com abas e um corpo por tipo (generico, revisao, dados, projeto) | variante (generico|revisao|dados|projeto), w, h, x, y, abas, rotulo, t {abas, corpo, grafico, quiz, check, progresso, total, meses, categorias, filtro, colunas, mover}, at, anim | texto corrido dentro da página; a página é estrutura, não conteúdo |
| `fichario` | a caixa-arquivo aberta: recebe cartões de fonte, ganha redoma e placa, e mostra o globo apagado lá fora | w, x, y, cartoes [{nome, icone, at}], domo {at, placa}, globo {at, texto}, at, anim | animar o PNG (nada de girar/esticar); a redoma é SVG, os cartões são desenho |
| `sala` | o fichário de lado com a porta aberta: acende a luz, desenha a porta, roda as tentativas de código e fecha em ok | w, x, y, tentar, n, linhas [{texto, erro}], rotulo, legenda, t {luz, porta, ok}, at, anim | animar o PNG; escrever código legível por cima do monitor (a tela é pequena) — o código vive na bolha |
| `produto` | card do app: ícone desenhado, nome antigo riscado, nome novo e a barra de endereço que continua igual | w, de, para, data, url, t {risca, novo, url}, x, y, at, anim | duas trocas de nome no mesmo card; texto longo no lugar do nome |
| `barras` | colunas verticais com valor no topo e escala declarada: comparar dois números sem mentir no tamanho | itens [{rotulo, valor, cor, at}], max, titulo, legenda, fator, tFator, w, h, x, y, at, anim | cortar o eixo para inflar a diferença; mais de 4 colunas |
| `fusao` | folha de papel e painel de app lado a lado; o divisor desbota, a folha ganha botão e o painel ganha texto | esquerda {rotulo, titulo}, direita {rotulo, titulo}, t {divisor, apaga, botao, margem}, w, h, x, y, at, anim | mais de dois painéis; animar o que está dentro da folha antes do divisor desbotar |
| `mascara` | cartão de resumo que se torna translúcido e revela o motor aceso por baixo | t {motor, sobe}, w, h, x, y, at, anim | trocar o cartão por outro; a graça é o mesmo objeto deixando de esconder |
| `fim` | cartão final: avatar do canal, nome, slot 16:9 do próximo vídeo e botão de inscrever | titulo, sub, avatar, promessa, rec {rotulo, nota}, inscrever, janela, t {avatar, nome, sub, promessa, slot, play, botao, onda1, onda2, onda3, pulso1, pulso2}, x, y, at, anim | mais de um slot de recomendação; texto corrido; concorrer com a última frase da narração |

## Poses do personagem (assets/personagem)

| Pose | O que a imagem mostra | Enquadramento | Nasceu em |
| --- | --- | --- | --- |
| `apresentando` | de pé, braço estendido para o lado com a palma aberta, sorriso amigável — apresentando algo | inteiro | kit |
| `explicando` | de pé, indicador erguido na altura do peito, sobrancelha firme — explicando um ponto | inteiro | kit |
| `pensativo` | de pé, mão no queixo, olhar para cima e de lado — dúvida ou reflexão | inteiro | kit |
| `mostrando-notebook` | segurando um notebook aberto, olhando para a tela | cena | kit |
| `apontando` | de pé, braço estendido apontando para o lado, expressão de quem mostra algo | inteiro | kit |
| `concluindo` | de pé, as duas mãos abertas na altura da cintura, sorriso satisfeito — resumindo | inteiro | kit |
| `incredulo` | de pé, os dois braços abertos na altura do peito com as palmas para cima, olhos arregalados e boca aberta — espanto, 'não acredito nisso' | inteiro | exemplo |
| `encolhendo` | de pé, ombros levantados e as duas palmas viradas para cima ao lado do corpo, sobrancelhas erguidas e boca torta — 'sei lá', dar de ombros | inteiro | exemplo |
| `desconfiado` | de pé, braços cruzados na altura do peito, uma sobrancelha erguida, olhando de lado — desconfiança | inteiro | exemplo |
| `cocando-cabeca` | de pé, mão direita na nuca, cabeça inclinada, sobrancelhas franzidas — 'cadê?', procurando e não achando | inteiro | exemplo |
| `espiando` | inclinado para a frente, mão na testa como viseira, olhar curioso para o lado — espiando algo escondido | inteiro | exemplo |
| `nao-fui-eu` | de pé, as duas mãos abertas na altura dos ombros com as palmas para a frente, sorriso nervoso e gota de suor — 'não fui eu' | inteiro | exemplo |

Transição entra na montagem como `{ nome, em, dur }` e ocupa uma faixa própria,
por cima do corte. Ela nunca substitui o corte: cobre 0,4–0,7 s dele.

Overlay entra como `{ nome, em, dur, valores }` e ocupa a faixa mais alta,
acima de cenas e transições.
