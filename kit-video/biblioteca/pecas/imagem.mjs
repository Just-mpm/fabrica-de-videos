import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "imagem",
  funcao: "imagem solta no quadro: logomarca, captura de tela, arte de outro vídeo",
  usa: "src, w, h, raio, borda, sombra, ajustar, x, y, at, anim",
  naoFaz: "objeto do canal desenhado à mão (isso é peça própria com PNG em assets/desenhos)",
};

export function montar(p = {}) {
  const {
    src = "",
    w = null,
    h = null,
    raio = null,
    borda = null,
    sombra = false,
    ajustar = "contain",
    anim = "fade",
    at = 0.2,
  } = p;

  if (!src) throw new Error("imagem: falta `src`");

  const estilo = [];
  if (w != null) estilo.push(`width:${px(w)}`);
  if (h != null) estilo.push(`height:${px(h)}`);
  if (raio != null) estilo.push(`border-radius:${px(raio)}`);
  if (borda != null) estilo.push(`border:${px(borda)} solid var(--line-2)`);
  if (sombra) estilo.push("box-shadow:0 24px 60px rgba(var(--shadow-rgb),.5)");

  return {
    html: envolver(
      p,
      `<img src="${src}" alt="" style="${estilo.join(";")};object-fit:${ajustar};display:block" ${entrada(p, { anim, at })} />`,
    ),
  };
}
