# Kit-Video (template)

Leia isto antes de mexer em qualquer cena, peça ou montagem.
O catálogo gerado (`biblioteca/CATALOGO.md`) é a versão que o build mantém atualizada; este arquivo é o mapa e as regras.

> **Para criar uma peça nova, o passo a passo está em [`COMO-CRIAR.md`](COMO-CRIAR.md).**
> Este arquivo diz **o que existe**; aquele diz **como fazer**.

**Sobre a narração:** a voz padrão é a voz padrão do MCP de gerar TTS. Pode ajustar o estilo para encaixar melhor, mas a voz não muda sem o usuário pedir.

---

## O que é

Um kit de vídeo narrado em HyperFrames. A montagem é dados; a biblioteca é código; o build transforma um no outro.

```
montagem/*.mjs        ← o vídeo (única coisa que muda por vídeo)
biblioteca/
  cenas/livre.mjs     ← a única cena: lista de peças com posição e tempo
  pecas/*.mjs         ← 53 peças: tudo o que aparece na tela
  transicoes/*.mjs    ← 5 transições (scan, tinta, circulo, faixa, cortina)
  overlays/*.mjs      ← 6 overlays (barra-progresso, canto, marca, carimbo, rabisco, faisca)
  som.mjs             ← nível de cada efeito medido do arquivo (não chutado)
  personagem.mjs      ← fichário das poses do personagem
assets/               ← film.css, fontes, personagem, desenhos, SFX, áudio
  personagem/         ← poses recortadas do personagem (vazio no template)
  desenhos/           ← objeto ou aparelho gerado que uma peça usa (margem já recortada)
  imagens/            ← imagem solta (captura, arte de outro vídeo)
  audio/              ← narração e trilha (vazio no template)
  sfx/                ← efeitos sonoros do kit
build/                ← compilar.mjs, motor.mjs, build.mjs
AGENTS.md             ← este mapa (o que existe e as regras)
COMO-CRIAR.md         ← como criar peça, testar e não quebrar o resto
```

Comandos:

```powershell
node build\build.mjs montagem\demo-livre.mjs
npx --yes hyperframes@0.9.46 check
npx --yes hyperframes@0.9.46 snapshot --at 5.5,19 --no-end --keep
npx --yes hyperframes@0.9.46 render --quality delivery -o renders\demos\nome.mp4
```

Versão fixa em todos os comandos: **0.9.46**. Não troque — versões acima falham com `Cannot find module deterministicFonts`.

### Como ler o `check`

- **`error`** é o que impede o render: texto coberto, caixa estourando, contraste abaixo de AA. Conserte.
- **`warning` de lint** `composition_file_too_large` aparece quando uma cena passa de ~300 linhas. É o desenho do kit (uma composição por cena) — esperado, não é defeito.
- **`info`** é aviso de composição. Fundo decorativo que passa do quadro é intencional e já vem marcado com `data-layout-allow-overflow`.
- Para guardar o JSON no PowerShell: `check --json | Out-File -Encoding utf8 relatorio.json`. O `>` do PowerShell grava UTF-16 e corrompe o arquivo.

### Paleta e mídia

- **Uma fonte de cor.** Toda cor vem dos tokens do `:root` de `assets/film.css` — não há `rgba()` literal nas peças, nas transições nem no motor. Trocou token, mudou o vídeo inteiro.
- **Tamanho de imagem.** Logo e poses até 512 px bastam (na tela: 84 px e ~900 px). O render recusa composição acima de 16 MB, mas arquivo grande só pesa o projeto.
- **Xadrez pintado.** `transparent_background: true` às vezes devolve um xadrez desenhado, sem alpha. Nesse caso: fundo branco chapado + `remove_background`.

### O que o template já entrega e o que falta

| Já vem pronto | Você coloca |
| --- | --- |
| 53 peças, 5 transições, 6 overlays | poses do seu personagem (`assets/personagem/`) |
| `film.css` com a paleta padrão | sua logomarca (`assets/logomarca.png`) |
| fontes (Montserrat, Nunito, JetBrains Mono) | sua narração (`assets/audio/`) e sua trilha |
| 15 efeitos sonoros + 7 do acervo | capturas de tela dos seus vídeos (`assets/imagens/`) |
| 4 montagens de exemplo | — |

---

## Para começar um vídeo novo

**O kit não é copiado.** Ele é o estúdio; um vídeo é uma montagem dentro dele.
Se você copiar o kit para cada pasta de vídeo, passa a ter as 53 peças duplicadas — e a próxima correção só vale em uma cópia.

O que muda por vídeo é **um arquivo**: `montagem/<slug>.mjs`.
O que fica fixo: `biblioteca/`, `assets/film.css`, `build/`, fontes, personagem, ícones.

### Onde cada coisa vai

| O que | Onde | Observação |
| --- | --- | --- |
| Roteiro, SPEC, referências | pasta do vídeo (`videos/<slug>/`), fora do kit | é fonte de conteúdo, não projeto de render |
| Narração gravada | `assets/audio/01-gancho.wav`, `02-...` | WAV mono 48 kHz; um arquivo por bloco |
| Transcrição por palavra | `work/transcricoes/<vídeo>/01-gancho.transcript.json` | mesmo prefixo do WAV; **uma subpasta por vídeo** |
| Tabela de leitura + JSON de fala | `py -3 ferramentas\palavras.py` gera `montagem/fala-<slug>.json` | tempos já somados |
| Montagem do vídeo | `montagem/<slug>.mjs` | **o único arquivo que você cria** |
| Trilha e efeitos | `assets/audio/`, `assets/sfx/` | os SFX já existem no kit |
| Render | `renders/<slug>.mp4` | saída do CLI; `renders/demos/` é só para demos |
| Entrega | `videos/<slug>/` | **o MP4 sai de `renders/` e vai para cá** no fim |

### Passo a passo

1. **Copie um molde**: `montagem/demo-livre.mjs` (9 cenas, 55 s, com SFX e sem narração). Para vídeo narrado, acrescente `fala` e `audio` de voz.
   O texto das demos fala do assunto do canal de origem (tecnologia/IA): copie a estrutura e troque as falas pelas suas.
2. **Coloque os WAVs** da narração em `assets/audio/`, com prefixo numérico (`01-gancho.wav`, `02-...`).
3. **Coloque as transcrições** em `work/transcricoes/<slug>/` com o mesmo prefixo (`01-gancho.transcript.json`), no formato lista `[{ "text": "...", "start": 0.3, "end": 0.5 }, ...]`. **Uma subpasta por vídeo**.
4. **Gere a tabela de leitura e o JSON de fala**:
   ```powershell
   py -3 ferramentas\palavras.py work\transcricoes\<slug> assets\audio montagem\fala-<slug>.json
   ```
   Sem argumentos ela usa a raiz de `work/transcricoes/` e sobrescreve `montagem/fala.json`. Sempre passe as três pastas.
   O `off` de cada bloco (no cabeçalho `--- 01-gancho (off 12.40) ---`) é o `start` que o WAV deve ter em `audio`. Se os dois não baterem, a âncora por palavra fica deslocada.
5. **Declare na montagem**:
   ```js
   export default {
     titulo: "Nome do vídeo",
     slug: "nome",
     cenas: [ /* ... */ ],
     transicoes: [ /* ... */ ],
     overlays: [ /* ... */ ],
     fala: [{ json: "montagem/fala-<slug>.json", em: 0 }],
     audio: [
       { id: "vo-01", src: "assets/audio/01-gancho.wav", start: 0, vol: 1.2, lane: 2 },
       { id: "mus",   src: "assets/audio/trilha.wav", start: 0, dur: 55.5, vol: 0.2, lane: 3 },
     ],
     sfx: [efeito("assets/sfx/caneta.wav", 3.85, { alvo: -16 })],
   };
   ```
   `fala` é o que permite escrever `at: "nunca"` numa peça. `audio` é o som que toca.
6. **Build**: `node build\build.mjs montagem\<slug>.mjs`
7. **Confira**: `check` → 0 erros; `snapshot --at ...` nos momentos de virada.
8. **Render**: `npx --yes hyperframes@0.9.46 render --quality delivery -o renders\<slug>.mp4`
9. **Entregue**: leve o MP4 para a pasta do vídeo.
   ```powershell
   Move-Item renders\<slug>.mp4 ..\videos\<slug>\<slug>.mp4
   ```
   Ali ficam só o que se entrega e o que não se refaz igual: o `youtube.md` (embalagem), as thumbnails e o `roteiro.md`. O `renders/` é saída do CLI, não acervo.

---

## O acervo cresce a cada vídeo

Todo vídeo termina com o kit maior do que começou. Sempre considere criar coisas novas antes de usar o que já existe. Apenas use o que já existe se for exatamente o que precisa e se não for ficar repetindo o mesmo uso durante um mesmo vídeo.

---

## Formato: 16:9 é o padrão, 9:16 é o Short

A montagem declara `formato: "9:16"` (sem declarar, é 16:9 — nada muda nos vídeos longos).

### Comando de check para shorts

**Sempre passe `--safe-zone shorts` no `check`.**
Sem a flag, o check cobra também a área segura do TikTok.

---

## Montagem: a cena

```js
{ bloco: "livre", dur: 6, valores: { pecas: [
    { tipo: "figura", pose: "explicando", lado: "right", pad: 80, bottom: -10, altura: 800, at: 0.3 },
    { tipo: "tag", texto: "o começo de tudo", x: 140, y: 150, at: 0.2 },
    { tipo: "titulo", linhas: ["é só", "pedir"], tamanho: 110, glow: true, x: 140, y: 200, at: 0.6 },
    { tipo: "texto", texto: "sem código, sem manual", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 470, at: 1.3 },
    { tipo: "prompt", x: 140, y: 620, w: 900, at: 2.0, texto: "resuma este texto em 5 tópicos" },
] } }
```

Regras:

- `pecas` é obrigatório e não pode ser vazio.
- Cada peça precisa de `tipo`; o build falha com a lista de tipos válidos.
- Peça de texto solta precisa de `x`/`y`; dentro de `grupo`, `linha` ou `cartao`, flui.
- Título que ocupa duas linhas se escreve com `\n` (`"ninguém\nprecisou"`) — sem isso o navegador escolhe a quebra e a altura do bloco vira imprevisível.
- `at: null` desliga a animação da peça (útil para conteúdo que anima junto com o cartão).
- `moldura: true` desenha os cantos de HUD no quadro da cena.
- Não existe limite de cenas; o limite é editorial.

# Personagem — o apresentador

**Opcional.** Se o seu canal tem um personagem, ele é quem apresenta e explica:
não é "o espectador" nem um avatar genérico — é **quem ensina**. Aparece para dar
rosto ao canal, abrir um assunto, apontar para um painel e fechar o vídeo.
Se o seu canal não tem, use as outras peças e tire as `figura` das montagens.

Arquivos de pose: `assets/personagem/<ação>.png`.
Fichário: `biblioteca/personagem.mjs` — o conjunto que vem junto é **exemplo**;
os nomes das ações descrevem o personagem do kit original, então troque as fichas
pelas suas (os nomes que você criar viram as poses válidas).

**O template não traz as poses.** As do kit original são arte de quem o criou.
Para ter as suas: gere cada pose com fundo transparente, salve em
`assets/personagem/` com o nome da ação, rode `py -3 ferramentas\normalizar-poses.py`
e descreva cada uma no fichário. Sem o PNG, a peça `figura` mostra um quadro de
espera com o caminho do arquivo que falta — nada quebra.
