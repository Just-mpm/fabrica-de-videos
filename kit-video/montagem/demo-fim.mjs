/* Demo do cartão final (`fim`) com os defaults do template: SEU CANAL e
   "seu slogan aqui". Serve para ver a peça sozinha, sem depender de um vídeo:

     node build\build.mjs montagem\demo-fim.mjs
     npx --yes hyperframes@0.9.46 snapshot --at 0.6,4,9.5 --no-end --keep

   Para um canal de verdade, passe `titulo`, `sub`, `inscrever`, `despedida` e
   `rec` na montagem (ou troque os defaults dentro da peça). */

export default {
  titulo: "demo do cartão final",
  slug: "demo-fim",
  formato: "16:9",
  cenas: [
    {
      bloco: "livre",
      dur: 10,
      valores: {
        pecas: [{ tipo: "fim", x: 0, y: 0, at: 0.2 }],
      },
    },
  ],
  transicoes: [],
  overlays: [],
  audio: [],
  sfx: [],
};
