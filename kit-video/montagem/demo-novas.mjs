/* ============================================================
   MONTAGEM — demo das peças novas.

   Segunda bancada do kit: mostra em uso as peças que nasceram
   depois da primeira demo (fluxo, codigo, grafico, tabela,
   celular, checklist, mito-verdade, linha-tempo, camadas,
   alerta, fonte).

   Serve para julgar desenho e ritmo sem narração. Para um vídeo
   de verdade, copie este arquivo e troque o conteúdo.
   ============================================================ */

import { efeito } from "../biblioteca/som.mjs";

export default {
  titulo: "Demo — peças novas",
  slug: "demo-novas",
  watermark: null,

  cenas: [
    // 1 · fluxo: o caminho de uma resposta
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "o caminho", x: 140, y: 150, at: null },
          { tipo: "titulo", linhas: ["da pergunta", "à resposta"], tamanho: 78, x: 140, y: 200, at: 0.3 },
          { tipo: "texto", texto: "toda resposta faz o mesmo percurso", tamanho: 30, cor: "var(--ink-soft)", x: 140, y: 400, at: 1.0 },
          { tipo: "fluxo", x: 140, y: 520, w: 1640, at: 1.4, destaque: 1, nos: [
            { titulo: "seu texto", texto: "a frase que você digita", icone: "doc" },
            { titulo: "o modelo", texto: "pesos, camadas, cálculo", icone: "chip" },
            { titulo: "a resposta", texto: "a palavra mais provável", icone: "chat" },
          ] },
          { tipo: "nota", texto: "cada seta é um cálculo", x: 140, bottom: 100, at: 2.2 },
        ],
      },
    },

    // 2 · codigo: o que está por baixo
    {
      bloco: "livre",
      dur: 5.2,
      valores: {
        pecas: [
          { tipo: "tag", texto: "por baixo", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["é conta,", "não mágica"], tamanho: 80, x: 140, y: 200, at: 0.4 },
          { tipo: "texto", texto: "toda resposta nasce de uma chamada como esta", tamanho: 28, cor: "var(--ink-soft)", x: 140, y: 400, largura: 520, at: 1.0 },
          { tipo: "codigo", x: 700, y: 150, w: 1020, at: 0.8, titulo: "exemplo.py", linguagem: "python", destaques: [4], linhas: [
            "from ia import modelo",
            "",
            "resposta = modelo.gerar(",
            "    texto=\"resuma em 5 tópicos\",",
            "    tokens=280,          # limite da saída",
            "    temperatura=0.7,",
            ")",
            "print(resposta)  # pronto em 1,9s",
          ], saida: ["resposta pronta em 1,9s"] },
          { tipo: "nota", texto: "nenhuma linha aqui pensa", x: 140, bottom: 100, at: 2.4 },
        ],
      },
    },

    // 3 · grafico: a curva
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "a curva", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "a adoção não parou", tamanho: 76, x: 140, y: 200, at: 0.4 },
          { tipo: "texto", texto: "em seis anos, de 6% para 58% das empresas", tamanho: 28, cor: "var(--ink-soft)", x: 140, y: 320, at: 1.0 },
          { tipo: "grafico", x: 140, y: 380, w: 1640, h: 470, at: 1.1, sufixo: "%", valores: [6, 11, 18, 26, 34, 45, 58], rotulos: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"] },
          { tipo: "nota", texto: "dado ilustrativo", x: 140, bottom: 100, at: 2.8 },
        ],
      },
    },

    // 4 · tabela: qual escolher
    {
      bloco: "livre",
      dur: 5.2,
      valores: {
        pecas: [
          { tipo: "tag", texto: "a comparação", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "qual escolher", tamanho: 76, x: 140, y: 200, at: 0.4 },
          { tipo: "tabela", x: 140, y: 340, w: 1640, destaque: 2, at: 1.0, legenda: "exemplo de leitura — confira o preço atual antes de assinar", colunas: ["", "grátis", "pro", "time"], linhas: [
            ["preço", "R$ 0", "R$ 20/mês", "R$ 90/mês"],
            ["modelo mais forte", false, true, true],
            ["uso comercial", false, true, true],
            ["limite de mensagens", "40/dia", "ilimitado", "ilimitado"],
          ] },
          { tipo: "nota", texto: "o preço muda toda hora", x: 140, bottom: 100, at: 2.6 },
        ],
      },
    },

    // 5 · celular: no bolso
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "no bolso", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["a mesma", "conversa"], tamanho: 84, x: 140, y: 200, at: 0.4 },
          { tipo: "texto", texto: "o texto quebra, o polegar rola", tamanho: 28, cor: "var(--ink-soft)", x: 140, y: 420, largura: 620, at: 1.0 },
          { tipo: "texto", tom: "mono", texto: "a tela aceita peças, como a janela", tamanho: 22, cor: "var(--cyan)", x: 140, y: 540, at: 2.0, extras: "data-layout-ignore" },
          { tipo: "celular", x: 1190, y: 168, w: 408, at: 1.3, pecas: [
            { tipo: "texto", tom: "mono", texto: "9:41", tamanho: 14, cor: "var(--ink-soft)", x: 24, y: 13, at: null, extras: "data-layout-ignore" },
            { tipo: "chip", texto: "assistente", estilo: "cyan", tamanho: 16, x: 18, y: 42, at: 1.5 },
            { tipo: "chat", x: 14, y: 94, largura: 294, tamanho: 19, gap: 8, textura: true, at: 1.6, mensagens: [
              { de: "voce", texto: "o que é um prompt?", at: 1.6 },
              { de: "ia", texto: "é o que você pede.", at: 2.1 },
              { de: "voce", texto: "e se eu pedir mal?", at: 2.6 },
              { de: "ia", texto: "a resposta vem pior.", at: 3.0 },
              { de: "ia", digitando: true, at: 3.5 },
            ] },
            { tipo: "campo", texto: "escreva algo", tamanho: 16, w: 294, x: 14, bottom: 24, at: 3.3 },
          ] },
          { tipo: "nota", texto: "a tela é viva", x: 140, bottom: 100, at: 2.6 },
        ],
      },
    },

    // 6 · checklist: antes de confiar
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "antes de confiar", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "quatro perguntas", tamanho: 76, x: 140, y: 200, at: 0.4 },
          { tipo: "checklist", x: 140, y: 350, w: 1000, at: 0.9, contador: true, itens: [
            { texto: "a resposta cita uma fonte?", nota: "sem fonte, trate como rascunho" },
            { texto: "o número bate com a conta?", nota: "refaça de cabeça ou na calculadora" },
            { texto: "a data está atualizada?", nota: "modelo velho responde como se fosse hoje" },
            { texto: "o texto parece você?", ok: false, nota: "reescreva o que soar artificial" },
          ] },
          { tipo: "icone", nome: "shield", tamanho: 240, cor: "var(--cyan)", fundo: "rgba(var(--cyan-rgb), .08)", raio: 44, x: 1360, y: 380, at: 2.4 },
          { tipo: "texto", tom: "mono", texto: "quem confere é você", tamanho: 24, cor: "var(--ink-soft)", x: 1360, y: 660, at: 2.8, extras: "data-layout-ignore" },
        ],
      },
    },

    // 7 · mito e verdade
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "mito e verdade", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "o que ela faz, de fato", tamanho: 72, x: 140, y: 200, at: 0.4 },
          { tipo: "mito-verdade", x: 140, y: 360, w: 1640, at: 0.9, mito: "a IA pensa como uma pessoa", verdade: "a IA calcula qual palavra vem depois" },
          { tipo: "texto", texto: "a diferença muda como você usa", tamanho: 30, cor: "var(--ink-soft)", x: 140, y: 660, at: 2.4 },
          { tipo: "nota", texto: "sem consciência, sem intenção", x: 140, bottom: 100, at: 2.6 },
        ],
      },
    },

    // 8 · linha do tempo
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "não começou ontem", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "setenta anos de tentativa", tamanho: 72, x: 140, y: 200, at: 0.4 },
          { tipo: "linha-tempo", x: 140, y: 380, w: 1640, h: 400, at: 0.9, marcos: [
            { data: "1956", titulo: "o nome nasce", texto: "Dartmouth" },
            { data: "1997", titulo: "o computador vence", texto: "Deep Blue" },
            { data: "2012", titulo: "a rede aprende", texto: "ImageNet" },
            { data: "2022", titulo: "vira conversa", texto: "o chat" },
            { data: "2026", titulo: "vira rotina", texto: "no trabalho" },
          ] },
          { tipo: "nota", texto: "mais dado, não mais ideia", x: 140, bottom: 100, at: 2.4 },
        ],
      },
    },

    // 9 · camadas + alerta
    {
      bloco: "livre",
      dur: 4.8,
      valores: {
        pecas: [
          { tipo: "tag", texto: "por dentro", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", linhas: ["camadas", "de pesos"], tamanho: 80, x: 140, y: 200, at: 0.4 },
          { tipo: "texto", texto: "cada coluna transforma o que a anterior entregou", tamanho: 28, cor: "var(--ink-soft)", x: 140, y: 420, largura: 640, at: 1.0 },
          { tipo: "camadas", x: 900, y: 130, w: 880, h: 560, at: 0.9, camadas: [4, 6, 6, 3], rotulos: ["entrada", "oculta", "oculta", "saída"] },
          { tipo: "alerta", x: 140, y: 700, w: 700, at: 2.2, tom: "dica", texto: "nenhuma camada entende — ela soma" },
        ],
      },
    },

    // 10 · fonte
    {
      bloco: "livre",
      dur: 6.5,
      valores: {
        pecas: [
          { tipo: "tag", texto: "com lastro", x: 140, y: 150, at: 0.15 },
          { tipo: "titulo", texto: "de onde veio isso?", tamanho: 76, x: 140, y: 200, at: 0.4 },
          { tipo: "fonte", x: 140, y: 360, w: 1000, tamanho: 36, at: 0.9,
            texto: "Ela responde igual quando acerta e quando inventa.",
            autor: "seu canal", veiculo: "roteiro", ano: "2026" },
          { tipo: "texto", tom: "lead", texto: "quando a frase é forte, a fonte aparece ao lado.", tamanho: 34, cor: "var(--ink-soft)", x: 1200, y: 400, largura: 580, at: 1.6 },
          { tipo: "nota", texto: "citação sem fonte é opinião", x: 140, bottom: 100, at: 2.4 },
        ],
      },
    },

    // 11 · fechamento
    {
      bloco: "livre",
      dur: 4.4,
      valores: {
        pecas: [
          { tipo: "fundo", qual: "aurora", opacidade: 0.9 },
          { tipo: "tag", texto: "o kit cresceu", x: 140, y: 150, at: 0.15 },
          { tipo: "numero", valor: 53, rotulo: "peças no acervo", tamanho: 210, x: 140, y: 240, at: 0.5 },
          { tipo: "texto", tom: "lead", texto: "e o próximo vídeo pede mais", tamanho: 38, cor: "var(--ink-soft)", x: 140, y: 620, at: 1.5 },
          { tipo: "regua", largura: 360, x: 140, y: 720, at: 2.1 },
          { tipo: "texto", tom: "mono", texto: "SEU CANAL", tamanho: 24, espacamento: "0.24em", cor: "var(--cyan)", x: 140, y: 760, at: 2.4, extras: "data-layout-ignore" },
        ],
      },
    },
  ],

  transicoes: [
    { nome: "scan", em: 4.5, dur: 0.6 },
    { nome: "faixa", em: 9.7, dur: 0.6 },
    { nome: "circulo", em: 14.5, dur: 0.6 },
    { nome: "cortina", em: 19.7, dur: 0.65 },
    { nome: "scan", em: 24.5, dur: 0.6 },
    { nome: "faixa", em: 29.3, dur: 0.6 },
    { nome: "circulo", em: 34.1, dur: 0.6 },
    { nome: "cortina", em: 38.9, dur: 0.65 },
    { nome: "scan", em: 43.7, dur: 0.6 },
    { nome: "faixa", em: 50.2, dur: 0.6 },
  ],

  overlays: [
    { nome: "canto", em: 0.2, dur: 3.0, valores: { rotulo: "seu canal · peças novas" } },
  ],

  /* Trilha: o template não traz música. Coloque o seu arquivo em
     assets/audio/ e descomente.
  audio: [
    { id: "trilha", src: "assets/audio/trilha.wav", start: 0, dur: 54.9, vol: 0.2, lane: 3 },
  ],
  */

  sfx: [
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 4.52, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 9.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_downer_01.wav", 14.52, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_tecido_01.wav", 19.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 24.52, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 29.32, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_downer_01.wav", 34.12, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_tecido_01.wav", 38.92, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_swipe-esq-dir_01.wav", 43.72, { alvo: -18 }),
    efeito("assets/sfx/acervo/transicao_whoosh-medio_01.wav", 50.22, { alvo: -18 }),

    efeito("assets/sfx/leve.wav", 1.6, { alvo: -22 }),
    efeito("assets/sfx/acervo/texto_tecla-unica_01.wav", 5.6, { alvo: -20 }),
    efeito("assets/sfx/acervo/texto_tecla-unica_01.wav", 5.95, { alvo: -20 }),
    efeito("assets/sfx/acervo/texto_tecla-unica_01.wav", 6.3, { alvo: -20 }),
    efeito("assets/sfx/contagem.wav", 7.5, { alvo: -21 }),
    efeito("assets/sfx/leve.wav", 12.2, { alvo: -21 }),
    efeito("assets/sfx/clique.wav", 17.0, { alvo: -17 }),
    efeito("assets/sfx/pop.wav", 21.9, { alvo: -19 }),
    efeito("assets/sfx/acerto.wav", 26.4, { alvo: -18 }),
    efeito("assets/sfx/erro.wav", 31.1, { alvo: -20 }),
    efeito("assets/sfx/acerto.wav", 31.6, { alvo: -18 }),
    efeito("assets/sfx/contagem.wav", 36.0, { alvo: -21 }),
    efeito("assets/sfx/leve.wav", 40.6, { alvo: -20 }),
    efeito("assets/sfx/ding.wav", 45.6, { alvo: -20 }),
    efeito("assets/sfx/conquista.wav", 52.2, { alvo: -19 }),
  ],
};

