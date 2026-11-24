import { entrada, envolver, px } from "./base.mjs";

export const contrato = {
  nome: "onda",
  funcao: "onda de áudio em barras: voz, música, som — o gesto de 'está ouvindo'",
  usa: "barras, w, h, cor, x, y, at, anim",
  naoFaz: "onda que representa dado real; é textura de áudio, não gráfico",
};

/* alturas determinísticas: o mesmo desenho em todo render */
function alturas(n) {
  return Array.from({ length: n }, (_, i) => {
    const a = Math.abs(Math.sin(i * 0.9) * 0.55 + Math.sin(i * 0.37 + 1.2) * 0.3);
    return 0.22 + Math.min(1, a) * 0.78;
  });
}

export function montar(p = {}) {
  const {
    barras = 46,
    w = 520,
    h = 110,
    cor = "var(--cyan)",
    at = 0.4,
    anim = "fade",
  } = p;

  const hs = alturas(barras);
  const larguraBarra = Math.max(3, Math.floor((w / barras) * 0.42));
  const gap = (w - larguraBarra * barras) / Math.max(1, barras - 1);

  const corpo = hs
    .map(
      (v, i) => `<div class="eq" style="width:${larguraBarra}px;height:${Math.round(v * h)}px;border-radius:999px;background:${cor};opacity:${(0.45 + v * 0.55).toFixed(2)};transform-origin:center bottom"></div>`,
    )
    .join("");

  return {
    html: envolver(
      p,
      `<div style="width:${px(w)};height:${px(h)};display:flex;align-items:center;gap:${gap.toFixed(1)}px" ${entrada(p, { at, anim: "equalizador" })}>${corpo}</div>`,
    ),
  };
}
