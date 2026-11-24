export const contrato = {
  nome: "circulo",
  funcao: "pulso de luz cresce do centro, cobre o corte e dissolve",
  duracao: "0.45–0.6 s",
  obrigatorios: [],
  opcionais: ["cor"],
  naoFaz: "usar duas vezes seguidas",
  observacao: "cobre em 42% da duração (ponha `em` ~0.25 s antes do corte) e dissolve no resto",
};

export function montar({ id, dur, valores = {} }) {
  const { cor = "var(--cyan)" } = valores;
  const meio = +(dur * 0.42).toFixed(2);
  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="overflow:hidden">
    <div style="position:absolute;left:960px;top:540px;width:2800px;height:2800px;margin:-1400px 0 0 -1400px;border-radius:50%;background:radial-gradient(circle, ${cor} 0%, var(--bg-2) 62%)" data-at="0" data-anim="circleIn" data-dur="${meio}" data-at2="${meio}" data-anim2="fadeOut" data-dur2="${+(dur - meio).toFixed(2)}"></div>
  </div>`,
  };
}
