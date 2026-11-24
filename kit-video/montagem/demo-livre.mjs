/* ============================================================
   MONTAGEM — o único arquivo que muda de vídeo para vídeo.

   Existe um bloco só: `livre`. Uma cena é uma lista de peças com
   posição (`x`/`y`), tempo (`at`) e gesto de entrada (`anim`).
   Nada de HTML aqui — o desenho é da peça, a composição é sua.

   `at` aceita número (segundos) ou uma palavra da transcrição:
   `at: "nunca"` faz a peça entrar no instante em que a palavra é
   falada. `palavra#2` pega a segunda ocorrência.

   Este é o vídeo-demo do kit: 55 s mostrando as peças em uso, sem
   narração. Com narração, acrescente `fala`, `audio` e ancore o `at`.
   ============================================================ */

import { efeito } from "../biblioteca/som.mjs";

export default {
  titulo: "Demo do kit",
  slug: "demo",
  watermark: null,

  cenas: [
    // 1 · abertura: a marca, o tom, o prometido
    {
      bloco: "livre",
      dur: 6.0,
      valores: {
        pecas: [
          { tipo: "fundo", qual: "ondas" },
          { tipo: "tag", texto: "demo do kit", x: 140, y: 152, at: 0.2 },
          { tipo: "titulo", linhas: ["peças", "prontas"], tamanho: 150, glow: true, x: 140, y: 226, at: 0.45, anim: "charsSlam" },
          { tipo: "texto", tom: "lead", texto: "as peças que montam os vídeos do seu canal", tamanho: 34, cor: "var(--ink-soft)", x: 140, y: 588, at: 1.5 },
          { tipo: "selo", texto: "demo", rot: -7, tamanho: 30, x: 145, y: 700, at: 2.3 },
          { tipo: "imagem", src: "assets/logomarca.png", x: 146, y: 800, w: 132, h: 132, raio: 999, borda: 2, at: 2.7 },
          { tipo: "texto", tom: "mono", texto: "SEU CANAL", tamanho: 26, espacamento: "0.22em", x: 306, y: 826, at: 2.9, extras: "data-layout-ignore" },
          { tipo: "texto", tom: "small", texto: "seu slogan aqui", x: 306, y: 872, at: 3.1 },
          { tipo: "figura", pose: "apresentando", lado: "right", pad: 70, bottom: -10, altura: 820, at: 0.9 },
        ],
      },
    },

    // 2 · a caixa de pedido
    {
      bloco: "livre",
      dur: 6.5,
      valores: {
        pecas: [
          { tipo: "tag", texto: "o começo de tudo", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "é só pedir", tamanho: 96, glow: true, x: 140, y: 224, at: 0.4 },
          { tipo: "texto", texto: "sem código, sem manual", tamanho: 32, cor: "var(--ink-soft)", x: 140, y: 340, at: 1.0 },
          { tipo: "prompt", x: 140, y: 440, w: 900, h: 128, at: 1.4, texto: "resuma este texto em 5 tópicos", status: "pedido enviado" },
          { tipo: "linha", x: 140, y: 700, gap: 14, at: 4.1, pecas: [
            { tipo: "chip", texto: "resumir", at: null },
            { tipo: "chip", texto: "explicar", estilo: "violet", at: null },
            { tipo: "chip", texto: "escrever", estilo: "dashed", at: null },
            { tipo: "chip", texto: "traduzir", estilo: "amber", at: null },
          ] },
          { tipo: "cursor", x: 962, y: 474, at: 4.0, at2: 4.32 },
          { tipo: "toast", titulo: "resposta chegando", texto: "leva menos de 2 segundos", x: 1150, y: 700, at: 4.9 },
          { tipo: "nota", texto: "é só isso que a IA recebe", x: 140, bottom: 100, at: 3.6 },
        ],
      },
    },

    // 3 · a resposta vem em conversa
    {
      bloco: "livre",
      dur: 6.5,
      valores: {
        pecas: [
          { tipo: "tag", texto: "a resposta", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["vem em", "conversa"], tamanho: 84, x: 140, y: 190, at: 0.4 },
          { tipo: "texto", texto: "e você continua perguntando", tamanho: 30, cor: "var(--ink-soft)", x: 140, y: 430, at: 1.2 },
          { tipo: "chat", x: 680, y: 250, largura: 980, at: 0.9, mensagens: [
            { de: "voce", texto: "resuma este texto em 5 tópicos", at: 1.0 },
            { de: "ia", texto: "1. contexto  2. problema  3. solução  4. exemplos  5. conclusão", at: 2.2 },
            { de: "voce", texto: "agora em uma frase", at: 4.3 },
            { de: "ia", texto: "a ideia central, sem rodeio.", at: 4.9 },
          ] },
          { tipo: "nota", texto: "a conversa é o produto", x: 140, bottom: 100, at: 3.4 },
        ],
      },
    },

    // 4 · o que acontece por dentro
    {
      bloco: "livre",
      dur: 6.0,
      valores: {
        pecas: [
          { tipo: "tag", texto: "por dentro", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["o que acontece", "em 2 segundos"], tamanho: 70, x: 140, y: 190, at: 0.4 },
          { tipo: "texto", texto: "nada de mágica: cálculo", tamanho: 30, cor: "var(--ink-soft)", x: 140, y: 430, at: 1.2 },
          { tipo: "terminal", x: 900, y: 140, w: 860, at: 0.7, titulo: "meu-projeto — modelo", linhas: [
            { tipo: "cmd", texto: "gerar_resposta --texto \"...\"", at: 1.0, digitar: true },
            { tipo: "out", texto: "lendo 1.284 tokens", at: 2.2 },
            { tipo: "out", texto: "calculando probabilidades", at: 2.8 },
            { tipo: "ok", texto: "resposta pronta em 1,9s", at: 3.5 },
          ] },
          { tipo: "passos", x: 140, y: 660, w: 1580, gap: 26, at: 2.4, passos: [
            { titulo: "lê o texto", texto: "quebra em tokens" },
            { titulo: "calcula", texto: "pesa as conexões" },
            { titulo: "escolhe", texto: "a palavra provável" },
          ] },
          { tipo: "nota", texto: "nenhuma consciência: só padrão", x: 140, bottom: 100, at: 3.9 },
        ],
      },
    },

    // 5 · como ela lê
    {
      bloco: "livre",
      dur: 6.5,
      valores: {
        pecas: [
          { tipo: "tag", texto: "como ela lê", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["não é letra,", "é pedaço"], tamanho: 76, x: 140, y: 190, at: 0.4 },
          { tipo: "texto", texto: "o texto vira pedaços chamados tokens", tamanho: 30, cor: "var(--ink-soft)", x: 140, y: 430, largura: 520, at: 1.3 },
          { tipo: "token", x: 700, y: 190, w: 1060, at: 1.7, texto: "a IA lê o texto em pedaços", legenda: "cada pedaço é um token", contar: true },
          { tipo: "medidor", x: 700, y: 460, tamanho: 260, valor: 87, rotulo: "confiança", at: 3.5 },
          { tipo: "texto", texto: "confiança não é certeza", tamanho: 30, cor: "var(--amber)", x: 1030, y: 520, at: 4.6 },
          { tipo: "nota", texto: "1 token ≈ 4 letras", x: 140, bottom: 100, at: 2.4 },
        ],
      },
    },

    // 6 · o modelo é uma rede
    {
      bloco: "livre",
      dur: 6.0,
      valores: {
        pecas: [
          { tipo: "tag", texto: "o modelo", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["tudo ligado", "a tudo"], tamanho: 82, x: 140, y: 190, at: 0.4 },
          { tipo: "texto", texto: "cada resposta nasce de conexões", tamanho: 30, cor: "var(--ink-soft)", x: 140, y: 430, at: 1.3 },
          { tipo: "numero", valor: 175, sufixo: "B", rotulo: "parâmetros", tamanho: 140, x: 140, y: 540, at: 2.6 },
          { tipo: "rede", x: 860, y: 130, w: 800, h: 740, at: 0.8 },
          { tipo: "nota", texto: "nenhum nó sabe o que os outros fazem", x: 140, bottom: 100, at: 2.9 },
        ],
      },
    },

    // 7 · na prática, uma ferramenta
    {
      bloco: "livre",
      dur: 6.5,
      valores: {
        pecas: [
          { tipo: "tag", texto: "na prática", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["uma ferramenta,", "não um oráculo"], tamanho: 64, x: 140, y: 190, at: 0.4 },
          { tipo: "texto", texto: "ela erra, inventa e chuta — e avisa quando não sabe", tamanho: 28, cor: "var(--ink-soft)", x: 140, y: 400, largura: 580, at: 1.3 },
          { tipo: "janela", x: 780, y: 250, w: 960, h: 500, url: "chat.exemplo.com", titulo: "assistente", at: 0.7, pecas: [
            { tipo: "chip", texto: "assistente de estudos", estilo: "cyan", tamanho: 20, at: null },
            { tipo: "texto", texto: "o que é um prompt?", tamanho: 30, at: null },
            { tipo: "barra", rotulo: "acertos", valor: 92, w: 760, at: 2.0 },
            { tipo: "barra", rotulo: "invenções", valor: 8, w: 760, cor: "var(--amber)", at: 2.7 },
            { tipo: "linha", gap: 12, at: 3.4, pecas: [
              { tipo: "chip", texto: "fonte citada", estilo: "cyan", at: null },
              { tipo: "chip", texto: "fonte ausente", estilo: "amber", at: null },
            ] },
          ] },
          { tipo: "cursor", x: 940, y: 596, at: 3.8, at2: 4.1 },
          { tipo: "nota", texto: "quem confere é você", x: 140, bottom: 100, at: 4.4 },
        ],
      },
    },

    // 8 · antes e depois
    {
      bloco: "livre",
      dur: 6.0,
      valores: {
        pecas: [
          { tipo: "tag", texto: "a diferença", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "antes e depois", tamanho: 76, x: 140, y: 190, at: 0.4 },
          { tipo: "comparar", x: 140, y: 320, w: 1640, h: 400, at: 1.0,
            esquerda: { rotulo: "sem IA", pecas: [
              { tipo: "titulo", texto: "horas de trabalho", tamanho: 52, cor: "var(--ink-soft)", at: null },
              { tipo: "texto", texto: "ler, resumir, reescrever, formatar.", tamanho: 28, at: null },
              { tipo: "numero", valor: 6, sufixo: "h", rotulo: "por texto", tamanho: 110, cor: "var(--ink-dim)", at: 1.4 },
            ] },
            direita: { rotulo: "com IA", pecas: [
              { tipo: "titulo", texto: "minutos", tamanho: 52, at: null },
              { tipo: "texto", texto: "você revisa o que ela adiantou.", tamanho: 28, at: null },
              { tipo: "numero", valor: 20, sufixo: "min", rotulo: "revisando", tamanho: 110, at: 1.9 },
            ] } },
          { tipo: "nota", texto: "o tempo volta para o que só você faz", x: 140, bottom: 100, at: 2.8 },
        ],
      },
    },

    // 9 · fechamento
    {
      bloco: "livre",
      dur: 5.5,
      valores: {
        pecas: [
          { tipo: "fundo", qual: "aurora", opacidade: 0.9 },
          { tipo: "tag", texto: "o fechamento", x: 140, y: 150, at: 0.2 },
          { tipo: "titulo", linhas: ["e o vídeo", "é seu"], tamanho: 84, x: 140, y: 240, at: 0.6 },
          { tipo: "titulo", texto: "mão na massa", tamanho: 84, cor: "var(--cyan)", glow: true, x: 140, y: 430, at: 1.7, anim: "slam" },
          { tipo: "regua", largura: 340, x: 140, y: 578, at: 2.5 },
          { tipo: "texto", tom: "mono", texto: "SEU CANAL", tamanho: 28, cor: "var(--ink-soft)", espacamento: "0.24em", x: 140, y: 618, at: 2.9 },
          { tipo: "figura", pose: "concluindo", lado: "right", pad: 90, bottom: -10, altura: 780, at: 1.2 },
        ],
      },
    },
  ],

  transicoes: [
    { nome: "scan", em: 5.7, dur: 0.6 },
    { nome: "faixa", em: 12.2, dur: 0.6 },
    { nome: "circulo", em: 18.7, dur: 0.6 },
    { nome: "cortina", em: 24.7, dur: 0.65 },
    { nome: "scan", em: 31.2, dur: 0.6 },
    { nome: "faixa", em: 37.2, dur: 0.6 },
    { nome: "circulo", em: 43.7, dur: 0.6 },
    { nome: "cortina", em: 49.7, dur: 0.65 },
  ],

  overlays: [
    { nome: "canto", em: 0.2, dur: 3.4, valores: { rotulo: "seu canal · demo do kit" } },
    { nome: "barra-progresso", em: 25.2, dur: 2.6, valores: { atual: 2, total: 4, rotulo: "demo" } },
    { nome: "faisca", em: 3.0, dur: 1.6, valores: { x: 1180, y: 250, tamanho: 110 } },
  ],

  /* Trilha: o template não traz música. Coloque o seu arquivo em
     assets/audio/ e descomente.
  audio: [
    { id: "trilha", src: "assets/audio/trilha.wav", start: 0, dur: 55.5, vol: 0.2, lane: 3 },
  ],
  */

  sfx: [
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 5.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 12.22, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_downer_01.wav", 18.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_tecido_01.wav", 24.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 31.22, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 37.22, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_downer_01.wav", 43.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_tecido_01.wav", 49.72, { alvo: -18 }),

    efeito("assets/sfx/acervo/texto_tecla-unica_01.wav", 7.86, { alvo: -20 }),
    efeito("assets/sfx/contagem.wav", 9.55, { alvo: -21 }),
    efeito("assets/sfx/clique.wav", 10.4, { alvo: -16 }),
    efeito("assets/sfx/mensagem.wav", 13.5, { alvo: -19 }),
    efeito("assets/sfx/mensagem.wav", 14.7, { alvo: -19 }),
    efeito("assets/sfx/pop.wav", 16.8, { alvo: -18 }),
    efeito("assets/sfx/mensagem.wav", 17.4, { alvo: -19 }),
    efeito("assets/sfx/acervo/texto_tecla-unica_01.wav", 20.0, { alvo: -20 }),
    efeito("assets/sfx/acerto.wav", 22.5, { alvo: -18 }),
    efeito("assets/sfx/leve.wav", 25.4, { alvo: -22 }),
    efeito("assets/sfx/ding.wav", 29.3, { alvo: -20 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 31.9, { alvo: -24 }),
    efeito("assets/sfx/clique.wav", 41.3, { alvo: -16 }),
    efeito("assets/sfx/leve.wav", 44.4, { alvo: -20 }),
    efeito("assets/sfx/acerto.wav", 50.7, { alvo: -17 }),
    efeito("assets/sfx/conquista.wav", 52.4, { alvo: -19 }),
  ],
};
