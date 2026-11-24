/* Ponto de entrada.

   Uso:  node build/build.mjs [montagem]
         node build/build.mjs montagem/outro-video.mjs

   Sem argumento, compila montagem/demo-livre.mjs.

   Os avisos do kit saem por stdout (console.log), não por stderr: no
   PowerShell cada linha de stderr de um programa externo vira um bloco
   "RemoteException" — o build parece ter falhado mesmo quando deu certo.
*/

import { compilar } from "./compilar.mjs";
import { buildFilm } from "./motor.mjs";

const arquivo = process.argv[2] || "../montagem/demo-livre.mjs";
const montagem = (await import(arquivo.startsWith(".") ? arquivo : `../${arquivo}`)).default;

const filme = compilar(montagem);
buildFilm(filme);
