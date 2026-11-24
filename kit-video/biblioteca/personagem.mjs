/* FICHÁRIO DO PERSONAGEM — a fonte de verdade das poses.

   A pose é escolhida pela ficha, não pelo nome. O campo `ve` descreve o que a
   imagem realmente mostra (conferido no PNG), `escala` compensa o enquadramento
   de cada geração e `de` diz em que vídeo a pose nasceu.

   O template vem sem os PNGs: as poses são a arte do SEU personagem. Enquanto os
   PNGs não existirem, a peça `figura` desenha um quadro de espera no lugar.

   O conjunto abaixo é um EXEMPLO — as ações descrevem o personagem do kit
   original. Troque as fichas pelas suas: o nome da chave aqui é o mesmo nome do
   arquivo em `assets/personagem/` e o mesmo que a montagem usa em `pose`.

   Para acrescentar uma pose: gere a imagem com fundo transparente, salve em
   `assets/personagem/<ação>.png`, rode `py -3 ferramentas\normalizar-poses.py`
   e registre aqui. */

export const FICHAS = {
  apresentando: {
    arquivo: "apresentando",
    ve: "de pé, braço estendido para o lado com a palma aberta, sorriso amigável — apresentando algo",
    enquadramento: "inteiro",
    de: "kit",
    serve: ["abertura", "apresentar um tema", "apresentar uma ferramenta"],
    escala: 1,
  },
  explicando: {
    arquivo: "explicando",
    ve: "de pé, indicador erguido na altura do peito, sobrancelha firme — explicando um ponto",
    enquadramento: "inteiro",
    de: "kit",
    serve: ["definição", "conceito", "'preste atenção nisso'"],
    escala: 1,
  },
  pensativo: {
    arquivo: "pensativo",
    ve: "de pé, mão no queixo, olhar para cima e de lado — dúvida ou reflexão",
    enquadramento: "inteiro",
    de: "kit",
    serve: ["pergunta", "dúvida comum", "'será que funciona?'"],
    escala: 1,
  },
  "mostrando-notebook": {
    arquivo: "mostrando-notebook",
    ve: "segurando um notebook aberto, olhando para a tela",
    enquadramento: "cena",
    de: "kit",
    serve: ["demonstração de ferramenta", "tutorial", "uso prático"],
    escala: 1,
  },
  apontando: {
    arquivo: "apontando",
    ve: "de pé, braço estendido apontando para o lado, expressão de quem mostra algo",
    enquadramento: "inteiro",
    de: "kit",
    serve: ["apontar para um painel", "uma janela", "um dado ao lado dele"],
    escala: 1,
  },
  concluindo: {
    arquivo: "concluindo",
    ve: "de pé, as duas mãos abertas na altura da cintura, sorriso satisfeito — resumindo",
    enquadramento: "inteiro",
    de: "kit",
    serve: ["fechamento", "resumo", "convite"],
    escala: 1,
  },
  incredulo: {
    arquivo: "incredulo",
    ve: "de pé, os dois braços abertos na altura do peito com as palmas para cima, olhos arregalados e boca aberta — espanto, 'não acredito nisso'",
    enquadramento: "inteiro",
    de: "exemplo",
    serve: ["reviravolta absurda", "'como assim?'", "número que não fecha"],
    escala: 1,
  },
  encolhendo: {
    arquivo: "encolhendo",
    ve: "de pé, ombros levantados e as duas palmas viradas para cima ao lado do corpo, sobrancelhas erguidas e boca torta — 'sei lá', dar de ombros",
    enquadramento: "inteiro",
    de: "exemplo",
    serve: ["fechamento sem resposta", "'ninguém sabe'", "resignação"],
    escala: 1,
  },
  desconfiado: {
    arquivo: "desconfiado",
    ve: "de pé, braços cruzados na altura do peito, uma sobrancelha erguida, olhando de lado — desconfiança",
    enquadramento: "inteiro",
    de: "exemplo",
    serve: ["suspeita", "'tem coisa aí'", "veredito desconfiado"],
    escala: 1,
  },
  "cocando-cabeca": {
    arquivo: "cocando-cabeca",
    ve: "de pé, mão direita na nuca, cabeça inclinada, sobrancelhas franzidas — 'cadê?', procurando e não achando",
    enquadramento: "inteiro",
    de: "exemplo",
    serve: ["não encontrei", "recurso escondido", "confusão"],
    escala: 1,
  },
  espiando: {
    arquivo: "espiando",
    ve: "inclinado para a frente, mão na testa como viseira, olhar curioso para o lado — espiando algo escondido",
    enquadramento: "inteiro",
    de: "exemplo",
    serve: ["descobrir algo", "olhar por dentro", "'tem uma salinha ali'"],
    escala: 1,
  },
  "nao-fui-eu": {
    arquivo: "nao-fui-eu",
    ve: "de pé, as duas mãos abertas na altura dos ombros com as palmas para a frente, sorriso nervoso e gota de suor — 'não fui eu'",
    enquadramento: "inteiro",
    de: "exemplo",
    serve: ["inocência", "'eu só pedi'", "resultado que apareceu sozinho"],
    escala: 1,
  },
};

/* apelidos: nomes curtos usados nas montagens */
export const APELIDOS = {
  personagem: "apresentando",
  ola: "apresentando",
  aula: "explicando",
  duvida: "pensativo",
  notebook: "mostrando-notebook",
  laptop: "mostrando-notebook",
  mostra: "apontando",
  fim: "concluindo",
  tchau: "concluindo",
  choque: "incredulo",
  espanto: "incredulo",
  ombros: "encolhendo",
  sei_la: "encolhendo",
  suspeita: "desconfiado",
  nuca: "cocando-cabeca",
  procurando: "cocando-cabeca",
  espiar: "espiando",
  dentro: "espiando",
  inocente: "nao-fui-eu",
  ops: "nao-fui-eu",
};

export function fichaPose(nome) {
  const chave = FICHAS[nome] ? nome : APELIDOS[nome];
  return chave ? { ...FICHAS[chave], nome: chave } : null;
}

export function arquivoPose(nome) {
  return fichaPose(nome)?.arquivo ?? null;
}

export const POSES_VALIDAS = Object.keys(FICHAS);
