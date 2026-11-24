export const contrato = {
  nome: "tinta",
  funcao: "faixa de cor chapada atravessa a tela cobrindo o corte, com fio de luz na frente",
  duracao: "0.45–0.6 s",
  obrigatorios: [],
  opcionais: ["cor", "fio"],
  naoFaz: "usar em corte comum; transição é para virada de argumento",
  observacao: "cobre no meio do movimento (em = corte − dur/2)",
};

/* Diferente de `faixa` (diagonal com gradiente) e de `scan` (véu descendo):
   aqui é um bloco liso atravessando na horizontal, e o que se vê é o fio de
   luz na borda de ataque — a tinta empurrando a cena para fora.
   O bloco é AZUL, não quase-preto: sobre o fundo do canal um véu escuro
   passaria despercebido — a passagem precisa se ver. */
export function montar({ id, dur, valores = {} }) {
  const { cor = "var(--panel)", fio = "var(--cyan)" } = valores;
  return {
    transparent: true,
    body: `
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" style="overflow:hidden">
    <div style="position:absolute;top:-60px;bottom:-60px;left:-640px;width:3200px;background:linear-gradient(90deg,${cor} 0%,var(--panel-2) 58%,var(--bg-2) 100%);z-index:2" data-at="0" data-anim="wipeR" data-dur="${dur}">
      <div style="position:absolute;top:0;bottom:0;right:0;width:7px;background:${fio};box-shadow:0 0 46px 10px ${fio}"></div>
    </div>
  </div>`,
  };
}
