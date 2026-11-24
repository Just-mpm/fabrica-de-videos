/* Nível de efeito sonoro — medido do arquivo, não chutado.

   O motor escreve `data-volume` direto no <audio> e os arquivos do acervo não
   saem no mesmo nível: alguns nascem com pico em −6 dBFS, outros em −20. Com um
   `vol` fixo para todos (o padrão 0,3) o som mais alto entra 14 dB acima do mais
   discreto — e quem escolhe "no ouvido" acaba escolhendo o mais alto, não o
   melhor.

   `efeito()` mede o pico uma vez por arquivo (ffmpeg) e devolve o `vol` que
   deixa aquele som no nível pedido. Numa montagem:

     import { efeito } from "../biblioteca/som.mjs";
     sfx.push(efeito("assets/sfx/caneta.wav", corte - 0.03));

   O `alvo` é o pico final dentro do filme: −16 dBFS é o lugar de quem
   acompanha a fala; −13 para destaque; −20 para detalhe discreto.
*/

import { spawnSync } from "node:child_process";

const cache = new Map();

/* pico do arquivo em dBFS (número negativo). null quando não deu para medir
   (aí o chamador cai no padrão do motor). */
export function picoDe(src) {
  if (cache.has(src)) return cache.get(src);
  const { stderr } = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-i", src, "-af", "volumedetect", "-f", "null", "-"],
    { encoding: "utf8" },
  );
  const m = /max_volume:\s*(-?[\d.]+)\s*dB/.exec(String(stderr || ""));
  const pico = m ? parseFloat(m[1]) : null;
  cache.set(src, pico);
  return pico;
}

/* ganho linear que leva o pico do arquivo até `alvo` dBFS */
export function ganho(src, alvo = -16) {
  const pico = picoDe(src);
  if (pico === null) return 0.3;
  return Number(Math.min(2, Math.max(0.02, Math.pow(10, (alvo - pico) / 20))).toFixed(2));
}

/* um efeito pronto para a lista `sfx` da montagem */
export function efeito(src, start, { alvo = -16, extra = 1, ...resto } = {}) {
  return {
    src,
    start: typeof start === "number" ? +start.toFixed(2) : start,
    vol: Number((ganho(src, alvo) * extra).toFixed(2)),
    ...resto,
  };
}

/* dois sons no mesmo instante com o mesmo papel: o segundo entra mais baixo
   para não somar pico. `camada()` é o empilhamento (papel + whoosh, por ex.) */
export function camada(src, start, { alvo = -19, ...resto } = {}) {
  return efeito(src, start, { alvo, ...resto });
}
