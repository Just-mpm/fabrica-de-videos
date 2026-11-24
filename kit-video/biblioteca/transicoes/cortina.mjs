export const contrato = {
  nome: "cortina",
  funcao: "persianas horizontais cobrem a tela em faixas e dissolvem",
  duracao: "0.5–0.7 s",
  obrigatorios: [],
  opcionais: ["cor", "faixas"],
  naoFaz: "usar duas vezes seguidas",
};

export function montar({ id, dur, valores = {} }) {
  const { cor = "var(--panel)", faixas = 6 } = valores;
  const entra = +(dur * 0.45).toFixed(2);
  const bandas = Array.from({ length: faixas }, (_, i) => {
    const h = 1080 / faixas;
    return `<div style="position:absolute;left:-100px;width:2120px;height:${h}px;top:${i * h}px;background:${cor};border-top:1px solid rgba(var(--cyan-rgb),.35)" data-at="${(i * 0.03).toFixed(2)}" data-anim="wipeR" data-dur="${entra}"></div>`;
  }).join("");

  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="overflow:hidden">
    <div data-at2="${entra}" data-anim2="fadeOut" data-dur2="${+(dur - entra).toFixed(2)}">${bandas}</div>
  </div>`,
  };
}
