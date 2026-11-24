# Template de canal para YouTube

Um estúdio completo para produzir vídeos narrados em HTML/CSS/JS com **HyperFrames**, mais os agentes de IA que escrevem o roteiro, os títulos, a descrição e montam os vídeos.

Veio de um canal real e foi limpo para você usar como base. **O visual, o nome e o personagem são seus para definir** — o kit entrega a estrutura, as 53 peças de cena, as transições, os efeitos e o jeito de trabalhar.

---

## O que já vem pronto

| Pronto | Você coloca |
| --- | --- |
| 53 peças de cena, 5 transições, 6 overlays | poses do seu personagem |
| Sistema visual (`film.css`) com paleta e fontes | sua logomarca |
| 15 efeitos sonoros + 7 do acervo | sua narração e sua trilha |
| 4 montagens de demonstração | capturas de tela dos seus vídeos |
| Agentes: roteirista, títulos, descrição, diretor de vídeo e auditor visual | as informações do seu canal |

> As 4 montagens de demonstração servem de molde: mostram a maioria das peças em uso (8 peças e o overlay `marca` não aparecem em nenhuma demo — o `kit-video/biblioteca/CATALOGO.md` descreve todas). O texto delas fala de inteligência artificial, o assunto do canal de onde o kit veio — o que se aproveita é a estrutura, então troque as falas pelas suas.

## O que tem em cada lugar

```
AGENTS.md               ← quem é o canal (nome, público, tom, cores). Comece por aqui.
README.md               ← este arquivo
opencode.json           ← configuração do OpenCode (agentes e MCPs)
setup.ps1               ← prepara os MCPs nesta máquina (uma vez; detalhes abaixo)
mcp.local.json          ← caminhos dos MCPs desta máquina (o setup cria; não vem no pacote)
.opencode/agents/       ← roteirista, gerador-titulo, gerador-descricao, auditor-visual, frame
.opencode/skills/       ← pacote-de-producao (títulos + descrição → youtube.md)
.opencode/mcp/run.mjs   ← inicia o MCP certo: pasta local, node_modules ou npx
kit-video/              ← o estúdio: peças, montagens, build, ferramentas
kit-video/AGENTS.md     ← o mapa do kit (leia antes de mexer em cena)
kit-video/COMO-CRIAR.md ← como criar uma peça nova
videos/                 ← uma pasta por vídeo entregue (roteiro, thumbnails, youtube.md)
```

## Pré-requisitos

- **Node 24** (`node -v`)
- **Python 3** com Pillow (`py -3 -m pip install pillow`) — usado nos scripts de imagem
- **ffmpeg e ffprobe** no PATH — o build mede a duração real dos áudios (os dois vêm juntos no pacote oficial do ffmpeg)
- **OpenCode** com a skill `hyperframes` — é quem renderiza
- Acesso à internet na primeira execução: o HyperFrames roda via `npx`
- **MCP `images-audio`** para gerar a narração, transcrever e criar as imagens (o agente `frame` depende dele). Sem esse MCP dá para trabalhar: grave a narração com a sua voz, transcreva no YouTube e gere os desenhos onde preferir.
- **Os MCPs ficam prontos com `setup.ps1`** (uma vez por máquina). Ele encontra os pacotes nesta máquina, grava `mcp.local.json` (fora do Git) e confere cada servidor. O `opencode.json` não guarda caminho de máquina — quem resolve é `.opencode/mcp/run.mjs`.

> Os comandos deste README estão em **PowerShell (Windows)**. Em macOS ou Linux, troque `\` por `/` nos caminhos, use os equivalentes (`mv` no lugar de `Move-Item`) e o PowerShell 7 (`pwsh`) no lugar de `powershell`.

> Versão fixa do HyperFrames: **0.9.46**. Não troque — versões acima quebram o build.

---

## Passo a passo da adaptação

> **Nada aqui é para você digitar à mão.** São as decisões a tomar; quem executa é a IA. O prompt pronto para colar está no fim do README ([Prompt para colar na sua IA](#prompt-para-colar-na-sua-ia)).

1. **Preencha o `AGENTS.md` da raiz.** Todo campo entre `{{ }}` é seu — 10 campos distintos, 15 ocorrências: nome do canal, tema, slogan, público, dois formatos de conteúdo, estética, personagem, propósito e ideia central. É esse arquivo que os agentes leem antes de escrever qualquer coisa.
2. **Coloque sua marca.** Troque `kit-video/assets/logomarca.png` pela sua (um placeholder vem junto). Ela aparece no cartão final e no overlay `marca`. Exporte com fundo transparente e até 512 px: na tela ela tem 84 px, então arquivo grande só pesa o projeto.
3. **Ajuste as cores.** Todas as cores do vídeo saem do bloco `:root` de `kit-video/assets/film.css`: as 5 de marca (`--navy`, `--blue`, `--cyan`, `--lime`, `--ice`), as triplas `--*-rgb` que alimentam os `rgba()` e os derivados (superfícies, texto, linhas, `--shadow-rgb`). **Não há cor literal fora desse bloco** — peças, transições e motor leem daqui, então trocar um token muda o vídeo inteiro. Se a sua paleta for clara, ajuste `--shadow-rgb` (a cor da sombra) e confira o contraste na tela. O prompt de imagem em `kit-video/COMO-CRIAR.md` cita os **nomes** dos tokens, não os valores — só mexa nele se renomear algum token.
4. **Ajuste as fontes** em `kit-video/assets/fonts/` + os `@font-face` do mesmo `film.css`. Se trocar a família, atualize `--display`, `--body` e `--mono`.
5. **Crie as poses do personagem** (pule se o seu canal não tem personagem — nesse caso remova as peças `figura` das montagens): gere cada pose com fundo transparente, salve em `kit-video/assets/personagem/` com o nome da ação (`apresentando.png`, `explicando.png`, `pensativo.png`…), rode `py -3 ferramentas\normalizar-poses.py` dentro de `kit-video/` e descreva cada pose em `kit-video/biblioteca/personagem.mjs`.
6. **Ajuste os agentes** em `.opencode/agents/` se quiser outro tom de roteiro, outro guia de título ou outra direção de arte. Os subagentes vêm **sem modelo fixo**: usam o modelo padrão do seu OpenCode. Se quiser prender um modelo, acrescente `model: provider/modelo` no cabeçalho de cada um.
7. **Prepare os MCPs** com `powershell -File setup.ps1` na raiz do template (é o PowerShell que já vem no Windows; em macOS ou Linux use `pwsh`). O passo a passo (e o login de cada um) está na seção [Os MCPs](#os-mcps).
8. **Teste** (dentro de `kit-video/`):

```powershell
node build\build.mjs montagem\demo-livre.mjs
npx --yes hyperframes@0.9.46 check
npx --yes hyperframes@0.9.46 preview
```

Se o `check` terminar com `0 error(s)`, seu kit está de pé. Para ver como cada peça se comporta, rode também `demo-novas.mjs`, `demo-transicoes.mjs` e `teste-pecas.mjs`.

> **Avisos esperados.** O `check` lista `composition_file_too_large` quando uma cena passa de ~300 linhas de HTML. É o desenho do kit (uma composição por cena): não é erro e não impede o render.
>
> **Relatório em JSON.** No PowerShell, `check --json > relatorio.json` grava UTF-16 e o arquivo deixa de ser JSON válido. Use `check --json | Out-File -Encoding utf8 relatorio.json` — ou leia o relatório completo que o próprio check salva em `.hyperframes/artifacts/checks/`.

---

## Os MCPs

Quatro servidores MCP dão as ferramentas externas aos agentes. O `opencode.json` não guarda caminho de máquina: ele chama `.opencode/mcp/run.mjs`, que acha o programa certo nesta máquina (pasta local → `node_modules` → `npx`).

| Nome no OpenCode | Para que serve | Primeiro uso |
|---|---|---|
| `images-audio` | narração (TTS), imagens/desenhos e transcrição por palavra | `--login` |
| `youtube-studio` | lê o Studio (destaques do nicho, ideias, "Pergunte ao Studio") | `--login` |
| `youtube` | lê o seu canal (métricas, retenção, comentários) e publica vídeo | `auth --setup`, depois `auth --account` |
| `google-trends` | interesse, regiões e termos em alta para escolher assunto | `--consent` |

### 1. Preparar (uma vez por máquina)

```powershell
powershell -File setup.ps1
```

O script:

1. confere o Node (mínimo 20; o template usa 24);
2. procura os pacotes no repositório de quem criou o kit e, em quem estiver sem `dist/`, roda `npm install` (quando falta `node_modules`) e `npm run build`;
3. grava `mcp.local.json` com os caminhos encontrados — arquivo desta máquina, que não vem no pacote;
4. testa cada servidor e mostra de onde ele será iniciado.

Se o repositório estiver em outro lugar:

```powershell
powershell -File setup.ps1 -McpRepo "E:\caminho\mcps-ai"
```

Sem a pasta local, o launcher baixa `images-audio`, `youtube-studio` e `google-trends` do npm com `npx -y` — os três já estão publicados. O `youtube` não é público: para ele, peça o repositório de pacotes a quem te entregou o template e rode o setup com `-McpRepo` apontando para a pasta.

### 2. Login de cada MCP (uma vez por máquina)

```powershell
node .opencode/mcp/run.mjs images-audio --login
node .opencode/mcp/run.mjs youtube-studio --login
node .opencode/mcp/run.mjs google-trends --consent
node .opencode/mcp/run.mjs youtube auth --setup
node .opencode/mcp/run.mjs youtube auth --account principal
```

Os comandos de login abrem uma janela do Chrome; faça login e espere a confirmação — ele fecha a janela que ele mesmo abriu (o `youtube auth --setup` é só uma pergunta no terminal). O perfil fica na pasta do usuário (`~/.chatgpt-images`, `~/.ai-studio-images`, `~/.youtube-studio-mcp`, `~/.youtube-mcp`) e **não** viaja quando você copia o template: por isso o login é por máquina.

O `images-audio --login` faz os dois provedores (ChatGPT e AI Studio); `--login --provider chatgpt` (ou `aistudio`) limita a um. O `youtube` é o único que precisa de credenciais do Google Cloud — o `auth --setup` pergunta uma vez.

### 3. Conferir

```powershell
node .opencode/mcp/run.mjs --check images-audio
```

A resposta diz `local` (pasta do repositório), `installed` (`node_modules`) ou `npx`, com a versão. Quando vier `npx`, ele só quer dizer que o launcher **tentaria** baixar o pacote — não é prova de que ele existe no npm. Dentro do OpenCode, `/mcps` mostra o que conectou de verdade.

### Se um MCP não conectar

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `não encontrado nesta máquina` | O setup não achou o pacote — ou é o `youtube`, que não é público | Rode o setup com `-McpRepo` apontando para o repositório |
| Conecta, mas a primeira tool falha | Falta login no perfil daquele MCP | Rode o comando de login da tabela |
| `Node ... exige 20` | Node antigo no PATH | Instale o Node 20 ou superior (o template usa 24) |
| `mcp.local.json inválido` | O arquivo foi editado à mão e ficou com BOM ou vírgula sobrando | Rode o setup de novo apontando para os pacotes; ele reescreve |

---

## Como nasce um vídeo

1. O agente **roteirista** escreve `videos/<slug>/roteiro.md`.
2. Você grava (ou gera) a narração e salva em `kit-video/assets/audio/01-gancho.wav`, `02-...`.
3. A transcrição por palavra vai para `kit-video/work/transcricoes/<slug>/`.
4. Gere o JSON de fala (dentro de `kit-video/`):

    ```powershell
    py -3 ferramentas\palavras.py work\transcricoes\<slug> assets\audio montagem\fala-<slug>.json
    ```

    É esse JSON que permite escrever `at: "palavra"` nas peças. Sempre passe as três pastas: sem argumentos o script lê a raiz de `work/transcricoes/` e sobrescreve `montagem/fala.json`, que é compartilhado entre vídeos.
5. Você (ou o agente **frame**) monta o vídeo em `kit-video/montagem/<slug>.mjs`, copiando o molde `demo-livre.mjs`.
6. Build → check → render → o MP4 vai para `videos/<slug>/`.
7. A skill **pacote-de-producao** gera títulos, thumbnail, descrição e tags em `videos/<slug>/youtube.md`.

O detalhe de cada passo está em `kit-video/AGENTS.md`.

---

## Prompt para colar na sua IA

Abra a pasta do projeto no **OpenCode** — é ele que carrega os agentes, a skill e os MCPs deste template — e cole o texto abaixo. Em outra ferramenta de IA (Claude Code, Cursor, Codex…) a adaptação de texto e de visual funciona, mas nada de `.opencode/` é carregado.

```text
Este projeto é um template de canal do YouTube. Ele foi copiado de outro canal e
todo o conteúdo pessoal daquele canal já foi removido: nome, marca, personagem,
narração e as capturas de tela. O que ficou é a estrutura, o kit de vídeo em
HyperFrames (pasta kit-video/) e os agentes. As 4 montagens de demonstração que
sobraram (demo-livre, demo-novas, demo-transicoes, teste-pecas) são do kit e
servem de molde — não apague.

Sua tarefa é me ajudar a adaptar este template para o MEU canal, sem quebrar nada.

Contexto do projeto:
- AGENTS.md (raiz) é o "cérebro" do canal para a IA. Todo campo entre {{ }} está
  vazio e precisa ser preenchido com as informações do meu canal.
- kit-video/ é o estúdio: 53 peças de cena, 5 transições, 6 overlays, um build em
  Node e scripts em Python. O mapa está em kit-video/AGENTS.md.
- kit-video/assets/film.css é o sistema visual (cores, fontes, formas).
- .opencode/agents/ tem cinco agentes (roteirista, gerador-titulo,
  gerador-descricao, auditor-visual, frame) com guias de estilo e de produção.
- opencode.json registra os MCPs (nome → `.opencode/mcp/run.mjs`); o caminho real
  de cada pacote fica em `mcp.local.json`, gerado pelo `setup.ps1` e ignorado pelo
  Git. O `images-audio` é o que gera voz, transcrição
  e imagens — se ele não funcionar aqui, me avise em vez de fingir que gerou.
- kit-video/assets/personagem/, assets/audio/ e assets/imagens/ estão vazias de
  propósito: eram a arte e a voz do canal original.

Como quero trabalhar:
1. Antes de mexer em qualquer arquivo, leia AGENTS.md, README.md,
   kit-video/AGENTS.md, kit-video/COMO-CRIAR.md, kit-video/assets/film.css e
   opencode.json. Depois me faça as perguntas que faltam para entender meu canal
   — uma rodada só, agrupada, sem interrogatório.
2. Preencha o AGENTS.md da raiz com as minhas respostas e me mostre o resultado.
   No fim, apague as notas de instrução do próprio template (o aviso "este arquivo
   é o cérebro", o "— template de canal" do título e os blocos que só ensinam a
   preencher): o arquivo precisa virar a identidade do MEU canal, não um tutorial.
3. Ajuste a identidade visual: paleta, fontes e formas em film.css, mantendo a
   legibilidade (contraste) e o padrão de 1920x1080 do kit. A paleta inteira
   está no :root de film.css e não há cor literal fora dele: troque os tokens
   (marca, triplas `--*-rgb`, derivados e `--shadow-rgb`) e o vídeo inteiro
   acompanha. Depois olhe o resultado na tela comigo e ajuste o que destoar.
4. Adapte os agentes ao meu tom de voz, ao meu público e ao meu jeito de fazer
   título e descrição. Não reescreva o que já funciona sem motivo.
5. Verifique se os MCPs respondem (`node .opencode/mcp/run.mjs --check <nome>`) e me
   diga o que cada um faz. Se algum não estiver disponível nesta máquina, explique
   o que falta e me pergunte antes de instalar qualquer coisa.
6. Me guie para criar a minha logomarca e, se eu quiser ter um personagem, as
   poses dele — no formato que o kit espera (nomes de arquivo e caminhos exatos).
   Se eu não quiser personagem, remova as peças `figura` das montagens de exemplo
   em vez de inventar um.
7. Ao final, rode:
     cd kit-video
     node build\build.mjs montagem\demo-livre.mjs
     npx --yes hyperframes@0.9.46 check
   e me diga em linguagem simples o que passou e o que ainda falta. Se der erro,
   conserte você mesmo antes de me devolver.

Regras:
- Não invente informação sobre o meu canal: se eu não respondi, pergunte.
- Não apague peças, transições, montagens de exemplo ou funcionalidades do kit
  para "simplificar". A única edição permitida nas demos é remover as instâncias
  de `figura`, e só quando eu não tiver personagem.
- Não deixe nenhum {{ }} sem preencher; se eu não tiver personagem, escreva
  "sem personagem" no campo em vez de inventar um.
- Explique em português simples, sem jargão, o que mudou em cada arquivo.
```

Dica: se você não tem personagem nem marca ainda, peça no mesmo prompt — "gere uma proposta de paleta, tipografia e um mascote no estilo do kit" — e escolha entre as opções antes de aplicar.

---

## Créditos e observações

- **Fontes:** Montserrat, Nunito e JetBrains Mono são licenciadas em SIL Open Font License e podem ser usadas livremente. Se você redistribuir este pacote, inclua o texto da OFL que vem no download oficial de cada fonte.
- **Efeitos sonoros:** os arquivos em `kit-video/assets/sfx/` ficaram porque não são pessoais. Confira a licença de cada um antes de publicar comercialmente.
- **O que veio do canal original:** a música, a narração, as capturas de tela, a marca e a arte do personagem **não estão aqui**. Os 5 desenhos de `kit-video/assets/desenhos/` (celular, fichário, sala, ícone, multidão) são objetos genéricos, sem marca nem texto — ficaram como exemplo de estilo.
- **Sobras de acervo:** `kit-video/assets/desenhos/multidao.png` e as fontes Inter e Space Grotesk em `kit-video/assets/fonts/` não são usadas por nenhuma peça. Ficaram como material livre — apague se preferir um pacote mais enxuto.
- **Peças e build** são a parte técnica do kit: mexa nelas à vontade, mas leia `COMO-CRIAR.md` antes de criar uma peça nova, para não quebrar as existentes.
