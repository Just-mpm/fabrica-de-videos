export const contrato = {
  nome: "faixa",
  funcao: "faixa diagonal de luz atravessa a tela cobrindo o corte",
  duracao: "0.45–0.6 s",
  obrigatorios: [],
  opcionais: ["cor"],
  naoFaz: "usar em corte comum",
};

export function montar({ id, dur, valores = {} }) {
  const { cor = "var(--cyan)" } = valores;
  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="overflow:hidden">
    <div style="position:absolute;top:-700px;bottom:-700px;left:-900px;width:2600px;transform:rotate(14deg);background:linear-gradient(90deg, rgba(var(--cyan-rgb),0) 0%, ${cor} 26%, var(--bg-2) 62%, var(--bg-2) 100%);box-shadow:0 0 90px rgba(var(--cyan-rgb),.45)" data-at="0" data-anim="wipeR" data-dur="${dur}"></div>
  </div>`,
  };
}
