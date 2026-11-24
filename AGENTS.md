# {{NOME_DO_CANAL}} — template de canal

> **Este arquivo é o "cérebro" do canal para a IA.** Tudo o que estiver entre `{{ }}` é para você preencher.
> Se você não é técnico: abra o projeto na sua ferramenta de IA e peça "preencha todos os `{{ }}` deste AGENTS.md com as informações do meu canal". O `README.md` da raiz tem o prompt pronto.

## Sobre o projeto

{{NOME_DO_CANAL}} é um canal do YouTube sobre {{TEMA_DO_CANAL}}.

O objetivo é apresentar o conteúdo de forma simples, didática e interessante, ajudando pessoas comuns a entender e aproveitar {{TEMA_DO_CANAL}}, mesmo sem conhecimento técnico.

**Slogan:** {{SLOGAN}}

## Público-alvo

{{PUBLICO}}

> Exemplo de como escrever: "pessoas curiosas sobre o tema, principalmente iniciantes e sem conhecimento técnico".

Queremos que qualquer pessoa consiga acompanhar nossos conteúdos e aprender algo útil, sem precisar ser especialista.

## Conteúdo do canal

Os conteúdos podem abordar:

- {{FORMATO_1}}
- {{FORMATO_2}}
- Tutoriais e demonstrações práticas.
- Novidades e lançamentos.
- Explicações sobre conceitos e tecnologias.
- Produtividade e aplicações no cotidiano.
- Experimentos, comparações e curiosidades.

> {{FORMATO_1}} e {{FORMATO_2}} são os dois jeitos de vídeo que você mais faz.
> Exemplos: "análise de ferramentas", "notícias comentadas", "tutoriais passo a passo", "curiosidades e comparações".

O projeto não está limitado a esses formatos. Novas ideias podem ser exploradas desde que façam sentido para a proposta do canal.

## Comunicação

A comunicação deve ser simples, natural, didática e interessante.

Evitar linguagem excessivamente técnica, formal ou artificial.

O objetivo é explicar assuntos complexos de maneira que qualquer pessoa consiga entender, sem sacrificar a precisão das informações.

Sempre priorizar conteúdos úteis, interessantes e confiáveis.

## Identidade visual

**Estética:** {{ESTETICA}}

> Exemplo: "render 3D suave, formas arredondadas, gradiente e brilho, sem contorno escuro, com elementos de tecnologia".

**Paleta** — as 5 cores de marca estão no bloco `:root` de `kit-video/assets/film.css`. Superfícies, texto e linhas são derivados delas, inclusive o fundo do vídeo (`--navy`). Não há cor literal fora desse bloco: trocar o token muda o vídeo inteiro.

| Papel | Cor |
| --- | --- |
| Fundo (sempre) | `#0B1E4D` |
| Superfícies, ícones e estrutura | `#1565D8` |
| Acento principal e brilho de marca | `#00D4FF` |
| Positivo, novidade, confirmação | `#A8F05A` |
| Texto e base clara | `#F2F8FF` |

**Tipografia:** Montserrat nos títulos (caixa alta, peso 800), Nunito nos textos e JetBrains Mono só onde o assunto é código, terminal ou atalho — o padrão do kit, já instalado em `kit-video/assets/fonts/`. Troque se quiser.

## Personagem oficial (opcional)

{{PERSONAGEM}}

> Sem personagem? Escreva "sem personagem: o canal usa só as peças de cena" no lugar do texto acima e remova as peças `figura` das montagens.
> O template **não traz a arte do personagem** (o desenho de quem criou o kit é pessoal).
> A pasta `kit-video/assets/personagem/` está vazia de propósito: gere as suas poses, salve lá com o nome da ação (`apresentando.png`, `explicando.png`…), rode `py -3 ferramentas\normalizar-poses.py` (dentro de `kit-video/`) e registre cada uma em `kit-video/biblioteca/personagem.mjs`.
> Enquanto os PNGs não existirem, a peça `figura` desenha um quadro de espera no lugar — o vídeo compila sem quebrar.

## O Papel dos Shorts no Canal

Os Shorts devem ser pensados para pessoas que ainda não conhecem o canal. Eles precisam funcionar como pequenas experiências completas: despertar curiosidade, desenvolver uma ideia e no final o espectador entender sobre o que foi falado, mesmo que ele não tenha conhecimento técnico nem seja da área.

## Direção geral

O {{NOME_DO_CANAL}} existe para {{PROPOSITO}}.

A ideia central é simples: **{{IDEIA_CENTRAL}}.**

> Exemplo: "aproximar as pessoas do tema, mostrando que pode ser compreendido e utilizado por todos. Menos complicação, mais conhecimento."

---

## Mapa do repositório

```
AGENTS.md              ← este arquivo: quem é o canal
README.md              ← como adaptar o template
opencode.json          ← agentes e MCPs do OpenCode (aponta para o launcher)
setup.ps1              ← prepara os MCPs nesta máquina (uma vez)
mcp.local.json         ← caminhos dos MCPs desta máquina (o setup cria; não vem no pacote)
.opencode/
  agents/              ← roteirista, gerador-titulo, gerador-descricao, auditor-visual, frame
  skills/              ← pacote-de-producao (títulos + descrição + youtube.md)
  mcp/run.mjs          ← inicia o MCP certo: pasta local, node_modules ou npx
kit-video/             ← o estúdio de vídeo (HyperFrames)
  AGENTS.md            ← o mapa do kit
  COMO-CRIAR.md        ← como criar uma peça nova
videos/                ← pasta de entrega de cada vídeo (roteiro, thumbnails, youtube.md)
```
