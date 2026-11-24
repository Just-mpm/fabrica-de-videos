export const contrato = {
  nome: "scan",
  funcao: "varredura: uma linha de luz desce e um véu escuro cobre o corte",
  duracao: "0.5–0.7 s",
  obrigatorios: [],
  opcionais: ["cor"],
  naoFaz: "usar em corte comum; transição é para virada de argumento",
  observacao: "o véu cobre em ~50% da duração e dissolve no resto",
};

export function montar({ id, dur, valores = {} }) {
  const { cor = "var(--cyan)" } = valores;
  const cobre = +(dur * 0.5).toFixed(2);
  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="overflow:hidden">
    <div style="position:absolute;inset:0;background:var(--bg-2);clip-path:inset(0 0 100% 0)" data-at="0" data-anim="scanIn" data-dur="${cobre}" data-at2="${cobre}" data-anim2="fadeOut" data-dur2="${+(dur - cobre).toFixed(2)}"></div>
    <div style="position:absolute;left:0;right:0;height:6px;top:-8px;background:${cor};box-shadow:0 0 40px 6px ${cor}" data-at="0" data-anim="desce" data-to="1096" data-dur="${cobre}"></div>
  </div>`,
  };
}
